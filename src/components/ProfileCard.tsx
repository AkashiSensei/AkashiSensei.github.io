import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from "react"

import { cn } from "@/lib/utils"
import "./ProfileCard.css"

const DEFAULT_INNER_GRADIENT =
  "var(--pc-default-inner-gradient)"

const ANIMATION_CONFIG = {
  initialDuration: 1200,
  initialXOffset: 70,
  initialYOffset: 60,
  deviceBetaOffset: 20,
  enterTransitionMs: 180,
} as const

type ProfileCardStyle = CSSProperties & {
  "--avatar-x"?: string
  "--avatar-y"?: string
  "--role-offset-y"?: string
  "--grain"?: string
  "--icon"?: string
  "--inner-gradient"?: string
  "--behind-glow-color"?: string
  "--behind-glow-size"?: string
}

type ProfileCardProps = {
  avatarHeight?: number
  avatarWidth?: number
  avatarX?: string
  avatarY?: string
  avatarUrl?: string
  behindGlowEnabled?: boolean
  className?: string
  contactText?: string
  enableMobileTilt?: boolean
  enableTilt?: boolean
  glowColor?: string
  glowSize?: string
  grainUrl?: string
  handle?: string
  iconUrl?: string
  imageLoading?: "eager" | "lazy"
  innerGradient?: string
  miniAvatarHeight?: number
  miniAvatarUrl?: string
  miniAvatarWidth?: number
  mobileTiltSensitivity?: number
  name: string
  onContactClick?: () => void
  role: string
  roleOffsetY?: string
  showUserInfo?: boolean
  status?: string
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max)
}

function round(value: number, precision = 3) {
  return Number.parseFloat(value.toFixed(precision))
}

function adjust(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
  return round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin))
}

function getOffsets(event: PointerEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect()

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function ProfileCardComponent({
  avatarHeight,
  avatarWidth,
  avatarX,
  avatarY,
  avatarUrl,
  behindGlowEnabled = true,
  className,
  contactText,
  enableMobileTilt = false,
  enableTilt = true,
  glowColor = "var(--pc-behind-glow-color)",
  glowSize = "var(--pc-behind-glow-size)",
  grainUrl,
  handle,
  iconUrl,
  imageLoading = "lazy",
  innerGradient,
  miniAvatarHeight,
  miniAvatarUrl,
  miniAvatarWidth,
  mobileTiltSensitivity = 5,
  name,
  onContactClick,
  role,
  roleOffsetY,
  showUserInfo = true,
  status,
}: ProfileCardProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const shellRef = useRef<HTMLDivElement | null>(null)
  const enterTimerRef = useRef<number | null>(null)
  const leaveRafRef = useRef<number | null>(null)

  const tiltEngine = useMemo(() => {
    if (!enableTilt) {
      return null
    }

    let rafId: number | null = null
    let running = false
    let lastTimestamp = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0
    let initialUntil = 0

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current
      const wrap = wrapRef.current

      if (!shell || !wrap) {
        return
      }

      const width = shell.clientWidth || 1
      const height = shell.clientHeight || 1
      const percentX = clamp((100 / width) * x)
      const percentY = clamp((100 / height) * y)
      const centerX = percentX - 50
      const centerY = percentY - 50

      wrap.style.setProperty("--pointer-x", `${percentX}%`)
      wrap.style.setProperty("--pointer-y", `${percentY}%`)
      wrap.style.setProperty("--background-x", `${adjust(percentX, 0, 100, 35, 65)}%`)
      wrap.style.setProperty("--background-y", `${adjust(percentY, 0, 100, 35, 65)}%`)
      wrap.style.setProperty(
        "--pointer-from-center",
        `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
      )
      wrap.style.setProperty("--pointer-from-top", `${percentY / 100}`)
      wrap.style.setProperty("--pointer-from-left", `${percentX / 100}`)
      wrap.style.setProperty("--rotate-x", `${round(-(centerX / 5))}deg`)
      wrap.style.setProperty("--rotate-y", `${round(centerY / 4)}deg`)
    }

    const step = (timestamp: number) => {
      if (!running) {
        return
      }

      if (lastTimestamp === 0) {
        lastTimestamp = timestamp
      }

      const delta = (timestamp - lastTimestamp) / 1000
      lastTimestamp = timestamp
      const tau = timestamp < initialUntil ? 0.6 : 0.14
      const k = 1 - Math.exp(-delta / tau)

      currentX += (targetX - currentX) * k
      currentY += (targetY - currentY) * k
      setVarsFromXY(currentX, currentY)

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step)
      } else {
        running = false
        lastTimestamp = 0
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
          rafId = null
        }
      }
    }

    const start = () => {
      if (running) {
        return
      }

      running = true
      lastTimestamp = 0
      rafId = requestAnimationFrame(step)
    }

    return {
      beginInitial(durationMs: number) {
        initialUntil = performance.now() + durationMs
        start()
      },
      cancel() {
        if (rafId !== null) {
          cancelAnimationFrame(rafId)
        }

        rafId = null
        running = false
        lastTimestamp = 0
      },
      getCurrent() {
        return {
          tx: targetX,
          ty: targetY,
          x: currentX,
          y: currentY,
        }
      },
      setImmediate(x: number, y: number) {
        currentX = x
        currentY = y
        targetX = x
        targetY = y
        setVarsFromXY(currentX, currentY)
      },
      setTarget(x: number, y: number) {
        targetX = x
        targetY = y
        start()
      },
      toCenter() {
        const shell = shellRef.current

        if (!shell) {
          return
        }

        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2)
      },
    }
  }, [enableTilt])

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current

      if (!shell || !tiltEngine) {
        return
      }

      const { x, y } = getOffsets(event, shell)
      tiltEngine.setTarget(x, y)
    },
    [tiltEngine],
  )

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current

      if (!shell || !tiltEngine) {
        return
      }

      shell.classList.add("active")
      shell.classList.add("entering")

      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current)
      }

      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering")
      }, ANIMATION_CONFIG.enterTransitionMs)

      const { x, y } = getOffsets(event, shell)
      tiltEngine.setTarget(x, y)
    },
    [tiltEngine],
  )

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current

    if (!shell || !tiltEngine) {
      return
    }

    tiltEngine.toCenter()

    const checkSettle = () => {
      const { tx, ty, x, y } = tiltEngine.getCurrent()
      const settled = Math.hypot(tx - x, ty - y) < 0.6

      if (settled) {
        shell.classList.remove("active")
        leaveRafRef.current = null
      } else {
        leaveRafRef.current = requestAnimationFrame(checkSettle)
      }
    }

    if (leaveRafRef.current !== null) {
      cancelAnimationFrame(leaveRafRef.current)
    }

    leaveRafRef.current = requestAnimationFrame(checkSettle)
  }, [tiltEngine])

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const shell = shellRef.current

      if (!shell || !tiltEngine) {
        return
      }

      const { beta, gamma } = event

      if (beta == null || gamma == null) {
        return
      }

      const centerX = shell.clientWidth / 2
      const centerY = shell.clientHeight / 2
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth)
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.deviceBetaOffset) * mobileTiltSensitivity,
        0,
        shell.clientHeight,
      )

      tiltEngine.setTarget(x, y)
    },
    [mobileTiltSensitivity, tiltEngine],
  )

  useEffect(() => {
    if (!enableTilt || !tiltEngine) {
      return
    }

    const shell = shellRef.current

    if (!shell) {
      return
    }

    shell.addEventListener("pointerenter", handlePointerEnter)
    shell.addEventListener("pointermove", handlePointerMove)
    shell.addEventListener("pointerleave", handlePointerLeave)

    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== "https:") {
        return
      }

      const deviceMotionEvent = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<PermissionState>
      }

      if (deviceMotionEvent && typeof deviceMotionEvent.requestPermission === "function") {
        void deviceMotionEvent
          .requestPermission()
          .then((state) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", handleDeviceOrientation)
            }
          })
          .catch(console.error)
      } else {
        window.addEventListener("deviceorientation", handleDeviceOrientation)
      }
    }

    shell.addEventListener("click", handleClick)

    const shouldSkipInitialTilt =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (shouldSkipInitialTilt) {
      tiltEngine.setImmediate(shell.clientWidth / 2, shell.clientHeight / 2)
    } else {
      const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.initialXOffset
      const initialY = ANIMATION_CONFIG.initialYOffset
      tiltEngine.setImmediate(initialX, initialY)
      tiltEngine.toCenter()
      tiltEngine.beginInitial(ANIMATION_CONFIG.initialDuration)
    }

    return () => {
      shell.removeEventListener("pointerenter", handlePointerEnter)
      shell.removeEventListener("pointermove", handlePointerMove)
      shell.removeEventListener("pointerleave", handlePointerLeave)
      shell.removeEventListener("click", handleClick)
      window.removeEventListener("deviceorientation", handleDeviceOrientation)

      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current)
      }

      if (leaveRafRef.current !== null) {
        cancelAnimationFrame(leaveRafRef.current)
      }

      tiltEngine.cancel()
      shell.classList.remove("entering")
    }
  }, [
    enableMobileTilt,
    enableTilt,
    handleDeviceOrientation,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerMove,
    tiltEngine,
  ])

  const cardStyle = useMemo(
    () =>
      ({
        "--avatar-x": avatarX,
        "--avatar-y": avatarY,
        "--role-offset-y": roleOffsetY,
        "--behind-glow-color": glowColor,
        "--behind-glow-size": glowSize,
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
      }) as ProfileCardStyle,
    [avatarX, avatarY, glowColor, glowSize, grainUrl, iconUrl, innerGradient, roleOffsetY],
  )

  return (
    <div ref={wrapRef} className={cn("pc-card-wrapper", className)} style={cardStyle}>
      {behindGlowEnabled ? <div className="pc-behind" /> : null}
      <div ref={shellRef} className="pc-card-shell">
        <section className="pc-card" aria-label={`${name}, ${role}`}>
          <div className="pc-inside">
            <div className="pc-shine" />
            <div className="pc-glare" />
            <div className="pc-content pc-avatar-content">
              {avatarUrl ? (
                <img
                  className="avatar"
                  src={avatarUrl}
                  alt=""
                  aria-hidden="true"
                  width={avatarWidth}
                  height={avatarHeight}
                  decoding={imageLoading === "eager" ? "sync" : "async"}
                  loading={imageLoading}
                />
              ) : null}
              {showUserInfo ? (
                <div className="pc-user-info">
                  <div className="pc-user-details">
                    <div className="pc-mini-avatar">
                      {avatarUrl ? (
                        <img
                          src={miniAvatarUrl ?? avatarUrl}
                          alt=""
                          aria-hidden="true"
                          width={miniAvatarWidth}
                          height={miniAvatarHeight}
                          decoding={imageLoading === "eager" ? "sync" : "async"}
                          loading={imageLoading}
                        />
                      ) : (
                        <span aria-hidden="true">{name.slice(0, 1)}</span>
                      )}
                    </div>
                    <div className="pc-user-text">
                      <div className="pc-handle">{handle ? `@${handle}` : name}</div>
                      {status ? (
                        <div key={status} className="pc-status pc-status-cycle">
                          {status}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {contactText ? (
                    <button
                      className="pc-contact-btn"
                      type="button"
                      onClick={onContactClick}
                      aria-label={contactText}
                    >
                      {contactText}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="pc-content">
              <div className="pc-details">
                <h3>{name}</h3>
                <p key={role} className="pc-role">
                  {role}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export const ProfileCard = memo(ProfileCardComponent)

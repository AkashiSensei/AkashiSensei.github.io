/* eslint-disable react-refresh/only-export-components */
import { ContactDialog } from "@/components/ContactDialog"
import { buildCoffeeChatReceiptData } from "@/components/coffee-chat-receipt"
import { ReceiptCard } from "@/components/ReceiptCard"

import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import type { CSSProperties } from "react"
import { useLayoutEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

const searchLineKeys = ["work", "future", "balance", "world", "people"] as const
const receiptSettledWindow = 0.05
const receiptEnterStart = -1.12
const receiptEnterDuration = Math.abs(receiptEnterStart) - receiptSettledWindow
const receiptLeaveStart = 0
const receiptLeaveDuration = 1.12

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
}

function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3
}

function getReceiptMotionStyle(timeDelta: number, isAnimationEnabled: boolean) {
  if (!isAnimationEnabled) {
    return {
      "--fpv-page-05-receipt-y": "0%",
    } as CSSProperties
  }

  const enterProgress = clamp01((timeDelta - receiptEnterStart) / receiptEnterDuration)

  if (enterProgress < 1) {
    const slideProgress = easeInOutCubic(enterProgress)

    return {
      "--fpv-page-05-receipt-y": `${((1 - slideProgress) * 100).toFixed(3)}%`,
    } as CSSProperties
  }

  const leaveProgress = clamp01((timeDelta - receiptLeaveStart) / receiptLeaveDuration)
  const slideProgress = easeOutCubic(leaveProgress)

  return {
    "--fpv-page-05-receipt-y": `${(-slideProgress * 100).toFixed(3)}%`,
  } as CSSProperties
}

function Page05ContactButton() {
  const { t } = useTranslation("home")

  return (
    <div className="fpv-page-05-contact-row">
      <ContactDialog>
        <button type="button" className="fpv-action-pill fpv-action-pill-solid">
          {t("contact")}
        </button>
      </ContactDialog>
    </div>
  )
}

function Page05({ timeDelta, isAnimationEnabled }: VirtualScreenProps) {
  const receiptStageRef = useRef<HTMLDivElement>(null)
  const [receiptWindowHeight, setReceiptWindowHeight] = useState(0)
  const { t } = useTranslation("home")
  const receiptData = buildCoffeeChatReceiptData(t)
  const subtitle = t("fpv.page05.subtitle")
  const endline = t("fpv.page05.endline")
  const receiptMotionStyle = getReceiptMotionStyle(timeDelta, isAnimationEnabled)
  const receiptWindowStyle = {
    "--receipt-fpv-window-height": receiptWindowHeight > 0 ? `${receiptWindowHeight}px` : undefined,
  } as CSSProperties

  useLayoutEffect(() => {
    const stage = receiptStageRef.current
    const receipt = stage?.querySelector<HTMLElement>(".receipt-card")

    if (!stage || !receipt) {
      return
    }

    let disposed = false
    const scheduledFrames: number[] = []

    const syncReceiptHeight = () => {
      if (disposed) {
        return
      }

      const stageStyle = window.getComputedStyle(stage)
      const scale = Number.parseFloat(stageStyle.getPropertyValue("--receipt-fpv-scale")) || 1
      const unscaledHeight = Math.max(receipt.scrollHeight, receipt.offsetHeight)
      const nextHeight = Math.ceil(unscaledHeight * scale + 2)

      setReceiptWindowHeight((currentHeight) =>
        Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight,
      )
    }

    const scheduleReceiptHeightSync = () => {
      syncReceiptHeight()
      scheduledFrames.push(
        window.requestAnimationFrame(() => {
          syncReceiptHeight()
          scheduledFrames.push(window.requestAnimationFrame(syncReceiptHeight))
        }),
      )
    }

    scheduleReceiptHeightSync()

    const resizeObserver = new ResizeObserver(scheduleReceiptHeightSync)
    resizeObserver.observe(receipt)
    document.fonts?.ready.then(syncReceiptHeight)
    window.addEventListener("resize", scheduleReceiptHeightSync)

    return () => {
      disposed = true
      resizeObserver.disconnect()
      window.removeEventListener("resize", scheduleReceiptHeightSync)
      scheduledFrames.forEach((frame) => window.cancelAnimationFrame(frame))
    }
  }, [])

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-05-layout"
      >
        <div className="fpv-page-05-left-stack">
          <div className="fpv-page-copy">
            <p className="fpv-page-05-eyebrow">{t("fpv.page05.eyebrow")}</p>
            <h2>{t("fpv.page05.title")}</h2>
            {subtitle ? <p className="fpv-page-subtitle">{subtitle}</p> : null}
          </div>

          <div className="fpv-note-list fpv-note-list-large fpv-page-05-description">
            {searchLineKeys.map((lineKey) => (
              <p key={lineKey}>{t(`fpv.page05.lines.${lineKey}`)}</p>
            ))}
          </div>

          <div
            className="fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-page-05-contact-row fpv-page-05-contact-anchor"
            data-fpv-attachment-anchor="page05-contact"
          >
            <button type="button" className="fpv-action-pill fpv-action-pill-solid">
              {t("contact")}
            </button>
          </div>

          <div className="fpv-page-copy">
            {endline ? <p className="fpv-page-endline">{endline}</p> : null}
            <span className="fpv-floating-whisper">{t("fpv.page05.whisper")}</span>
          </div>
        </div>

        <div className="fpv-page-05-receipt" style={receiptWindowStyle}>
          <div
            ref={receiptStageRef}
            className="fpv-page-05-receipt-stage"
            style={receiptMotionStyle}
          >
            <ReceiptCard data={receiptData} showPromo={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

export const page05Screen: VirtualScreenDefinition = {
  id: "page-05",
  time: 5.5,
  distanceMultiplier: 0.2,
  visibleBefore: 1.12,
  visibleAfter: 1.12,
  attachments: [
    {
      id: "page05-contact-float",
      anchor: "page05-contact",
      className: "fpv-page-05-contact-float",
      interactive: true,
      cloneAnchor: false,
      Component: Page05ContactButton,
    },
  ],
  Component: Page05,
}

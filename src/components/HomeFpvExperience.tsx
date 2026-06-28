import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { createRoot, type Root } from "react-dom/client"
import * as THREE from "three"
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/examples/jsm/renderers/CSS3DRenderer.js"

import { useAnimationPreference } from "@/components/animation-provider"
import { HOME_FPV_SCREENS } from "@/components/home-fpv/screens"
import type {
  CameraFrame,
  CameraTrack,
  ViewportState,
  VirtualScreenAttachmentDefinition,
  VirtualScreenDefinition,
} from "@/components/home-fpv/types"

const CAMERA_TRACK_URL = "/assets/homepage-fpv/camera.json"
const DAY_VIDEO_URL = "/assets/homepage-fpv/day-gop3.mp4"
const NIGHT_VIDEO_URL = "/assets/homepage-fpv/night-gop3.mp4"
const STATIC_PROGRESS = 0
const VIDEO_FRAME_RATE = 90
const SCROLL_TIMELINE_DURATION = 8
const KEYBOARD_SCREEN_SCROLL_DURATION = 2000
const SCREEN_NAVIGATION_EPSILON = 0.035
const SHOW_DEBUG_SURFACES = import.meta.env.VITE_FPV_DEBUG_SURFACES === "true"
const ENABLE_DEV_LIVE_CSS3D_SYNC = import.meta.env.DEV
const DEFAULT_VISIBILITY_FADE_RATIO = 0.9

type RenderState = {
  progress: number
  time: number
}

type VideoDebugState = {
  time: number
  duration: number
}

type Css3DScreen = {
  visibility: ScreenVisibility
  screen: VirtualScreenDefinition
  viewport: ViewportState
  element: HTMLDivElement
  root: Root
  scale: number
  currentTimeDelta: number
  lastTimeDelta: number
  lastAnimationEnabled: boolean | null
  objects: Css3DLayerObject[]
  attachments: Css3DAttachment[]
}

type Css3DLayerObject = {
  object: CSS3DObject
  interactive: boolean
  attachmentDriven?: boolean
}

type Css3DAttachment = {
  definition: VirtualScreenAttachmentDefinition
  element: HTMLDivElement
  object: CSS3DObject
  root?: Root
  lastSignature: string
}

type ScreenVisibility = {
  start: number
  end: number
  fadeInDuration: number
  fadeOutDuration: number
}

type Css3DSceneBundle = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  projectionAspect: number
  renderer: CSS3DRenderer
  screens: Css3DScreen[]
}

type BoxQuadPoint = {
  x: number
  y: number
}

type BoxQuadLike = {
  p1: BoxQuadPoint
  p2: BoxQuadPoint
  p3: BoxQuadPoint
  p4: BoxQuadPoint
}

type BoxQuadProvider = {
  getBoxQuads?: (options?: { relativeTo?: Element }) => BoxQuadLike[]
}

type LocalRect = {
  left: number
  top: number
  width: number
  height: number
}

const SCREEN_TIMES = Array.from(
  new Set(HOME_FPV_SCREENS.map((screen) => screen.time)),
).sort((a, b) => a - b)
const SCROLL_SCREENS = Math.max(SCREEN_TIMES.length, 1)

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clamp01(value: number) {
  return clamp(value, 0, 1)
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
}

function normalizeAngle(value: number) {
  let angle = value % 360
  if (angle > 180) angle -= 360
  if (angle < -180) angle += 360
  return angle
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function interpolateAngle(start: number, end: number, progress: number) {
  return start + normalizeAngle(end - start) * progress
}

function easeInOutCubic(progress: number) {
  return progress < 0.5 ?
      4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2
}

function getSectionScrollMetrics(section: HTMLElement) {
  const viewportHeight = window.innerHeight
  const scrollDistance = Math.max(section.offsetHeight - viewportHeight, 1)
  const sectionTop = section.getBoundingClientRect().top + window.scrollY

  return {
    sectionTop,
    scrollDistance,
  }
}

function getScrollYForScreenTime(section: HTMLElement, time: number) {
  const { sectionTop, scrollDistance } = getSectionScrollMetrics(section)
  const progress = clamp01(time / SCROLL_TIMELINE_DURATION)

  return sectionTop + progress * scrollDistance
}

function getScreenIndexAtTime(time: number) {
  let screenIndex = 0

  for (let index = 0; index < SCREEN_TIMES.length; index += 1) {
    if (time >= SCREEN_TIMES[index] - SCREEN_NAVIGATION_EPSILON) {
      screenIndex = index
    }
  }

  return screenIndex
}

function getAdjacentScreenTime(currentTime: number, direction: 1 | -1) {
  const nearestIndex = SCREEN_TIMES.reduce((nearest, screenTime, index) => {
    const nearestDistance = Math.abs(SCREEN_TIMES[nearest] - currentTime)
    const distance = Math.abs(screenTime - currentTime)

    return distance < nearestDistance ? index : nearest
  }, 0)
  const isAtScreen =
    Math.abs(SCREEN_TIMES[nearestIndex] - currentTime) <= SCREEN_NAVIGATION_EPSILON

  if (isAtScreen) {
    return SCREEN_TIMES[clamp(nearestIndex + direction, 0, SCREEN_TIMES.length - 1)]
  }

  let targetTime: number | undefined

  if (direction > 0) {
    targetTime = SCREEN_TIMES.find((screenTime) => screenTime > currentTime)
  } else {
    for (let index = SCREEN_TIMES.length - 1; index >= 0; index -= 1) {
      if (SCREEN_TIMES[index] < currentTime) {
        targetTime = SCREEN_TIMES[index]
        break
      }
    }
  }

  return targetTime ?? SCREEN_TIMES[direction > 0 ? SCREEN_TIMES.length - 1 : 0]
}

function isEditableKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true'], [contenteditable='']"),
  )
}

function getScreenDisplayProgress(time: number, visibility: ScreenVisibility) {
  if (time <= visibility.start) {
    return 0
  }

  if (visibility.fadeInDuration > 0) {
    const enterEnd = visibility.start + visibility.fadeInDuration

    if (time < enterEnd) {
      return clamp01((time - visibility.start) / visibility.fadeInDuration) * 100
    }
  }

  if (visibility.fadeOutDuration <= 0) {
    return time <= visibility.end ? 100 : 200
  }

  if (time >= visibility.end) {
    return 200
  }

  const exitStart = visibility.end - visibility.fadeOutDuration

  if (time > exitStart) {
    return 100 + clamp01((time - exitStart) / visibility.fadeOutDuration) * 100
  }

  return 100
}

function getOpacityFromDisplayProgress(displayProgress: number) {
  const opacity =
    displayProgress <= 100 ? displayProgress / 100 : (200 - displayProgress) / 100

  return clamp01(opacity)
}

function sampleCameraFrame(track: CameraTrack, time: number): CameraFrame {
  const frames = track.camera.frames
  if (frames.length === 0) {
    throw new Error("Camera track contains no frames.")
  }

  const clampedTime = clamp(time, frames[0].time, frames[frames.length - 1].time)
  const rawIndex = clampedTime / track.comp.frameDuration
  const lowerIndex = clamp(Math.floor(rawIndex), 0, frames.length - 1)
  const upperIndex = clamp(lowerIndex + 1, 0, frames.length - 1)
  const lower = frames[lowerIndex]
  const upper = frames[upperIndex]
  const localProgress =
    upper.time === lower.time ?
      0
    : clamp01((clampedTime - lower.time) / (upper.time - lower.time))

  return {
    frame: lower.frame,
    time: clampedTime,
    position: [
      interpolate(lower.position[0], upper.position[0], localProgress),
      interpolate(lower.position[1], upper.position[1], localProgress),
      interpolate(lower.position[2], upper.position[2], localProgress),
    ],
    orientation: [
      interpolateAngle(lower.orientation[0], upper.orientation[0], localProgress),
      interpolateAngle(lower.orientation[1], upper.orientation[1], localProgress),
      interpolateAngle(lower.orientation[2], upper.orientation[2], localProgress),
    ],
    rotation: [
      interpolateAngle(lower.rotation[0], upper.rotation[0], localProgress),
      interpolateAngle(lower.rotation[1], upper.rotation[1], localProgress),
      interpolateAngle(lower.rotation[2], upper.rotation[2], localProgress),
    ],
    zoom: interpolate(lower.zoom, upper.zoom, localProgress),
    fov: {
      vertical: interpolate(lower.fov.vertical, upper.fov.vertical, localProgress),
      horizontal: interpolate(lower.fov.horizontal, upper.fov.horizontal, localProgress),
    },
  }
}

function aePositionToThree(position: [number, number, number], track: CameraTrack) {
  return new THREE.Vector3(
    position[0] - track.comp.width / 2,
    -(position[1] - track.comp.height / 2),
    -position[2],
  )
}

function getTrackAspect(track: CameraTrack) {
  const aspect = track.comp.width / Math.max(track.comp.height, 1)

  return Number.isFinite(aspect) && aspect > 0 ? aspect : 16 / 9
}

function getFrameHorizontalFov(frame: CameraFrame, track: CameraTrack) {
  if (Number.isFinite(frame.fov.horizontal) && frame.fov.horizontal > 0) {
    return frame.fov.horizontal
  }

  const sourceAspect = getTrackAspect(track)
  const verticalFov = degreesToRadians(frame.fov.vertical)

  return radiansToDegrees(2 * Math.atan(Math.tan(verticalFov / 2) * sourceAspect))
}

function getCoverAdjustedVerticalFov(
  frame: CameraFrame,
  track: CameraTrack,
  projectionAspect: number,
) {
  const sourceAspect = getTrackAspect(track)

  if (projectionAspect <= sourceAspect) {
    return frame.fov.vertical
  }

  const horizontalFov = degreesToRadians(getFrameHorizontalFov(frame, track))

  return radiansToDegrees(2 * Math.atan(Math.tan(horizontalFov / 2) / projectionAspect))
}

function applyAeCameraFrame(
  camera: THREE.PerspectiveCamera,
  frame: CameraFrame,
  track: CameraTrack,
  projectionAspect: number,
) {
  camera.fov = getCoverAdjustedVerticalFov(frame, track, projectionAspect)
  camera.aspect = projectionAspect
  camera.position.copy(aePositionToThree(frame.position, track))
  camera.rotation.set(
    degreesToRadians(normalizeAngle(frame.orientation[0])),
    degreesToRadians(-normalizeAngle(frame.orientation[1])),
    degreesToRadians(-normalizeAngle(frame.orientation[2])),
    "XYZ",
  )
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()
}

function getScreenFrameAtDistance(distance: number, verticalFov: number, aspect: number) {
  const height = 2 * distance * Math.tan(degreesToRadians(verticalFov) / 2)

  return {
    width: height * aspect,
    height,
  }
}

function getScreenVisibility(screen: VirtualScreenDefinition): ScreenVisibility {
  const visibleBefore = screen.visibleBefore ?? 1.12
  const visibleAfter = screen.visibleAfter ?? 1.12
  const start = screen.time - visibleBefore
  const end = screen.time + visibleAfter
  // Keep the fully-settled 100 state brief: most of the visibility window is
  // spent entering toward 100 or leaving toward 200.
  const defaultFadeInDuration = visibleBefore * DEFAULT_VISIBILITY_FADE_RATIO
  const defaultFadeOutDuration = visibleAfter * DEFAULT_VISIBILITY_FADE_RATIO

  return {
    start,
    end,
    fadeInDuration: screen.fadeInDuration ?? defaultFadeInDuration,
    fadeOutDuration: screen.fadeOutDuration ?? defaultFadeOutDuration,
  }
}

function getAttachmentAnchor(screenElement: HTMLElement, anchorName: string) {
  const anchors = screenElement.querySelectorAll<HTMLElement>(
    "[data-fpv-attachment-anchor]",
  )

  return Array.from(anchors).find(
    (anchor) => anchor.dataset.fpvAttachmentAnchor === anchorName,
  ) ?? null
}

function removeAttachmentAnchorAttributes(element: Element) {
  element.removeAttribute("data-fpv-attachment-anchor")

  for (const child of Array.from(element.children)) {
    removeAttachmentAnchorAttributes(child)
  }
}

function cloneAttachmentAnchor(
  attachment: Css3DAttachment,
  anchor: HTMLElement,
) {
  const signature = `${anchor.tagName}|${anchor.className}|${anchor.innerHTML}`

  if (attachment.lastSignature === signature) {
    return
  }

  const clone = anchor.cloneNode(true) as HTMLElement
  removeAttachmentAnchorAttributes(clone)
  clone.classList.remove("fpv-attachment-anchor-hidden")
  clone.classList.remove("fpv-attachment-anchor-reference")
  clone.classList.add("fpv-attachment-clone")
  clone.style.visibility = "visible"
  attachment.element.replaceChildren(clone)
  attachment.lastSignature = signature
}

function parseTransformOrigin(value: string, element: HTMLElement) {
  const [originX = "0px", originY = "0px"] = value.split(" ")
  const parseAxis = (axisValue: string, size: number) => {
    if (axisValue.endsWith("%")) {
      return (Number.parseFloat(axisValue) / 100) * size
    }

    return Number.parseFloat(axisValue) || 0
  }

  return {
    x: parseAxis(originX, element.offsetWidth),
    y: parseAxis(originY, element.offsetHeight),
  }
}

function getOffsetFallbackLocalRect(anchor: HTMLElement, screenElement: HTMLElement): LocalRect {
  let matrix = new DOMMatrix()
  let current: HTMLElement | null = anchor

  while (current && current !== screenElement) {
    const style = window.getComputedStyle(current)
    const transform =
      style.transform && style.transform !== "none" ?
        new DOMMatrix(style.transform)
      : new DOMMatrix()
    const origin = parseTransformOrigin(style.transformOrigin, current)
    const currentMatrix = new DOMMatrix()
      .translate(current.offsetLeft, current.offsetTop)
      .translate(origin.x, origin.y)
      .multiply(transform)
      .translate(-origin.x, -origin.y)

    matrix = currentMatrix.multiply(matrix)

    const offsetParent: Element | null = current.offsetParent
    current =
      offsetParent instanceof HTMLElement && screenElement.contains(offsetParent) ?
        offsetParent
      : null
  }

  const points = [
    new DOMPoint(0, 0),
    new DOMPoint(anchor.offsetWidth, 0),
    new DOMPoint(anchor.offsetWidth, anchor.offsetHeight),
    new DOMPoint(0, anchor.offsetHeight),
  ].map((point) => point.matrixTransform(matrix))
  const xs = points.map((point) => point.x)
  const ys = points.map((point) => point.y)
  const left = Math.min(...xs)
  const top = Math.min(...ys)
  const right = Math.max(...xs)
  const bottom = Math.max(...ys)

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  }
}

function getAnchorLocalRect(anchor: HTMLElement, screenElement: HTMLElement): LocalRect {
  const getBoxQuads = (anchor as BoxQuadProvider).getBoxQuads

  if (typeof getBoxQuads === "function") {
    try {
      // Read the anchor in virtual-screen coordinates; viewport rects already
      // include CSS3D projection and make small depth offsets look huge.
      const [quad] = getBoxQuads.call(anchor, { relativeTo: screenElement })

      if (quad) {
        const xs = [quad.p1.x, quad.p2.x, quad.p3.x, quad.p4.x]
        const ys = [quad.p1.y, quad.p2.y, quad.p3.y, quad.p4.y]
        const left = Math.min(...xs)
        const top = Math.min(...ys)
        const right = Math.max(...xs)
        const bottom = Math.max(...ys)

        return {
          left,
          top,
          width: right - left,
          height: bottom - top,
        }
      }
    } catch {
      // Fall back below for browsers without relative box quad support.
    }
  }

  return getOffsetFallbackLocalRect(anchor, screenElement)
}

function parseFiniteNumber(value: string | undefined) {
  if (!value) {
    return null
  }

  const parsed = Number.parseFloat(value)

  return Number.isFinite(parsed) ? parsed : null
}

function getAttachmentDepth(
  attachment: Css3DAttachment,
  anchor: HTMLElement,
  screen: Css3DScreen,
  isAnimationEnabled: boolean,
) {
  const dataDepth = parseFiniteNumber(anchor.dataset.fpvAttachmentDepth)

  if (dataDepth !== null) {
    return dataDepth
  }

  if (attachment.definition.getDepth) {
    return attachment.definition.getDepth({
      viewport: screen.viewport,
      timeDelta: screen.currentTimeDelta,
      isAnimationEnabled,
    })
  }

  const cssDepth = parseFiniteNumber(
    window.getComputedStyle(anchor).getPropertyValue("--fpv-attachment-depth"),
  )

  if (cssDepth !== null) {
    return cssDepth
  }

  return attachment.definition.depth ?? 0
}

function getAttachmentStyle(
  attachment: Css3DAttachment,
  screen: Css3DScreen,
  isAnimationEnabled: boolean,
) {
  return attachment.definition.getStyle?.({
    viewport: screen.viewport,
    timeDelta: screen.currentTimeDelta,
    isAnimationEnabled,
  })
}

function syncScreenAttachments(screen: Css3DScreen, isAnimationEnabled: boolean) {
  if (screen.attachments.length === 0) {
    return
  }

  for (const attachment of screen.attachments) {
    const anchor = getAttachmentAnchor(screen.element, attachment.definition.anchor)

    if (!anchor) {
      attachment.element.style.visibility = "hidden"
      continue
    }

    const anchorRect = getAnchorLocalRect(anchor, screen.element)

    if (anchorRect.width <= 0 || anchorRect.height <= 0) {
      attachment.element.style.visibility = "hidden"
      continue
    }

    if (!attachment.root && (attachment.definition.cloneAnchor ?? true)) {
      cloneAttachmentAnchor(attachment, anchor)
    }

    const anchorCenterX = anchorRect.left + anchorRect.width / 2
    const anchorCenterY = anchorRect.top + anchorRect.height / 2
    const localX = (anchorCenterX - screen.viewport.width / 2) * screen.scale
    const localY = -(anchorCenterY - screen.viewport.height / 2) * screen.scale

    attachment.element.style.width = `${anchorRect.width}px`
    attachment.element.style.height = `${anchorRect.height}px`
    attachment.element.style.visibility = "visible"
    const attachmentDepth = getAttachmentDepth(
      attachment,
      anchor,
      screen,
      isAnimationEnabled,
    )
    const attachmentStyle = getAttachmentStyle(
      attachment,
      screen,
      isAnimationEnabled,
    )
    attachment.element.dataset.fpvAttachmentDepth = attachmentDepth.toFixed(2)
    attachment.element.dataset.fpvAttachmentOpacity =
      attachmentStyle?.opacity?.toFixed(3) ?? ""
    attachment.element.dataset.fpvAttachmentBlur =
      attachmentStyle?.blur?.toFixed(2) ?? ""
    attachment.element.style.setProperty(
      "--fpv-attachment-opacity",
      String(attachmentStyle?.opacity ?? 1),
    )
    attachment.element.style.setProperty(
      "--fpv-attachment-blur",
      `${attachmentStyle?.blur ?? 0}px`,
    )
    attachment.element.style.setProperty(
      "--fpv-attachment-filter",
      attachmentStyle?.blur && attachmentStyle.blur > 0 ?
        `blur(${attachmentStyle.blur.toFixed(2)}px)`
      : "none",
    )
    attachment.object.position.set(localX, localY, attachmentDepth)
    attachment.object.scale.set(screen.scale, screen.scale, 1)
  }
}

function createVirtualScreenElement(
  screen: VirtualScreenDefinition,
  viewport: ViewportState,
  index: number,
  isAnimationEnabled: boolean,
) {
  const element = document.createElement("div")
  element.className = [
    "fpv-css3d-item",
    "fpv-virtual-screen",
    SHOW_DEBUG_SURFACES ? "fpv-virtual-screen-debug" : "",
  ].filter(Boolean).join(" ")
  element.style.width = `${viewport.width}px`
  element.style.height = `${viewport.height}px`
  element.style.setProperty("--screen-hue", String((index * 58 + 188) % 360))

  const mount = document.createElement("div")
  mount.className = "fpv-virtual-screen-mount"
  element.appendChild(mount)

  if (SHOW_DEBUG_SURFACES) {
    const debugSurface = document.createElement("div")
    debugSurface.className = "fpv-virtual-screen-debug-surface"

    const label = document.createElement("span")
    label.textContent = `${screen.id.replace("page-", "screen ")} / ${screen.time.toFixed(2)}s`
    debugSurface.appendChild(label)
    element.appendChild(debugSurface)
  }

  const root = createRoot(mount)
  flushSync(() => {
    root.render(
      <screen.Component
        viewport={viewport}
        timeDelta={0}
        isAnimationEnabled={isAnimationEnabled}
      />,
    )
  })

  return {
    element,
    root,
  }
}

function createAttachmentObject(
  attachment: VirtualScreenAttachmentDefinition,
  viewport: ViewportState,
  isAnimationEnabled: boolean,
) {
  const element = document.createElement("div")
  element.className = [
    "fpv-css3d-item",
    "fpv-css3d-attachment",
    "fpv-page-copy",
    attachment.className,
  ].filter(Boolean).join(" ")
  element.style.pointerEvents = attachment.interactive ? "auto" : "none"

  const object = new CSS3DObject(element)
  const root =
    attachment.Component ?
      createRoot(element)
    : undefined

  if (root && attachment.Component) {
    const AttachmentComponent = attachment.Component

    flushSync(() => {
      root.render(
        <AttachmentComponent
          viewport={viewport}
          timeDelta={0}
          isAnimationEnabled={isAnimationEnabled}
        />,
      )
    })
  }

  return {
    definition: attachment,
    element,
    object,
    root,
    lastSignature: "",
  }
}

function createCss3DSceneBundle(
  track: CameraTrack,
  viewport: ViewportState,
  container: HTMLDivElement,
  isAnimationEnabled: boolean,
): Css3DSceneBundle {
  const projectionAspect = viewport.width / Math.max(viewport.height, 1)
  const scene = new THREE.Scene()
  const initialFrame = track.camera.frames[0]
  const camera = new THREE.PerspectiveCamera(
    initialFrame ?
      getCoverAdjustedVerticalFov(initialFrame, track, projectionAspect)
    : 50,
    projectionAspect,
    1,
    10000,
  )
  const renderer = new CSS3DRenderer()
  renderer.setSize(viewport.width, viewport.height)
  renderer.domElement.className = "fpv-css3d-renderer"
  renderer.domElement.style.left = "0px"
  renderer.domElement.style.top = "0px"
  renderer.domElement.style.width = `${viewport.width}px`
  renderer.domElement.style.height = `${viewport.height}px`
  container.appendChild(renderer.domElement)

  const screens: Css3DScreen[] = []

  for (const [screenIndex, screen] of HOME_FPV_SCREENS.entries()) {
    const bornFrame = sampleCameraFrame(track, screen.time)
    const bornCamera = new THREE.PerspectiveCamera()
    applyAeCameraFrame(bornCamera, bornFrame, track, projectionAspect)

    const forward = new THREE.Vector3()
    bornCamera.getWorldDirection(forward)

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(bornCamera.quaternion)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(bornCamera.quaternion)
    const distance = bornFrame.zoom * screen.distanceMultiplier
    const { width, height } = getScreenFrameAtDistance(
      distance,
      getCoverAdjustedVerticalFov(bornFrame, track, projectionAspect),
      projectionAspect,
    )
    const [offsetX, offsetY] = screen.offset ?? [0, 0]
    const center = bornCamera.position
      .clone()
      .add(forward.clone().multiplyScalar(distance))
      .add(right.clone().multiplyScalar(offsetX * width))
      .add(up.clone().multiplyScalar(-offsetY * height))

    const group = new THREE.Group()
    group.position.copy(center)
    group.quaternion.copy(bornCamera.quaternion)
    scene.add(group)

    const virtualScreen = createVirtualScreenElement(
      screen,
      viewport,
      screenIndex,
      isAnimationEnabled,
    )
    const screenObject = new CSS3DObject(virtualScreen.element)
    const scale = width / viewport.width

    screenObject.position.set(0, 0, 0)
    screenObject.scale.set(scale, scale, 1)
    group.add(screenObject)

    const attachments = (screen.attachments ?? []).map((attachment) => {
      const attachmentObject = createAttachmentObject(
        attachment,
        viewport,
        isAnimationEnabled,
      )
      group.add(attachmentObject.object)

      return attachmentObject
    })
    const css3dScreen: Css3DScreen = {
      visibility: getScreenVisibility(screen),
      screen,
      viewport,
      element: virtualScreen.element,
      root: virtualScreen.root,
      scale,
      currentTimeDelta: 0,
      lastTimeDelta: 0,
      lastAnimationEnabled: null,
      objects: [
        {
          object: screenObject,
          interactive: true,
        },
        ...attachments.map((attachment) => ({
          object: attachment.object,
          interactive: attachment.definition.interactive ?? false,
          attachmentDriven: true,
        })),
      ],
      attachments,
    }

    syncScreenAttachments(css3dScreen, isAnimationEnabled)
    screens.push(css3dScreen)
  }

  return {
    scene,
    camera,
    projectionAspect,
    renderer,
    screens,
  }
}

function disposeCss3DSceneBundle(bundle: Css3DSceneBundle) {
  for (const screen of bundle.screens) {
    screen.root.unmount()
    for (const attachment of screen.attachments) {
      attachment.root?.unmount()
    }
  }

  bundle.renderer.domElement.remove()
}

function renderCss3DScene(
  bundle: Css3DSceneBundle,
  track: CameraTrack,
  time: number,
  isAnimationEnabled: boolean,
) {
  const frame = sampleCameraFrame(track, time)
  applyAeCameraFrame(bundle.camera, frame, track, bundle.projectionAspect)

  for (const screen of bundle.screens) {
    const displayProgress = Math.round(
      getScreenDisplayProgress(time, screen.visibility),
    )
    const timeDelta = Number((time - screen.screen.time).toFixed(4))
    const opacity = getOpacityFromDisplayProgress(displayProgress)
    screen.currentTimeDelta = timeDelta

    if (
      screen.lastTimeDelta !== timeDelta ||
      screen.lastAnimationEnabled !== isAnimationEnabled
    ) {
      flushSync(() => {
        screen.root.render(
          <screen.screen.Component
            viewport={screen.viewport}
            timeDelta={timeDelta}
            isAnimationEnabled={isAnimationEnabled}
          />,
        )
        for (const attachment of screen.attachments) {
          if (!attachment.root || !attachment.definition.Component) {
            continue
          }

          const AttachmentComponent = attachment.definition.Component
          attachment.root.render(
            <AttachmentComponent
              viewport={screen.viewport}
              timeDelta={timeDelta}
              isAnimationEnabled={isAnimationEnabled}
            />,
          )
        }
      })
      screen.lastTimeDelta = timeDelta
      screen.lastAnimationEnabled = isAnimationEnabled
    }

    syncScreenAttachments(screen, isAnimationEnabled)

    for (const { object, interactive, attachmentDriven } of screen.objects) {
      const attachmentOpacity = parseFiniteNumber(
        object.element.style.getPropertyValue("--fpv-attachment-opacity"),
      ) ?? 1
      object.element.style.opacity = opacity.toFixed(3)
      object.element.style.filter = ""
      object.element.style.pointerEvents =
        interactive && opacity * attachmentOpacity > 0.08 ? "auto" : "none"
      object.element.classList.toggle(
        "fpv-css3d-attachment-driven",
        attachmentDriven ?? false,
      )
    }
  }

  bundle.renderer.render(bundle.scene, bundle.camera)
}

function getVideoFrameNumber(time: number, duration: number) {
  const totalFrames = Math.max(1, Math.round(duration * VIDEO_FRAME_RATE))
  const frame = clamp(Math.floor(time * VIDEO_FRAME_RATE) + 1, 1, totalFrames)

  return {
    frame,
    totalFrames,
  }
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return reducedMotion
}

function useIsDarkTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setIsDarkTheme(root.classList.contains("dark"))
    update()

    const observer = new MutationObserver(update)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return isDarkTheme
}

export function HomeFpvExperience() {
  const { isAnimationEnabled } = useAnimationPreference()
  const isDarkTheme = useIsDarkTheme()
  const reducedMotion = useReducedMotion()
  const isSceneMotionAllowed = !reducedMotion
  const isLocalFpvEffectsEnabled = isAnimationEnabled && !reducedMotion
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const css3dLayerRef = useRef<HTMLDivElement>(null)
  const css3dBundleRef = useRef<Css3DSceneBundle | null>(null)
  const renderTimeRef = useRef(0)
  const localFpvEffectsEnabledRef = useRef(isAnimationEnabled && !reducedMotion)
  const keyboardScrollFrameRef = useRef<number | null>(null)
  const [track, setTrack] = useState<CameraTrack | null>(null)
  const [viewport, setViewport] = useState<ViewportState>(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }))
  const [renderState, setRenderState] = useState<RenderState>({
    progress: STATIC_PROGRESS,
    time: 0,
  })
  const [videoDebugState, setVideoDebugState] = useState<VideoDebugState>({
    time: 0,
    duration: 0,
  })

  const videoSrc = isDarkTheme ? NIGHT_VIDEO_URL : DAY_VIDEO_URL

  useEffect(() => {
    localFpvEffectsEnabledRef.current = isLocalFpvEffectsEnabled
  }, [isLocalFpvEffectsEnabled])

  const renderSceneAt = useCallback(
    (time: number) => {
      if (!track || !css3dBundleRef.current) {
        return
      }

      const syncedTime = clamp(time, 0, SCROLL_TIMELINE_DURATION)
      renderTimeRef.current = syncedTime
      renderCss3DScene(
        css3dBundleRef.current,
        track,
        syncedTime,
        isLocalFpvEffectsEnabled,
      )
    },
    [isLocalFpvEffectsEnabled, track],
  )

  const seekVideoTo = useCallback(
    (targetTime: number) => {
      const video = videoRef.current

      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
        return
      }

      const clampedTarget = clamp(targetTime, 0, video.duration)
      const seekThreshold = Math.max(0.004, 1 / VIDEO_FRAME_RATE / 2)

      if (Math.abs(video.currentTime - clampedTarget) > seekThreshold) {
        video.currentTime = clampedTarget
      }

      setVideoDebugState({
        time: video.currentTime,
        duration: video.duration,
      })
    },
    [],
  )

  const updateRenderState = useCallback(() => {
    const section = sectionRef.current
    const nextViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    const { sectionTop, scrollDistance } =
      section ? getSectionScrollMetrics(section) : { sectionTop: 0, scrollDistance: 1 }
    const progress =
      isSceneMotionAllowed ?
        clamp01((window.scrollY - sectionTop) / scrollDistance)
      : STATIC_PROGRESS
    const time = progress * SCROLL_TIMELINE_DURATION
    renderTimeRef.current = time

    setViewport((current) =>
      current.width === nextViewport.width && current.height === nextViewport.height ?
        current
      : nextViewport,
    )
    setRenderState({
      progress,
      time,
    })
    renderSceneAt(time)
    seekVideoTo(time)
  }, [isSceneMotionAllowed, renderSceneAt, seekVideoTo])

  const cancelKeyboardScreenScroll = useCallback(() => {
    if (keyboardScrollFrameRef.current !== null) {
      window.cancelAnimationFrame(keyboardScrollFrameRef.current)
      keyboardScrollFrameRef.current = null
    }
  }, [])

  const animateScrollToScreenTime = useCallback(
    (targetTime: number) => {
      const section = sectionRef.current

      if (!section) {
        return
      }

      cancelKeyboardScreenScroll()

      const maxScrollY = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      )
      const startY = window.scrollY
      const targetY = clamp(getScrollYForScreenTime(section, targetTime), 0, maxScrollY)
      const deltaY = targetY - startY

      if (!isSceneMotionAllowed || Math.abs(deltaY) < 1) {
        window.scrollTo(0, targetY)
        return
      }

      const startTime = performance.now()

      const tick = (currentTime: number) => {
        const progress = clamp01(
          (currentTime - startTime) / KEYBOARD_SCREEN_SCROLL_DURATION,
        )
        window.scrollTo(0, startY + deltaY * easeInOutCubic(progress))

        if (progress < 1) {
          keyboardScrollFrameRef.current = window.requestAnimationFrame(tick)
          return
        }

        keyboardScrollFrameRef.current = null
      }

      keyboardScrollFrameRef.current = window.requestAnimationFrame(tick)
    },
    [cancelKeyboardScreenScroll, isSceneMotionAllowed],
  )

  useEffect(() => {
    const container = css3dLayerRef.current
    if (!track || !container) {
      return
    }

    let disposed = false

    queueMicrotask(() => {
      if (disposed) {
        return
      }

      const bundle = createCss3DSceneBundle(
        track,
        viewport,
        container,
        localFpvEffectsEnabledRef.current,
      )

      if (disposed) {
        disposeCss3DSceneBundle(bundle)
        return
      }

      css3dBundleRef.current = bundle
      renderCss3DScene(
        bundle,
        track,
        renderTimeRef.current,
        localFpvEffectsEnabledRef.current,
      )
    })

    return () => {
      disposed = true
      const bundle = css3dBundleRef.current

      if (bundle) {
        queueMicrotask(() => disposeCss3DSceneBundle(bundle))
      }
      css3dBundleRef.current = null
    }
  }, [track, viewport])

  useEffect(() => {
    queueMicrotask(() => {
      renderSceneAt(renderTimeRef.current)
    })
  }, [renderSceneAt])

  useEffect(() => {
    if (!ENABLE_DEV_LIVE_CSS3D_SYNC) {
      return
    }

    let frameId: number | null = null

    const sync = () => {
      renderSceneAt(renderTimeRef.current)
      frameId = window.requestAnimationFrame(sync)
    }

    frameId = window.requestAnimationFrame(sync)

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [renderSceneAt])

  useEffect(() => {
    let isCurrent = true

    fetch(CAMERA_TRACK_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load camera track: ${response.status}`)
        }
        return response.json() as Promise<CameraTrack>
      })
      .then((cameraTrack) => {
        if (!isCurrent) {
          return
        }
        setTrack(cameraTrack)
      })
      .catch(() => {
        if (isCurrent) {
          setTrack(null)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [])

  useEffect(() => {
    let frameId: number | null = null

    const requestUpdate = () => {
      if (frameId !== null) {
        return
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null
        updateRenderState()
      })
    }

    requestUpdate()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    window.visualViewport?.addEventListener("resize", requestUpdate)

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      window.visualViewport?.removeEventListener("resize", requestUpdate)
    }
  }, [updateRenderState])

  useEffect(() => {
    const handlePageKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableKeyboardTarget(event.target)
      ) {
        return
      }

      const direction =
        event.key === "PageDown" ? 1
        : event.key === "PageUp" ? -1
        : null

      if (direction === null || SCREEN_TIMES.length === 0 || !sectionRef.current) {
        return
      }

      const { sectionTop, scrollDistance } = getSectionScrollMetrics(sectionRef.current)
      const currentTime =
        clamp01((window.scrollY - sectionTop) / scrollDistance) *
        SCROLL_TIMELINE_DURATION
      const targetTime = getAdjacentScreenTime(currentTime, direction)

      event.preventDefault()
      event.stopPropagation()
      animateScrollToScreenTime(targetTime)
    }

    window.addEventListener("keydown", handlePageKeyDown, { capture: true })

    return () => {
      window.removeEventListener("keydown", handlePageKeyDown, { capture: true })
    }
  }, [animateScrollToScreenTime])

  useEffect(() => {
    window.addEventListener("wheel", cancelKeyboardScreenScroll, { passive: true })
    window.addEventListener("touchstart", cancelKeyboardScreenScroll, { passive: true })

    return () => {
      cancelKeyboardScreenScroll()
      window.removeEventListener("wheel", cancelKeyboardScreenScroll)
      window.removeEventListener("touchstart", cancelKeyboardScreenScroll)
    }
  }, [cancelKeyboardScreenScroll])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const handleMetadata = () => {
      setVideoDebugState({
        time: video.currentTime,
        duration: video.duration,
      })
      updateRenderState()
    }
    video.addEventListener("loadedmetadata", handleMetadata)
    video.pause()

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata)
    }
  }, [updateRenderState, videoSrc])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      return
    }

    const updateVideoDebug = () => {
      setVideoDebugState({
        time: video.currentTime,
        duration: video.duration,
      })
    }

    video.addEventListener("seeked", updateVideoDebug)
    video.addEventListener("loadeddata", updateVideoDebug)

    return () => {
      video.removeEventListener("seeked", updateVideoDebug)
      video.removeEventListener("loadeddata", updateVideoDebug)
    }
  }, [videoSrc])

  const edgeStep = useMemo(
    () => clamp(getScreenIndexAtTime(renderState.time) + 1, 1, SCROLL_SCREENS),
    [renderState.time],
  )
  const videoFrame = getVideoFrameNumber(
    videoDebugState.time,
    videoDebugState.duration || SCROLL_TIMELINE_DURATION,
  )

  return (
    <section
      ref={sectionRef}
      className="fpv-home"
      style={{ minHeight: `${SCROLL_SCREENS * 100}svh` }}
    >
      <div className="fpv-home-sticky">
        <video
          key={videoSrc}
          ref={videoRef}
          className="fpv-home-video"
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="fpv-home-shade" aria-hidden="true" />

        <div className="fpv-edge fpv-edge-left" aria-hidden="true">
          <span>FPV HOME</span>
          <span>
            {String(edgeStep).padStart(2, "0")} / {String(SCROLL_SCREENS).padStart(2, "0")}
          </span>
        </div>
        <div className="fpv-edge fpv-edge-right" aria-hidden="true">
          <span>{track ? `${track.camera.frames.length} CAMERA FRAMES` : "CAMERA LOADING"}</span>
          <span>VIDEO {videoDebugState.time.toFixed(2)}S</span>
          <span>FRAME {videoFrame.frame} / {videoFrame.totalFrames}</span>
        </div>

        <div ref={css3dLayerRef} className="fpv-css3d-layer" />
      </div>
    </section>
  )
}

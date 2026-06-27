import type { ComponentType } from "react"

export type CameraFrame = {
  frame: number
  time: number
  position: [number, number, number]
  orientation: [number, number, number]
  rotation: [number, number, number]
  zoom: number
  fov: {
    vertical: number
    horizontal: number
  }
}

export type CameraTrack = {
  comp: {
    width: number
    height: number
    frameDuration: number
    duration: number
  }
  camera: {
    frames: CameraFrame[]
  }
}

export type ViewportState = {
  width: number
  height: number
}

export type VirtualScreenProps = {
  viewport: ViewportState
  timeDelta: number
}

export type VirtualScreenAttachmentProps = VirtualScreenProps

export type VirtualScreenAttachmentDefinition = {
  id: string
  anchor: string
  depth?: number
  getDepth?: (props: VirtualScreenAttachmentProps) => number
  getStyle?: (props: VirtualScreenAttachmentProps) => {
    opacity?: number
    blur?: number
  }
  className?: string
  interactive?: boolean
  cloneAnchor?: boolean
  Component?: ComponentType<VirtualScreenAttachmentProps>
}

export type VirtualScreenDefinition = {
  id: string
  time: number
  distanceMultiplier: number
  visibleBefore?: number
  visibleAfter?: number
  fadeInDuration?: number
  fadeOutDuration?: number
  offset?: [number, number]
  attachments?: VirtualScreenAttachmentDefinition[]
  Component: ComponentType<VirtualScreenProps>
}

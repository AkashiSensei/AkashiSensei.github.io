declare module "three" {
  export class Quaternion {
    copy(quaternion: Quaternion): this
  }

  export class Vector3 {
    constructor(x?: number, y?: number, z?: number)
    x: number
    y: number
    z: number
    set(x: number, y: number, z: number): this
    clone(): Vector3
    copy(vector: Vector3): this
    add(vector: Vector3): this
    multiplyScalar(scalar: number): this
    applyQuaternion(quaternion: Quaternion): this
    project(camera: PerspectiveCamera): this
  }

  export class Euler {
    set(x: number, y: number, z: number, order?: string): this
  }

  export class Object3D {
    position: Vector3
    quaternion: Quaternion
    rotation: Euler
    scale: Vector3
    add(object: Object3D): this
    remove(object: Object3D): this
  }

  export class Group extends Object3D {}

  export class Scene extends Object3D {}

  export class PerspectiveCamera extends Object3D {
    constructor(fov?: number, aspect?: number, near?: number, far?: number)
    aspect: number
    fov: number
    updateProjectionMatrix(): void
    updateMatrixWorld(): void
    getWorldDirection(target: Vector3): Vector3
  }
}

declare module "three/examples/jsm/renderers/CSS3DRenderer.js" {
  import { Object3D, PerspectiveCamera, Scene } from "three"

  export class CSS3DObject extends Object3D {
    constructor(element: HTMLElement)
    element: HTMLElement
  }

  export class CSS3DRenderer {
    domElement: HTMLDivElement
    setSize(width: number, height: number): void
    render(scene: Scene, camera: PerspectiveCamera): void
  }
}

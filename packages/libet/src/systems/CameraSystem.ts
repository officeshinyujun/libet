import { PerspectiveCamera, OrthographicCamera, Vector3, Euler, MathUtils } from "three"
import { BaseSystem } from "../core/SystemManager"

export type CameraMode = "firstPerson" | "thirdPerson" | "topDown" | "fixed" | "orbital"

export interface CameraConfig {
  mode: CameraMode
  fov?: number
  near?: number
  far?: number
  position?: [number, number, number]
  target?: [number, number, number]
  distance?: number
  height?: number
  smoothSpeed?: number
}

interface CameraState {
  position: Vector3
  target: Vector3
  current: Vector3
  lookAt: Vector3
}

export class CameraSystem extends BaseSystem {
  readonly name = "camera"
  priority = 4
  updateInterval = 0

  private camera: PerspectiveCamera | OrthographicCamera | null = null
  private config: CameraConfig = { mode: "firstPerson" }
  private state: CameraState = {
    position: new Vector3(0, 2, 5),
    target: new Vector3(0, 0, 0),
    current: new Vector3(0, 2, 5),
    lookAt: new Vector3(0, 0, 0),
  }
  private followTarget: { position: Vector3; getRotation?: () => number } | null = null
  private shakeOffset = new Vector3()
  private shakeIntensity = 0
  private shakeDecay = 0
  private orbitalAngle = 0
  private orbitalElevation = Math.PI / 4

  init(): void {
    this.state.current.copy(this.state.position)
    this.state.lookAt.copy(this.state.target)
  }

  setCamera(cam: PerspectiveCamera | OrthographicCamera): void {
    this.camera = cam
  }

  configure(config: CameraConfig): void {
    this.config = config
    if (config.position) this.state.position.set(...config.position)
    if (config.target) this.state.target.set(...config.target)
    if (config.mode === "orbital") this.orbitalAngle = 0
  }

  follow(entity: { position: Vector3; getRotation?: () => number }): void {
    this.followTarget = entity
  }

  unfollow(): void {
    this.followTarget = null
  }

  shake(intensity: number, decay = 2): void {
    this.shakeIntensity = intensity
    this.shakeDecay = decay
  }

  update(dt: number): void {
    if (!this.camera) return

    const targetPos = this.followTarget ? this.followTarget.position : this.state.position

    switch (this.config.mode) {
      case "firstPerson": {
        const height = this.config.height ?? 1.6
        this.state.current.lerp(
          new Vector3(targetPos.x, targetPos.y + height, targetPos.z),
          (this.config.smoothSpeed ?? 10) * dt,
        )
        break
      }
      case "thirdPerson": {
        const dist = this.config.distance ?? 5
        const height = this.config.height ?? 2
        const yaw = this.followTarget?.getRotation?.() ?? 0
        const offset = new Vector3(
          Math.sin(yaw) * dist,
          height,
          Math.cos(yaw) * dist,
        )
        const desired = new Vector3(
          targetPos.x + offset.x,
          targetPos.y + offset.y,
          targetPos.z + offset.z,
        )
        this.state.current.lerp(desired, (this.config.smoothSpeed ?? 5) * dt)
        this.state.lookAt.lerp(targetPos, (this.config.smoothSpeed ?? 5) * dt)
        break
      }
      case "topDown": {
        const dist = this.config.distance ?? 20
        const desired = new Vector3(targetPos.x, targetPos.y + dist, targetPos.z)
        this.state.current.lerp(desired, (this.config.smoothSpeed ?? 3) * dt)
        this.state.lookAt.lerp(targetPos, (this.config.smoothSpeed ?? 3) * dt)
        break
      }
      case "orbital": {
        this.orbitalAngle += (this.config.smoothSpeed ?? 0.5) * dt
        const radius = this.config.distance ?? 10
        const elev = this.orbitalElevation
        const desired = new Vector3(
          targetPos.x + radius * Math.sin(this.orbitalAngle) * Math.cos(elev),
          targetPos.y + radius * Math.sin(elev),
          targetPos.z + radius * Math.cos(this.orbitalAngle) * Math.cos(elev),
        )
        this.state.current.lerp(desired, 2 * dt)
        this.state.lookAt.lerp(targetPos, 2 * dt)
        break
      }
      case "fixed":
        break
    }

    if (this.shakeIntensity > 0.01) {
      this.shakeOffset.set(
        (Math.random() - 0.5) * this.shakeIntensity,
        (Math.random() - 0.5) * this.shakeIntensity,
        (Math.random() - 0.5) * this.shakeIntensity,
      )
      this.shakeIntensity *= Math.exp(-this.shakeDecay * dt)
    } else {
      this.shakeOffset.set(0, 0, 0)
      this.shakeIntensity = 0
    }

    const finalPos = this.state.current.clone().add(this.shakeOffset)
    this.camera.position.copy(finalPos)

    if (this.config.mode === "firstPerson") {
      const lookTarget = new Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion).add(finalPos)
      this.camera.lookAt(lookTarget)
    } else {
      this.camera.lookAt(this.state.lookAt)
    }
  }
}

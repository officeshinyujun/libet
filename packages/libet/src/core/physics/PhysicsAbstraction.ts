import * as THREE from 'three'

export type BodyType = 'dynamic' | 'static' | 'kinematic'
export type ColliderShape = 'cuboid' | 'sphere' | 'capsule' | 'trimesh' | 'hull'

export interface BodyConfig {
  type: BodyType
  shape: ColliderShape
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  mass?: number
  friction?: number
  restitution?: number
}

export interface RaycastHit {
  entityId: string
  point: [number, number, number]
  normal: [number, number, number]
  distance: number
}

export type CollisionEventType = 'enter' | 'stay' | 'exit'

export interface CollisionEvent {
  type: CollisionEventType
  selfEntity: string
  otherEntity: string
  contact: [number, number, number]
}

export interface BodyHandle {
  id: string
}

export interface IPhysicsSystem {
  init(config: { gravity: [number, number, number] }): void
  step(dt: number): void
  destroy(): void

  createBody(config: BodyConfig): BodyHandle
  removeBody(handle: BodyHandle): void

  setPosition(handle: BodyHandle, pos: [number, number, number]): void
  setRotation(handle: BodyHandle, rot: [number, number, number]): void
  getPosition(handle: BodyHandle): [number, number, number]
  getRotation(handle: BodyHandle): [number, number, number]
  setLinearVelocity(handle: BodyHandle, vel: [number, number, number]): void
  setAngularVelocity(handle: BodyHandle, vel: [number, number, number]): void
  applyForce(handle: BodyHandle, force: [number, number, number]): void
  applyImpulse(handle: BodyHandle, impulse: [number, number, number]): void

  raycast(
    origin: [number, number, number],
    direction: [number, number, number],
    maxDist: number,
  ): RaycastHit | null

  onCollision(
    handle: BodyHandle,
    eventType: CollisionEventType,
    callback: (event: CollisionEvent) => void,
  ): void
  offCollision(handle: BodyHandle, eventType: CollisionEventType): void

  setGravity(gravity: [number, number, number]): void
  setDebugDraw(enabled: boolean): void
}

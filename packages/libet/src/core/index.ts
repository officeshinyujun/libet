export { Entity } from "./Entity"
export { EntityManager } from "./EntityManager"
export { BaseComponent } from "./Component"
export { DirtyFlags } from "./Component"
export type { Component } from "./Component"
export { SystemManager, BaseSystem } from "./SystemManager"
export type { GameSystem } from "./SystemManager"

export type {
  IPhysicsSystem,
  BodyConfig,
  BodyHandle,
  RaycastHit,
  CollisionEvent,
  CollisionEventType,
  BodyType,
  ColliderShape,
} from "./physics"
export { RapierBackend } from "./physics"

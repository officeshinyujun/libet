import type {
  IPhysicsSystem,
  BodyConfig,
  BodyHandle,
  RaycastHit,
  CollisionEvent,
  CollisionEventType,
} from "./PhysicsAbstraction"
import * as RAPIER from "@dimforge/rapier3d-compat"
import { Euler, Quaternion } from "three"

export class RapierBackend implements IPhysicsSystem {
  private world: RAPIER.World | null = null
  private bodies = new Map<string, RAPIER.RigidBody>()
  private colliderToBody = new Map<number, string>()
  private bodyConfigs = new Map<string, BodyConfig>()
  private collisionCallbacks = new Map<string, Map<CollisionEventType, (event: CollisionEvent) => void>>()
  private eventQueue: RAPIER.EventQueue | null = null
  private nextId = 0

  init(config: { gravity: [number, number, number] }): void {
    this.world = new RAPIER.World(new RAPIER.Vector3(config.gravity[0], config.gravity[1], config.gravity[2]))
    this.eventQueue = new RAPIER.EventQueue(true)
  }

  step(dt: number): void {
    if (!this.world || !this.eventQueue) return
    this.world.step(this.eventQueue)
    this.processCollisions()
  }

  destroy(): void {
    this.bodies.clear()
    this.colliderToBody.clear()
    this.bodyConfigs.clear()
    this.collisionCallbacks.clear()
    this.world = null
    this.eventQueue = null
  }

  createBody(config: BodyConfig): BodyHandle {
    if (!this.world) throw new Error("Physics not initialized")

    const id = `body_${this.nextId++}`
    const pos = config.position
    const rot = config.rotation ?? [0, 0, 0]

    let bodyDesc: RAPIER.RigidBodyDesc
    switch (config.type) {
      case 'dynamic':
        bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(pos[0], pos[1], pos[2])
        break
      case 'static':
        bodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(pos[0], pos[1], pos[2])
        break
      case 'kinematic':
        bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(pos[0], pos[1], pos[2])
        break
    }

    const body = this.world.createRigidBody(bodyDesc)
    this.bodies.set(id, body)
    this.bodyConfigs.set(id, config)

    const colliderDesc = this.createCollider(config)
    if (colliderDesc) {
      const collider = this.world.createCollider(colliderDesc, body)
      this.colliderToBody.set(collider.handle, id)
    }

    return { id }
  }

  private createCollider(config: BodyConfig): RAPIER.ColliderDesc | null {
    const scale = config.scale ?? [1, 1, 1]
    const friction = config.friction ?? 0.5
    const restitution = config.restitution ?? 0.0

    let desc: RAPIER.ColliderDesc
    switch (config.shape) {
      case 'cuboid':
        desc = RAPIER.ColliderDesc.cuboid(scale[0] / 2, scale[1] / 2, scale[2] / 2)
        break
      case 'sphere':
        desc = RAPIER.ColliderDesc.ball(Math.max(scale[0], scale[1], scale[2]) / 2)
        break
      case 'capsule': {
        const r = Math.max(scale[0], scale[2]) / 2
        const h = scale[1] / 2
        desc = RAPIER.ColliderDesc.capsule(r, h)
        break
      }
      case 'trimesh':
      case 'hull':
        return null
      default:
        return null
    }
    desc.setFriction(friction)
    desc.setRestitution(restitution)
    if (config.mass !== undefined) desc.setMass(config.mass)
    return desc
  }

  removeBody(handle: BodyHandle): void {
    if (!this.world) return
    const body = this.bodies.get(handle.id)
    if (body) {
      this.world.removeRigidBody(body)
      this.bodies.delete(handle.id)
      this.bodyConfigs.delete(handle.id)
      this.collisionCallbacks.delete(handle.id)
      for (const [ch, bid] of this.colliderToBody) {
        if (bid === handle.id) { this.colliderToBody.delete(ch); break }
      }
    }
  }

  setPosition(handle: BodyHandle, pos: [number, number, number]): void {
    const body = this.bodies.get(handle.id)
    if (body) body.setTranslation(new RAPIER.Vector3(pos[0], pos[1], pos[2]), true)
  }

  setRotation(handle: BodyHandle, rot: [number, number, number]): void {
    const body = this.bodies.get(handle.id)
    if (body) body.setRotation(new RAPIER.Quaternion(0, 0, 0, 1), true)
  }

  getPosition(handle: BodyHandle): [number, number, number] {
    const body = this.bodies.get(handle.id)
    if (!body) return [0, 0, 0]
    const t = body.translation()
    return [t.x, t.y, t.z]
  }

  getRotation(handle: BodyHandle): [number, number, number] {
    const body = this.bodies.get(handle.id)
    if (!body) return [0, 0, 0]
    const r = body.rotation()
    const euler = new Euler().setFromQuaternion(new Quaternion(r.x, r.y, r.z, r.w))
    return [euler.x, euler.y, euler.z]
  }

  setLinearVelocity(handle: BodyHandle, vel: [number, number, number]): void {
    const body = this.bodies.get(handle.id)
    if (body) body.setLinvel(new RAPIER.Vector3(vel[0], vel[1], vel[2]), true)
  }

  setAngularVelocity(handle: BodyHandle, vel: [number, number, number]): void {
    const body = this.bodies.get(handle.id)
    if (body) body.setAngvel(new RAPIER.Vector3(vel[0], vel[1], vel[2]), true)
  }

  applyForce(handle: BodyHandle, force: [number, number, number]): void {
    const body = this.bodies.get(handle.id)
    if (body) body.applyImpulse(new RAPIER.Vector3(force[0], force[1], force[2]), true)
  }

  applyImpulse(handle: BodyHandle, impulse: [number, number, number]): void {
    const body = this.bodies.get(handle.id)
    if (body) body.applyImpulse(new RAPIER.Vector3(impulse[0], impulse[1], impulse[2]), true)
  }

  raycast(origin: [number, number, number], direction: [number, number, number], maxDist: number): RaycastHit | null {
    if (!this.world) return null
    const ray = new RAPIER.Ray(
      new RAPIER.Vector3(origin[0], origin[1], origin[2]),
      new RAPIER.Vector3(direction[0], direction[1], direction[2]),
    )
    const hit = this.world.castRay(ray, maxDist, true)
    if (!hit) return null
    const point = ray.pointAt(hit.timeOfImpact)
    const bodyId = this.colliderToBody.get(hit.collider.handle)
    return {
      entityId: bodyId ?? String(hit.collider.handle),
      point: [point.x, point.y, point.z],
      normal: [0, 1, 0],
      distance: hit.timeOfImpact,
    }
  }

  onCollision(handle: BodyHandle, eventType: CollisionEventType, callback: (event: CollisionEvent) => void): void {
    if (!this.collisionCallbacks.has(handle.id)) {
      this.collisionCallbacks.set(handle.id, new Map())
    }
    this.collisionCallbacks.get(handle.id)!.set(eventType, callback)
  }

  offCollision(handle: BodyHandle, eventType: CollisionEventType): void {
    this.collisionCallbacks.get(handle.id)?.delete(eventType)
  }

  private processCollisions(): void {
    if (!this.eventQueue || !this.world) return

    this.eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      const bodyId1 = this.colliderToBody.get(handle1)
      const bodyId2 = this.colliderToBody.get(handle2)
      if (!bodyId1 || !bodyId2) return

      const eventType: CollisionEventType = started ? 'enter' : 'exit'
      const contact: [number, number, number] = [0, 0, 0]

      this.collisionCallbacks.get(bodyId1)?.get(eventType)?.({
        type: eventType, selfEntity: bodyId1, otherEntity: bodyId2, contact,
      })
      this.collisionCallbacks.get(bodyId2)?.get(eventType)?.({
        type: eventType, selfEntity: bodyId2, otherEntity: bodyId1, contact,
      })
    })
  }

  setGravity(gravity: [number, number, number]): void {
    if (this.world) {
      this.world.gravity = new RAPIER.Vector3(gravity[0], gravity[1], gravity[2])
    }
  }

  setDebugDraw(_enabled: boolean): void {}
}

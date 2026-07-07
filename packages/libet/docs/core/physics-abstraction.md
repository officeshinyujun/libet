# Physics Abstraction Layer

> **Status**: Planned — Implementation target: Phase 1

A thin abstraction layer over `@react-three/rapier` that decouples game code from the physics engine. Enables future swap to a different physics backend (e.g., PhysX, custom WASM engine) without changing game code.

## Why Abstract?

- Rapier is the current default, but not the only option
- Physics engine APIs differ significantly — coupling prevents migration
- Enables testing with mock physics in non-browser environments
- Custom collision filtering and event systems become engine-agnostic

## Interface

```typescript
interface IPhysicsSystem {
  // World lifecycle
  init(config: PhysicsConfig): void
  step(dt: number): void
  destroy(): void

  // Body management
  createBody(config: BodyConfig): BodyHandle
  removeBody(handle: BodyHandle): void

  // Body state
  setPosition(handle: BodyHandle, pos: Vector3): void
  setRotation(handle: BodyHandle, rot: Quaternion): void
  getPosition(handle: BodyHandle): Vector3
  getRotation(handle: BodyHandle): Quaternion
  setLinearVelocity(handle: BodyHandle, vel: Vector3): void
  setAngularVelocity(handle: BodyHandle, vel: Vector3): void
  applyForce(handle: BodyHandle, force: Vector3): void
  applyImpulse(handle: BodyHandle, impulse: Vector3): void

  // Collision
  raycast(origin: Vector3, direction: Vector3, maxDist: number): RaycastHit | null
  onCollision(handle: BodyHandle, event: CollisionEventType, callback: CollisionCallback): void

  // Configuration
  setGravity(gravity: Vector3): void
  setDebugDraw(enabled: boolean): void
}

// Engine-agnostic types
interface BodyConfig {
  type: 'dynamic' | 'static' | 'kinematic'
  shape: 'cuboid' | 'sphere' | 'capsule' | 'trimesh' | 'hull'
  position: Vector3
  rotation: Quaternion
  mass?: number
  friction?: number
  restitution?: number
}

interface RaycastHit {
  entityId: string
  point: Vector3
  normal: Vector3
  distance: number
}

type CollisionEventType = 'enter' | 'stay' | 'exit'

interface CollisionCallback {
  (event: { selfEntity: string; otherEntity: string; contact: Vector3 }): void
}
```

## Current Implementation: RapierBackend

```typescript
class RapierBackend implements IPhysicsSystem {
  private world: RAPIER.World
  private bodies: Map<string, RAPIER.RigidBody>

  init(config: PhysicsConfig) {
    this.world = new RAPIER.World(config.gravity)
  }

  createBody(config: BodyConfig): BodyHandle {
    // Maps BodyConfig → RAPIER.RigidBodyDesc
    // Returns a handle (opaque to game code)
  }

  // ... implementation for each interface method
}
```

## Usage

```typescript
import { PhysicsSystem } from "@web-game/libet"

// Auto-configured via <World physics={...}>
const physics = new RapierBackend()
physics.init({ gravity: [0, -9.81, 0] })

const ball = physics.createBody({
  type: 'dynamic',
  shape: 'sphere',
  position: [0, 5, 0],
  mass: 1,
})

physics.applyImpulse(ball, [0, 10, 0])
```

## World Integration

```tsx
// <World> internally:
<Physics gravity={gravity}>
  <PhysicsProvider backend={rapierBackend}>
    {children}
  </PhysicsProvider>
</Physics>
```

## Custom Backend

```typescript
class MyCustomPhysicsEngine implements IPhysicsSystem {
  // Implement all interface methods
  // Swap in via <World physics={{ backend: MyCustomPhysicsEngine }}>
}
```

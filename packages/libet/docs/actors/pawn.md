# Pawn

A generic physical actor. Unlike `Character`, Pawn does not have built-in movement logic — it is a purely physics-driven object. Use for vehicles, balls, crates, drones, or any physics-propelled object.

```tsx
import { Pawn } from "@web-game/libet"

// Dynamic box
<Pawn
  name="crate"
  position={[5, 3, 0]}
  physics="dynamic"
  mass={2}
  color="brown"
/>

// Kinematic platform
<Pawn
  name="moving-platform"
  position={[0, 1, 0]}
  physics="kinematicPosition"
  collider="cuboid"
  color="gray"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Unique identifier |
| `modelpath` | `THREE.Group \| THREE.Mesh \| THREE.Object3D` | — | 3D model |
| `scale` | `[number, number, number]` | — | Scale |
| `rotation` | `[number, number, number]` | — | Initial rotation (radians) |
| `position` | `[number, number, number]` | — | Initial position |
| `physics` | `'dynamic' \| 'fixed' \| 'kinematicPosition' \| 'kinematicVelocity'` | `'dynamic'` | Rapier body type |
| `collider` | `RigidBodyProps['colliders']` | auto | Shape passed to Rapier |
| `mass` | `number` | `1.0` | Mass (dynamic only) |
| `color` | `string` | `'orange'` | Placeholder mesh color |
| `children` | `ReactNode` | — | Sub-components |

## Collider Auto-Detection

| Condition | Collider |
|-----------|----------|
| No model (`modelpath` not set) | `'cuboid'` |
| Model provided | `'hull'` (convex hull) |

Override with explicit `collider` prop.

## Context: `usePawn()`

```tsx
import { usePawn } from "@web-game/libet"

function PawnLogic() {
  const { name, rigidBody, props } = usePawn()
  // Access RapierRigidBody for custom force/velocity control
}
```

## Common Use Cases

| Scenario | `physics` | Notes |
|----------|-----------|-------|
| Crate / barrel | `'dynamic'` | Affected by gravity and collisions |
| Floating pick-up | `'kinematicPosition'` | Animate position manually |
| Push block | `'dynamic'` | Use `mass` to control weight |
| Moving wall | `'kinematicVelocity'` | Set velocity manually |

## Custom Control Example

```tsx
function BallController() {
  const { rigidBody } = usePawn()

  useBeforePhysicsStep(() => {
    if (rigidBody.current) {
      rigidBody.current.applyImpulse({ x: 0, y: 5, z: 0 }, true)
    }
  })
}
```

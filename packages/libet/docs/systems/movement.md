# Movement System

Provides two movement algorithms used by `PlayerController`. Both operate on a `RapierRigidBody` by setting linear velocity.

## DirectMovement

Sets velocity instantly. No acceleration or deceleration — the character moves at `speed` immediately when input is pressed and stops instantly when released.

```typescript
import { applyDirectMovement } from "@web-game/libet"

// Used internally by PlayerController when inertia={false}
applyDirectMovement(rigidBody, direction, speed)
// → sets { x: direction.x * speed, y: currentVel.y, z: direction.z * speed }
```

### Characteristics

- **Responsiveness**: Immediate
- **Feel**: Arcade-like, snappy
- **Use case**: Platformers, fast-paced action

## InertialMovement

Smoothly accelerates to target speed and decelerates to zero when input stops. Uses `THREE.Vector3.lerp` for interpolation.

```typescript
import { applyInertialMovement } from "@web-game/libet"

// Used internally by PlayerController when inertia={true}
applyInertialMovement(rigidBody, direction, speed, delta, acceleration, deceleration)
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `rigidBody` | `RapierRigidBody` | — | Target rigid body |
| `direction` | `THREE.Vector3` | — | Normalized movement direction |
| `speed` | `number` | — | Target speed (world units/sec) |
| `delta` | `number` | — | Frame delta time |
| `acceleration` | `number` | `10` | Acceleration rate (higher = faster) |
| `deceleration` | `number` | `10` | Deceleration rate (higher = faster stop) |

### Characteristics

- **Responsiveness**: Gradual
- **Feel**: Realistic, momentum-based
- **Use case**: FPS games, driving, simulation

## Custom Movement

Both functions are standalone exports — use them in custom controllers:

```tsx
import { applyInertialMovement } from "@web-game/libet"
import { useBeforePhysicsStep } from "@react-three/rapier"

function EnemyController() {
  const { rigidBody } = useCharacter()
  const direction = new THREE.Vector3(1, 0, 1).normalize()

  useBeforePhysicsStep((world) => {
    if (rigidBody.current) {
      applyInertialMovement(rigidBody.current, direction, 3, 1/60, 5, 8)
    }
  })

  return null
}
```

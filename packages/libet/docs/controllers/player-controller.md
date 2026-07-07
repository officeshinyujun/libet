# PlayerController

Handles keyboard input, camera control, and character movement. Attaches to a `Character` via `controllerID` and manages the full input→physics→camera pipeline.

```tsx
import { PlayerController } from "@web-game/libet"

// First-person with inertia
<PlayerController
  controllerID="player"
  view="firstPerson"
  inertia={true}
  crouch={true}
  crouchKey="ControlLeft"
  crouchDepth={0.5}
/>

// Third-person, direct movement
<PlayerController
  controllerID="player2"
  view="thirdPerson"
  inertia={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `controllerID` | `string` | — | Must match `name` of a `Character` in the world |
| `view` | `'firstPerson' \| 'thirdPerson'` | — | Camera perspective mode |
| `inertia` | `boolean` | `false` | Enable acceleration/deceleration |
| `crouch` | `boolean` | `false` | Enable crouch toggle |
| `crouchKey` | `string` | `'ControlLeft'` | Key code for crouch |
| `crouchDepth` | `number` | `0.5` | Eye height ratio when crouching (0.0 ~ 1.0) |

## Default Controls

| Action | Key(s) |
|--------|--------|
| Move Forward | `W`, `ArrowUp` |
| Move Backward | `S`, `ArrowDown` |
| Move Left | `A`, `ArrowLeft` |
| Move Right | `D`, `ArrowRight` |
| Jump | `Space` |
| Crouch | `CtrlLeft` (or custom `crouchKey`) |

## Movement Modes

### Direct Movement (`inertia: false`)

Velocity is set immediately to `direction × speed`. Instant acceleration — responsive but abrupt.

```typescript
// Internal: DirectMovement.ts
rigidBody.setLinvel({ x: direction.x * speed, y: vel.y, z: direction.z * speed })
```

### Inertial Movement (`inertia: true`)

Uses `lerp` for smooth acceleration and deceleration. Configurable acceleration/deceleration rate (default: 10).

```typescript
// Internal: InertialMovement.ts
currentVel.lerp(targetVel, acceleration * delta)
currentVel.lerp(targetVel, deceleration * delta)  // when no input
```

## Camera Behavior

### First-Person

- Camera position is lerped to the Character's eye level (`height/2 * 0.9`)
- `PointerLockControls` handles mouse look
- Eye height adjusts smoothly during crouch transitions

### Third-Person

- Camera orbits behind the character at `height * 3.0` distance
- Focus point is at `80%` of eye height
- Camera position uses `lerp` for smooth following

## Internal Pipeline

```
useEffect → Keyboard event listeners (keydown/keyup)
  ↓ store input state in refs
useBeforePhysicsStep (fixed 60fps)
  ├─ 1. Read input refs
  ├─ 2. Calculate direction from camera orientation
  ├─ 3. Rotate character to face movement direction
  ├─ 4. Apply DirectMovement or InertialMovement
  └─ 5. Jump: raycast downward, apply impulse if grounded
useFrame (variable rate)
  └─ Camera position lerp to RigidBody position + eye offset
```

## Required Setup

The `controllerID` Character must exist and be registered in the World before `PlayerController` runs:

```tsx
<World>
  <Character name="player" speed={8} jumpHeight={2} />
  <PlayerController controllerID="player" view="firstPerson" />
</World>
```

## Notes

- Renders `<PointerLockControls />` internally — pointer lock activates on user click
- Crouch modifies eye height visually only; collider height adjustment is not yet implemented
- Jump uses `useBeforePhysicsStep` for fixed-timestep consistency

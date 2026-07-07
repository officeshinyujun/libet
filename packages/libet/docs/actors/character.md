# Character

Represents a player or NPC with a physics body, movement capabilities, and optional 3D model. Uses `@react-three/rapier` `RigidBody` with `lockRotations` and `ccd` (continuous collision detection).

```tsx
import { Character } from "@web-game/libet"

// Basic box character
<Character
  name="player"
  position={[0, 2, 0]}
  speed={8}
  jumpHeight={2}
/>

// With 3D model
<Character
  name="player"
  modelpath={gltfScene}
  scale={[1, 1, 1]}
  speed={8}
  jumpHeight={2}
>
  <Action inputKey="KeyE" action={(char) => console.log("interact!")} />
</Character>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Unique identifier (used by controllers to reference this character) |
| `tags` | `string[]` | — | Filtering/search tags |
| `position` | `[number, number, number]` | — | Initial world position |
| `rotation` | `[number, number, number]` | — | Initial rotation (radians) |
| `scale` | `[number, number, number]` | — | Scale |
| `modelpath` | `THREE.Group \| THREE.Mesh \| THREE.Object3D` | — | 3D model (e.g., GLTF scene) |
| `speed` | `number` | — | Movement speed (world units/second) |
| `jumpHeight` | `number` | — | Jump height (world units) |
| `children` | `ReactNode` | — | Sub-components (e.g., `Action`) |

## Context: `useCharacter()`

Any child of a Character can access the character's data:

```tsx
import { useCharacter } from "@web-game/libet"

function MyComponent() {
  const { name, rigidBody, props } = useCharacter()
  // rigidBody.current → RapierRigidBody | null
  // props → the CharacterType passed to the Character
}
```

Throws if called outside a Character context.

## Physics Details

- **`lockRotations`**: Enabled — character doesn't tip over
- **`ccd`**: Enabled — prevents tunneling through thin geometry at high speed
- **Collider**: Auto-detected as `cuboid` (box fallback) or `hull` (model)
- **Jump**: Uses `useBeforePhysicsStep` with raycasting for ground detection. Requires `jumpHeight` to be set.

## Movement Controller

A Character is passive until a `PlayerController` references it via `name`:

```tsx
<Character name="player" speed={8} jumpHeight={2} />
<PlayerController controllerID="player" view="firstPerson" />
```

See [PlayerController](../controllers/player-controller.md).

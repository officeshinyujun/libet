# StaticMesh

A simple mesh actor for decorative or semi-interactive objects. Lighter than `Map` (no chunking), useful for props, obstacles, and modular level pieces.

```tsx
import { StaticMesh } from "@web-game/libet"

// Static wall
<StaticMesh
  name="wall"
  position={[10, 1.5, 0]}
  scale={[4, 3, 0.5]}
  physics="fixed"
  color="#8B7355"
/>

// Dynamic rolling barrel (with model)
<StaticMesh
  name="barrel"
  modelpath={barrelModel}
  position={[2, 2, 0]}
  physics="dynamic"
  collider="hull"
  color="#8B4513"
/>

// Decorative prop (no physics)
<StaticMesh
  name="lamp-post"
  modelpath={lampModel}
  position={[-5, 0, -3]}
  physics="none"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Identifier |
| `modelpath` | `THREE.Group \| THREE.Mesh \| THREE.Object3D` | — | 3D model |
| `position` | `[number, number, number]` | — | World position |
| `rotation` | `[number, number, number]` | — | Rotation (radians) |
| `scale` | `[number, number, number]` | — | Scale |
| `physics` | `'fixed' \| 'dynamic' \| 'none'` | `'fixed'` | Physics mode |
| `collider` | `RigidBodyProps['colliders']` | auto | Collider shape |
| `color` | `string` | `'white'` | Placeholder mesh color |
| `children` | `ReactNode` | — | Sub-components |

## Collider Auto-Detection

| Condition | `physics` | Default Collider |
|-----------|-----------|------------------|
| No model | any | `'cuboid'` |
| Model | `'dynamic'` | `'hull'` (stable for moving) |
| Model | `'fixed'` | `'trimesh'` (accurate for static) |
| Model | `'none'` | No collider |

## When to Use Which

| Component | Best For |
|-----------|----------|
| `StaticMesh` | Small props, modular pieces, simple obstacles |
| `Map` | Large terrain, entire levels, chunked geometry |
| `Pawn` | Physics-driven interactive objects (balls, vehicles) |
| `Character` | Animated characters with movement/jump logic |

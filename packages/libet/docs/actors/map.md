# Map

Represents terrain or level geometry. Uses a 3D model (typically GLTF) and can optionally split it into chunks for large worlds.

```tsx
import { Map } from "@web-game/libet"
import { useGLTF } from "@react-three/drei"

function Level() {
  const { scene } = useGLTF("/maps/forest.glb")

  return (
    <Map
      name="forest"
      modelpath={scene}
      position={[0, -0.5, 0]}
      physics="fixed"
      colliders="trimesh"
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Map identifier |
| `modelpath` | `THREE.Group \| THREE.Mesh \| THREE.Object3D` | — | 3D model (cloned internally for chunking) |
| `position` | `[number, number, number]` | — | World position |
| `rotation` | `[number, number, number]` | — | Rotation (radians) |
| `scale` | `[number, number, number]` | — | Scale |
| `physics` | `'fixed' \| 'none' \| 'dynamic'` | `'none'` | Physics mode |
| `isChunked` | `boolean` | `false` | Enable chunk division |
| `chuckSize` | `number` | — | Chunk edge length (world units) |

## Chunked Map

For large levels, `isChunked` divides the model into tiles:

```tsx
<Map
  name="large-island"
  modelpath={islandScene}
  physics="fixed"
  isChunked
  chuckSize={32}
/>
```

Each chunk becomes a separate `RigidBody` with `colliders="trimesh"`. This improves physics performance and enables future frustum culling per chunk.

### Limitations

- The model is `cloned` per chunk — high-poly models will multiply memory usage
- Chunking is grid-based along X and Z axes; Y is ignored
- Models should be centered at origin for predictable chunk boundaries

## Physics Notes

| `physics` | Behavior |
|-----------|----------|
| `'none'` | Visual only, no physics body. Use for decoration or skyboxes |
| `'fixed'` | Static collider with `colliders="trimesh"`. Ground, walls, buildings |
| `'dynamic'` | Dynamic rigid body (rare for maps; use only for floating platforms) |

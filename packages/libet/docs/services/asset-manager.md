# Asset Manager

> **Status**: Planned — Implementation target: Phase 2

Manages loading, caching, and streaming of game assets (models, textures, audio, data files). Designed for progressive loading and memory-efficient lifecycle.

## API

```typescript
interface AssetHandle<T = any> {
  id: string
  data: T
  refCount: number
  retain(): void
  release(): void
}

class AssetManager {
  load<T>(url: string, type: AssetType, options?: LoadOptions): Promise<AssetHandle<T>>
  loadMultiple<T>(items: LoadItem[]): Promise<AssetHandle<T>[]>
  preload(urls: string[], onProgress?: ProgressCallback): Promise<void>
  get<T>(id: string): AssetHandle<T> | undefined
  release(id: string): void
  releaseAll(): void
  setBasePath(path: string): void

  // Streaming (for large worlds)
  stream<T>(url: string, type: AssetType): AsyncGenerator<ChunkData<T>>
}
```

## Asset Types

```typescript
type AssetType =
  | 'gltf'          // 3D model (GLTF/GLB)
  | 'texture'       // Image → THREE.Texture
  | 'audio'         // Audio file → AudioBuffer
  | 'hdr'           // HDR environment map
  | 'json'          // JSON data file
  | 'binary'        // Raw binary data
```

## Usage

```typescript
import { AssetManager } from "@web-game/libet"

const assets = new AssetManager()

// Load a model
async function loadLevel() {
  const [map, groundTex, ambience] = await assets.loadMultiple([
    { url: "/levels/forest.glb", type: "gltf" },
    { url: "/textures/ground.jpg", type: "texture" },
    { url: "/audio/forest-ambient.mp3", type: "audio" },
  ])

  // Use assets
  scene.add(map.data.scene)
  material.map = groundTex.data
  audio.play(ambience.data)
}

// With progress tracking
assets.preload([
  "/levels/forest.glb",
  "/levels/cave.glb",
], (progress) => {
  console.log(`Loading: ${progress.loaded}/${progress.total}`)
  // Update loading bar
})
```

## Caching Strategy

- **LRU Cache**: Recently used assets are retained; least recently used are evicted under memory pressure
- **Reference Counting**: `retain()` / `release()` for manual lifetime control
- **Dedup**: Same URL loaded twice returns the same `AssetHandle`
- **Preload Queue**: Priority-based loading order

## GLTF Optimization

When loading GLTF models, the Asset Manager applies optimizations:

1. Removes empty nodes from the scene graph
2. Merges identical materials
3. Converts to Draco-decoded geometry if available
4. Applies texture compression (KTX2 → Basis Universal)

## React Integration

```tsx
function useAsset(url: string, type: AssetType) {
  const [asset, setAsset] = useState<AssetHandle | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    assets.load(url, type).then(setAsset).catch(setError)
    return () => { if (asset) asset.release() }
  }, [url])

  return { data: asset?.data, progress, error }
}
```

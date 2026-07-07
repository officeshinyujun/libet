# Entity & Component System

> **Status**: Planned — Implementation target: Phase 1

A lightweight ECS-like architecture for composable game object behavior. Replaces the current per-actor type explosion with a generic `Entity` that has attachable `Component` instances.

## Design Goals

- **Composition over inheritance**: Build behavior by attaching components, not by extending classes
- **Data-oriented**: Internally uses Structure-of-Arrays (SOA) layout for cache-efficient iteration
- **Minimal React overhead**: Components update via direct function calls, not React re-renders
- **Swappable**: The ECS core is dependency-free; React integration is an optional layer

## Interface

```typescript
// --- Entity ---
interface Entity {
  id: string
  components: Map<string, Component>
  worldMatrix: THREE.Matrix4
  dirtyFlags: number  // Bitmask for efficient change propagation
  active: boolean
  visible: boolean

  addComponent(comp: Component): void
  removeComponent(type: string): void
  getComponent<T extends Component>(type: string): T | undefined
  hasComponent(type: string): boolean
  destroy(): void
}

// --- Component ---
interface Component {
  type: string       // Unique component type identifier
  entity: Entity     // Owning entity (set automatically on add)

  onAttach?(): void
  onDetach?(): void
  update?(dt: number): void
}

// --- Entity Factory ---
function createEntity(id: string, components?: Component[]): Entity
```

## Usage

```typescript
// Define a component
class HealthComponent implements Component {
  type = "health"
  entity!: Entity
  current: number
  max: number

  constructor(max: number) {
    this.max = max
    this.current = max
  }

  takeDamage(amount: number) {
    this.current = Math.max(0, this.current - amount)
    if (this.current <= 0) {
      this.entity.destroy()
    }
  }
}

// Create an entity with components
const player = createEntity("player", [
  new TransformComponent(position),
  new HealthComponent(100),
  new MeshComponent(model),
])

// Query and use
const health = player.getComponent<HealthComponent>("health")
health?.takeDamage(10)
```

## React Integration

For React-based entities, a wrapper component:

```tsx
function EntityView({ entity }: { entity: Entity }) {
  // Renders the entity's mesh/visual components
  // Synced with R3F scene graph
  return <group>{/* auto-rendered from MeshComponent */}</group>
}
```

## Dirty Flag Bitmask

Each entity carries a `dirtyFlags` number used as a bitmask:

```typescript
const enum DirtyFlags {
  TRANSFORM  = 1 << 0,  // 1
  MATERIAL   = 1 << 1,  // 2
  VISIBILITY = 1 << 2,  // 4
  BOUNDS     = 1 << 3,  // 8
  ALL        = 0xFFFF_FFFF,
}
```

Systems check the relevant flag before processing. A clean entity is skipped entirely.

## SOA Pool (Internal)

The Entity manager stores hot data in typed arrays for SIMD-friendly iteration:

```typescript
// Internal — not public API
class EntityPool {
  positions: Float32Array    // Every frame
  rotations: Float32Array    // Every frame
  scales: Float32Array       // Every frame
  activeFlags: Uint8Array    // Every frame
  names: string[]            // Rarely accessed
  tags: string[][]           // Rarely accessed
}
```

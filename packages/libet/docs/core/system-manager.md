# System Manager

> **Status**: Planned — Implementation target: Phase 1

Manages registration, scheduling, and execution of all game systems. Implements **time-sliced update buckets** to distribute CPU load across frames.

## Update Buckets

Not all systems need to run at 60fps. The bucket system allows configurable update intervals per system:

| Bucket | Interval | Example Systems | CPU Budget |
|--------|----------|-----------------|------------|
| **Critical** | Every frame (1/60s) | Physics, Camera | 50% |
| **High** | 30fps (1/30s) | Animation, Input | 20% |
| **Normal** | 15fps (1/15s) | AI, Pathfinding | 15% |
| **Low** | 10fps (1/10s) | Visibility Culling | 10% |
| **Background** | 5fps (1/5s) | LOD Update, Cleanup | 5% |

## Interface

```typescript
interface GameSystem {
  name: string
  priority: number        // Lower = runs earlier
  updateInterval: number  // Seconds between updates (0 = every frame)

  init?(): void
  update(dt: number): void
  cleanup?(): void
}

class SystemManager {
  register(system: GameSystem): void
  unregister(name: string): void
  getSystem<T extends GameSystem>(name: string): T | undefined

  // Called by World's useFrame
  update(dt: number): void
}
```

## Usage

```typescript
// Define a system
class AISystem implements GameSystem {
  name = "ai"
  priority = 3
  updateInterval = 1 / 15  // 15 fps

  update(dt: number) {
    // Query entities with AIComponent
    // Update behavior trees, steering, etc.
  }
}

// Register with World
<World onReady={() => {
  systemManager.register(new AISystem())
  systemManager.register(new VisibilitySystem())
}}>
```

## Bucket Scheduling Logic

```typescript
update(dt: number) {
  const now = performance.now()

  for (const system of sortedSystems) {
    if (now - system.lastUpdate >= system.updateInterval) {
      system.lastUpdate = now
      system.update(dt)
    }
  }
}
```

## Priority Order

Within the same bucket, systems execute in `priority` order:

1. `Input` (priority 0) — capture input state
2. `Physics` (priority 1) — apply forces, step simulation
3. `Animation` (priority 2) — update bone poses
4. `AI` (priority 3) — decision making
5. `Camera` (priority 4) — position camera after all transforms are updated
6. `Culling` (priority 5) — frustum/occlusion culling before render
7. `Cleanup` (priority 9) — destroy flagged entities

## React Integration

The `SystemManager` is created and managed inside `<World>`. Systems can be registered via:

1. **`World.onReady` callback** — for global systems
2. **`useSystemManager()` hook** — for component-level registration
3. **Auto-registration** — Entity components with an `update` method are automatically discovered

# Interaction System

A raycaster-based system that detects which mesh the player is looking at. Consists of three parts:

1. **`InteractionProvider`** — Context provider (state container)
2. **`InteractionManager`** — Runs raycaster every frame
3. **`useInteractionContext()`** — Hook to read the focused mesh UUID

Both `InteractionProvider` and `InteractionManager` are automatically included by `<World>`, so you generally don't need to add them manually.

## How It Works

```
Camera center (0, 0) → Raycaster → scene.intersectObjects()
  ↓
First visible mesh found → UUID stored in context
  ↓
OutlineComponent (hover/click) or custom logic reads UUID
```

## Context Hook

```tsx
import { useInteractionContext } from "@web-game/libet"

function MyComponent() {
  const { focusedMeshUuid, setFocusedMeshUuid } = useInteractionContext()

  useEffect(() => {
    if (focusedMeshUuid) {
      console.log("Looking at mesh:", focusedMeshUuid)
    }
  }, [focusedMeshUuid])
}
```

Throws if called outside `InteractionProvider`.

## Manual Setup (Outside World)

If you need interaction outside `<World>`, wrap your scene manually:

```tsx
import { InteractionProvider, InteractionManager } from "@web-game/libet"

<Canvas>
  <InteractionProvider>
    <InteractionManager maxDistance={30} />
    <YourScene />
  </InteractionProvider>
</Canvas>
```

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `maxDistance` | `number` | `20` | Maximum raycast distance |

## Notes

- Intersects against all `scene.children` recursively
- Only the nearest visible `Mesh` is selected
- Invisible objects, helpers, and non-Mesh types are filtered out
- Runs every frame via `useFrame` — for performance, consider throttling with a distance check or cooldown

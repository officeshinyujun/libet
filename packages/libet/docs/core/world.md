# World

The top-level container for the entire game. Wraps R3F `<Canvas>`, Rapier `<Physics>`, and all internal providers.

```tsx
import { World } from "@web-game/libet"

function Game() {
  return (
    <World
      width="100vw"
      height="100vh"
      camera={{ position: [0, 5, 10], fov: 75 }}
      physics={{ gravity: [0, -9.81, 0], debug: false }}
      environment={{ preset: "sunset", background: true }}
      debug={{ stats: true }}
      onTick={(delta) => console.log("tick", delta)}
    >
      {/* All game objects go here */}
    </World>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Entities placed in the world |
| `width` | `string` | — | Canvas CSS width |
| `height` | `string` | — | Canvas CSS height |
| `physics.gravity` | `[number, number, number]` | `[0, -9.81, 0]` | Gravity vector |
| `physics.debug` | `boolean` | `false` | Physics wireframe visualization |
| `physics.paused` | `boolean` | `false` | Pause simulation |
| `camera.type` | `'perspective' \| 'orthographic'` | `'perspective'` | Camera type |
| `camera.position` | `[number, number, number]` | — | Initial camera position |
| `camera.fov` | `number` | `75` | Field of view (perspective) |
| `camera.near` | `number` | — | Near clipping plane |
| `camera.far` | `number` | — | Far clipping plane |
| `environment.preset` | `'sunset' \| 'dawn' \| 'night' \| 'warehouse' \| 'forest'` | — | HDR environment preset |
| `environment.background` | `boolean` | `true` | Use environment as background |
| `debug.physics` | `boolean` | — | Same as physics.debug |
| `debug.axes` | `boolean` | — | Show coordinate axes helper |
| `debug.stats` | `boolean` | — | Show FPS/memory stats |
| `onReady` | `() => void` | — | Called after world initialization |
| `onTick` | `(delta: number) => void` | — | Called every frame with delta seconds |

All additional props are passed through to R3F `<Canvas>`.

## Internal Providers

World sets up this provider chain automatically:

```
Canvas → Physics → WorldProvider → InteractionProvider → InteractionManager → Suspense → children
```

- **WorldProvider**: Entity/character registry via `useWorld()`
- **InteractionProvider**: Raycaster focus state via `useInteractionContext()`
- **InteractionManager**: Runs raycaster every frame for hover detection
- **Suspense**: Wraps children for async asset loading

## Usage Notes

- Only one `<World>` per page (multi-world is not supported)
- Children must be Entities or valid R3F elements
- `debug.stats` uses `r3f-perf` style stats overlay
- `onTick` runs inside `useFrame`, useful for game loop logic that doesn't belong to a specific system

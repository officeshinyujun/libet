# libet — 3D Web Game Library

A lightweight React Three Fiber based 3D web game engine.

## Installation

```bash
npm install @web-game/libet
```

Peer dependencies:
- `react`, `react-dom` (^19.0.0)
- `three` (>=0.150.0)
- `@react-three/fiber` (^9.0.0)
- `@react-three/drei` (^10.0.0)
- `@react-three/rapier` (^2.0.0)

## Quick Start

```tsx
import { World, Character, PlayerController, Map, Pointer } from "@web-game/libet"
import { useGLTF } from "@react-three/drei"

function Game() {
  const { scene } = useGLTF("/levels/arena.glb")

  return (
    <World
      width="100vw"
      height="100vh"
      camera={{ fov: 75 }}
      physics={{ gravity: [0, -9.81, 0] }}
      debug={{ stats: true }}
    >
      <Map name="arena" modelpath={scene} physics="fixed" />

      <Character name="player" position={[0, 2, 0]} speed={8} jumpHeight={2}>
        <Pointer size={[24, 24]} />
      </Character>

      <PlayerController controllerID="player" view="firstPerson" inertia />
    </World>
  )
}
```

## Architecture

```
<World>                     ← Canvas + Physics + Providers
  ├─ <Map>                  ← Level geometry
  ├─ <Character>            ← Player/NPC (physics body)
  │   └─ <Action>           ← Key binding
  ├─ <Pawn>                 ← Physical objects
  ├─ <StaticMesh>           ← Decorative meshes
  ├─ <PlayerController>     ← Input + Camera control
  └─ <Pointer>              ← Crosshair overlay
```

## Documentation

| Section | Contents |
|---------|----------|
| [Architecture Overview](docs/architecture.md) | Design principles, data flow, context chain |
| **Core** | |
| [World](docs/core/world.md) | Top-level container props and configuration |
| [Entity & Component](docs/core/entity-component.md) | ECS architecture (planned) |
| [System Manager](docs/core/system-manager.md) | Update scheduling with buckets (planned) |
| [Physics Abstraction](docs/core/physics-abstraction.md) | Engine-agnostic physics layer (planned) |
| **Actors** | |
| [Character](docs/actors/character.md) | Player/NPC with movement and jumping |
| [Pawn](docs/actors/pawn.md) | Generic physical actor |
| [Map](docs/actors/map.md) | Terrain with chunking support |
| [StaticMesh](docs/actors/static-mesh.md) | Simple mesh actor |
| **Controllers** | |
| [PlayerController](docs/controllers/player-controller.md) | FPS/third-person controls |
| [Action](docs/controllers/action.md) | Key/mouse action binding |
| **Display** | |
| [Pointer](docs/display/pointer.md) | Crosshair overlay |
| **Effects** | |
| [Interaction](docs/effects/interaction.md) | Raycaster focus detection |
| [Outline](docs/effects/outline.md) | Hover/click highlight effect |
| **Systems** | |
| [Movement](docs/systems/movement.md) | Direct & inertial movement |
| **Services (planned)** | |
| [Asset Manager](docs/services/asset-manager.md) | Loading, caching, streaming |
| [Input Manager](docs/services/input-manager.md) | Action-mapped multi-device input |
| [Audio Manager](docs/services/audio-manager.md) | Spatial audio, volume groups |

## Development

```bash
npm run dev      # Watch mode build
npm run build    # Production build
```

## Package

- **ESM + CJS** dual format
- TypeScript declarations included
- Tree-shakeable — only import what you use

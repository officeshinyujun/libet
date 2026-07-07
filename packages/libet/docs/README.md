# libet Documentation

A lightweight React Three Fiber based 3D web game engine.

## Table of Contents

### Architecture
- [Architecture Overview](architecture.md) — Core design philosophy, data flow, context chain

### Core (Phase 1)
- [World](core/world.md) — Top-level container: Canvas, Physics, Providers
- [Entity & Component](core/entity-component.md) — Custom ECS-like architecture
- [System Manager](core/system-manager.md) — Update scheduling with priority buckets
- [Physics Abstraction](core/physics-abstraction.md) — Rapier wrapper with swap-ready interface

### Actors
- [Character](actors/character.md) — Player/NPC with physics body, movement, jumping
- [Pawn](actors/pawn.md) — Generic physical actor (vehicles, objects, props)
- [Map](actors/map.md) — Terrain and level geometry with chunking support
- [StaticMesh](actors/static-mesh.md) — Simple static or dynamic mesh

### Controllers
- [PlayerController](controllers/player-controller.md) — FPS/Third-person input + camera control
- [Action](controllers/action.md) — Key/mouse action binding component

### Display
- [Pointer](display/pointer.md) — Crosshair/pointer overlay

### Effects
- [Interaction](effects/interaction.md) — Raycaster-based focus detection system
- [Outline](effects/outline.md) — Highlight outline with hover/click trigger

### Systems
- [Movement](systems/movement.md) — Direct & inertial movement implementations

### Services (Phase 2)
- [Asset Manager](services/asset-manager.md) — Loading, caching, streaming
- [Input Manager](services/input-manager.md) — Action-mapped multi-device input
- [Audio Manager](services/audio-manager.md) — Playback, spatial audio, groups

# Architecture Overview

## Design Philosophy

libet is built on three principles:

1. **Component Composition** — Game objects are Entities composed of Components. Systems iterate over entities that have the required components.
2. **Layered Abstraction** — Every external dependency (physics, rendering, audio) has a thin abstraction layer. Swappable without changing game code.
3. **Measured Performance** — Custom optimization techniques are applied where profiling proves they matter, not prematurely.

## Component Hierarchy

```
<World>                                    ← Canvas + Physics + Providers
  ├─ <Physics>                             ← @react-three/rapier
  │   ├─ <WorldProvider>                   ← Entity registry (Context)
  │   │   ├─ <InteractionProvider>         ← Raycaster focus state
  │   │   │   ├─ <InteractionManager />    ← Raycaster loop
  │   │   │   ├─ <Suspense>
  │   │   │   │   ├─ <Map />               ← Level geometry
  │   │   │   │   ├─ <Character>           ← Player/NPC (RigidBody)
  │   │   │   │   │   └─ <Action />        ← Key binding
  │   │   │   │   ├─ <Pawn />              ← Physical object
  │   │   │   │   └─ <StaticMesh />        ← Decorative mesh
  │   │   │   └─ <PlayerController />      ← Input + Camera
  │   │   └─ </Suspense>
  │   └─ </InteractionProvider>
  └─ </WorldProvider>
```

## Data Flow

```
Input Devices                    Game Logic                    Rendering
  ┌──────┐     InputManager     ┌──────────┐     Systems      ┌─────────┐
  │Keyboard│ ───Action──► │PlayerCtrl│ ──update──► │R3F     │
  │ Mouse  │     Mapping      │ AI Sys  │  (buckets)  │Canvas  │
  │Gamepad │                   │ Phys Sys │             │        │
  └──────┘                    └──────────┘             └─────────┘
                                    │
                              ┌─────▼──────┐
                              │ Entity Pool │
                              │ (SOA layout)│
                              └────────────┘
```

## Context Chain (React)

```
WorldContext         — registerEntity, getEntity, character registry
  └─ InteractionContext — focusedMeshUuid, setFocusedMeshUuid
       └─ CharacterContext — name, rigidBody ref, props (per Character)
       └─ PawnContext      — name, rigidBody ref, props (per Pawn)
```

## Package Structure

```
src/
├── index.ts                  # Re-export all public API
├── world/                    # World container + providers
│   ├── World.tsx             # Canvas + Physics + Context providers
│   ├── WorldContext.tsx       # Entity registry
│   └── type.ts               # WorldType props
├── core/                     # Core engine (Phase 1 — planned)
│   ├── Entity.ts             # Entity interface + factory
│   ├── Component.ts          # Component base interface
│   ├── SystemManager.ts      # Update scheduler with buckets
│   └── physics/              # Physics abstraction layer
├── actors/                   # Game object components
│   ├── BaseActor/            # Base type shared by all actors
│   ├── Character/            # Dynamic character with physics body
│   ├── Pawn/                 # Generic physical actor
│   ├── Map/                  # Level geometry (chunked option)
│   └── StaticMesh/           # Simple mesh (fixed/dynamic/none)
├── controllers/              # Input handling
│   ├── PlayerController/     # FPS/TP camera + movement
│   └── Action/               # Key/mouse action binding
├── display/                  # UI overlays
│   └── Pointer/              # Crosshair component
├── objects/effects/          # Visual effects
│   ├── InteractionComponent/ # Raycaster system
│   └── OutlineComponent/     # Highlight effect
├── systems/                  # Gameplay systems
│   └── MovementSystem/       # Direct & inertial movement
└── services/                 # Global services (Phase 2 — planned)
    ├── AssetManager/         # Loading, caching, streaming
    ├── InputManager/         # Action-mapped multi-device input
    └── AudioManager/         # Playback, spatial audio
```

## Optimization Strategy

| Technique | Scope | Impact |
|-----------|-------|--------|
| Dirty Propagation Bitmask | Per-entity update flags | Reduces unnecessary React re-renders 60-90% |
| Time-Sliced Update Buckets | System scheduling | CPU usage reduction 30-50% |
| TypedArray Input State | Input polling | GC-free input queries |
| Hierarchical Visibility | Culling | Draw call reduction 40-70% |
| Hot/Cold SOA Layout | Memory | Cache miss reduction 50%+ |
| Uniform Pool Allocator | Temporary objects | Zero GC pressure |
| Custom Render Order | Rendering pipeline | Overdraw reduction 20-40% |
| Worker-based Offloading | LOD, AI, pathfinding | Main thread load reduction 40%+ |

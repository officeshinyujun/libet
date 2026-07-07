# Audio Manager

> **Status**: Planned — Implementation target: Phase 2

A Web Audio API wrapper providing spatial audio, volume groups, pooling, and asset lifecycle management.

## API

```typescript
interface AudioConfig {
  masterVolume: number
  spatial: boolean
  poolSize: number
}

interface PlayOptions {
  volume?: number
  pitch?: number
  loop?: boolean
  group?: 'sfx' | 'music' | 'ambient' | 'voice'
  startTime?: number
  fadeIn?: number   // Seconds
}

interface SpatialOptions extends PlayOptions {
  position: [number, number, number]
  refDistance?: number   // Default: 3
  maxDistance?: number   // Default: 100
  rolloff?: number       // Default: 1 (logarithmic)
}

interface AudioHandle {
  id: string
  play(): void
  pause(): void
  stop(): void
  setVolume(vol: number): void
  setPitch(pitch: number): void
  setPosition(pos: [number, number, number]): void
  isPlaying(): boolean
  getDuration(): number
  getPlaybackTime(): number
  onEnded(callback: () => void): void
}

class AudioManager {
  constructor(config?: AudioConfig)

  play(clip: AudioBuffer, options?: PlayOptions): AudioHandle
  playSpatial(clip: AudioBuffer, options: SpatialOptions): AudioHandle
  stopAll(): void
  stopGroup(group: string): void

  // Volume groups
  setGroupVolume(group: string, volume: number): void
  getGroupVolume(group: string): number
  setMasterVolume(vol: number): void

  // Listener (attach to camera)
  setListenerPosition(pos: [number, number, number]): void
  setListenerOrientation(forward: [number, number, number], up: [number, number, number]): void

  // Pooling
  setPoolSize(size: number): void
  getActiveCount(): number

  // Cleanup
  dispose(): void
}
```

## Usage

```typescript
import { AudioManager } from "@web-game/libet"

const audio = new AudioManager({
  masterVolume: 0.8,
  spatial: true,
  poolSize: 32,
})

// Simple SFX
const sfx = audio.play(clickBuffer, {
  volume: 0.5,
  group: 'sfx',
})
sfx.onEnded(() => console.log("Click finished"))

// Spatial audio (3D position)
const footsteps = audio.playSpatial(footstepBuffer, {
  position: [5, 0, 3],
  refDistance: 2,
  maxDistance: 20,
  loop: true,
  group: 'ambient',
})

// Update position as entity moves
footsteps.setPosition([10, 0, 8])

// Volume control
audio.setMasterVolume(0.5)
audio.setGroupVolume('music', 0.3)
audio.setGroupVolume('sfx', 1.0)

// Listener follows camera
useFrame(() => {
  audio.setListenerPosition(camera.position.toArray())
  audio.setListenerOrientation(
    camera.getWorldDirection(new THREE.Vector3()).toArray(),
    [0, 1, 0]
  )
})
```

## Volume Groups

| Group | Suggested Volume | Typical Use |
|-------|------------------|-------------|
| `sfx` | 1.0 | One-shot effects, gunshots, impacts |
| `music` | 0.3~0.5 | Background music, boss themes |
| `ambient` | 0.4~0.6 | Environmental loops, wind, water |
| `voice` | 1.0 | Dialog, narration, callouts |

## Object Pooling

- Pre-allocates `poolSize` audio sources at initialization
- Playing a clip claims a source from the pool
- Stopped or ended sources return to the pool
- If all sources are in use, the oldest non-looping source is recycled (with warning)

## Web Audio Graph

```
MasterGain → GroupGains (sfx/music/ambient/voice)
  └─ Each GroupGain → PannerNode (if spatial) → SourceNode (pooled)
```

## React Integration

```tsx
function useAudio(url: string, spatial?: boolean) {
  const buffer = useAsset(url, 'audio').data

  const play = useCallback((options?: PlayOptions) => {
    if (buffer) return audio.play(buffer, options)
  }, [buffer])

  return { play, audio }
}
```

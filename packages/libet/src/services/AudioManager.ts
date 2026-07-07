export interface AudioConfig {
  masterVolume?: number
  spatial?: boolean
  poolSize?: number
}

export interface PlayOptions {
  volume?: number
  pitch?: number
  loop?: boolean
  group?: string
  startTime?: number
  fadeIn?: number
}

export interface SpatialOptions extends PlayOptions {
  position: [number, number, number]
  refDistance?: number
  maxDistance?: number
  rolloff?: number
}

export interface AudioHandle {
  readonly id: string
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

class AudioSourceHandle implements AudioHandle {
  readonly id: string
  private source: AudioBufferSourceNode | null = null
  private gain: GainNode
  private panner: PannerNode | null = null
  private _isPlaying = false
  private _duration = 0
  private _playbackTime = 0
  private _startOffset = 0
  private _startTime = 0
  private _pausedAt = 0
  private _onEnded: (() => void) | null = null
  private volume: number
  private pitch: number
  private loop: boolean
  private buffer: AudioBuffer
  private ctx: AudioContext
  private endedHandler: (() => void) | null = null

  constructor(
    id: string,
    buffer: AudioBuffer,
    ctx: AudioContext,
    dest: AudioNode,
    options: PlayOptions & { spatial?: boolean; position?: [number, number, number]; refDistance?: number; maxDistance?: number; rolloff?: number },
  ) {
    this.id = id
    this.buffer = buffer
    this.ctx = ctx
    this.volume = options.volume ?? 1
    this.pitch = options.pitch ?? 1
    this.loop = options.loop ?? false
    this._duration = buffer.duration

    this.gain = ctx.createGain()
    this.gain.gain.value = this.volume

    if (options.spatial && options.position) {
      this.panner = ctx.createPanner()
      this.panner.panningModel = "HRTF"
      this.panner.distanceModel = "inverse"
      this.panner.refDistance = options.refDistance ?? 3
      this.panner.maxDistance = options.maxDistance ?? 100
      this.panner.rolloffFactor = options.rolloff ?? 1
      this.panner.positionX.value = options.position[0]
      this.panner.positionY.value = options.position[1]
      this.panner.positionZ.value = options.position[2]
      this.gain.connect(this.panner)
      this.panner.connect(dest)
    } else {
      this.gain.connect(dest)
    }

    if (options.fadeIn && options.fadeIn > 0) {
      this.gain.gain.setValueAtTime(0, ctx.currentTime)
      this.gain.gain.linearRampToValueAtTime(this.volume, ctx.currentTime + options.fadeIn)
    }
  }

  play(): void {
    if (this._isPlaying) return

    this.source = this.ctx.createBufferSource()
    this.source.buffer = this.buffer
    this.source.playbackRate.value = this.pitch
    this.source.loop = this.loop

    this.source.connect(this.gain)

    const offset = this._pausedAt
    this._startOffset = offset
    this._startTime = this.ctx.currentTime

    this.source.start(0, offset)
    this._isPlaying = true

    this.endedHandler = () => {
      this._isPlaying = false
      this._onEnded?.()
    }
    this.source.onended = this.endedHandler
  }

  pause(): void {
    if (!this._isPlaying || !this.source) return
    this.source.stop()
    this._pausedAt = this.getPlaybackTime()
    this._isPlaying = false
  }

  stop(): void {
    if (!this._isPlaying || !this.source) return
    this.source.stop()
    this._isPlaying = false
    this._pausedAt = 0
  }

  setVolume(vol: number): void {
    this.volume = vol
    this.gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1)
  }

  setPitch(pitch: number): void {
    this.pitch = pitch
    if (this.source) {
      this.source.playbackRate.value = pitch
    }
  }

  setPosition(pos: [number, number, number]): void {
    if (this.panner) {
      this.panner.positionX.value = pos[0]
      this.panner.positionY.value = pos[1]
      this.panner.positionZ.value = pos[2]
    }
  }

  isPlaying(): boolean {
    return this._isPlaying
  }

  getDuration(): number {
    return this._duration
  }

  getPlaybackTime(): number {
    if (!this._isPlaying) return this._pausedAt
    return this._pausedAt + (this.ctx.currentTime - this._startTime)
  }

  onEnded(callback: () => void): void {
    this._onEnded = callback
  }

  dispose(): void {
    this.stop()
    this.gain.disconnect()
    this.panner?.disconnect()
  }
}

export class AudioManager {
  private ctx: AudioContext
  private masterGain: GainNode
  private groupGains = new Map<string, GainNode>()
  private listener: AudioListener | null = null
  private pool: AudioBufferSourceNode[] = []
  private config: Required<AudioConfig>
  private handles = new Map<string, AudioSourceHandle>()

  constructor(config: AudioConfig = {}) {
    this.config = {
      masterVolume: config.masterVolume ?? 0.8,
      spatial: config.spatial ?? true,
      poolSize: config.poolSize ?? 32,
    }

    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = this.config.masterVolume
    this.masterGain.connect(this.ctx.destination)

    const defaultGroups = ['sfx', 'music', 'ambient', 'voice']
    for (const group of defaultGroups) {
      const gain = this.ctx.createGain()
      gain.gain.value = 1.0
      gain.connect(this.masterGain)
      this.groupGains.set(group, gain)
    }
  }

  private getGroupNode(group?: string): AudioNode {
    if (group && this.groupGains.has(group)) {
      return this.groupGains.get(group)!
    }
    return this.masterGain
  }

  play(clip: AudioBuffer, options: PlayOptions = {}): AudioHandle {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const id = `audio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const dest = this.getGroupNode(options.group)

    const handle = new AudioSourceHandle(id, clip, this.ctx, dest, {
      ...options,
      spatial: false,
    })

    this.handles.set(id, handle)
    handle.play()
    return handle
  }

  playSpatial(clip: AudioBuffer, options: SpatialOptions): AudioHandle {
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    const id = `spatial_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const dest = this.getGroupNode(options.group)

    const handle = new AudioSourceHandle(id, clip, this.ctx, dest, {
      ...options,
      spatial: true,
    })

    this.handles.set(id, handle)
    handle.play()
    return handle
  }

  stopAll(): void {
    for (const handle of this.handles.values()) {
      handle.stop()
    }
  }

  stopGroup(group: string): void {
    for (const handle of this.handles.values()) {
      if (handle.isPlaying()) {
        handle.stop()
      }
    }
  }

  setGroupVolume(group: string, volume: number): void {
    const gain = this.groupGains.get(group)
    if (gain) {
      gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1)
    }
  }

  getGroupVolume(group: string): number {
    return this.groupGains.get(group)?.gain.value ?? 0
  }

  setMasterVolume(vol: number): void {
    this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.1)
  }

  setListenerPosition(pos: [number, number, number]): void {
    this.ctx.listener.positionX.value = pos[0]
    this.ctx.listener.positionY.value = pos[1]
    this.ctx.listener.positionZ.value = pos[2]
  }

  setListenerOrientation(
    forward: [number, number, number],
    up: [number, number, number],
  ): void {
    this.ctx.listener.forwardX.value = forward[0]
    this.ctx.listener.forwardY.value = forward[1]
    this.ctx.listener.forwardZ.value = forward[2]
    this.ctx.listener.upX.value = up[0]
    this.ctx.listener.upY.value = up[1]
    this.ctx.listener.upZ.value = up[2]
  }

  setPoolSize(size: number): void {
    this.config.poolSize = size
  }

  getActiveCount(): number {
    let count = 0
    for (const handle of this.handles.values()) {
      if (handle.isPlaying()) count++
    }
    return count
  }

  dispose(): void {
    this.stopAll()
    this.handles.clear()
    this.masterGain.disconnect()
    for (const gain of this.groupGains.values()) {
      gain.disconnect()
    }
    this.ctx.close()
  }
}

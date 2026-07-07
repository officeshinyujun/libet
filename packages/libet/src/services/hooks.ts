import { useState, useEffect, useCallback, useRef } from "react"
import { AssetManager, type AssetHandle } from "./AssetManager"
import { InputManager } from "./InputManager"
import { AudioManager, type AudioHandle, type PlayOptions, type SpatialOptions } from "./AudioManager"

let globalAssetManager: AssetManager | null = null
let globalInputManager: InputManager | null = null
let globalAudioManager: AudioManager | null = null

export function setAssetManager(mgr: AssetManager): void {
  globalAssetManager = mgr
}
export function setInputManager(mgr: InputManager): void {
  globalInputManager = mgr
}
export function setAudioManager(mgr: AudioManager): void {
  globalAudioManager = mgr
}

export function getAssetManager(): AssetManager {
  if (!globalAssetManager) {
    globalAssetManager = new AssetManager()
  }
  return globalAssetManager
}
export function getInputManager(): InputManager {
  if (!globalInputManager) {
    globalInputManager = new InputManager()
  }
  return globalInputManager
}
export function getAudioManager(): AudioManager {
  if (!globalAudioManager) {
    globalAudioManager = new AudioManager()
  }
  return globalAudioManager
}

export function useAsset<T>(url: string, type: "gltf" | "texture" | "audio" | "hdr" | "json" | "binary") {
  const [asset, setAsset] = useState<AssetHandle<T> | null>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    const mgr = getAssetManager()

    mgr.load<T>(url, type).then((handle) => {
      if (!cancelled) setAsset(handle)
    }).catch((err) => {
      if (!cancelled) setError(err)
    })

    return () => {
      cancelled = true
    }
  }, [url, type])

  return { data: asset?.data, progress, error }
}

export function useInputAction(name: string, input?: InputManager) {
  const mgr = input ?? getInputManager()
  const [active, setActive] = useState(false)
  const [justPressed, setJustPressed] = useState(false)

  useEffect(() => {
    let frameId: number
    let prev = false

    const check = () => {
      const curr = mgr.isActive(name)
      setActive(curr)
      setJustPressed(curr && !prev)
      prev = curr
      frameId = requestAnimationFrame(check)
    }
    frameId = requestAnimationFrame(check)
    return () => cancelAnimationFrame(frameId)
  }, [name, mgr])

  return { active, justPressed }
}

export function useInputVector2(name: string, input?: InputManager) {
  const mgr = input ?? getInputManager()
  const [vec2, setVec2] = useState<[number, number]>([0, 0])

  useEffect(() => {
    let frameId: number
    const check = () => {
      setVec2(mgr.getVector2(name))
      frameId = requestAnimationFrame(check)
    }
    frameId = requestAnimationFrame(check)
    return () => cancelAnimationFrame(frameId)
  }, [name, mgr])

  return vec2
}

export function useAudio(url: string, spatial = false) {
  const [buffer, setBuffer] = useState<AudioBuffer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const mgr = getAudioManager()
    const assetMgr = getAssetManager()

    assetMgr.load<ArrayBuffer>(url, "audio").then((handle) => {
      if (cancelled) return
      const ctx = (mgr as any).ctx as AudioContext
      ctx.decodeAudioData(handle.data).then((buf) => {
        if (!cancelled) {
          setBuffer(buf)
          setLoading(false)
        }
      })
    }).catch(() => setLoading(false))

    return () => { cancelled = true }
  }, [url])

  const play = useCallback((options?: PlayOptions): AudioHandle | null => {
    if (!buffer) return null
    return getAudioManager().play(buffer, options)
  }, [buffer])

  const playSpatial = useCallback((options: SpatialOptions): AudioHandle | null => {
    if (!buffer) return null
    return getAudioManager().playSpatial(buffer, options)
  }, [buffer])

  return { play, playSpatial, loading }
}

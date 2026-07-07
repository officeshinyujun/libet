export type AssetType = 'gltf' | 'texture' | 'audio' | 'hdr' | 'json' | 'binary'

export interface LoadItem {
  url: string
  type: AssetType
}

export interface ProgressInfo {
  loaded: number
  total: number
  percentage: number
}

type ProgressCallback = (progress: ProgressInfo) => void

export interface AssetHandle<T = unknown> {
  id: string
  data: T
  refCount: number
  retain(): void
  release(): void
}

interface AssetEntry<T = unknown> {
  handle: AssetHandle<T>
  promise: Promise<AssetHandle<T>>
  settled: boolean
}

export class AssetManager {
  private cache = new Map<string, AssetEntry<unknown>>()
  private basePath = ""
  private loadingCount = 0
  private totalCount = 0
  private progressListeners: ProgressCallback[] = []

  setBasePath(path: string): void {
    this.basePath = path.replace(/\/$/, "")
  }

  onProgress(cb: ProgressCallback): void {
    this.progressListeners.push(cb)
  }

  private resolveUrl(url: string): string {
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url
    }
    return this.basePath ? `${this.basePath}/${url}` : url
  }

  load<T>(url: string, type: AssetType): Promise<AssetHandle<T>> {
    const resolved = this.resolveUrl(url)
    const cached = this.cache.get(resolved)
    if (cached) {
      return cached.promise as Promise<AssetHandle<T>>
    }

    this.totalCount++
    this.loadingCount++
    this.emitProgress()

    const promise = this.loadInternal<T>(resolved, type).finally(() => {
      this.loadingCount--
      this.emitProgress()
    })

    const id = resolved
    const entry: AssetEntry<T> = {
      handle: {
        id,
        data: null as unknown as T,
        refCount: 1,
        retain: function (this: AssetHandle) { this.refCount++ },
        release: function (this: AssetHandle) { this.refCount-- },
      } as AssetHandle<T>,
      promise,
      settled: false,
    }

    this.cache.set(resolved, entry)

    promise.then((handle) => {
      entry.settled = true
    }).catch(() => {
      this.cache.delete(resolved)
    })

    return promise
  }

  loadMultiple<T>(items: LoadItem[]): Promise<AssetHandle<T>[]> {
    return Promise.all(items.map((item) => this.load<T>(item.url, item.type)))
  }

  preload(urls: string[], onProgress?: ProgressCallback): Promise<void> {
    if (onProgress) this.progressListeners.push(onProgress)

    const items: LoadItem[] = urls.map((url) => {
      const ext = url.split(".").pop()?.toLowerCase() || ""
      const type = this.guessType(ext)
      return { url, type }
    })

    return this.loadMultiple(items).then(() => {}) as Promise<void>
  }

  private guessType(ext: string): AssetType {
    switch (ext) {
      case "glb":
      case "gltf":
        return "gltf"
      case "jpg":
      case "jpeg":
      case "png":
      case "webp":
      case "svg":
        return "texture"
      case "mp3":
      case "wav":
      case "ogg":
      case "aac":
        return "audio"
      case "hdr":
      case "exr":
        return "hdr"
      case "json":
        return "json"
      default:
        return "binary"
    }
  }

  private async loadInternal<T>(url: string, type: AssetType): Promise<AssetHandle<T>> {
    let data: T

    switch (type) {
      case "gltf": {
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js")
        const loader = new GLTFLoader()
        data = await new Promise((resolve, reject) => {
          loader.load(url, (gltf) => resolve(gltf as unknown as T), undefined, reject)
        })
        break
      }

      case "texture": {
        const { TextureLoader } = await import("three")
        const loader = new TextureLoader()
        data = await new Promise((resolve, reject) => {
          loader.load(url, (tex) => resolve(tex as unknown as T), undefined, reject)
        })
        break
      }

      case "audio": {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        data = arrayBuffer as unknown as T
        break
      }

      case "json": {
        const response = await fetch(url)
        data = await response.json()
        break
      }

      case "hdr": {
        const { RGBELoader } = await import("three/examples/jsm/loaders/RGBELoader.js")
        const loader = new RGBELoader()
        data = await new Promise((resolve, reject) => {
          loader.load(url, (tex) => resolve(tex as unknown as T), undefined, reject)
        })
        break
      }

      default: {
        const response = await fetch(url)
        const buffer = await response.arrayBuffer()
        data = buffer as unknown as T
        break
      }
    }

    const entry = this.cache.get(url)
    if (entry) {
      entry.handle.data = data
      entry.settled = true
    }

    return {
      id: url,
      data,
      refCount: 1,
      retain: function (this: AssetHandle) { this.refCount++ },
      release: function (this: AssetHandle) { this.refCount-- },
    } as AssetHandle<T>
  }

  get<T>(id: string): AssetHandle<T> | undefined {
    const resolved = this.resolveUrl(id)
    const entry = this.cache.get(resolved)
    if (entry?.settled) {
      return entry.handle as AssetHandle<T>
    }
    return undefined
  }

  release(id: string): void {
    const resolved = this.resolveUrl(id)
    const entry = this.cache.get(resolved)
    if (entry) {
      entry.handle.refCount--
      if (entry.handle.refCount <= 0) {
        this.cache.delete(resolved)
      }
    }
  }

  releaseAll(): void {
    this.cache.clear()
  }

  private emitProgress(): void {
    const total = this.totalCount
    const loaded = total - this.loadingCount
    const info: ProgressInfo = {
      loaded,
      total,
      percentage: total > 0 ? (loaded / total) * 100 : 100,
    }
    for (const cb of this.progressListeners) {
      cb(info)
    }
  }

  get pending(): number {
    return this.loadingCount
  }

  get cached(): number {
    return this.cache.size
  }
}

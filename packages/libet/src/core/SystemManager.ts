export interface GameSystem {
  readonly name: string
  priority: number
  updateInterval: number
  lastUpdate: number
  init?(): void
  update(dt: number): void
  cleanup?(): void
}

export abstract class BaseSystem implements GameSystem {
  abstract readonly name: string
  priority = 5
  updateInterval = 0
  lastUpdate = 0

  init?(): void
  abstract update(dt: number): void
  cleanup?(): void
}

export class SystemManager {
  private systems: GameSystem[] = []
  private sorted = false

  register(system: GameSystem): void {
    this.systems.push(system)
    this.sorted = false
    system.init?.()
  }

  unregister(name: string): void {
    const idx = this.systems.findIndex((s) => s.name === name)
    if (idx !== -1) {
      this.systems[idx].cleanup?.()
      this.systems.splice(idx, 1)
    }
  }

  get<T extends GameSystem>(name: string): T | undefined {
    return this.systems.find((s) => s.name === name) as T | undefined
  }

  update(dt: number): void {
    if (!this.sorted) {
      this.systems.sort((a, b) => a.priority - b.priority)
      this.sorted = true
    }
    const now = performance.now()
    for (const system of this.systems) {
      if (now - system.lastUpdate >= system.updateInterval * 1000) {
        system.lastUpdate = now
        system.update(dt)
      }
    }
  }

  destroy(): void {
    for (const system of this.systems) {
      system.cleanup?.()
    }
    this.systems.length = 0
    this.sorted = false
  }
}

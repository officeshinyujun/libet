import type { Component } from "./Component"
import { DirtyFlags } from "./Component"

export class Entity {
  readonly id: string
  private components = new Map<string, Component>()
  dirtyFlags = 0
  active = true
  visible = true

  constructor(id: string) {
    this.id = id
  }

  addComponent(component: Component): this {
    component.entity = this
    this.components.set(component.type, component)
    component.onAttach?.()
    this.markDirty(DirtyFlags.ALL)
    return this
  }

  removeComponent(type: string): void {
    const comp = this.components.get(type)
    if (comp) {
      comp.onDetach?.()
      this.components.delete(type)
    }
  }

  getComponent<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T | undefined
  }

  hasComponent(type: string): boolean {
    return this.components.has(type)
  }

  getComponents(): IterableIterator<Component> {
    return this.components.values()
  }

  markDirty(flags: number): void {
    this.dirtyFlags |= flags
  }

  clearDirty(flags?: number): void {
    if (flags !== undefined) {
      this.dirtyFlags &= ~flags
    } else {
      this.dirtyFlags = 0
    }
  }

  updateComponents(dt: number): void {
    if (!this.active) return
    for (const component of this.components.values()) {
      component.update?.(dt)
    }
  }

  destroy(): void {
    for (const component of this.components.values()) {
      component.onDetach?.()
    }
    this.components.clear()
    this.active = false
    this.visible = false
  }
}

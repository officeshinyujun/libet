import { Entity } from "./Entity"
import type { Component } from "./Component"

export class EntityManager {
  private entities = new Map<string, Entity>()
  private pendingDestroy: string[] = []

  create(id: string, components?: Component[]): Entity {
    if (this.entities.has(id)) {
      return this.entities.get(id)!
    }
    const entity = new Entity(id)
    if (components) {
      for (const comp of components) {
        entity.addComponent(comp)
      }
    }
    this.entities.set(id, entity)
    return entity
  }

  get(id: string): Entity | undefined {
    return this.entities.get(id)
  }

  has(id: string): boolean {
    return this.entities.has(id)
  }

  destroy(id: string): void {
    const entity = this.entities.get(id)
    if (entity) {
      entity.destroy()
      this.entities.delete(id)
    }
  }

  destroyLater(id: string): void {
    this.pendingDestroy.push(id)
  }

  flushPendingDestroys(): void {
    for (const id of this.pendingDestroy) {
      this.destroy(id)
    }
    this.pendingDestroy.length = 0
  }

  findByComponent(type: string): Entity[] {
    const result: Entity[] = []
    for (const entity of this.entities.values()) {
      if (entity.active && entity.hasComponent(type)) {
        result.push(entity)
      }
    }
    return result
  }

  forEach(fn: (entity: Entity) => void): void {
    for (const entity of this.entities.values()) {
      if (entity.active) fn(entity)
    }
  }

  get count(): number {
    return this.entities.size
  }

  clear(): void {
    for (const entity of this.entities.values()) {
      entity.destroy()
    }
    this.entities.clear()
    this.pendingDestroy.length = 0
  }
}

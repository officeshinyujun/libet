import type { Entity } from "./Entity"

export enum DirtyFlags {
  TRANSFORM  = 1 << 0,
  MATERIAL   = 1 << 1,
  VISIBILITY = 1 << 2,
  BOUNDS     = 1 << 3,
  ALL        = 0x7fffffff,
}

export interface Component {
  readonly type: string
  entity: Entity
  onAttach?(): void
  onDetach?(): void
  update?(dt: number): void
}

export abstract class BaseComponent implements Component {
  abstract readonly type: string
  entity!: Entity

  onAttach?(): void
  onDetach?(): void
  update?(dt: number): void
}

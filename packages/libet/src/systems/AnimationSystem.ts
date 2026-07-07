import { AnimationMixer, AnimationClip, AnimationAction, Object3D, LoopRepeat, LoopOnce } from "three"
import { BaseSystem } from "../core/SystemManager"

export interface AnimationState {
  name: string
  clip: AnimationClip
  loop?: boolean
  speed?: number
  blendTime?: number
}

export class AnimationComponent {
  readonly type = "animation"
  entity: any
  private mixer: AnimationMixer
  private states = new Map<string, AnimationState>()
  private actions = new Map<string, AnimationAction>()
  private currentState = ""
  private nextState = ""
  private blendTime = 0
  private blendElapsed = 0

  constructor(root: Object3D) {
    this.mixer = new AnimationMixer(root)
  }

  addState(state: AnimationState): void {
    this.states.set(state.name, state)
    const action = this.mixer.clipAction(state.clip)
    action.setLoop(state.loop ? LoopRepeat : LoopOnce, 1)
    if (!state.loop) action.clampWhenFinished = true
    action.stop()
    this.actions.set(state.name, action)
  }

  play(name: string, blendTime = 0.2): void {
    if (!this.actions.has(name) || name === this.currentState) return
    this.nextState = name
    this.blendTime = blendTime
    this.blendElapsed = 0
  }

  update(dt: number): void {
    if (this.nextState && this.currentState !== this.nextState) {
      const fromAction = this.actions.get(this.currentState)
      const toAction = this.actions.get(this.nextState)
      if (toAction) {
        this.blendElapsed += dt
        const t = Math.min(this.blendElapsed / this.blendTime, 1)
        if (fromAction && this.blendTime > 0) {
          fromAction.setEffectiveWeight(1 - t)
        }
        toAction.setEffectiveWeight(t)
        toAction.play()
        if (t >= 1) {
          fromAction?.stop()
          this.currentState = this.nextState
          this.nextState = ""
        }
      }
    }
    this.mixer.update(dt)
  }

  getCurrentState(): string {
    return this.currentState
  }

  destroy(): void {
    this.mixer.stopAllAction()
  }
}

export class AnimationSystem extends BaseSystem {
  readonly name = "animation"
  priority = 2
  updateInterval = 1 / 60

  private components = new Set<AnimationComponent>()

  register(comp: AnimationComponent): void {
    this.components.add(comp)
  }

  unregister(comp: AnimationComponent): void {
    this.components.delete(comp)
  }

  update(dt: number): void {
    for (const comp of this.components) {
      comp.update(dt)
    }
  }
}

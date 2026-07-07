export type InputDevice = 'keyboard' | 'mouse' | 'gamepad' | 'touch'

export interface InputBinding {
  device: InputDevice
  code: string
  modifiers?: {
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
  }
}

export type InputMode = 'pressed' | 'released' | 'held' | 'doubleTap'

export interface InputAction {
  name: string
  bindings: InputBinding[]
  mode: InputMode
}

interface ActionState {
  action: InputAction
  active: boolean
  previous: boolean
  timestamp: number
  lastTapTime: number
  value: number
  vector2: [number, number]
}

const MAX_ACTIONS = 256

export class InputManager {
  private states = new Map<string, ActionState>()
  private activeFlags = new Uint8Array(MAX_ACTIONS)
  private justPressedFlags = new Uint8Array(MAX_ACTIONS)
  private justReleasedFlags = new Uint8Array(MAX_ACTIONS)
  private values = new Float32Array(MAX_ACTIONS)
  private vectors = new Float32Array(MAX_ACTIONS * 2)
  private actionIndex = new Map<string, number>()
  private nextIndex = 0

  private rawKeys = new Set<string>()
  private rawMouseButtons = new Set<number>()
  private mouseDelta: [number, number] = [0, 0]
  private gamepads: (Gamepad | null)[] = []
  private doubleTapThreshold = 300

  constructor() {
    this.setupListeners()
  }

  private setupListeners(): void {
    window.addEventListener("keydown", (e) => {
      this.rawKeys.add(e.code)
    })
    window.addEventListener("keyup", (e) => {
      this.rawKeys.delete(e.code)
    })
    window.addEventListener("mousedown", (e) => {
      this.rawMouseButtons.add(e.button)
    })
    window.addEventListener("mouseup", (e) => {
      this.rawMouseButtons.delete(e.button)
    })
    window.addEventListener("mousemove", (e) => {
      this.mouseDelta[0] += e.movementX
      this.mouseDelta[1] += e.movementY
    })
  }

  registerAction(action: InputAction): void {
    if (this.actionIndex.has(action.name)) return

    const idx = this.nextIndex++
    this.actionIndex.set(action.name, idx)
    this.states.set(action.name, {
      action,
      active: false,
      previous: false,
      timestamp: 0,
      lastTapTime: 0,
      value: 0,
      vector2: [0, 0],
    })
  }

  unregisterAction(name: string): void {
    const idx = this.actionIndex.get(name)
    if (idx !== undefined) {
      this.activeFlags[idx] = 0
      this.justPressedFlags[idx] = 0
      this.justReleasedFlags[idx] = 0
      this.values[idx] = 0
      this.vectors[idx * 2] = 0
      this.vectors[idx * 2 + 1] = 0
      this.actionIndex.delete(name)
    }
    this.states.delete(name)
  }

  update(): void {
    this.updateGamepads()

    for (const [name, state] of this.states) {
      const idx = this.actionIndex.get(name)!
      state.previous = state.active
      state.active = this.evaluateBinding(state.action)

      const now = performance.now()

      switch (state.action.mode) {
        case 'pressed':
          this.activeFlags[idx] = state.active ? 1 : 0
          this.justPressedFlags[idx] = (state.active && !state.previous) ? 1 : 0
          this.justReleasedFlags[idx] = (!state.active && state.previous) ? 1 : 0
          break

        case 'held':
          this.activeFlags[idx] = state.active ? 1 : 0
          this.justPressedFlags[idx] = 0
          this.justReleasedFlags[idx] = 0
          break

        case 'released':
          this.activeFlags[idx] = (!state.active && state.previous) ? 1 : 0
          this.justPressedFlags[idx] = 0
          this.justReleasedFlags[idx] = (!state.active && state.previous) ? 1 : 0
          break

        case 'doubleTap': {
          const justActivated = state.active && !state.previous
          if (justActivated) {
            const timeSinceLastTap = now - state.lastTapTime
            if (timeSinceLastTap < this.doubleTapThreshold) {
              this.activeFlags[idx] = 1
              state.lastTapTime = 0
            } else {
              this.activeFlags[idx] = 0
              state.lastTapTime = now
            }
          } else {
            this.activeFlags[idx] = 0
          }
          this.justPressedFlags[idx] = 0
          this.justReleasedFlags[idx] = 0
          break
        }
      }

      this.values[idx] = state.active ? 1 : 0
    }
  }

  private evaluateBinding(action: InputAction): boolean {
    for (const binding of action.bindings) {
      if (this.checkBinding(binding)) return true
    }
    return false
  }

  private checkBinding(binding: InputBinding): boolean {
    switch (binding.device) {
      case 'keyboard':
        return this.rawKeys.has(binding.code)
      case 'mouse':
        return this.rawMouseButtons.has(Number(binding.code.replace("Mouse", "")))
      case 'gamepad':
        return this.checkGamepadBinding(binding.code)
      case 'touch':
        return false
      default:
        return false
    }
  }

  private checkGamepadBinding(code: string): boolean {
    for (const gp of this.gamepads) {
      if (!gp) continue
      if (code.startsWith("GamepadButton")) {
        const idx = parseInt(code.replace("GamepadButton", ""), 10)
        if (gp.buttons[idx]?.pressed) return true
      }
      if (code === "GamepadLeftStick") {
        const x = gp.axes[0] ?? 0
        const y = gp.axes[1] ?? 0
        if (Math.abs(x) > 0.2 || Math.abs(y) > 0.2) return true
      }
    }
    return false
  }

  private updateGamepads(): void {
    this.gamepads = navigator.getGamepads ? Array.from(navigator.getGamepads()) : []
  }

  isActive(name: string): boolean {
    const idx = this.actionIndex.get(name)
    return idx !== undefined ? this.activeFlags[idx] === 1 : false
  }

  justPressed(name: string): boolean {
    const idx = this.actionIndex.get(name)
    return idx !== undefined ? this.justPressedFlags[idx] === 1 : false
  }

  justReleased(name: string): boolean {
    const idx = this.actionIndex.get(name)
    return idx !== undefined ? this.justReleasedFlags[idx] === 1 : false
  }

  getValue(name: string): number {
    const idx = this.actionIndex.get(name)
    return idx !== undefined ? this.values[idx] : 0
  }

  getVector2(name: string): [number, number] {
    const idx = this.actionIndex.get(name)
    if (idx === undefined) return [0, 0]

    const state = this.states.get(name)
    if (!state?.action.bindings.some((b) => b.code === "WASD")) {
      return [0, 0]
    }

    let x = 0, z = 0
    if (this.rawKeys.has("KeyD") || this.rawKeys.has("ArrowRight")) x += 1
    if (this.rawKeys.has("KeyA") || this.rawKeys.has("ArrowLeft")) x -= 1
    if (this.rawKeys.has("KeyW") || this.rawKeys.has("ArrowUp")) z -= 1
    if (this.rawKeys.has("KeyS") || this.rawKeys.has("ArrowDown")) z += 1

    if (x !== 0 || z !== 0) {
      const len = Math.sqrt(x * x + z * z)
      x /= len
      z /= len
    }

    return [x, z]
  }

  getMouseDelta(): [number, number] {
    const d: [number, number] = [this.mouseDelta[0], this.mouseDelta[1]]
    this.mouseDelta[0] = 0
    this.mouseDelta[1] = 0
    return d
  }

  getBindings(name: string): InputBinding[] {
    return this.states.get(name)?.action.bindings ?? []
  }

  setBindings(name: string, bindings: InputBinding[]): void {
    const state = this.states.get(name)
    if (state) {
      state.action.bindings = bindings
    }
  }

  resetToDefaults(): void {
  }
}

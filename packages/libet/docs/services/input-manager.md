# Input Manager

> **Status**: Planned — Implementation target: Phase 2

An action-mapped input system that decouples game logic from raw input events. Supports keyboard, mouse, gamepad, and touch input through a unified API.

## Design Goals

- **Action-based**: Game code asks "is jump pressed?", not "is Space key down?"
- **Multi-device**: One action binds to keyboard + gamepad + mouse simultaneously
- **Rebindable**: Key mappings are data, not hardcoded
- **GC-free**: Input state stored in typed arrays, no allocations during polling

## API

```typescript
type InputDevice = 'keyboard' | 'mouse' | 'gamepad' | 'touch'

interface InputBinding {
  device: InputDevice
  code: string           // e.g., "KeyW", "Space", "Mouse0", "GamepadLeftStickY"
  modifiers?: {
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
  }
}

interface InputAction {
  name: string
  bindings: InputBinding[]
  mode: 'pressed' | 'released' | 'held' | 'doubleTap'
}

class InputManager {
  registerAction(action: InputAction): void
  unregisterAction(name: string): void

  // Query state
  isActive(name: string): boolean
  justPressed(name: string): boolean
  justReleased(name: string): boolean
  getValue(name: string): number           // Analog: 0.0 ~ 1.0
  getVector2(name: string): [number, number]  // Joystick axes

  // Rebinding
  getBindings(name: string): InputBinding[]
  setBindings(name: string, bindings: InputBinding[]): void
  resetToDefaults(): void

  // Gamepad
  getGamepadState(index: number): GamepadState | null
}
```

## Usage

```typescript
import { InputManager } from "@web-game/libet"

const input = new InputManager()

// Define actions
input.registerAction({
  name: "jump",
  bindings: [
    { device: 'keyboard', code: 'Space' },
    { device: 'gamepad', code: 'GamepadButtonA' },
    { device: 'mouse', code: 'Mouse0' },
  ],
  mode: 'pressed',
})

input.registerAction({
  name: "move",
  bindings: [
    { device: 'keyboard', code: 'WASD' },    // Special: maps to 4 keys
    { device: 'gamepad', code: 'GamepadLeftStick' }, // → Vector2
  ],
  mode: 'held',
})

// Game loop
function update(dt: number) {
  if (input.justPressed("jump")) {
    player.jump()
  }

  const move = input.getVector2("move")
  player.move(move[0], move[1])
}
```

## React Integration

```tsx
function useInputAction(name: string) {
  const input = useInputManager()
  const [active, setActive] = useState(false)

  useEffect(() => {
    const check = () => setActive(input.isActive(name))
    const interval = setInterval(check, 1000 / 60)
    return () => clearInterval(interval)
  }, [name])

  return active
}

function Movement() {
  const isMoving = useInputAction("move")
  return <effectComposer>{isMoving && <MotionBlur />}</effectComposer>
}
```

## Input State Storage (TypedArray)

```typescript
// Internal — no object allocations during polling
class InputState {
  private _active: Uint8Array       // 256 actions max
  private _justPressed: Uint8Array
  private _justReleased: Uint8Array
  private _values: Float32Array     // Analog values
  private _vectors: Float32Array    // Vector2 values packed

  // All queries are index lookups into typed arrays
  isActive(index: number): boolean {
    return this._active[index] === 1
  }
}
```

## Rebinding UI Example

```tsx
function RebindMenu() {
  const input = useInputManager()
  const bindings = input.getBindings("jump")

  return (
    <div>
      <label>Jump:</label>
      {bindings.map((b, i) => (
        <button key={i} onClick={() => startRebinding("jump", i)}>
          {b.code}
        </button>
      ))}
    </div>
  )
}
```

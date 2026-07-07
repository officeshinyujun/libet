import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function InputManagerPage() {
  const { locale } = useLocale()

  const example = `import { InputManager } from "@web-game/libet"

const input = new InputManager()

// Define actions (Action Mapping)
input.registerAction({
  name: "jump",
  bindings: [
    { device: "keyboard", code: "Space" },
    { device: "gamepad", code: "GamepadButtonA" },
  ],
  mode: "pressed",
})

input.registerAction({
  name: "move",
  bindings: [
    { device: "keyboard", code: "WASD" },
    { device: "gamepad", code: "GamepadLeftStick" },
  ],
  mode: "held",
})

// Query in game loop
if (input.justPressed("jump")) player.jump()
const [x, z] = input.getVector2("move")`

  if (locale === "ko") {
    return (
      <div>
        <h1>Input Manager</h1>
        <p>액션 매핑 기반 입력 시스템입니다. 키보드, 마우스, 게임패드를 통합된 인터페이스로 처리합니다.</p>

        <h2>특징</h2>
        <ul>
          <li><strong>Action 기반</strong>: "점프를 눌렀는가?" → 하드코딩된 키 검사 대신</li>
          <li><strong>멀티 디바이스</strong>: 하나의 Action에 여러 입력 바인딩</li>
          <li><strong>리바인딩 가능</strong>: <code>setBindings(name, bindings)</code></li>
          <li><strong>TypedArray 상태</strong>: GC-free 폴링</li>
          <li><strong>React Hook</strong>: <code>useInputAction(name)</code>, <code>useInputVector2(name)</code></li>
        </ul>

        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Input Manager</h1>
      <p>An action-mapped input system. Handles keyboard, mouse, and gamepad through a unified interface.</p>

      <h2>Features</h2>
      <ul>
        <li><strong>Action-based</strong>: "Is jump pressed?" instead of hardcoded key checks</li>
        <li><strong>Multi-device</strong>: Multiple bindings per action</li>
        <li><strong>Rebindable</strong>: <code>setBindings(name, bindings)</code></li>
        <li><strong>GC-free</strong>: TypedArray-based state storage</li>
        <li><strong>React Hooks</strong>: <code>useInputAction(name)</code>, <code>useInputVector2(name)</code></li>
      </ul>

      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

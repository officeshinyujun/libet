import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function ActionPage() {
  const { locale } = useLocale()
  const example = `<Character name="player">
  <Action
    inputKey="KeyE"
    action={(character) => console.log("Interact!", character.name)}
  />
  <Action
    mouseButton={0}
    action={(character) => console.log("Left clicked")}
  />
</Character>`

  if (locale === "ko") {
    return (
      <div>
        <h1>Action</h1>
        <p>키보드 키나 마우스 버튼을 콜백에 바인딩하는 로직 전용 컴포넌트입니다. <strong>반드시 Character의 자식</strong>이어야 합니다.</p>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          <div><code>inputKey</code></div><div><code>string</code></div><div>—</div><div>Keyboard event code (e.g., KeyE, Space)</div>
          <div><code>mouseButton</code></div><div><code>0 | 1 | 2</code></div><div>—</div><div>Mouse button: 0=left, 1=middle, 2=right</div>
          <div><code>action</code></div><div><code>function</code></div><div>—</div><div>Callback with character context</div>
        </div>
        <p>inputKey와 mouseButton 중 하나는 반드시 제공해야 합니다.</p>
        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Action</h1>
      <p>A logic-only component that binds a key or mouse button to a callback. <strong>Must be a child of Character.</strong></p>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        <div><code>inputKey</code></div><div><code>string</code></div><div>—</div><div>Keyboard event code</div>
        <div><code>mouseButton</code></div><div><code>0 | 1 | 2</code></div><div>—</div><div>Mouse button number</div>
        <div><code>action</code></div><div><code>function</code></div><div>—</div><div>Callback with character context</div>
      </div>
      <p>At least one of inputKey or mouseButton must be provided.</p>
      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

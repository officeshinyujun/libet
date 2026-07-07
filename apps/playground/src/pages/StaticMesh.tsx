import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function StaticMeshPage() {
  const { locale } = useLocale()
  const example = `<StaticMesh name="wall" position={[3, 1, 0]} scale={[0.5, 2, 3]} physics="fixed" color="#718096" />
<StaticMesh name="barrel" position={[0, 1, 0]} modelpath={barrelModel} physics="dynamic" />`

  if (locale === "ko") {
    return (
      <div>
        <h1>StaticMesh</h1>
        <p>단순 메시 액터입니다. Map보다 가벼우며, 소품이나 모듈형 레벨 조각에 적합합니다.</p>
        <h2>Props</h2>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          <div><code>physics</code></div><div><code>fixed/dynamic/none</code></div><div><code>fixed</code></div><div>Physics mode</div>
          <div><code>collider</code></div><div><code>auto</code></div><div>auto</div><div>Auto-detected by model presence</div>
          <div><code>color</code></div><div><code>string</code></div><div><code>white</code></div><div>Placeholder mesh color</div>
        </div>
        <h2>예제</h2>
        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>StaticMesh</h1>
      <p>A simple mesh actor. Lighter than Map, suitable for props and modular level pieces.</p>
      <h2>Props</h2>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        <div><code>physics</code></div><div><code>fixed/dynamic/none</code></div><div><code>fixed</code></div><div>Physics mode</div>
        <div><code>collider</code></div><div><code>auto</code></div><div>auto</div><div>Auto-detected</div>
        <div><code>color</code></div><div><code>string</code></div><div><code>white</code></div><div>Placeholder color</div>
      </div>
      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

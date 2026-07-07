import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function OutlinePage() {
  const { locale } = useLocale()

  const example = `<StaticMesh name="chest">
  <OutlineComponent color="gold" thickness={0.05} trigger="hover" />
</StaticMesh>

<StaticMesh name="door">
  <OutlineComponent color="#00ff88" trigger="click" />
</StaticMesh>`

  if (locale === "ko") {
    return (
      <div>
        <h1>OutlineComponent</h1>
        <p>메시에 하이라이트 아웃라인을 추가합니다. drei Outlines를 portal 렌더링으로 구현하여 정확한 뎁스 테스트를 보장합니다.</p>

        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          <div><code>color</code></div><div><code>string</code></div><div><code>white</code></div><div>Outline color</div>
          <div><code>thickness</code></div><div><code>number</code></div><div><code>0.05</code></div><div>Outline width (world units)</div>
          <div><code>trigger</code></div><div><code>always/hover/click</code></div><div><code>always</code></div><div>When to show</div>
          <div><code>emission</code></div><div><code>number</code></div><div><code>1</code></div><div>Emission multiplier</div>
        </div>

        <h2>Trigger 모드</h2>
        <ul>
          <li><strong>always</strong>: 항상 표시</li>
          <li><strong>hover</strong>: 플레이어가 바라볼 때 표시 (InteractionProvider 필요)</li>
          <li><strong>click</strong>: 바라보고 클릭 시 토글</li>
        </ul>

        <h2>예제</h2>
        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>OutlineComponent</h1>
      <p>Adds a highlight outline to a mesh. Built on drei Outlines with portal rendering for correct depth testing.</p>

      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        <div><code>color</code></div><div><code>string</code></div><div><code>white</code></div><div>Outline color</div>
        <div><code>thickness</code></div><div><code>number</code></div><div><code>0.05</code></div><div>Outline width</div>
        <div><code>trigger</code></div><div><code>always/hover/click</code></div><div><code>always</code></div><div>Show trigger</div>
        <div><code>emission</code></div><div><code>number</code></div><div><code>1</code></div><div>Emission multiplier</div>
      </div>

      <h2>Trigger Modes</h2>
      <ul>
        <li><strong>always</strong>: Always visible</li>
        <li><strong>hover</strong>: Visible when looked at (requires InteractionProvider)</li>
        <li><strong>click</strong>: Toggle on click</li>
      </ul>

      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

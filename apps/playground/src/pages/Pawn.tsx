import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

const propsData = [
  ["name", "string", "—", "Unique identifier"],
  ["physics", "string", "dynamic", "dynamic, fixed, kinematicPosition, kinematicVelocity"],
  ["mass", "number", "1.0", "Mass (dynamic only)"],
  ["collider", "string", "auto", "cuboid, hull, ball, etc."],
  ["color", "string", "orange", "Placeholder color"],
]

export function PawnPage() {
  const { locale } = useLocale()

  const example = `<Pawn name="crate" position={[0, 3, 0]} physics="dynamic" mass={2} color="#e53e3e" />
<Pawn name="ball" position={[1, 3, 0]} physics="dynamic" mass={0.5} color="#3182ce" collider="ball" />`

  if (locale === "ko") {
    return (
      <div>
        <h1>Pawn</h1>
        <p>범용 물리 액터입니다. Character와 달리 이동 로직이 내장되어 있지 않으며, 순수 물리 시뮬레이션에 의해 움직입니다.</p>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          {propsData.map(([n, t, d, desc]) => (
            <div key={n}><div><code>{n}</code></div><div><code>{t}</code></div><div>{d}</div><div>{desc}</div></div>
          ))}
        </div>
        <h2>물리 타입</h2>
        <ul>
          <li><strong>dynamic</strong>: 중력과 충돌에 영향받는 물체</li>
          <li><strong>fixed</strong>: 고정된 충돌체 (벽, 바닥)</li>
          <li><strong>kinematicPosition</strong>: 수동 위치 제어</li>
          <li><strong>kinematicVelocity</strong>: 속도 기반 제어</li>
        </ul>
        <h2>예제</h2>
        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Pawn</h1>
      <p>A generic physics-driven actor. Unlike Character, Pawn has no built-in movement logic — purely physics-driven.</p>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        {propsData.map(([n, t, d, desc]) => (
          <div key={n}><div><code>{n}</code></div><div><code>{t}</code></div><div>{d}</div><div>{desc}</div></div>
        ))}
      </div>
      <h2>Physics Types</h2>
      <ul>
        <li><strong>dynamic</strong>: Affected by gravity and collisions</li>
        <li><strong>fixed</strong>: Static collider (walls, floors)</li>
        <li><strong>kinematicPosition</strong>: Manual position control</li>
        <li><strong>kinematicVelocity</strong>: Velocity-based control</li>
      </ul>
      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

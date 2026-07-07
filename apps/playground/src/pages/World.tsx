import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

const propsData = [
  ["children", "ReactNode", "—", "Entities placed in the world"],
  ["width", "string", "—", "Canvas CSS width"],
  ["height", "string", "—", "Canvas CSS height"],
  ["physics.gravity", "[x, y, z]", "[0, -9.81, 0]", "Gravity vector"],
  ["physics.debug", "boolean", "false", "Physics wireframe"],
  ["camera.position", "[x, y, z]", "—", "Initial camera position"],
  ["camera.fov", "number", "75", "Field of view"],
  ["environment.preset", "string", "—", "HDR preset (sunset, dawn, night, ...)"],
  ["debug.stats", "boolean", "false", "Show FPS/draw calls overlay"],
  ["onTick", "(dt) => void", "—", "Called every frame"],
  ["onReady", "() => void", "—", "Called after init"],
]

export function WorldPage() {
  const { locale } = useLocale()

  const example = `<World
  width="100vw"
  height="100vh"
  camera={{ position: [0, 5, 10], fov: 75 }}
  physics={{ gravity: [0, -9.81, 0] }}
  debug={{ stats: true }}
  onTick={(dt) => console.log("tick", dt)}
>
  {/* Game objects */}
</World>`

  if (locale === "ko") {
    return (
      <div>
        <h1>World</h1>
        <p>게임 월드의 최상위 컨테이너입니다. R3F Canvas, Rapier Physics, 모든 내부 Provider를 자동으로 설정합니다.</p>

        <h2>Props</h2>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          {propsData.map(([name, type, def, desc]) => (
            <div key={name}>
              <div><code>{name}</code></div>
              <div><code>{type}</code></div>
              <div>{def}</div>
              <div>{desc}</div>
            </div>
          ))}
        </div>

        <h2>예제</h2>
        <CodeBlock code={example} lang="tsx" />

        <h2>Provider 체인</h2>
        <p>World는 내부적으로 Canvas → Physics → WorldProvider → InteractionProvider → Suspense 체인을 구성합니다.</p>
        <ul>
          <li><strong>WorldProvider</strong>: Entity 레지스트리, SystemManager 제공</li>
          <li><strong>InteractionProvider</strong>: Raycaster 포커스 상태 관리</li>
          <li><strong>ErrorBoundary</strong>: R3F 크래시 시 Fallback UI 표시</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h1>World</h1>
      <p>The top-level container for the entire game. Automatically sets up R3F Canvas, Rapier Physics, and all internal providers.</p>

      <h2>Props</h2>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        {propsData.map(([name, type, def, desc]) => (
          <div key={name}>
            <div><code>{name}</code></div>
            <div><code>{type}</code></div>
            <div>{def}</div>
            <div>{desc}</div>
          </div>
        ))}
      </div>

      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />

      <h2>Provider Chain</h2>
      <p>World internally constructs: Canvas → Physics → WorldProvider → InteractionProvider → Suspense.</p>
      <ul>
        <li><strong>WorldProvider</strong>: Entity registry, SystemManager</li>
        <li><strong>InteractionProvider</strong>: Raycaster focus state</li>
        <li><strong>ErrorBoundary</strong>: Fallback UI on R3F crash</li>
      </ul>
    </div>
  )
}

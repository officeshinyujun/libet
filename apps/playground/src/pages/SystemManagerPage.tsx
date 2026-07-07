import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function SystemManagerPage() {
  const { locale } = useLocale()

  const example = `import { SystemManager, BaseSystem } from "@web-game/libet"

// Define a system
class AISystem extends BaseSystem {
  readonly name = "ai"
  priority = 3
  updateInterval = 1 / 15  // 15fps

  update(dt: number) {
    // AI logic here
  }
}

// Register with SystemManager
const systems = new SystemManager()
systems.register(new AISystem())

// Called every frame by WorldLoop
systems.update(dt)
`

  const buckets = `// Built-in update intervals
new AISystem()     // 15fps (AI, pathfinding)
new CameraSystem() // every frame (camera follow)
new AnimationSystem() // 60fps (animation blending)

// Custom interval
class SlowSystem extends BaseSystem {
  readonly name = "cleanup"
  priority = 9
  updateInterval = 1  // 1fps
  update(dt: number) { /* cleanup */ }
}`

  if (locale === "ko") {
    return (
      <div>
        <h1>System Manager</h1>
        <p>게임 시스템의 등록, 스케줄링, 실행을 관리합니다. <strong>Time-Sliced Update Buckets</strong>을 통해 시스템별 업데이트 주기를 다르게 설정할 수 있습니다.</p>

        <h2>GameSystem 인터페이스</h2>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          <div><code>name</code></div><div><code>string</code></div><div>—</div><div>시스템 식별자</div>
          <div><code>priority</code></div><div><code>number</code></div><div><code>5</code></div><div>실행 순서 (낮을수록 먼저)</div>
          <div><code>updateInterval</code></div><div><code>number</code></div><div><code>0</code></div><div>업데이트 간격 (초). 0=매 프레임</div>
        </div>

        <h2>Update Buckets</h2>
        <p>모든 시스템이 60fps로 돌 필요는 없습니다. 중요도에 따라 updateInterval을 설정하면 CPU 사용률을 30-50% 절감할 수 있습니다.</p>
        <div className="props-grid">
          <div className="props-header">Interval</div>
          <div className="props-header">Priority</div>
          <div className="props-header">Example</div>
          <div className="props-header" />
          <div><code>0 (every frame)</code></div><div>1</div><div>Physics, Camera</div><div />
          <div><code>1/30 (30fps)</code></div><div>2</div><div>Animation, Input</div><div />
          <div><code>1/15 (15fps)</code></div><div>3</div><div>AI, Pathfinding</div><div />
          <div><code>1/10 (10fps)</code></div><div>5</div><div>Visibility Culling</div><div />
          <div><code>1/5 (5fps)</code></div><div>9</div><div>Cleanup, LOD</div><div />
        </div>

        <h2>API</h2>
        <ul>
          <li><code>register(system)</code> — 시스템 등록 (init 자동 호출)</li>
          <li><code>unregister(name)</code> — 시스템 제거 (cleanup 호출)</li>
          <li><code>get(name)</code> — 등록된 시스템 조회</li>
          <li><code>update(dt)</code> — 매 프레임 호출 (WorldLoop에서 자동 실행)</li>
        </ul>

        <CodeBlock code={example} lang="tsx" />
        <CodeBlock code={buckets} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>System Manager</h1>
      <p>Manages registration, scheduling, and execution of game systems. Implements <strong>Time-Sliced Update Buckets</strong> for configurable update intervals per system.</p>

      <h2>GameSystem Interface</h2>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        <div><code>name</code></div><div><code>string</code></div><div>—</div><div>System identifier</div>
        <div><code>priority</code></div><div><code>number</code></div><div><code>5</code></div><div>Execution order (lower first)</div>
        <div><code>updateInterval</code></div><div><code>number</code></div><div><code>0</code></div><div>Update interval in seconds. 0 = every frame</div>
      </div>

      <h2>Update Buckets</h2>
      <p>Not all systems need to run at 60fps. Setting different intervals per system can reduce CPU usage by 30-50%.</p>
      <div className="props-grid">
        <div className="props-header">Interval</div>
        <div className="props-header">Priority</div>
        <div className="props-header">Example</div>
        <div className="props-header" />
        <div><code>0 (every frame)</code></div><div>1</div><div>Physics, Camera</div><div />
        <div><code>1/30 (30fps)</code></div><div>2</div><div>Animation, Input</div><div />
        <div><code>1/15 (15fps)</code></div><div>3</div><div>AI, Pathfinding</div><div />
        <div><code>1/10 (10fps)</code></div><div>5</div><div>Visibility Culling</div><div />
        <div><code>1/5 (5fps)</code></div><div>9</div><div>Cleanup, LOD</div><div />
      </div>

      <h2>API</h2>
      <ul>
        <li><code>register(system)</code> — Register system (calls init)</li>
        <li><code>unregister(name)</code> — Remove system (calls cleanup)</li>
        <li><code>get(name)</code> — Get registered system</li>
        <li><code>update(dt)</code> — Called every frame (auto by WorldLoop)</li>
      </ul>

      <CodeBlock code={example} lang="tsx" />
      <CodeBlock code={buckets} lang="tsx" />
    </div>
  )
}

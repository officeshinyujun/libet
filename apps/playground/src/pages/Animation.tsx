import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function AnimationPage() {
  const { locale } = useLocale()

  const example = `import { AnimationSystem, AnimationComponent } from "@web-game/libet"

// Create animation component
const anim = new AnimationComponent(model)
anim.addState({
  name: "idle",
  clip: idleClip,
  loop: true,
})
anim.addState({
  name: "run",
  clip: runClip,
  loop: true,
  speed: 1.5,
})

// Transition between states
anim.play("run", 0.2)  // 0.2s blend

// Register with system
const animSystem = new AnimationSystem()
animSystem.register(anim)`

  const addStateSig = "addState({ name, clip, loop, speed, blendTime })"

  if (locale === "ko") {
    return (
      <div>
        <h1>Animation System</h1>
        <p>상태 머신(State Machine) 기반 애니메이션 시스템입니다. GLTF 애니메이션 클립을 블렌딩하여 전환할 수 있습니다.</p>

        <h2>AnimationComponent</h2>
        <ul>
          <li><code>{addStateSig}</code> — 애니메이션 상태 등록</li>
          <li><code>play(name, blendTime)</code> — 상태 전환 (블렌딩)</li>
          <li><code>update(dt)</code> — 매 프레임 호출 (mixer 업데이트)</li>
        </ul>

        <h2>AnimationSystem</h2>
        <ul>
          <li>Priority 2, 60fps 업데이트</li>
          <li><code>register(component)</code> / <code>unregister(component)</code></li>
        </ul>

        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Animation System</h1>
      <p>A state machine-based animation system. Transitions between GLTF animation clips with blending.</p>

      <h2>AnimationComponent</h2>
      <ul>
        <li><code>{addStateSig}</code> — Register state</li>
        <li><code>play(name, blendTime)</code> — Transition with blend</li>
        <li><code>update(dt)</code> — Update mixer every frame</li>
      </ul>

      <h2>AnimationSystem</h2>
      <ul>
        <li>Priority 2, updates at 60fps</li>
        <li><code>register(component)</code> / <code>unregister(component)</code></li>
      </ul>

      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

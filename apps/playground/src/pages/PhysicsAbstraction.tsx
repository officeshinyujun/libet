import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function PhysicsAbstractionPage() {
  const { locale } = useLocale()

  const example = `import { RapierBackend, type IPhysicsSystem } from "@web-game/libet"

const physics: IPhysicsSystem = new RapierBackend()
physics.init({ gravity: [0, -9.81, 0] })

// Create a body
const ball = physics.createBody({
  type: "dynamic",
  shape: "sphere",
  position: [0, 5, 0],
  mass: 1,
})

// Apply force
physics.applyImpulse(ball, [0, 10, 0])

// Raycast
const hit = physics.raycast([0, 0, 0], [0, -1, 0], 100)
if (hit) console.log("Hit at:", hit.point)

// Collision events
physics.onCollision(ball, "enter", (event) => {
  console.log("Collision:", event.selfEntity, event.otherEntity)
})`

  const custom = `// Implement custom physics engine
class MyCustomPhysics implements IPhysicsSystem {
  init(config: { gravity: [number, number, number] }): void { }
  step(dt: number): void { }
  createBody(config: BodyConfig): BodyHandle { return { id: "custom" } }
  // ... implement all interface methods
}`

  if (locale === "ko") {
    return (
      <div>
        <h1>Physics Abstraction</h1>
        <p>물리 엔진을 추상화하는 인터페이스 레이어입니다. 기본으로 RapierBackend가 제공되며, 인터페이스만 구현하면 물리 엔진을 교체할 수 있습니다.</p>

        <h2>IPhysicsSystem 인터페이스</h2>
        <ul>
          <li><code>init({'{\u00A0gravity\u00A0}'})</code> — 물리 월드 초기화</li>
          <li><code>step(dt)</code> — 물리 시뮬레이션 한 스텝</li>
          <li><code>createBody(config)</code> — 물리 바디 생성 (BodyHandle 반환)</li>
          <li><code>removeBody(handle)</code> — 바디 제거</li>
          <li><code>setPosition / getPosition / setRotation / getRotation</code> — Transform</li>
          <li><code>setLinearVelocity / setAngularVelocity / applyForce / applyImpulse</code> — 힘/속도</li>
          <li><code>raycast(origin, direction, maxDist)</code> — 레이캐스트</li>
          <li><code>onCollision / offCollision</code> — 충돌 이벤트</li>
        </ul>

        <h2>RapierBackend</h2>
        <p>@dimforge/rapier3d-compat 기반 구현체입니다. collider-to-body 매핑을 통해 충돌 이벤트를 body ID로 전달합니다.</p>

        <CodeBlock code={example} lang="tsx" />

        <h2>커스텀 백엔드</h2>
        <p>IPhysicsSystem 인터페이스만 구현하면 PhysX, Jolt, 또는 자체 WASM 물리 엔진으로 교체할 수 있습니다.</p>
        <CodeBlock code={custom} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Physics Abstraction</h1>
      <p>An abstraction layer over the physics engine. Comes with RapierBackend by default. Swap to any physics engine by implementing the interface.</p>

      <h2>IPhysicsSystem Interface</h2>
      <ul>
        <li><code>init({'{\u00A0gravity\u00A0}'})</code> — Initialize physics world</li>
        <li><code>step(dt)</code> — Step simulation</li>
        <li><code>createBody(config)</code> — Create physics body (returns BodyHandle)</li>
        <li><code>removeBody(handle)</code> — Remove body</li>
        <li><code>setPosition / getPosition / setRotation / getRotation</code> — Transform</li>
        <li><code>setLinearVelocity / setAngularVelocity / applyForce / applyImpulse</code> — Forces</li>
        <li><code>raycast(origin, direction, maxDist)</code> — Raycasting</li>
        <li><code>onCollision / offCollision</code> — Collision events</li>
      </ul>

      <h2>RapierBackend</h2>
      <p>Built on @dimforge/rapier3d-compat. Uses collider-to-body mapping to deliver collision events by body ID.</p>

      <CodeBlock code={example} lang="tsx" />

      <h2>Custom Backend</h2>
      <p>Implement IPhysicsSystem to swap in PhysX, Jolt, or your own WASM physics engine.</p>
      <CodeBlock code={custom} lang="tsx" />
    </div>
  )
}

import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function ECSPage() {
  const { locale } = useLocale()

  const entityApi = `import { Entity, BaseComponent } from "@web-game/libet"

// 1. Create entity
const player = new Entity("player")

// 2. Define a component
class HealthComponent extends BaseComponent {
  readonly type = "health"
  current = 100
  max = 100

  takeDamage(amount: number) {
    this.current = Math.max(0, this.current - amount)
  }
}

// 3. Attach component
player.addComponent(new HealthComponent())

// 4. Query
const health = player.getComponent("health")
health?.takeDamage(10)`

  const entityManager = `import { EntityManager } from "@web-game/libet"

const entities = new EntityManager()

// Create with components
const player = entities.create("player", [
  new HealthComponent(),
  new TransformComponent(),
])

// Find by component type
const allWithHealth = entities.findByComponent("health")

// Cleanup
entities.destroy("player")`

  const dirtyFlags = `import { DirtyFlags } from "@web-game/libet"

// Bitmask flags for efficient change propagation
entity.markDirty(DirtyFlags.TRANSFORM)

// System checks flags before processing
if (entity.dirtyFlags & DirtyFlags.TRANSFORM) {
  updateTransform(entity)
  entity.clearDirty(DirtyFlags.TRANSFORM)
}`

  if (locale === "ko") {
    return (
      <div>
        <h1>Entity & Component</h1>
        <p>경량 ECS-like 아키텍처. Entity는 Component의 컨테이너이며, System이 Component를 가진 Entity를 iterate합니다.</p>

        <h2>Entity</h2>
        <p>Entity는 고유한 ID를 가지며, Component를 추가/제거/조회할 수 있습니다. 내부적으로 Dirty Flag bitmask로 변경을 추적합니다.</p>
        <ul>
          <li><code>addComponent(component)</code> — Component 추가 (onAttach 호출)</li>
          <li><code>removeComponent(type)</code> — Component 제거 (onDetach 호출)</li>
          <li><code>getComponent(type)</code> — Component 조회</li>
          <li><code>markDirty(flags)</code> / <code>clearDirty()</code> — Dirty flag 설정</li>
          <li><code>destroy()</code> — 모든 Component 정리 후 제거</li>
        </ul>
        <CodeBlock code={entityApi} lang="tsx" />

        <h2>EntityManager</h2>
        <p>Entity의 생성/소멸/조회를 관리합니다. findByComponent로 특정 Component를 가진 모든 Entity를 찾을 수 있습니다.</p>
        <CodeBlock code={entityManager} lang="tsx" />

        <h2>DirtyFlag Bitmask</h2>
        <p>각 Entity는 bitmask 기반의 dirty flag를 가집니다. System은 매 프레임 모든 Entity를 검사하는 대신, dirty flag가 설정된 Entity만 처리합니다.</p>
        <CodeBlock code={dirtyFlags} lang="tsx" />

        <h2>Component 인터페이스</h2>
        <ul>
          <li><code>type: string</code> — 고유 식별자</li>
          <li><code>entity: Entity</code> — 소속 Entity (addComponent 시 자동 설정)</li>
          <li><code>onAttach?(): void</code> — Component가 Entity에 추가될 때</li>
          <li><code>onDetach?(): void</code> — Component가 제거될 때</li>
          <li><code>update?(dt: number): void</code> — 매 프레임 (Entity가 active일 때만)</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h1>Entity & Component</h1>
      <p>A lightweight ECS-like architecture. Entities are containers for Components. Systems iterate over entities with matching components.</p>

      <h2>Entity</h2>
      <p>Each Entity has a unique ID and can add/remove/query Components. Uses a dirty flag bitmask for efficient change tracking.</p>
      <ul>
        <li><code>addComponent(component)</code> — Add component (calls onAttach)</li>
        <li><code>removeComponent(type)</code> — Remove component (calls onDetach)</li>
        <li><code>getComponent(type)</code> — Query component</li>
        <li><code>markDirty(flags)</code> / <code>clearDirty()</code> — Control dirty flags</li>
        <li><code>destroy()</code> — Cleanup all components</li>
      </ul>
      <CodeBlock code={entityApi} lang="tsx" />

      <h2>EntityManager</h2>
      <p>Manages entity lifecycle. Query entities by component type with <code>findByComponent</code>.</p>
      <CodeBlock code={entityManager} lang="tsx" />

      <h2>DirtyFlag Bitmask</h2>
      <p>Each entity carries a bitmask-based dirty flag. Systems skip clean entities instead of checking every entity every frame.</p>
      <CodeBlock code={dirtyFlags} lang="tsx" />

      <h2>Component Interface</h2>
      <ul>
        <li><code>type: string</code> — Unique identifier</li>
        <li><code>entity: Entity</code> — Owning entity (set automatically)</li>
        <li><code>onAttach?(): void</code> — When attached to an entity</li>
        <li><code>onDetach?(): void</code> — When detached from an entity</li>
        <li><code>update?(dt: number): void</code> — Called every frame</li>
      </ul>
    </div>
  )
}

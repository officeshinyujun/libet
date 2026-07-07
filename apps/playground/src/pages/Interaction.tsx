import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function InteractionPage() {
  const { locale } = useLocale()

  const example = `// InteractionManager is auto-included by <World>
// Use the context to detect what the player is looking at:

import { useInteractionContext } from "@web-game/libet"

function MyComponent() {
  const { focusedMeshUuid } = useInteractionContext()
  // focusedMeshUuid is the UUID of the mesh at screen center
}`

  if (locale === "ko") {
    return (
      <div>
        <h1>Interaction</h1>
        <p>Raycaster 기반 포커스 감지 시스템입니다. <code>InteractionProvider</code>와 <code>InteractionManager</code>로 구성되며, <code>World</code>에 자동 포함됩니다.</p>

        <h2>동작 방식</h2>
        <ol>
          <li>매 프레임 카메라 중심에서 Ray 발사</li>
          <li>scene의 모든 Mesh와 교차 검사</li>
          <li>가장 가까운 보이는 Mesh의 UUID를 context에 저장</li>
        </ol>
        <p><code>InteractionProvider</code>가 없으면 <code>hover</code>와 <code>click</code> 트리거가 동작하지 않습니다.</p>

        <h2>사용 예제</h2>
        <CodeBlock code={example} lang="tsx" />
        <p>OutlineComponent의 <code>trigger="hover"</code> 모드가 이 시스템을 사용합니다.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Interaction</h1>
      <p>A raycaster-based focus detection system. Consists of <code>InteractionProvider</code> and <code>InteractionManager</code>, auto-included by <code>World</code>.</p>

      <h2>How it works</h2>
      <ol>
        <li>Ray is cast from camera center every frame</li>
        <li>Intersects against all Meshes in the scene</li>
        <li>The nearest visible Mesh UUID is stored in context</li>
      </ol>
      <p>Without <code>InteractionProvider</code>, <code>hover</code> and <code>click</code> triggers won't work.</p>

      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />
      <p>The OutlineComponent's <code>trigger="hover"</code> mode uses this system.</p>
    </div>
  )
}

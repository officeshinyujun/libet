import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function CameraSystemPage() {
  const { locale } = useLocale()

  const example = `import { CameraSystem } from "@web-game/libet"

const camera = new CameraSystem()
camera.setCamera(cameraRef)
camera.configure({ mode: "orbital", distance: 10 })
camera.follow(playerEntity)
camera.shake(0.5, 2)  // intensity, decay`

  const configureSig = "configure({ mode, distance, height, smoothSpeed })"

  if (locale === "ko") {
    return (
      <div>
        <h1>Camera System</h1>
        <p>PlayerController에서 분리된 독립형 카메라 시스템입니다. 5가지 모드와 Shake, Follow 기능을 제공합니다.</p>

        <h2>모드</h2>
        <div className="props-grid">
          <div className="props-header">Mode</div>
          <div className="props-header">Description</div>
          <div className="props-header" />
          <div className="props-header" />
          <div><code>firstPerson</code></div><div>1인칭, 엔티티 Eye Height에 카메라 고정</div><div /><div />
          <div><code>thirdPerson</code></div><div>3인칭, 엔티티 뒤에서 따라감</div><div /><div />
          <div><code>topDown</code></div><div>탑뷰, 위에서 내려다봄</div><div /><div />
          <div><code>orbital</code></div><div>궤도, 엔티티 주위를 회전</div><div /><div />
          <div><code>fixed</code></div><div>고정 카메라</div><div /><div />
        </div>

        <h2>API</h2>
        <ul>
          <li><code>setCamera(camera)</code> — 대상 카메라 설정</li>
          <li><code>{configureSig}</code> — 모드 설정</li>
          <li><code>follow(entity)</code> — 엔티티 추적</li>
          <li><code>shake(intensity, decay)</code> — 화면 흔들림</li>
          <li><code>update(dt)</code> — 매 프레임 호출</li>
        </ul>

        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Camera System</h1>
      <p>A standalone camera system extracted from PlayerController. Provides 5 modes with shake and follow support.</p>

      <h2>Modes</h2>
      <div className="props-grid">
        <div className="props-header">Mode</div>
        <div className="props-header">Description</div>
        <div className="props-header" />
        <div className="props-header" />
        <div><code>firstPerson</code></div><div>Locked to entity eye height</div><div /><div />
        <div><code>thirdPerson</code></div><div>Follows behind entity</div><div /><div />
        <div><code>topDown</code></div><div>Bird's eye view</div><div /><div />
        <div><code>orbital</code></div><div>Orbits around entity</div><div /><div />
        <div><code>fixed</code></div><div>Static camera</div><div /><div />
      </div>

      <h2>API</h2>
      <ul>
        <li><code>setCamera(camera)</code> — Assign target camera</li>
        <li><code>{configureSig}</code> — Set mode</li>
        <li><code>follow(entity)</code> — Track an entity</li>
        <li><code>shake(intensity, decay)</code> — Screen shake</li>
        <li><code>update(dt)</code> — Call every frame</li>
      </ul>

      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

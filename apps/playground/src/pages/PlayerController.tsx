import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

const controlsData = [
  ["Move", "W / ArrowUp"],
  ["Move Backward", "S / ArrowDown"],
  ["Strafe Left", "A / ArrowLeft"],
  ["Strafe Right", "D / ArrowRight"],
  ["Jump", "Space"],
  ["Crouch", "CtrlLeft"],
]

export function PlayerControllerPage() {
  const { locale } = useLocale()

  const example = `<PlayerController
  controllerID="player"
  view="firstPerson"
  inertia={true}
  crouch={true}
  crouchDepth={0.5}
/>`

  if (locale === "ko") {
    return (
      <div>
        <h1>PlayerController</h1>
        <p>키보드 입력과 카메라를 제어합니다. <code>controllerID</code>로 Character를 찾아 이동/점프/웅크리기 로직을 실행합니다.</p>

        <h2>Props</h2>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          <div><code>controllerID</code></div><div><code>string</code></div><div>—</div><div>Character name과 일치</div>
          <div><code>view</code></div><div><code>firstPerson/thirdPerson</code></div><div>—</div><div>카메라 시점</div>
          <div><code>inertia</code></div><div><code>boolean</code></div><div><code>false</code></div><div>관성 이동 (가속/감속)</div>
          <div><code>crouch</code></div><div><code>boolean</code></div><div><code>false</code></div><div>웅크리기 활성화</div>
          <div><code>crouchDepth</code></div><div><code>number</code></div><div><code>0.5</code></div><div>웅크리기 시 Eye Height 비율</div>
        </div>

        <h2>기본 조작</h2>
        <div className="props-grid">
          <div className="props-header">Action</div>
          <div className="props-header">Key</div>
          <div className="props-header" />
          <div className="props-header" />
          {controlsData.map(([action, key]) => (
            <div key={action}><div>{action}</div><div><code>{key}</code></div><div /><div /></div>
          ))}
        </div>

        <h2>예제</h2>
        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>PlayerController</h1>
      <p>Handles keyboard input and camera control. Finds a Character by <code>controllerID</code> and runs movement/jump/crouch logic.</p>

      <h2>Props</h2>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        <div><code>controllerID</code></div><div><code>string</code></div><div>—</div><div>Must match Character name</div>
        <div><code>view</code></div><div><code>firstPerson/thirdPerson</code></div><div>—</div><div>Camera perspective</div>
        <div><code>inertia</code></div><div><code>boolean</code></div><div><code>false</code></div><div>Inertial movement</div>
        <div><code>crouch</code></div><div><code>boolean</code></div><div><code>false</code></div><div>Enable crouch</div>
        <div><code>crouchDepth</code></div><div><code>number</code></div><div><code>0.5</code></div><div>Eye height ratio when crouching</div>
      </div>

      <h2>Controls</h2>
      <div className="props-grid">
        <div className="props-header">Action</div>
        <div className="props-header">Key</div>
        <div className="props-header" />
        <div className="props-header" />
        {controlsData.map(([action, key]) => (
          <div key={action}><div>{action}</div><div><code>{key}</code></div><div /><div /></div>
        ))}
      </div>

      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

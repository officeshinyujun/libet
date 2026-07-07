import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function QuickStart() {
  const { locale } = useLocale()

  const install = "npm install @web-game/libet"
  const peerDeps = `# Peer dependencies (install these too):
npm install react react-dom three @react-three/fiber @react-three/drei @react-three/rapier`

  const example = `import { World, Character, PlayerController, StaticMesh, Pointer } from "@web-game/libet"

function Game() {
  return (
    <World
      width="100vw"
      height="100vh"
      camera={{ fov: 75, position: [0, 5, 10] }}
      physics={{ gravity: [0, -9.81, 0] }}
    >
      <StaticMesh name="ground" position={[0, -0.5, 0]} scale={[10, 1, 10]} color="#4a5568" physics="fixed" />
      <Character name="player" position={[0, 2, 0]} speed={8} jumpHeight={2} />
      <PlayerController controllerID="player" view="thirdPerson" inertia />
      <Pointer size={[20, 20]} />
    </World>
  )
}`

  if (locale === "ko") {
    return (
      <div>
        <h1>Quick Start</h1>
        <p>libet을 시작하는 가장 빠른 방법입니다.</p>
        <h2>설치</h2>
        <CodeBlock code={install} lang="bash" />
        <CodeBlock code={peerDeps} lang="bash" />
        <h2>Hello World</h2>
        <p>아래 코드를 복사하여 React 프로젝트에 붙여넣으면 즉시 3D 씬이 렌더링됩니다.</p>
        <CodeBlock code={example} lang="tsx" />
        <h2>동작</h2>
        <ul>
          <li><strong>WASD</strong> 또는 방향키로 이동</li>
          <li><strong>Space</strong> 점프</li>
          <li><strong>Ctrl</strong> 웅크리기 (crouch 활성화 시)</li>
          <li>마우스 클릭으로 포인터 잠금 (1인칭 모드)</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <h1>Quick Start</h1>
      <p>The fastest way to get started with libet.</p>
      <h2>Installation</h2>
      <CodeBlock code={install} lang="bash" />
      <CodeBlock code={peerDeps} lang="bash" />
      <h2>Hello World</h2>
      <p>Copy the code below into your React project for an instant 3D scene.</p>
      <CodeBlock code={example} lang="tsx" />
      <h2>Controls</h2>
      <ul>
        <li><strong>WASD</strong> or Arrow keys to move</li>
        <li><strong>Space</strong> to jump</li>
        <li><strong>Ctrl</strong> to crouch (when crouch enabled)</li>
        <li>Click to lock pointer (first-person mode)</li>
      </ul>
    </div>
  )
}

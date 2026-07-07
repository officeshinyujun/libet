import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

const code = `import { World, Character, PlayerController, Pawn,
  StaticMesh, Pointer, OutlineComponent } from "@web-game/libet"

function Game() {
  return (
    <World physics={{ gravity: [0, -9.81, 0] }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} />

      <StaticMesh name="ground" position={[0, -0.5, 0]}
        scale={[14, 1, 14]} physics="fixed" />

      <Character name="player" position={[0, 1, 0]}
        speed={7} jumpHeight={2.5} />

      <PlayerController controllerID="player"
        view="thirdPerson" inertia />

      <Pawn name="crate" position={[2, 3, 0]}
        physics="dynamic" mass={1}>
        <mesh onClick={() => alert("hit!")}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
          <OutlineComponent trigger="hover" />
        </mesh>
      </Pawn>

      <Pointer size={[16, 16]} />
    </World>
  )
}`

export function GameDemoPage() {
  const { locale } = useLocale()

  if (locale === "ko") {
    return (
      <div>
        <h1>Game Demo</h1>
        <p>libet의 주요 기능을 모두 활용한 간단한 3D 게임 데모입니다.</p>

        <h2>사용된 기능</h2>
        <ul>
          <li><strong>World</strong> — Canvas + Physics + Providers</li>
          <li><strong>Character</strong> — WASD 이동, 점프 (Space)</li>
          <li><strong>PlayerController</strong> — 1인칭/3인칭 전환 (버튼 클릭)</li>
          <li><strong>Pawn</strong> — 물리 큐브 (2초마다 자동 생성, 낙하)</li>
          <li><strong>StaticMesh</strong> — 벽/바닥/기둥</li>
          <li><strong>OutlineComponent</strong> — 마우스 호버 시 강조</li>
          <li><strong>Pointer</strong> — 크로스헤어</li>
          <li><strong>Pawn + usePawn</strong> — 물리 impulse로 무작위 낙하</li>
        </ul>

        <h2>조작법</h2>
        <ul>
          <li><strong>WASD</strong> 이동</li>
          <li><strong>Space</strong> 점프</li>
          <li><strong>캐릭터 위 버튼</strong> 1인칭/3인칭 전환</li>
          <li><strong>기둥에 마우스</strong> 호버 아웃라인</li>
        </ul>

        <h2>핵심 코드</h2>
        <CodeBlock code={code} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Game Demo</h1>
      <p>A complete 3D game demo showcasing libet's core features.</p>

      <h2>Features Used</h2>
      <ul>
        <li><strong>World</strong> — Canvas + Physics + Providers</li>
        <li><strong>Character</strong> — WASD movement, Space to jump</li>
        <li><strong>PlayerController</strong> — 1st/3rd person toggle</li>
        <li><strong>Pawn</strong> — Physics crates (auto-spawn every 2s)</li>
        <li><strong>StaticMesh</strong> — Walls, floor, pillars</li>
        <li><strong>OutlineComponent</strong> — Hover highlight on pillars</li>
        <li><strong>Pointer</strong> — Crosshair overlay</li>
        <li><strong>usePawn</strong> — Random impulse on spawn</li>
      </ul>

      <h2>Controls</h2>
      <ul>
        <li><strong>WASD</strong> Move</li>
        <li><strong>Space</strong> Jump</li>
        <li><strong>Button above character</strong> Toggle 1st/3rd person</li>
        <li><strong>Hover pillars</strong> See outline effect</li>
      </ul>

      <h2>Key Code</h2>
      <CodeBlock code={code} lang="tsx" />
    </div>
  )
}

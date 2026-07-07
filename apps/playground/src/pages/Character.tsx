import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

const propsData = [
  ["name", "string", "—", "Unique identifier (used by controllers)"],
  ["position", "[x, y, z]", "—", "Initial world position"],
  ["speed", "number", "—", "Movement speed (units/sec)"],
  ["jumpHeight", "number", "—", "Jump height (units)"],
  ["modelpath", "THREE.Group", "—", "3D model (GLTF scene)"],
  ["scale", "[x, y, z]", "—", "Scale"],
  ["tags", "string[]", "—", "Filtering tags"],
]

export function CharacterPage() {
  const { locale } = useLocale()

  const example = `<Character
  name="player"
  position={[0, 2, 0]}
  speed={8}
  jumpHeight={2}
>
  <Action inputKey="KeyE" action={(char) => console.log("interact!")} />
</Character>`

  if (locale === "ko") {
    return (
      <div>
        <h1>Character</h1>
        <p>플레이어 또는 NPC를 나타냅니다. Rapier RigidBody와 lockRotations, CCD가 적용된 물리 바디를 가집니다.</p>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          {propsData.map(([n, t, d, desc]) => (
            <div key={n}><div><code>{n}</code></div><div><code>{t}</code></div><div>{d}</div><div>{desc}</div></div>
          ))}
        </div>
        <h2>예제</h2>
        <CodeBlock code={example} lang="tsx" />
        <h2>Context: useCharacter()</h2>
        <p>Character의 자식 컴포넌트는 <code>useCharacter()</code> 훅으로 name, rigidBody ref, props에 접근할 수 있습니다.</p>
        <h2>컨트롤러 연동</h2>
        <p>Character는 PlayerController가 <code>controllerID</code>로 참조해야 움직입니다.</p>
        <CodeBlock code={`<Character name="player" speed={8} jumpHeight={2} />
<PlayerController controllerID="player" view="firstPerson" />`} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Character</h1>
      <p>Represents a player or NPC with a physics body. Uses Rapier RigidBody with lockRotations and CCD.</p>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        {propsData.map(([n, t, d, desc]) => (
          <div key={n}><div><code>{n}</code></div><div><code>{t}</code></div><div>{d}</div><div>{desc}</div></div>
        ))}
      </div>
      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />
      <h2>Context: useCharacter()</h2>
      <p>Child components can access name, rigidBody ref, and props via <code>useCharacter()</code>.</p>
      <h2>Controller Integration</h2>
      <p>A Character moves when a PlayerController references it via <code>controllerID</code>.</p>
      <CodeBlock code={`<Character name="player" speed={8} jumpHeight={2} />
<PlayerController controllerID="player" view="firstPerson" />`} lang="tsx" />
    </div>
  )
}

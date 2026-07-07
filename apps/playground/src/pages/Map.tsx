import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function MapPage() {
  const { locale } = useLocale()

  const example = `<Map
  name="arena"
  modelpath={gltfScene}
  position={[0, -0.5, 0]}
  physics="fixed"
  isChunked
  chuckSize={32}
/>`

  if (locale === "ko") {
    return (
      <div>
        <h1>Map</h1>
        <p>지형 또는 레벨 지오메트리를 나타냅니다. 3D 모델(GLTF)을 기반으로 하며, 대형 월드를 위한 청크 분할을 지원합니다.</p>

        <h2>Props</h2>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          <div><code>modelpath</code></div><div><code>THREE.Group</code></div><div>—</div><div>3D model (cloned for chunking)</div>
          <div><code>physics</code></div><div><code>fixed | none</code></div><div><code>none</code></div><div>Physics mode</div>
          <div><code>isChunked</code></div><div><code>boolean</code></div><div><code>false</code></div><div>Split into tiles for performance</div>
          <div><code>chuckSize</code></div><div><code>number</code></div><div>—</div><div>Chunk edge length (world units)</div>
        </div>

        <h2>청크 모드</h2>
        <p>큰 맵을 <code>chuckSize</code> 크기의 타일로 분할합니다. 각 타일은 개별 RigidBody로 생성되어 물리 성능이 향상됩니다.</p>

        <h2>예제</h2>
        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Map</h1>
      <p>Represents terrain or level geometry. Uses a 3D model (GLTF) and supports chunk division for large worlds.</p>

      <h2>Props</h2>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        <div><code>modelpath</code></div><div><code>THREE.Group</code></div><div>—</div><div>3D model (cloned for chunking)</div>
        <div><code>physics</code></div><div><code>fixed | none</code></div><div><code>none</code></div><div>Physics mode</div>
        <div><code>isChunked</code></div><div><code>boolean</code></div><div><code>false</code></div><div>Split into tiles</div>
        <div><code>chuckSize</code></div><div><code>number</code></div><div>—</div><div>Chunk edge length</div>
      </div>

      <h2>Chunked Mode</h2>
      <p>Large maps are divided into tiles of <code>chuckSize</code>. Each tile becomes a separate RigidBody for better physics performance.</p>

      <h2>Example</h2>
      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

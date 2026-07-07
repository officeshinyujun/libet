import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function AssetManagerPage() {
  const { locale } = useLocale()

  const example = `import { AssetManager } from "@web-game/libet"

const assets = new AssetManager()

async function loadLevel() {
  const [map, texture] = await assets.loadMultiple([
    { url: "/levels/forest.glb", type: "gltf" },
    { url: "/textures/ground.jpg", type: "texture" },
  ])
  scene.add(map.data.scene)
}

// React hook
const { data, progress } = useAsset("/model.glb", "gltf")`

  if (locale === "ko") {
    return (
      <div>
        <h1>Asset Manager</h1>
        <p>게임 에셋 로딩, 캐싱, 메모리 관리를 담당합니다. GLTF, Texture, Audio, HDR, JSON, Binary를 지원합니다.</p>

        <h2>기능</h2>
        <ul>
          <li>LRU 캐시 + Reference Counting</li>
          <li>Progress 콜백 (로딩바)</li>
          <li><code>loadMultiple</code> 병렬 로딩</li>
          <li><code>preload</code> 프리로딩</li>
          <li>React Hook: <code>useAsset(url, type)</code></li>
        </ul>

        <h2>지원 타입</h2>
        <p><code>gltf | texture | audio | hdr | json | binary</code></p>

        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Asset Manager</h1>
      <p>Manages loading, caching, and memory for game assets. Supports GLTF, Texture, Audio, HDR, JSON, and Binary formats.</p>

      <h2>Features</h2>
      <ul>
        <li>LRU Cache + Reference Counting</li>
        <li>Progress callbacks</li>
        <li>Parallel loading via <code>loadMultiple</code></li>
        <li>Preloading via <code>preload</code></li>
        <li>React Hook: <code>useAsset(url, type)</code></li>
      </ul>

      <h2>Supported Types</h2>
      <p><code>gltf | texture | audio | hdr | json | binary</code></p>

      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

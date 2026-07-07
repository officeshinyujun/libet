import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function AudioManagerPage() {
  const { locale } = useLocale()

  const example = `import { AudioManager } from "@web-game/libet"

const audio = new AudioManager({ masterVolume: 0.8, spatial: true })

// Simple SFX
audio.play(clip, { volume: 0.5, group: "sfx" })

// Spatial audio (3D position)
audio.playSpatial(footstepBuffer, {
  position: [5, 0, 3],
  refDistance: 2,
  maxDistance: 20,
  loop: true,
  group: "ambient",
})

// Volume control
audio.setMasterVolume(0.5)
audio.setGroupVolume("music", 0.3)
audio.setListenerPosition(camera.position)

// React hook
const { play } = useAudio("/sfx/click.mp3")`

  if (locale === "ko") {
    return (
      <div>
        <h1>Audio Manager</h1>
        <p>Web Audio API 기반 오디오 시스템입니다. 공간 음향과 볼륨 그룹을 지원합니다.</p>

        <h2>볼륨 그룹</h2>
        <div className="props-grid">
          <div className="props-header">Group</div>
          <div className="props-header">Usage</div>
          <div className="props-header" />
          <div className="props-header" />
          <div><code>sfx</code></div><div>효과음 (총알, 발소리)</div><div /><div />
          <div><code>music</code></div><div>배경 음악</div><div /><div />
          <div><code>ambient</code></div><div>환경음 (바람, 물)</div><div /><div />
          <div><code>voice</code></div><div>대화, 내레이션</div><div /><div />
        </div>

        <h2>API</h2>
        <ul>
          <li><code>play(clip, options)</code> — 2D 재생</li>
          <li><code>playSpatial(clip, options)</code> — 3D 공간 음향</li>
          <li><code>setGroupVolume(group, vol)</code> — 그룹 볼륨</li>
          <li><code>setListenerPosition(pos)</code> — 청취자 위치 (카메라)</li>
          <li><code>useAudio(url)</code> — React Hook</li>
        </ul>

        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Audio Manager</h1>
      <p>A Web Audio API wrapper with spatial audio and volume group support.</p>

      <h2>Volume Groups</h2>
      <div className="props-grid">
        <div className="props-header">Group</div>
        <div className="props-header">Usage</div>
        <div className="props-header" />
        <div className="props-header" />
        <div><code>sfx</code></div><div>One-shot effects</div><div /><div />
        <div><code>music</code></div><div>Background music</div><div /><div />
        <div><code>ambient</code></div><div>Environmental loops</div><div /><div />
        <div><code>voice</code></div><div>Dialog, narration</div><div /><div />
      </div>

      <h2>API</h2>
      <ul>
        <li><code>play(clip, options)</code> — 2D playback</li>
        <li><code>playSpatial(clip, options)</code> — 3D spatial audio</li>
        <li><code>setGroupVolume(group, vol)</code> — Group volume</li>
        <li><code>setListenerPosition(pos)</code> — Listener position</li>
        <li><code>useAudio(url)</code> — React Hook</li>
      </ul>

      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

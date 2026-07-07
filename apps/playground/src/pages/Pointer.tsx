import { useLocale } from "../i18n/context"
import { CodeBlock } from "../components/CodeBlock"

export function PointerPage() {
  const { locale } = useLocale()
  const example = `<Pointer size={[24, 24]} />

{/* Custom image */}
<Pointer image="/crosshair.png" size={[48, 48]} />`

  if (locale === "ko") {
    return (
      <div>
        <h1>Pointer</h1>
        <p>Canvas 위에 절대 위치로 렌더링되는 크로스헤어 오버레이입니다. FPS 게임에 유용합니다.</p>
        <div className="props-grid">
          <div className="props-header">Name</div>
          <div className="props-header">Type</div>
          <div className="props-header">Default</div>
          <div className="props-header">Description</div>
          <div><code>image</code></div><div><code>string</code></div><div>—</div><div>Custom crosshair image URL</div>
          <div><code>size</code></div><div><code>[number, number]</code></div><div>—</div><div>Width and height in pixels</div>
        </div>
        <p>기본값은 흰색 Plus(+) 아이콘(SVG)입니다. <code>pointer-events: none</code>으로 Canvas와의 상호작용을 방해하지 않습니다.</p>
        <CodeBlock code={example} lang="tsx" />
      </div>
    )
  }

  return (
    <div>
      <h1>Pointer</h1>
      <p>A crosshair overlay rendered as an absolutely-positioned HTML element on top of the Canvas.</p>
      <div className="props-grid">
        <div className="props-header">Name</div>
        <div className="props-header">Type</div>
        <div className="props-header">Default</div>
        <div className="props-header">Description</div>
        <div><code>image</code></div><div><code>string</code></div><div>—</div><div>Custom crosshair image URL</div>
        <div><code>size</code></div><div><code>[number, number]</code></div><div>—</div><div>Pixel dimensions</div>
      </div>
      <p>Default is a white Plus (+) SVG icon. Has <code>pointer-events: none</code> to not block Canvas interaction.</p>
      <CodeBlock code={example} lang="tsx" />
    </div>
  )
}

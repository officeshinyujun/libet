import type { ReactNode } from "react"
import { useLocale } from "../i18n/context"
import { CharacterDemo } from "../demos/CharacterDemo"
import { PawnPhysics } from "../demos/PawnPhysics"
import { CameraModes } from "../demos/CameraModes"
import { InteractionDemo } from "../demos/InteractionDemo"
import { AnimationDemo } from "../demos/AnimationDemo"
import { GameDemo } from "../demos/GameDemo"
import type { PageId } from "../App"

const demos: Record<string, ReactNode> = {
  character: <CharacterDemo />,
  pawn: <PawnPhysics />,
  playercontroller: <CharacterDemo />,
  world: <CharacterDemo />,
  map: <PawnPhysics />,
  interaction: <InteractionDemo />,
  camera: <CameraModes />,
  animation: <AnimationDemo />,
  gamedemo: <GameDemo />,
}

export function DocLayout({ children, demo }: { children: ReactNode; demo?: PageId }) {
  const { t } = useLocale()
  const demoContent = demo ? demos[demo] : null

  if (demoContent) {
    return (
      <div className="doc-with-demo">
        <main className="doc-page">
          {children}
        </main>
        <aside className="demo-panel">
          <div className="demo-header">{t("demo.label")}</div>
          <div className="demo-content">
            {demoContent}
          </div>
        </aside>
      </div>
    )
  }

  return (
    <main className="doc-page doc-page--alone">
      {children}
    </main>
  )
}

import { useState, useMemo } from "react"
import { Header } from "./layouts/Header"
import { Sidebar } from "./layouts/Sidebar"
import { DocLayout } from "./layouts/DocLayout"
import { useLocale } from "./i18n/context"

import { Home } from "./pages/Home"
import { QuickStart } from "./pages/QuickStart"
import { WorldPage } from "./pages/World"
import { ECSPage } from "./pages/ECS"
import { SystemManagerPage } from "./pages/SystemManagerPage"
import { PhysicsAbstractionPage } from "./pages/PhysicsAbstraction"
import { CharacterPage } from "./pages/Character"
import { PawnPage } from "./pages/Pawn"
import { MapPage } from "./pages/Map"
import { StaticMeshPage } from "./pages/StaticMesh"
import { PlayerControllerPage } from "./pages/PlayerController"
import { ActionPage } from "./pages/Action"
import { PointerPage } from "./pages/Pointer"
import { InteractionPage } from "./pages/Interaction"
import { OutlinePage } from "./pages/Outline"
import { CameraSystemPage } from "./pages/CameraSystem"
import { AnimationPage } from "./pages/Animation"
import { AssetManagerPage } from "./pages/AssetManager"
import { InputManagerPage } from "./pages/InputManager"
import { AudioManagerPage } from "./pages/AudioManager"
import { GameDemoPage } from "./pages/GameDemoPage"

export type PageId =
  | "home" | "quickstart"
  | "world" | "ecs" | "system" | "physics"
  | "character" | "pawn" | "map" | "staticmesh"
  | "playercontroller" | "action"
  | "pointer"
  | "interaction" | "outline"
  | "camera" | "animation"
  | "asset" | "input" | "audio"
  | "gamedemo"

interface PageInfo {
  id: PageId
  section: string
  hasDemo: boolean
}

export const pages: PageInfo[] = [
  { id: "home", section: "nav.home", hasDemo: false },
  { id: "quickstart", section: "nav.home", hasDemo: false },
  { id: "world", section: "sidebar.core", hasDemo: true },
  { id: "ecs", section: "sidebar.core", hasDemo: false },
  { id: "system", section: "sidebar.core", hasDemo: false },
  { id: "physics", section: "sidebar.core", hasDemo: false },
  { id: "character", section: "sidebar.actors", hasDemo: true },
  { id: "pawn", section: "sidebar.actors", hasDemo: true },
  { id: "map", section: "sidebar.actors", hasDemo: true },
  { id: "staticmesh", section: "sidebar.actors", hasDemo: false },
  { id: "playercontroller", section: "sidebar.controllers", hasDemo: true },
  { id: "action", section: "sidebar.controllers", hasDemo: false },
  { id: "pointer", section: "sidebar.display", hasDemo: false },
  { id: "interaction", section: "sidebar.effects", hasDemo: true },
  { id: "outline", section: "sidebar.effects", hasDemo: false },
  { id: "camera", section: "sidebar.systems", hasDemo: true },
  { id: "animation", section: "sidebar.systems", hasDemo: true },
  { id: "asset", section: "sidebar.services", hasDemo: false },
  { id: "input", section: "sidebar.services", hasDemo: false },
  { id: "audio", section: "sidebar.services", hasDemo: false },
  { id: "gamedemo", section: "", hasDemo: true },
]

export function App() {
  const [page, setPage] = useState<PageId>("home")
  const { locale } = useLocale()

  const renderPage = useMemo(() => {
    const p = page
    switch (p) {
      case "home": return <Home />
      case "quickstart": return <QuickStart />
      case "world": return <WorldPage />
      case "ecs": return <ECSPage />
      case "system": return <SystemManagerPage />
      case "physics": return <PhysicsAbstractionPage />
      case "character": return <CharacterPage />
      case "pawn": return <PawnPage />
      case "map": return <MapPage />
      case "staticmesh": return <StaticMeshPage />
      case "playercontroller": return <PlayerControllerPage />
      case "action": return <ActionPage />
      case "pointer": return <PointerPage />
      case "interaction": return <InteractionPage />
      case "outline": return <OutlinePage />
      case "camera": return <CameraSystemPage />
      case "animation": return <AnimationPage />
      case "asset": return <AssetManagerPage />
      case "input": return <InputManagerPage />
      case "audio": return <AudioManagerPage />
      case "gamedemo": return <GameDemoPage />
      default: return <Home />
    }
  }, [page])

  const pageInfo = pages.find((p) => p.id === page)

  return (
    <div>
      <Header currentPage={page} />
      <div className="layout">
        <Sidebar current={page} onChange={setPage} />
        <DocLayout demo={pageInfo?.hasDemo ? page : undefined}>
          {renderPage}
        </DocLayout>
      </div>
    </div>
  )
}

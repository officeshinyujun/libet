import { useLocale } from "../i18n/context"
import { VStack } from "../components/VStack"
import { pages, type PageId } from "../App"

const sections = [
  { key: "sidebar.core", ids: ["world", "ecs", "system", "physics"] },
  { key: "sidebar.actors", ids: ["character", "pawn", "map", "staticmesh"] },
  { key: "sidebar.controllers", ids: ["playercontroller", "action"] },
  { key: "sidebar.display", ids: ["pointer"] },
  { key: "sidebar.effects", ids: ["interaction", "outline"] },
  { key: "sidebar.systems", ids: ["camera", "animation"] },
  { key: "sidebar.services", ids: ["asset", "input", "audio"] },
]

export function Sidebar({ current, onChange }: { current: PageId; onChange: (id: PageId) => void }) {
  const { t } = useLocale()

  return (
    <aside className="sidebar">
      <VStack gap={0}>
      <div className="sidebar-section">
        <button className="sidebar-link" onClick={() => onChange("home")}>Home</button>
        <button className="sidebar-link" onClick={() => onChange("quickstart")}>Quick Start</button>
        <button className={`sidebar-link ${current === "gamedemo" ? "active" : ""}`} onClick={() => onChange("gamedemo")}>
          Game Demo
        </button>
      </div>
        {sections.map((section) => (
          <div key={section.key} className="sidebar-section" style={{ width: "100%" }}>
            <div className="sidebar-label">{t(section.key)}</div>
            <VStack gap={0}>
              {section.ids.map((id) => {
                return (
                  <button
                    key={id}
                    className={`sidebar-link ${current === id ? "active" : ""}`}
                    onClick={() => onChange(id as PageId)}
                  >
                    {t(`sidebar.${id}`)}
                  </button>
                )
              })}
            </VStack>
          </div>
        ))}
      </VStack>
    </aside>
  )
}

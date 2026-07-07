import { useState } from "react"
import { World, StaticMesh, OutlineComponent, Character, PlayerController, Pointer } from "@web-game/libet"
import { Html } from "@react-three/drei"

type TriggerMode = "always" | "hover" | "click"

export function InteractionDemo() {
  const [trigger, setTrigger] = useState<TriggerMode>("hover")
  const [color, setColor] = useState("#63b3ed")
  const [thickness, setThickness] = useState(0.06)
  const [emission, setEmission] = useState(1.5)

  return (
    <World
      width="100%" height="100%"
      camera={{ position: [0, 2, 5], fov: 55 }}
      physics={{ gravity: [0, -9.81, 0] }}
    >
      <StaticMesh name="ground" position={[0, -0.5, 0]} scale={[7, 0.5, 7]} color="#2d3748" physics="fixed" />

      <StaticMesh name="box-1" position={[-1.5, 0.5, 0]} scale={[1, 1, 1]} physics="none" color="#e53e3e">
        <OutlineComponent color={color} thickness={thickness} emission={emission} trigger={trigger} />
      </StaticMesh>
      <StaticMesh name="box-2" position={[1.5, 0.5, 0]} scale={[1, 1, 1]} physics="none" color="#38a169">
        <OutlineComponent color={color} thickness={thickness} emission={emission} trigger={trigger} />
      </StaticMesh>
      <StaticMesh name="box-3" position={[0, 0.5, 1.5]} scale={[1, 1, 1]} physics="none" color="#3182ce">
        <OutlineComponent color={color} thickness={thickness} emission={emission} trigger={trigger} />
      </StaticMesh>

      <Character name="player" position={[0, 1, 3]} speed={5} jumpHeight={2} />
      <PlayerController controllerID="player" view="thirdPerson" inertia />
      <Pointer size={[16, 16]} />

      <Html fullscreen>
        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,.75)", borderRadius: 8, padding: "8px 14px",
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
          justifyContent: "center", pointerEvents: "auto", fontSize: 12, color: "#ccc", fontFamily: "monospace",
        }}>
          <span style={{ color: "#fff", fontWeight: 600 }}>Outline</span>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Trigger
            <select value={trigger} onChange={(e) => setTrigger(e.target.value as TriggerMode)}
              style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 3, padding: "2px 6px", fontSize: 11 }}>
              <option value="hover">hover</option>
              <option value="always">always</option>
              <option value="click">click</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Color
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)}
              style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 3, padding: "2px 6px", width: 70, fontSize: 11 }} />
            <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: color, border: "1px solid #555" }} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Thickness
            <input type="range" min={0.01} max={0.2} step={0.01} value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
              style={{ width: 60, accentColor: "#636efa" }} />
            <span style={{ minWidth: 24 }}>{thickness.toFixed(2)}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Emission
            <input type="range" min={0} max={5} step={0.1} value={emission}
              onChange={(e) => setEmission(Number(e.target.value))}
              style={{ width: 60, accentColor: "#636efa" }} />
            <span>{emission.toFixed(1)}</span>
          </label>
        </div>
      </Html>
    </World>
  )
}

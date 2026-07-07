import { useState } from "react"
import { World, Character, PlayerController, StaticMesh, Pointer } from "@web-game/libet"
import { Html } from "@react-three/drei"

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Html fullscreen>
      <div style={{
        position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
        background: "rgba(0,0,0,.75)", borderRadius: 8, padding: "8px 14px",
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
        justifyContent: "center", pointerEvents: "auto", fontSize: 12, color: "#ccc",
        fontFamily: "monospace",
      }}>
        {children}
      </div>
    </Html>
  )
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
      <input type="checkbox" checked={value} onChange={onToggle} style={{ accentColor: "#636efa" }} />
      {label}
    </label>
  )
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ minWidth: 60 }}>{label}</span>
      <input type="range" min={min} max={max} step={step ?? 0.1} value={value} onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 80, accentColor: "#636efa" }} />
      <span style={{ minWidth: 24, textAlign: "right" }}>{value}</span>
    </label>
  )
}

export function CharacterDemo() {
  const [view, setView] = useState<"firstPerson" | "thirdPerson">("firstPerson")
  const [inertia, setInertia] = useState(true)
  const [crouch, setCrouch] = useState(false)
  const [speed, setSpeed] = useState(7)
  const [jumpHeight, setJumpHeight] = useState(2.5)

  return (
    <World
      width="100%"
      height="100%"
      camera={{ position: [0, 3, 6], fov: 60 }}
      physics={{ gravity: [0, -9.81, 0] }}
    >
      <StaticMesh name="ground" position={[0, -0.5, 0]} scale={[12, 0.5, 12]} color="#2d3748" physics="fixed" />
      <StaticMesh name="wall1" position={[-4, 1, -4]} scale={[1, 2, 1]} color="#4a5568" physics="fixed" />
      <StaticMesh name="wall2" position={[4, 1, 4]} scale={[1, 2, 1]} color="#4a5568" physics="fixed" />
      <StaticMesh name="ramp" position={[0, 0, 4]} scale={[2, 0.3, 1.5]} rotation={[0.3, 0, 0]} color="#718096" physics="fixed" />

      <Character name="player" position={[0, 1, 0]} speed={speed} jumpHeight={jumpHeight} />
      <PlayerController controllerID="player" view={view} inertia={inertia} crouch={crouch} />
      {view === "firstPerson" && <Pointer size={[16, 16]} />}

      <Panel>
        <span style={{ color: "#fff", fontWeight: 600 }}>Player</span>
        <button onClick={() => setView(v => v === "firstPerson" ? "thirdPerson" : "firstPerson")}
          style={{ background: "#636efa", color: "#fff", border: "none", borderRadius: 3, padding: "3px 10px", cursor: "pointer", fontSize: 11 }}>
          {view === "firstPerson" ? "3rd Person" : "1st Person"}
        </button>
        <Toggle label="Inertia" value={inertia} onToggle={() => setInertia(v => !v)} />
        <Toggle label="Crouch" value={crouch} onToggle={() => setCrouch(v => !v)} />
        <Slider label="Speed" value={speed} min={1} max={15} onChange={setSpeed} />
        <Slider label="Jump" value={jumpHeight} min={0.5} max={5} onChange={setJumpHeight} />
      </Panel>
    </World>
  )
}

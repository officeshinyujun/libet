import { useState, useRef, useEffect, useCallback } from "react"
import { World, Pawn, StaticMesh, usePawn } from "@web-game/libet"
import { Html } from "@react-three/drei"

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#ccc", fontFamily: "monospace" }}>
      <span style={{ minWidth: 40 }}>{label}</span>
      <input type="range" min={min} max={max} step={step ?? 0.1} value={value} onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 70, accentColor: "#636efa" }} />
      <span style={{ minWidth: 20, textAlign: "right" }}>{value}</span>
    </label>
  )
}

type PhysType = "dynamic" | "fixed" | "kinematicPosition"
type ShapeType = "box" | "sphere" | "capsule"

function LivePawn({ physics, mass, shape }: { physics: PhysType; mass: number; shape: ShapeType }) {
  const { rigidBody } = usePawn()
  const impulseApplied = useRef(false)

  useEffect(() => {
    if (impulseApplied.current) return
    impulseApplied.current = true
    if (rigidBody.current) {
      rigidBody.current.applyImpulse({ x: 0, y: 5, z: 0 }, true)
    }
  }, [rigidBody])

  const geo = shape === "box" ? <boxGeometry args={[0.6, 0.6, 0.6]} />
    : shape === "sphere" ? <sphereGeometry args={[0.4, 16, 16]} />
    : <capsuleGeometry args={[0.3, 0.5]} />

  return <mesh>{geo}<meshStandardMaterial color="#e53e3e" /></mesh>
}

export function PawnPhysics() {
  const [physics, setPhysics] = useState<PhysType>("dynamic")
  const [mass, setMass] = useState(2)
  const [shape, setShape] = useState<ShapeType>("box")
  const [pawnKey, setPawnKey] = useState(0)

  const respawn = useCallback(() => {
    setPawnKey(k => k + 1)
  }, [])

  return (
    <World
      width="100%" height="100%"
      camera={{ position: [0, 3, 8], fov: 55 }}
      physics={{ gravity: [0, -9.81, 0] }}
    >
      <StaticMesh name="ground" position={[0, -0.5, 0]} scale={[8, 0.5, 8]} color="#2d3748" physics="fixed" />
      <StaticMesh name="block" position={[0, 0.5, 2]} scale={[1.5, 1, 0.5]} color="#4a5568" physics="fixed" />

      <Pawn key={pawnKey} name="test-pawn" position={[0, 3, -1]} scale={[0.8, 0.8, 0.8]}
        physics={physics} mass={mass} color="#e53e3e">
        <LivePawn physics={physics} mass={mass} shape={shape} />
      </Pawn>

      <Html fullscreen>
        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,.75)", borderRadius: 8, padding: "8px 14px",
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
          justifyContent: "center", pointerEvents: "auto", fontSize: 12, color: "#ccc", fontFamily: "monospace",
        }}>
          <span style={{ color: "#fff", fontWeight: 600 }}>Pawn</span>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Type
            <select value={physics} onChange={(e) => setPhysics(e.target.value as PhysType)}
              style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 3, padding: "2px 6px", fontSize: 11 }}>
              <option value="dynamic">dynamic</option>
              <option value="fixed">fixed</option>
              <option value="kinematicPosition">kinematic</option>
            </select>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Shape
            <select value={shape} onChange={(e) => setShape(e.target.value as ShapeType)}
              style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 3, padding: "2px 6px", fontSize: 11 }}>
              <option value="box">box</option>
              <option value="sphere">sphere</option>
              <option value="capsule">capsule</option>
            </select>
          </label>

          <Slider label="Mass" value={mass} min={0.1} max={10} onChange={setMass} />
          <button onClick={respawn}
            style={{ background: "#636efa", color: "#fff", border: "none", borderRadius: 3, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            Respawn
          </button>
        </div>
      </Html>
    </World>
  )
}

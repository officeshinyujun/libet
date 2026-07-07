import { useRef, useState, useEffect } from "react"
import { World } from "@web-game/libet"
import { useFrame, useThree } from "@react-three/fiber"
import { CameraSystem, type CameraMode } from "@web-game/libet"
import { Html } from "@react-three/drei"
import * as THREE from "three"

function SceneObjects() {
  return (
    <group>
      <mesh position={[0, -0.5, 0]}><boxGeometry args={[8, 0.2, 8]} /><meshStandardMaterial color="#2d3748" /></mesh>
      <mesh position={[0, 0.8, 0]}><capsuleGeometry args={[0.3, 0.6]} /><meshStandardMaterial color="#636efa" /></mesh>
      <mesh position={[2.5, 0.5, 2]}><boxGeometry args={[0.6, 0.6, 0.6]} /><meshStandardMaterial color="#e53e3e" /></mesh>
      <mesh position={[-2, 0.5, 2.5]}><sphereGeometry args={[0.4, 16, 16]} /><meshStandardMaterial color="#38a169" /></mesh>
      <mesh position={[2, 0.5, -2.5]}><dodecahedronGeometry args={[0.4]} /><meshStandardMaterial color="#d69e2e" /></mesh>
      <mesh position={[-2.5, 0.5, -2]}><torusGeometry args={[0.4, 0.15, 12, 24]} /><meshStandardMaterial color="#805ad5" /></mesh>
    </group>
  )
}

function CameraController({ mode, distance, height, smoothSpeed, doShake }: { mode: CameraMode; distance: number; height: number; smoothSpeed: number; doShake: number }) {
  const { camera } = useThree()
  const csRef = useRef<CameraSystem | null>(null)

  useEffect(() => {
    const cs = new CameraSystem()
    cs.setCamera(camera)
    cs.configure({ mode, distance, height, smoothSpeed })
    cs.follow({ position: new THREE.Vector3(0, 0.8, 0) })
    csRef.current = cs
    return () => {}
  }, [camera])

  useEffect(() => {
    csRef.current?.configure({ mode, distance, height, smoothSpeed })
  }, [mode, distance, height, smoothSpeed])

  useEffect(() => {
    if (doShake > 0) csRef.current?.shake(0.5, 2)
  }, [doShake])

  useFrame((_, delta) => csRef.current?.update(delta))
  return <SceneObjects />
}

export function CameraModes() {
  const [mode, setMode] = useState<CameraMode>("orbital")
  const [distance, setDistance] = useState(6)
  const [height, setHeight] = useState(1.5)
  const [smoothSpeed, setSmoothSpeed] = useState(5)
  const [shakeCount, setShakeCount] = useState(0)

  return (
    <World width="100%" height="100%" camera={{ position: [0, 3, 6], fov: 55 }}>
      <CameraController mode={mode} distance={distance} height={height} smoothSpeed={smoothSpeed} doShake={shakeCount} />

      <Html fullscreen>
        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,.75)", borderRadius: 8, padding: "8px 14px",
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
          justifyContent: "center", pointerEvents: "auto", fontSize: 12, color: "#ccc", fontFamily: "monospace",
        }}>
          <span style={{ color: "#fff", fontWeight: 600 }}>Camera</span>

          <select value={mode} onChange={(e) => setMode(e.target.value as CameraMode)}
            style={{ background: "#222", color: "#fff", border: "1px solid #444", borderRadius: 3, padding: "2px 6px", fontSize: 11 }}>
            <option value="firstPerson">1st Person</option>
            <option value="thirdPerson">3rd Person</option>
            <option value="topDown">Top Down</option>
            <option value="orbital">Orbital</option>
            <option value="fixed">Fixed</option>
          </select>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Dist
            <input type="range" min={3} max={20} value={distance} onChange={(e) => setDistance(Number(e.target.value))}
              style={{ width: 60, accentColor: "#636efa" }} />
            <span style={{ minWidth: 24 }}>{distance}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Height
            <input type="range" min={0.5} max={8} value={height} onChange={(e) => setHeight(Number(e.target.value))}
              style={{ width: 60, accentColor: "#636efa" }} />
            <span>{height.toFixed(1)}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            Smooth
            <input type="range" min={1} max={20} value={smoothSpeed} onChange={(e) => setSmoothSpeed(Number(e.target.value))}
              style={{ width: 60, accentColor: "#636efa" }} />
            <span>{smoothSpeed}</span>
          </label>

          <button onClick={() => setShakeCount(c => c + 1)}
            style={{ background: "#e53e3e", color: "#fff", border: "none", borderRadius: 3, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
            Shake!
          </button>
        </div>
      </Html>
    </World>
  )
}

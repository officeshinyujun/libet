import { useRef, useState } from "react"
import { World, StaticMesh } from "@web-game/libet"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

function RotatingCube({ speed }: { speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) { ref.current.rotation.x += delta * speed; ref.current.rotation.y += delta * speed * 1.3 }
  })
  return <mesh ref={ref} position={[-2, 0.8, 0]}><boxGeometry args={[0.8, 0.8, 0.8]} /><meshStandardMaterial color="#636efa" /></mesh>
}

function BouncingSphere({ speed }: { speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(0)
  useFrame((_, delta) => {
    t.current += delta
    if (ref.current) {
      ref.current.position.y = 0.8 + Math.abs(Math.sin(t.current * speed)) * 1.2
      ref.current.scale.setScalar(0.8 + Math.sin(t.current * speed * 1.5) * 0.15)
    }
  })
  return <mesh ref={ref} position={[0, 0.8, 0]}><sphereGeometry args={[0.4, 16, 16]} /><meshStandardMaterial color="#e53e3e" /></mesh>
}

function PulsingTorus({ speed }: { speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const t = useRef(0)
  useFrame((_, delta) => {
    t.current += delta
    if (ref.current) {
      const s = 1 + Math.sin(t.current * speed) * 0.3
      ref.current.scale.setScalar(s)
      ref.current.rotation.z += delta * speed * 0.3
    }
  })
  return <mesh ref={ref} position={[2, 0.8, 0]}><torusGeometry args={[0.4, 0.15, 12, 24]} /><meshStandardMaterial color="#38a169" /></mesh>
}

export function AnimationDemo() {
  const [rotateSpeed, setRotateSpeed] = useState(2)
  const [bounceSpeed, setBounceSpeed] = useState(2)
  const [pulseSpeed, setPulseSpeed] = useState(2)
  const [showCube, setShowCube] = useState(true)
  const [showSphere, setShowSphere] = useState(true)
  const [showTorus, setShowTorus] = useState(true)

  return (
    <World width="100%" height="100%" camera={{ position: [0, 2, 5], fov: 50 }}>
      <StaticMesh name="ground" position={[0, -0.5, 0]} scale={[6, 0.5, 6]} color="#2d3748" physics="none" />
      {showCube && <RotatingCube speed={rotateSpeed} />}
      {showSphere && <BouncingSphere speed={bounceSpeed} />}
      {showTorus && <PulsingTorus speed={pulseSpeed} />}

      <Html fullscreen>
        <div style={{
          position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,.75)", borderRadius: 8, padding: "8px 14px",
          display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
          justifyContent: "center", pointerEvents: "auto", fontSize: 12, color: "#ccc", fontFamily: "monospace",
        }}>
          <span style={{ color: "#fff", fontWeight: 600 }}>Animation</span>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input type="checkbox" checked={showCube} onChange={() => setShowCube(v => !v)} style={{ accentColor: "#636efa" }} />
            <span style={{ color: "#636efa" }}>Cube</span>
            <input type="range" min={0} max={5} value={rotateSpeed} onChange={(e) => setRotateSpeed(Number(e.target.value))}
              style={{ width: 50, accentColor: "#636efa" }} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input type="checkbox" checked={showSphere} onChange={() => setShowSphere(v => !v)} style={{ accentColor: "#e53e3e" }} />
            <span style={{ color: "#e53e3e" }}>Sphere</span>
            <input type="range" min={0} max={5} value={bounceSpeed} onChange={(e) => setBounceSpeed(Number(e.target.value))}
              style={{ width: 50, accentColor: "#e53e3e" }} />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <input type="checkbox" checked={showTorus} onChange={() => setShowTorus(v => !v)} style={{ accentColor: "#38a169" }} />
            <span style={{ color: "#38a169" }}>Torus</span>
            <input type="range" min={0} max={5} value={pulseSpeed} onChange={(e) => setPulseSpeed(Number(e.target.value))}
              style={{ width: 50, accentColor: "#38a169" }} />
          </label>
        </div>
      </Html>
    </World>
  )
}

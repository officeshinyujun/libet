import { useState, useRef, useEffect } from "react"
import { World, Character, PlayerController, Pawn, StaticMesh, Pointer, OutlineComponent, usePawn } from "@web-game/libet"
import { Html } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

function Spawner({ onSpawn, max }: { onSpawn: (count: number) => void; max: number }) {
  const count = useRef(0)
  const time = useRef(0)
  const done = useRef(false)
  useFrame((_, delta) => {
    if (done.current) return
    time.current += delta
    if (time.current > 2) {
      time.current = 0
      count.current++
      if (count.current >= max) { done.current = true; return }
      onSpawn(count.current)
    }
  })
  return null
}

function ViewToggle({ view, onToggle }: { view: string; onToggle: () => void }) {
  return (
    <Html position={[0, 3.2, 0]} center>
      <button onClick={onToggle} style={{
        padding: "4px 12px", borderRadius: 4, border: "1px solid rgba(255,255,255,.2)",
        background: "rgba(0,0,0,.6)", color: "#fff", fontSize: 11, cursor: "pointer",
        fontFamily: "inherit", whiteSpace: "nowrap",
      }}>
        {view === "firstPerson" ? "[ 3rd Person ]" : "[ 1st Person ]"}
      </button>
    </Html>
  )
}

function FallingCube() {
  const { rigidBody } = usePawn()
  const [color, setColor] = useState("#e53e3e")
  const colors = ["#e53e3e", "#38a169", "#3182ce", "#d69e2e", "#805ad5"]
  const applied = useRef(false)

  useEffect(() => {
    if (applied.current) return
    applied.current = true
    if (rigidBody.current) {
      rigidBody.current.applyImpulse({
        x: (Math.random() - 0.5) * 3,
        y: 2 + Math.random() * 2,
        z: (Math.random() - 0.5) * 3,
      }, true)
    }
  }, [rigidBody])

  return (
    <mesh onClick={() => setColor(colors[Math.floor(Math.random() * colors.length)])}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
      <OutlineComponent color="#fff" thickness={0.03} trigger="hover" />
    </mesh>
  )
}

function Ground() {
  return (
    <group>
      <StaticMesh name="floor" position={[0, -0.5, 0]} scale={[14, 1, 14]} physics="fixed" color="#1a1a2e" />
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={`grid-h${i}`}>
          <mesh position={[0, -0.4, -6 + i * 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[14, 0.02]} />
            <meshBasicMaterial color="#2a2a4a" transparent opacity={0.5} />
          </mesh>
          <mesh position={[-6 + i * 2, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.02, 14]} />
            <meshBasicMaterial color="#2a2a4a" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Walls() {
  const wallProps = { physics: "fixed" as const, color: "#2d2d4f" as string }
  return (
    <group>
      <StaticMesh name="wall-n" position={[0, 1.5, -7]} scale={[14, 3, 0.3]} {...wallProps} />
      <StaticMesh name="wall-s" position={[0, 1.5, 7]} scale={[14, 3, 0.3]} {...wallProps} />
      <StaticMesh name="wall-w" position={[-7, 1.5, 0]} scale={[0.3, 3, 14]} {...wallProps} />
      <StaticMesh name="wall-e" position={[7, 1.5, 0]} scale={[0.3, 3, 14]} {...wallProps} />
    </group>
  )
}

export function GameDemo() {
  const [view, setView] = useState<"firstPerson" | "thirdPerson">("firstPerson")
  const [pawns, setPawns] = useState<number[]>([])

  return (
    <World
      width="100%"
      height="100%"
      camera={{ position: [0, 6, 10], fov: 60 }}
      physics={{ gravity: [0, -9.81, 0] }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      <Ground />
      <Walls />

      <StaticMesh name="pillar1" position={[-3, 0.5, -3]} scale={[0.8, 1, 0.8]} physics="fixed" color="#636efa">
        <OutlineComponent color="#8888ff" thickness={0.06} trigger="hover" />
      </StaticMesh>
      <StaticMesh name="pillar2" position={[3, 0.5, 3]} scale={[0.8, 1, 0.8]} physics="fixed" color="#636efa">
        <OutlineComponent color="#8888ff" thickness={0.06} trigger="hover" />
      </StaticMesh>

      {pawns.map((id) => (
        <Pawn key={id} name={`crate-${id}`} position={[
          (id % 2 === 0 ? -1 : 1) * 1.5,
          2 + id,
          (id % 3 === 0 ? -1 : 1) * 1.5,
        ]} scale={[0.5, 0.5, 0.5]} physics="dynamic" mass={1} color="#e53e3e">
          <FallingCube />
        </Pawn>
      ))}

      <Character name="player" position={[0, 1, 0]} speed={7} jumpHeight={2.5}>
        <ViewToggle view={view} onToggle={() => setView(v => v === "firstPerson" ? "thirdPerson" : "firstPerson")} />
      </Character>
      <PlayerController controllerID="player" view={view} inertia />
      {view === "firstPerson" && <Pointer size={[16, 16]} />}

      <Spawner onSpawn={(c) => setPawns(prev => [...prev, c])} max={6} />
    </World>
  )
}

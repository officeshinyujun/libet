import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Mesh } from "three"

export interface StatsData {
  fps: number
  frameTime: number
  meshes: number
  drawCalls: number
  triangles: number
}

export function StatsCollector({ onStats }: { onStats: (stats: StatsData) => void }) {
  const { gl, scene } = useThree()
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const frameTimes = useRef<number[]>([])

  useFrame(() => {
    const now = performance.now()
    frameTimes.current.push(now - lastTime.current)
    frameCount.current++

    if (now - lastTime.current >= 1000) {
      const avg = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length
      const info = gl.info

      let meshTotal = 0
      scene.traverse((child) => {
        if ((child as Mesh).isMesh) meshTotal++
      })

      onStats({
        fps: frameCount.current,
        frameTime: Math.round(avg * 100) / 100,
        meshes: meshTotal,
        drawCalls: info.render?.calls ?? 0,
        triangles: info.render?.triangles ?? 0,
      })

      frameCount.current = 0
      frameTimes.current = []
      lastTime.current = now
    }
  })

  return null
}

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { WorldType } from "./type";
import { Suspense } from "react";

export function World({
  children,
  physics,
  camera,
  environment,
  debug,
  onReady,
  onTick,
  width,
  height
}: WorldType) {
  return (
    <Canvas camera={camera} style={{ width, height }}>
      <Physics
        gravity={physics?.gravity ?? [0, -9.81, 0]}
        paused={physics?.paused}
        debug={debug?.physics}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Physics>
    </Canvas>
  )
}

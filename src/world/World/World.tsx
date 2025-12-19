import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { WorldType } from "./type";

export function World({
  children,
  physics,
  camera,
  environment,
  debug,
  onReady,
  onTick,
}: WorldType) {
  return (
    <Canvas camera={camera}>
      <Physics
        gravity={physics?.gravity ?? [0, -9.81, 0]}
        paused={physics?.paused}
        debug={debug?.physics}
      >
        {children}
      </Physics>
    </Canvas>
  )
}

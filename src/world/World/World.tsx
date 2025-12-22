import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { WorldType } from "./type";
import { Suspense } from "react";
import { WorldProvider } from "./WorldContext";
import { InteractionProvider, InteractionManager } from "../../objects/Effects/InteractionComponent";

export function World({
  children,
  physics,
  camera,
  environment,
  debug,
  onReady,
  onTick,
  width,
  height,
  ...rest
}: WorldType) {
  return (
    <Canvas 
      camera={camera} 
      style={{ width, height, ...rest.style }} 
      {...rest}
    >
      <Physics
        gravity={physics?.gravity ?? [0, -9.81, 0]}
        paused={physics?.paused}
        debug={debug?.physics}
      >
        <WorldProvider>
            <InteractionProvider>
                <InteractionManager />
                <Suspense fallback={null}>
                {children}
                </Suspense>
            </InteractionProvider>
        </WorldProvider>
      </Physics>
    </Canvas>
  )
}

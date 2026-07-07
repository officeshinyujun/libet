import { Canvas, useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { WorldType } from "./type";
import { Suspense, useEffect, useRef, useState } from "react";
import { WorldProvider, useWorld } from "./WorldContext";
import { InteractionProvider, InteractionManager } from "../../objects/Effects/InteractionComponent";
import { ErrorBoundary } from "../../display/ErrorBoundary";
import { StatsCollector, type StatsData } from "../../display/StatsCollector";

function WorldLoop({ onTick }: { onTick?: (dt: number) => void }) {
  const { systems } = useWorld();

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    systems.update(dt);
    onTick?.(dt);
  });

  return null;
}

function StatsDisplay({ stats }: { stats: StatsData | null }) {
  if (!stats) return null
  return (
    <div style={{
      position: "fixed", top: 56, left: 8, zIndex: 9999,
      fontFamily: "monospace", fontSize: 12, color: "#0f0",
      background: "rgba(0,0,0,0.7)", padding: "8px 12px", borderRadius: 4,
      pointerEvents: "none", userSelect: "none", lineHeight: 1.6,
      whiteSpace: "pre",
    }}>
      {`FPS: ${stats.fps} (${stats.frameTime}ms)
Draw Calls: ${stats.drawCalls}
Meshes: ${stats.meshes}
Tris: ${stats.triangles.toLocaleString()}`}
    </div>
  )
}

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
  const readyCalled = useRef(false);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    if (!readyCalled.current) {
      readyCalled.current = true;
      onReady?.();
    }
  }, [onReady]);

  return (
    <ErrorBoundary>
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
              <WorldLoop onTick={onTick} />
              {debug?.stats && <StatsCollector onStats={setStats} />}
              <InteractionProvider>
                  <InteractionManager />
                  <Suspense fallback={null}>
                  {children}
                  </Suspense>
              </InteractionProvider>
          </WorldProvider>
        </Physics>
      </Canvas>
      <StatsDisplay stats={stats} />
    </ErrorBoundary>
  )
}

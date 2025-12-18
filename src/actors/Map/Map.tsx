import * as React from "react"
import * as THREE from "three"
import { RigidBody } from "@react-three/rapier"
import { MapType } from "./type"
import { useMapDivider } from "./useMapDivider"

export default function Map(props: MapType) {
  const {
    name,
    scale ,
    position ,
    rotation ,
    modelpath,
    physics,
    chuckSize,
    isChunked,
  } = props

  /** 모델 clone */
  const object = React.useMemo<THREE.Object3D | null>(() => {
    if (!modelpath) return null
    return modelpath.clone(true)
  }, [modelpath])

  /** chunk 분할 (useMapDivider 사용) */
  const tiles = React.useMemo(() => {
    if (!object || !isChunked || !chuckSize) return []
    return useMapDivider({
      object,
      chunkSize: chuckSize,
    })
  }, [object, isChunked, chuckSize])

  /** ===== Chunked Map ===== */
  if (isChunked && object && chuckSize) {
    return (
      <group
        name={name}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        {tiles.map((tile) => {
          const content = (
            <primitive object={object.clone(true)} />
          )

          if (physics === "none") {
            return (
              <group
                key={tile.index.join("-")}
                position={tile.position}
              >
                {content}
              </group>
            )
          }

          return (
            <RigidBody
              key={tile.index.join("-")}
              type="fixed"
              colliders="trimesh"
            >
              <group position={tile.position}>
                {content}
              </group>
            </RigidBody>
          )
        })}
      </group>
    )
  }

  /** ===== Non-Chunked Map ===== */
  const content = object ? (
    <primitive object={object} />
  ) : (
    <mesh />
  )

  if (physics === "none") {
    return (
      <group
        name={name}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        {content}
      </group>
    )
  }

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group
        name={name}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        {content}
      </group>
    </RigidBody>
  )
}

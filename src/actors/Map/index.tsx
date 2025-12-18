import * as React from "react"
import * as THREE from "three"
import { RigidBody } from "@react-three/rapier"
import { MapType } from "./type"

type Tile = {
  key: string
  position: [number, number, number]
}

export default function Map(props: MapType) {
  const {
    name,
    scale = [1, 1, 1],
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    modelpath,
    physics = "none",
    chuckSize,
    isChunked,
  } = props

  /** 모델 clone */
  const object = React.useMemo<THREE.Object3D | null>(() => {
    if (!modelpath) return null
    return modelpath.clone(true)
  }, [modelpath])

  /** chunk 계산 */
  const tiles = React.useMemo<Tile[]>(() => {
    if (!object || !isChunked || !chuckSize) return []

    const box = new THREE.Box3().setFromObject(object)
    const size = new THREE.Vector3()
    box.getSize(size)

    const width = size.x
    const depth = size.z

    const tilesX = Math.ceil(width / chuckSize)
    const tilesZ = Math.ceil(depth / chuckSize)

    const startX = -width / 2
    const startZ = -depth / 2

    const result: Tile[] = []

    for (let x = 0; x < tilesX; x++) {
      for (let z = 0; z < tilesZ; z++) {
        result.push({
          key: `${x}-${z}`,
          position: [
            startX + (x + 0.5) * chuckSize,
            0,
            startZ + (z + 0.5) * chuckSize,
          ],
        })
      }
    }

    return result
  }, [object, isChunked, chuckSize])

  /** ====== Chunked Map ====== */
  if (isChunked && object && chuckSize) {
    return (
      <group
        name={name}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        {tiles.map((tile) => {
          const content = <primitive object={object.clone(true)} />

          if (physics === "none") {
            return (
              <group key={tile.key} position={tile.position}>
                {content}
              </group>
            )
          }

          return (
            <RigidBody
              key={tile.key}
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

  /** ====== Non-Chunked Map ====== */
  const content = object ? <primitive object={object} /> : <mesh />

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

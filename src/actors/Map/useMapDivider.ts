import * as THREE from "three"

export type Vec3 = readonly [number, number, number]

export type MapTile = {
  index: readonly [number, number]
  position: Vec3
}

export function useMapDivider(params: {
  object: THREE.Object3D
  chunkSize: number
}): MapTile[] {
  const { object, chunkSize } = params

  const box = new THREE.Box3().setFromObject(object)
  const size = new THREE.Vector3()
  box.getSize(size)

  const worldPos = new THREE.Vector3()
  object.getWorldPosition(worldPos)

  const width = size.x
  const depth = size.z

  const tilesX = Math.ceil(width / chunkSize)
  const tilesZ = Math.ceil(depth / chunkSize)

  const startX = worldPos.x - width / 2
  const startZ = worldPos.z - depth / 2

  const tiles: MapTile[] = []

  for (let x = 0; x < tilesX; x++) {
    for (let z = 0; z < tilesZ; z++) {
      tiles.push({
        index: [x, z],
        position: [
          startX + (x + 0.5) * chunkSize,
          worldPos.y,
          startZ + (z + 0.5) * chunkSize,
        ] as Vec3,
      })
    }
  }

  return tiles
}

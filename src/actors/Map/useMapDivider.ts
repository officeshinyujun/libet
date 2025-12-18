import * as THREE from "three"

export function useMapDivider(params: {
  object: THREE.Object3D
  chunkSize: number
}) {
  const { object, chunkSize } = params

  // 월드 기준 Bounding Box
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

  const tiles = []

  for (let x = 0; x < tilesX; x++) {
    for (let z = 0; z < tilesZ; z++) {
      tiles.push({
        index: [x, z],
        position: [
          startX + (x + 0.5) * chunkSize,
          worldPos.y,
          startZ + (z + 0.5) * chunkSize,
        ],
      })
    }
  }

  return tiles
}

import * as React from "react"
import * as THREE from "three"
import { RigidBody } from "@react-three/rapier"
import { MapType } from "./type"

export default function Map(props: MapType) {
   const { name, scale, position, rotation, modelpath, physics } = props
  const object = React.useMemo<THREE.Object3D | null>(() => {
    if (!modelpath) return null
    return modelpath.clone(true)
  }, [modelpath])

  if (physics === "none") {
    return (
      <group
        name={name}
        scale={scale}
        position={position}
        rotation={rotation}
      >
        {object ? <primitive object={object} /> : <mesh />}
      </group>
    )
  } else {
    return (
        <RigidBody type="fixed" colliders="trimesh">
        <group
            name={name}
            scale={scale}
            position={position}
            rotation={rotation}
        >
            {object ? <primitive object={object} /> : <mesh />}
        </group>
        </RigidBody>
    )
  }
}

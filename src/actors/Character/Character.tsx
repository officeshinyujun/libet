import {CharacterType} from "./type"
import { RigidBody } from "@react-three/rapier"

export default function Character(props : CharacterType) {
    const {name, tags, scale, rotation, position, modelpath, controllerID, speed, jumpHeight} = props
    return (
      <RigidBody>
        <group>
            {modelpath ? 
            (<primitive 
                object={modelpath} 
                name={name}
                scale={scale}
                rotation={rotation}
                position={position}
            />) 
            : (
                <mesh
                    name={name}
                    scale={scale}
                    rotation={rotation}
                    position={position}
                >
                    <boxGeometry />
                    <meshStandardMaterial />
                </mesh>
            )}
        </group>
      </RigidBody>
    )
}

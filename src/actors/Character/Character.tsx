import {CharacterType} from "./type"
import { RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useWorld } from "../../world/World/WorldContext"
import { useEffect, useRef } from "react"

export default function Character(props : CharacterType) {
    const {name, tags, scale, rotation, position, modelpath, speed, jumpHeight} = props
    const rigidBodyRef = useRef<RapierRigidBody>(null)
    const { registerCharacter, unregisterCharacter } = useWorld()

    useEffect(() => {
        if (name && rigidBodyRef) {
            registerCharacter(name, rigidBodyRef, props)
        }
        return () => {
            if (name) unregisterCharacter(name)
        }
    }, [name, registerCharacter, unregisterCharacter, props])

    return (
      <RigidBody ref={rigidBodyRef} position={position} rotation={rotation} lockRotations>
        <group>
            {modelpath ? 
            (<primitive 
                object={modelpath} 
                name={name}
                tags={tags}
                scale={scale}
            />) 
            : (
                <mesh
                    name={name}
                    scale={scale}
                >
                    <boxGeometry />
                    <meshStandardMaterial />
                </mesh>
            )}
        </group>
      </RigidBody>
    )
}

import {CharacterType} from "./type"
import { RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useWorld } from "../../world/World/WorldContext"
import { useEffect, useRef, createContext, useContext } from "react"

export interface CharacterContextValue {
    name: string;
    rigidBody: React.RefObject<RapierRigidBody | null>;
    props: CharacterType;
}

const CharacterContext = createContext<CharacterContextValue | null>(null);

export const useCharacter = () => {
    const context = useContext(CharacterContext);
    if (!context) {
        throw new Error("useCharacter must be used within a Character component");
    }
    return context;
}

export default function Character(props : CharacterType) {
    const {name, tags, scale, rotation, position, modelpath, speed, jumpHeight, children} = props
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

    const contextValue = {
        name,
        rigidBody: rigidBodyRef,
        props
    }

    return (
      <RigidBody ref={rigidBodyRef} position={position} rotation={rotation} lockRotations ccd>
        <CharacterContext.Provider value={contextValue}>
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
                {children}
            </group>
        </CharacterContext.Provider>
      </RigidBody>
    )
}

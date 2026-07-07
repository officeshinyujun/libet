import {CharacterType} from "./type"
import { RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useWorld } from "../../world/World/WorldContext"
import { useEffect, useRef, createContext, useContext } from "react"
import { Entity } from "../../core/Entity"

export interface CharacterContextValue {
    name: string;
    rigidBody: React.RefObject<RapierRigidBody | null>;
    props: CharacterType;
    entity: Entity;
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
    const entityRef = useRef<Entity | null>(null)
    const { registerCharacter, unregisterCharacter, entities } = useWorld()
    const propsRef = useRef(props)
    propsRef.current = props

    useEffect(() => {
        if (!name) return
        entityRef.current = entities.create(name)
        registerCharacter(name, rigidBodyRef, propsRef.current)
        return () => {
            unregisterCharacter(name)
        }
    }, [name, registerCharacter, unregisterCharacter, entities])

    useEffect(() => {
        return () => {
            if (entityRef.current) {
                entityRef.current.destroy()
                entityRef.current = null
            }
        }
    }, [])

    const contextValue = {
        name,
        rigidBody: rigidBodyRef,
        props,
        entity: entityRef.current!,
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

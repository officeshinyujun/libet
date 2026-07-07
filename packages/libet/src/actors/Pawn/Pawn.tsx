import { PawnType } from "./type";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef, useMemo, createContext, useContext, useEffect } from "react";
import { useWorld } from "../../world/World/WorldContext";
import { Entity } from "../../core/Entity";

export interface PawnContextValue {
    name: string;
    rigidBody: React.RefObject<RapierRigidBody | null>;
    props: PawnType;
    entity: Entity;
}

const PawnContext = createContext<PawnContextValue | null>(null);

export const usePawn = () => {
    const context = useContext(PawnContext);
    if (!context) {
        throw new Error("usePawn must be used within a Pawn component");
    }
    return context;
}

export default function Pawn(props: PawnType) {
    const {
        name,
        modelpath,
        scale,
        rotation,
        position,
        physics = "dynamic",
        collider,
        mass = 1.0,
        children,
        color = "orange"
    } = props;

    const rigidBodyRef = useRef<RapierRigidBody>(null);
    const entityRef = useRef<Entity | null>(null);
    const { entities } = useWorld();

    useEffect(() => {
        if (!name) return
        if (!entityRef.current) {
            entityRef.current = entities.create(name)
        }
        return () => {
            if (entityRef.current) {
                entityRef.current.destroy()
                entityRef.current = null
            }
        }
    }, [name, entities])

    const contextValue = {
        name,
        rigidBody: rigidBodyRef,
        props,
        entity: entityRef.current!,
    };

    const content = useMemo(() => {
        if (modelpath) {
            return (
                <primitive
                    object={modelpath}
                    scale={scale}
                >
                    {children}
                </primitive>
            )
        }
        return (
            <mesh scale={scale}>
                <boxGeometry />
                <meshStandardMaterial color={color} />
                {children}
            </mesh>
        )
    }, [modelpath, scale, color, children]);

    const defaultCollider = modelpath ? "hull" : "cuboid";
    const appliedCollider = collider ?? defaultCollider;

    return (
        <RigidBody
            ref={rigidBodyRef}
            name={name}
            type={physics}
            position={position}
            rotation={rotation}
            colliders={appliedCollider}
            mass={mass}
        >
            <PawnContext.Provider value={contextValue}>
                {content}
            </PawnContext.Provider>
        </RigidBody>
    );
}
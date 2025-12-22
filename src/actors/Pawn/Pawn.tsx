import { PawnType } from "./type";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef, useMemo, createContext, useContext } from "react";

export interface PawnContextValue {
    name: string;
    rigidBody: React.RefObject<RapierRigidBody | null>;
    props: PawnType;
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

    const contextValue = {
        name,
        rigidBody: rigidBodyRef,
        props
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

    // Default collider: 'hull' for models (dynamic friendly), 'cuboid' for box
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
import { BaseActorType } from "../BaseActor/type"
import * as THREE from "three"
import { RigidBodyProps } from "@react-three/rapier";
import { ReactNode } from "react";

/**
 * Pawn Type
 * 
 * Represents a generic physical actor in the world.
 * Can be controlled or just follow physics laws.
 * Examples: Vehicles, Balls, Drones, Crates.
 */
export type PawnType = BaseActorType & {
    /** Optional 3D Model */
    modelpath?: THREE.Group | THREE.Mesh | THREE.Object3D;
    
    /** 
     * Physics Body Type 
     * @default 'dynamic'
     */
    physics?: "dynamic" | "fixed" | "kinematicPosition" | "kinematicVelocity";

    /**
     * Collider Shape
     * @default 'cuboid' (if box) or 'hull' (if model)
     */
    collider?: RigidBodyProps['colliders'];

    /** Mass of the object */
    mass?: number;

    /** Children components (e.g., Logic, Effects, Cameras) */
    children?: ReactNode;

    /** Debug color for placeholder */
    color?: string;
}
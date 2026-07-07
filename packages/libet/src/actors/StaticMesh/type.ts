import { BaseActorType } from "../BaseActor/type"
import * as THREE from "three"
import { RigidBodyProps } from "@react-three/rapier";

export type StaticMeshType = BaseActorType & {
    /** Optional 3D Model. If not provided, a default box will be rendered. */
    modelpath?: THREE.Group | THREE.Mesh | THREE.Object3D;
    
    /** 
     * Physics Body Type 
     * - 'fixed': Static object (walls, floor)
     * - 'dynamic': Moving object affected by gravity/forces
     * - 'none': No physics
     */
    physics?: "fixed" | "dynamic" | "none";

    /**
     * Collider Shape (for Rapier)
     * Default: 'cuboid' (if no model) or 'trimesh' (if model provided)
     */
    collider?: RigidBodyProps['colliders'];

    /** Color for the default mesh (if modelpath is missing) */
    color?: string;

    /** Optional children to be rendered inside the mesh */
    children?: React.ReactNode;
}
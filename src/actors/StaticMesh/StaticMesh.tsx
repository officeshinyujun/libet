import { StaticMeshType } from "./type"
import { RigidBody } from "@react-three/rapier"
import { useMemo } from "react"

export default function StaticMesh(props: StaticMeshType) {
    const { 
        name, 
        scale, 
        position, 
        rotation, 
        modelpath, 
        physics = "fixed",
        collider,
        color = "white"
    } = props

    const content = useMemo(() => {
        if (modelpath) {
            return (
                <primitive 
                    object={modelpath} 
                    scale={scale} 
                />
            )
        }
        return (
            <mesh scale={scale}>
                <boxGeometry />
                <meshStandardMaterial color={color} />
            </mesh>
        )
    }, [modelpath, scale, color])

    if (physics === 'none') {
        return (
            <group name={name} position={position} rotation={rotation}>
                {content}
            </group>
        )
    }

    // Default collider logic: 
    // If model provided:
    //   - 'dynamic' physics -> 'hull' (convex hull) is safer and more stable than trimesh for moving objects.
    //   - 'fixed' physics -> 'trimesh' is fine for static scenery.
    // If no model (box) -> 'cuboid'
    const defaultCollider = modelpath 
        ? (physics === 'dynamic' ? 'hull' : 'trimesh')
        : "cuboid";
    const appliedCollider = collider ?? defaultCollider;

    return (
        <RigidBody 
            name={name}
            type={physics === 'dynamic' ? 'dynamic' : 'fixed'}
            position={position}
            rotation={rotation}
            colliders={appliedCollider}
        >
            {content}
        </RigidBody>
    )
}
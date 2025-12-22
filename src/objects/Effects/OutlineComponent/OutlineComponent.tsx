import { OutlineComponentType } from "./type";
import { Outlines } from "@react-three/drei";
import { useEffect, useState, useRef, useLayoutEffect, useContext } from "react";
import * as THREE from "three";
import { createPortal } from "@react-three/fiber";
import { useInteractionContext } from "../InteractionComponent/InteractionContext";

export default function OutlineComponent({ 
    color = "white", 
    thickness = 0.05, 
    emission = 1,
    visible = true,
    trigger = "always"
}: OutlineComponentType) {
    const groupRef = useRef<THREE.Group>(null);
    const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);
    const [toggled, setToggled] = useState(false);

    // Safely get context (might be null if provider missing)
    let focusedMeshUuid: string | null = null;
    try {
        const ctx = useInteractionContext();
        focusedMeshUuid = ctx.focusedMeshUuid;
    } catch (e) {
        // Ignore context missing error if not using interaction triggers
        if (trigger === "hover" || trigger === "click") {
             console.warn(`OutlineComponent: trigger='${trigger}' requires InteractionProvider in the World.`);
        }
    }

    // Find all parent meshes
    useLayoutEffect(() => {
        if (!groupRef.current) return;
        
        const parent = groupRef.current.parent;
        if (!parent) return;

        const found: THREE.Mesh[] = [];
        // If parent is a mesh, add it
        if ((parent as THREE.Mesh).isMesh) {
            found.push(parent as THREE.Mesh);
        }
        
        // Traverse to find nested meshes (e.g. inside a GLTF group)
        parent.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                // Avoid adding the parent twice if it was caught above
                if (child !== parent) found.push(child as THREE.Mesh);
            }
        });

        setMeshes(found);
    }, []);

    // Determine if we should show the outline
    const isHovered = meshes.some(m => m.uuid === focusedMeshUuid);

    // Handle click toggle
    useEffect(() => {
        if (trigger !== 'click') return;

        const handleMouseDown = () => {
            if (isHovered) {
                setToggled(prev => !prev);
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, [trigger, isHovered]);

    const isActive = visible && (
        trigger === "always" || 
        (trigger === "hover" && isHovered) ||
        (trigger === "click" && toggled)
    );

    if (!isActive || meshes.length === 0) return <group ref={groupRef} />;

    const outlineColor = new THREE.Color(color).multiplyScalar(emission);

    return (
        <group ref={groupRef}>
            {meshes.map((mesh) => (
                <PortalOutline 
                    key={mesh.uuid} 
                    target={mesh} 
                    color={outlineColor} 
                    thickness={thickness} 
                />
            ))}
        </group>
    );
}

// Helper component to portal the outline into the target mesh
function PortalOutline({ target, color, thickness }: { target: THREE.Mesh, color: THREE.Color, thickness: number }) {
    return createPortal(
        <Outlines 
            thickness={thickness} 
            color={color}
            screenspace={false} // Physics based thickness usually better for games
            toneMapped={false} // Needed for emission to blow out
            opacity={1}
            transparent={false}
        />,
        target
    );
}

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useInteractionContext } from "./InteractionContext";
import { useRef } from "react";

export function InteractionManager({ maxDistance = 20 }: { maxDistance?: number }) {
    const { setFocusedMeshUuid } = useInteractionContext();
    const { camera, scene } = useThree();
    const raycaster = useRef(new THREE.Raycaster());
    const pointer = useRef(new THREE.Vector2(0, 0));

    useFrame(() => {
        // Set raycaster from camera center (0, 0)
        raycaster.current.setFromCamera(pointer.current, camera);
        raycaster.current.far = maxDistance;

        // Intersect against the whole scene
        // Optimization: In a real engine, we might want to only intersect interactable layers
        const intersects = raycaster.current.intersectObjects(scene.children, true);

        // Filter out:
        // 1. Invisible objects
        // 2. The ray itself (if visualized)
        // 3. Helpers, triggers, etc. (usually interactables have userdata or specific types)
        // For now, simpler: Pick the first mesh.
        
        let foundUuid = null;

        for (const hit of intersects) {
            // Check if it's a mesh and visible
            if ((hit.object as THREE.Mesh).isMesh && hit.object.visible) {
                foundUuid = hit.object.uuid;
                break;
            }
        }

        setFocusedMeshUuid(foundUuid);
    });

    return null;
}

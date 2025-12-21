import { PlayerControllerType } from "./type"
import { useWorld } from "../../world/World/WorldContext"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useState, useMemo } from "react"
import { PointerLockControls } from "@react-three/drei"
import { useRapier } from "@react-three/rapier"
import * as THREE from "three"

/**
 * PlayerController
 * 
 * Handles First-Person control logic.
 * - Syncs Camera position to Character (eye level).
 * - Uses PointerLockControls for Camera rotation.
 * - Uses Raycasting for Ground Detection (Jump).
 */
export default function PlayerController(props : PlayerControllerType) {
    const {controllerID, view} = props
    const { getCharacter } = useWorld()
    const { camera } = useThree()
    const { rapier, world } = useRapier()
    
    // Input state
    const [moveForward, setMoveForward] = useState(false)
    const [moveBackward, setMoveBackward] = useState(false)
    const [moveLeft, setMoveLeft] = useState(false)
    const [moveRight, setMoveRight] = useState(false)
    const [jump, setJump] = useState(false)

    // Reusable vectors to avoid GC overhead
    const frontVector = useMemo(() => new THREE.Vector3(), [])
    const sideVector = useMemo(() => new THREE.Vector3(), [])
    const direction = useMemo(() => new THREE.Vector3(), [])
    const worldUp = useMemo(() => new THREE.Vector3(0, 1, 0), [])
    
    // Raycast setup
    // Determine if we need to filter interaction groups or just hit everything (solid)
    // For now, hitting anything solid is fine.

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': setMoveForward(true); break;
                case 'ArrowLeft':
                case 'KeyA': setMoveLeft(true); break;
                case 'ArrowDown':
                case 'KeyS': setMoveBackward(true); break;
                case 'ArrowRight':
                case 'KeyD': setMoveRight(true); break;
                case 'Space': setJump(true); break;
            }
        };
        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': setMoveForward(false); break;
                case 'ArrowLeft':
                case 'KeyA': setMoveLeft(false); break;
                case 'ArrowDown':
                case 'KeyS': setMoveBackward(false); break;
                case 'ArrowRight':
                case 'KeyD': setMoveRight(false); break;
                case 'Space': setJump(false); break;
            }
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useFrame((state, delta) => {
        const characterData = getCharacter(controllerID);
        if (!characterData || !characterData.ref.current) return;

        const rigidBody = characterData.ref.current;
        const charProps = characterData.props;
        
        const position = rigidBody.translation();
        const scale = charProps.scale || [1, 1, 1];
        const height = scale[1]; 

        // --- 1. Camera Sync (Eye Level Calculation) ---
        if (view === 'firstPerson') {
             const eyeOffset = height / 2 * 0.9; 
             camera.position.set(position.x, position.y + eyeOffset, position.z);
        }

        // --- 2. Movement Logic (Camera Relative) ---
        camera.getWorldDirection(frontVector);
        frontVector.y = 0;
        frontVector.normalize();

        sideVector.crossVectors(frontVector, worldUp).normalize();
        
        direction.set(0, 0, 0);
        
        const fwd = Number(moveForward) - Number(moveBackward);
        const right = Number(moveRight) - Number(moveLeft);

        direction.addScaledVector(frontVector, fwd);
        direction.addScaledVector(sideVector, right);
        direction.normalize();
        
        const speed = charProps.speed || 5.0;
        const vel = rigidBody.linvel();
        
        rigidBody.setLinvel({ 
            x: direction.x * speed, 
            y: vel.y, 
            z: direction.z * speed 
        }, true);

        // --- 3. Jump Logic (Raycast Ground Check) ---
        if (jump) {
             // Origin: Center of body
             // Direction: Down
             const rayOrigin = position;
             const rayDir = { x: 0, y: -1, z: 0 };
             // Length: Half height + margin. 
             // Margin needs to be small but enough to catch the floor contact.
             const rayLength = (height / 2) + 0.1; 
             
             // Create Ray
             const ray = new rapier.Ray(rayOrigin, rayDir);
             
             // Cast ray
             // hit will be null if nothing found within maxToi
             const hit = world.castRay(ray, rayLength, true);

             // Check if hit exists and isn't the player itself?
             // Rapier rays usually don't hit the source collider if it starts inside, 
             // but 'solid' param (3rd arg) might affect this.
             // Usually we filter out the player collider, but simplest is relying on 'internal' checks.
             // If we start at center, we are inside our own collider. 
             // If 'solid' is true, it might hit ourselves at distance 0.
             // So we should filter specific collider or ignore self.
             
             // A better approach without filtering complexity: start ray slightly below center?
             // Or check hit distance. If distance < epsilon, it's self.
             
             // However, cleaner way: RigidBody excludes itself from queries? Not automatic.
             
             // Let's assume for now the ray starts inside and ignores backfaces/internal or we can use a InteractionGroup.
             // BUT, easiest fix: Use 'world.castRay' with a filter or simple distance check?
             // Actually, if we hit ourselves, the distance is 0. Ground is at height/2.
             
             // Let's refine: Start ray at bottom + epsilon UP? No, prone to tunnelling.
             
             // Filter:
             // castRay(ray, maxToi, solid, filterFlags, filterGroups, filterExcludeCollider, filterExcludeRigidBody)
             // We can pass 'rigidBody' to exclude it!
             
             const hitFiltered = world.castRay(
                ray, 
                rayLength, 
                true, 
                undefined, 
                undefined, 
                undefined, 
                rigidBody // Exclude this rigid body
             );

             if (hitFiltered) {
                 // Grounded!
                 // Check if vertical velocity is negligible (standing on ground)
                 if (Math.abs(vel.y) < 0.5) { 
                     const targetHeight = charProps.jumpHeight || 1.0;
                     const gravity = 9.81; // Standard earth gravity approximation
                     const mass = rigidBody.mass();
                     
                     // v^2 = u^2 + 2as -> v = sqrt(2 * g * h)
                     const jumpVelocity = Math.sqrt(2 * gravity * targetHeight);
                     
                     // Impulse = Change in Momentum = m * delta_v
                     // We want to reach jumpVelocity instantly from 0 vertical velocity.
                     const impulseY = mass * jumpVelocity;

                     rigidBody.applyImpulse({ x: 0, y: impulseY, z: 0 }, true);
                 }
             }
        }
    });

    return (
        <>
            {view === 'firstPerson' && <PointerLockControls />}
        </>
    )
}

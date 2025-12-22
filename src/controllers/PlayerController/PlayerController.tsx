import { PlayerControllerType } from "./type"
import { useWorld } from "../../world/World/WorldContext"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useState, useMemo } from "react"
import { PointerLockControls } from "@react-three/drei"
import { useRapier } from "@react-three/rapier"
import * as THREE from "three"
import { applyDirectMovement } from "../../systems/MovementSystem/DirectMovement"
import { applyInertialMovement } from "../../systems/MovementSystem/InertialMovement"

/**
 * PlayerController
 * 
 * Handles First-Person control logic.
 * - Syncs Camera position to Character (eye level).
 * - Uses PointerLockControls for Camera rotation.
 * - Uses Raycasting for Ground Detection (Jump).
 */
export default function PlayerController(props : PlayerControllerType) {
    const {controllerID, view, inertia = false} = props
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
        } else if (view === 'thirdPerson') {
             // Third Person: Orbit around the character
             // Focus point: Slightly above center (e.g., head area)
             const focusY = height / 2 * 0.5; // Look at upper body/head
             const focusPoint = new THREE.Vector3(position.x, position.y + focusY, position.z);
             
             // Offset distance based on scale
             const distance = height * 3.0; // Distance behind
             
             // Calculate offset vector relative to camera rotation
             // We want the camera to be 'distance' away, 'behind' the rotation direction.
             // Since PointerLockControls rotates the camera to look FORWARD,
             // we place the camera BACKWARD relative to that rotation.
             const offset = new THREE.Vector3(0, 0, distance);
             offset.applyQuaternion(camera.quaternion);
             
             camera.position.copy(focusPoint).add(offset);
        }

        // --- 2. Movement Logic (Camera Relative) ---
        camera.getWorldDirection(frontVector);
        frontVector.y = 0;
        frontVector.normalize();

        // Rotate Character to face camera direction
        const angle = Math.atan2(frontVector.x, frontVector.z);
        const rotationQuat = new THREE.Quaternion().setFromAxisAngle(worldUp, angle);
        rigidBody.setRotation(rotationQuat, true);

        sideVector.crossVectors(frontVector, worldUp).normalize();
        
        direction.set(0, 0, 0);
        
        const fwd = Number(moveForward) - Number(moveBackward);
        const right = Number(moveRight) - Number(moveLeft);

        direction.addScaledVector(frontVector, fwd);
        direction.addScaledVector(sideVector, right);
        direction.normalize();
        
        const speed = charProps.speed || 5.0;
        const vel = rigidBody.linvel();
        
        if (inertia) {
            applyInertialMovement(rigidBody, direction, speed, delta);
        } else {
            applyDirectMovement(rigidBody, direction, speed);
        }

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
            {(view === 'firstPerson' || view === 'thirdPerson') && <PointerLockControls />}
        </>
    )
}

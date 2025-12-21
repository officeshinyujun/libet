import { PlayerControllerType } from "./type"
import { useWorld } from "../../world/World/WorldContext"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useState, useMemo } from "react"
import { PointerLockControls } from "@react-three/drei"
import * as THREE from "three"

/**
 * PlayerController
 * 
 * Handles First-Person control logic.
 * - Syncs Camera position to Character (eye level).
 * - Uses PointerLockControls for Camera rotation.
 * - Calculates movement relative to Camera view direction.
 */
export default function PlayerController(props : PlayerControllerType) {
    const {controllerID, view} = props
    const { getCharacter } = useWorld()
    const { camera } = useThree()
    
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
        
        // --- 1. Camera Sync (Eye Level Calculation) ---
        // Calculate eye height based on character scale (collider height).
        // Assuming box/capsule is centered, height is scale.y.
        // Eye level is usually near the top (e.g., 90% of half-height from center).
        if (view === 'firstPerson') {
             const scale = charProps.scale || [1, 1, 1];
             const height = scale[1]; 
             // Position is center. Top is +height/2. Eye level slightly below top.
             const eyeOffset = height / 2 * 0.9; 

             // Directly copy position to avoid jitter from interpolation lag 
             // relative to the physics update, assuming this runs after physics.
             camera.position.set(position.x, position.y + eyeOffset, position.z);
        }

        // --- 2. Movement Logic (Camera Relative) ---
        // Get camera forward direction
        camera.getWorldDirection(frontVector);
        
        // Flatten to horizontal plane (XZ) to prevent flying/digging
        frontVector.y = 0;
        frontVector.normalize();

        // Calculate Right vector (Cross product of Up and Forward)
        sideVector.crossVectors(frontVector, worldUp).normalize();
        
        // Reset direction
        direction.set(0, 0, 0);

        // Apply Inputs: 
        // Forward/Back moves along frontVector
        // Left/Right moves along sideVector
        // Note: 'sideVector' from cross(front, up) points Left (in Three.js RHR? No, Right usually). 
        // Let's verify: Cross(Forward, Up). If Forward is -Z, Up is +Y -> Cross is -X (Right).
        // So +1 on sideVector should be Right.
        
        const fwd = Number(moveForward) - Number(moveBackward);
        const right = Number(moveRight) - Number(moveLeft);

        direction.addScaledVector(frontVector, fwd);
        direction.addScaledVector(sideVector, right);
        direction.normalize();
        
        const speed = charProps.speed || 5.0;
        const vel = rigidBody.linvel();
        
        // Apply velocity
        // Keep vertical velocity (gravity) untouched unless jumping
        rigidBody.setLinvel({ 
            x: direction.x * speed, 
            y: vel.y, 
            z: direction.z * speed 
        }, true);

        // --- 3. Jump Logic ---
        if (jump) {
             // Simple ground check approximation (vertical velocity ~ 0)
             if (Math.abs(vel.y) < 0.1) {
                 const jumpHeight = charProps.jumpHeight || 5.0;
                 rigidBody.applyImpulse({ x: 0, y: jumpHeight, z: 0 }, true);
             }
        }
    });

    return (
        <>
            {view === 'firstPerson' && <PointerLockControls />}
        </>
    )
}

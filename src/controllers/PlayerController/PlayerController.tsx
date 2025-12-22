import { PlayerControllerType } from "./type"
import { useWorld } from "../../world/World/WorldContext"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useState, useMemo } from "react"
import { PointerLockControls } from "@react-three/drei"
import { useRapier, useBeforePhysicsStep } from "@react-three/rapier"
import * as THREE from "three"
import { applyDirectMovement } from "../../systems/MovementSystem/DirectMovement"
import { applyInertialMovement } from "../../systems/MovementSystem/InertialMovement"
import { useRef } from "react"

/**
 * PlayerController
 * 
 * Handles First-Person control logic.
 * - Syncs Camera position to Character (eye level).
 * - Uses PointerLockControls for Camera rotation.
 * - Uses Raycasting for Ground Detection (Jump).
 */
export default function PlayerController(props : PlayerControllerType) {
    const {
        controllerID, 
        view, 
        inertia = false,
        crouch = false,
        crouchKey = "ControlLeft",
        crouchDepth = 0.5
    } = props

    const { getCharacter } = useWorld()
    const { camera } = useThree()
    const { rapier, world } = useRapier()
    
    // Input state refs
    const moveForward = useRef(false)
    const moveBackward = useRef(false)
    const moveLeft = useRef(false)
    const moveRight = useRef(false)
    const jump = useRef(false)
    const isCrouching = useRef(false)

    // Reusable vectors to avoid GC overhead
    const frontVector = useMemo(() => new THREE.Vector3(), [])
    const sideVector = useMemo(() => new THREE.Vector3(), [])
    const direction = useMemo(() => new THREE.Vector3(), [])
    const worldUp = useMemo(() => new THREE.Vector3(0, 1, 0), [])
    
    // Current camera height offset for smooth transition
    const currentHeightOffset = useRef(0);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.code === crouchKey && crouch) {
                isCrouching.current = true;
            }
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': moveForward.current = true; break;
                case 'ArrowLeft':
                case 'KeyA': moveLeft.current = true; break;
                case 'ArrowDown':
                case 'KeyS': moveBackward.current = true; break;
                case 'ArrowRight':
                case 'KeyD': moveRight.current = true; break;
                case 'Space': jump.current = true; break;
            }
        };
        const onKeyUp = (event: KeyboardEvent) => {
            if (event.code === crouchKey && crouch) {
                isCrouching.current = false;
            }
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': moveForward.current = false; break;
                case 'ArrowLeft':
                case 'KeyA': moveLeft.current = false; break;
                case 'ArrowDown':
                case 'KeyS': moveBackward.current = false; break;
                case 'ArrowRight':
                case 'KeyD': moveRight.current = false; break;
                case 'Space': jump.current = false; break;
            }
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, [crouch, crouchKey]);

    // --- Physics Update Loop (Fixed Step) ---
    useBeforePhysicsStep((world) => {
        const characterData = getCharacter(controllerID);
        if (!characterData || !characterData.ref.current) return;

        const rigidBody = characterData.ref.current;
        const charProps = characterData.props;
        const speed = charProps.speed || 5.0;
        const height = (charProps.scale?.[1] || 1);

        // --- 1. Movement Logic ---
        // Calculate direction based on camera and input
        camera.getWorldDirection(frontVector);
        frontVector.y = 0;
        frontVector.normalize();

        // Rotate Character to face camera direction
        const angle = Math.atan2(frontVector.x, frontVector.z);
        const rotationQuat = new THREE.Quaternion().setFromAxisAngle(worldUp, angle);
        rigidBody.setRotation(rotationQuat, true);

        sideVector.crossVectors(frontVector, worldUp).normalize();
        
        direction.set(0, 0, 0);
        
        const fwd = Number(moveForward.current) - Number(moveBackward.current);
        const right = Number(moveRight.current) - Number(moveLeft.current);

        direction.addScaledVector(frontVector, fwd);
        direction.addScaledVector(sideVector, right);
        direction.normalize();
        
        // Use fixed delta for physics calculations
        const fixedDelta = 1 / 60; 

        if (inertia) {
            applyInertialMovement(rigidBody, direction, speed, fixedDelta);
        } else {
            applyDirectMovement(rigidBody, direction, speed);
        }

        // --- 2. Jump Logic ---
        if (jump.current) {
             const position = rigidBody.translation();
             const vel = rigidBody.linvel();
             const rayOrigin = position;
             const rayDir = { x: 0, y: -1, z: 0 };
             const rayLength = (height / 2) + 0.1; 
             
             const ray = new rapier.Ray(rayOrigin, rayDir);
             
             const hitFiltered = world.castRay(
                ray, 
                rayLength, 
                true, 
                undefined, 
                undefined, 
                undefined, 
                rigidBody
             );

             if (hitFiltered) {
                 if (Math.abs(vel.y) < 0.5) { 
                     const targetHeight = charProps.jumpHeight || 1.0;
                     const gravity = 9.81;
                     const mass = rigidBody.mass();
                     const jumpVelocity = Math.sqrt(2 * gravity * targetHeight);
                     const impulseY = mass * jumpVelocity;

                     rigidBody.applyImpulse({ x: 0, y: impulseY, z: 0 }, true);
                 }
             }
        }
    });

    // --- Render Update Loop (Frame Rate) ---
    useFrame((state, delta) => {
        const characterData = getCharacter(controllerID);
        if (!characterData || !characterData.ref.current) return;

        const rigidBody = characterData.ref.current;
        const charProps = characterData.props;
        
        // Use lerp for smooth visual updates of the camera
        // Note: We read the RB position here. If RB is updated in fixed step,
        // this might still be "stepped" unless we interpolate.
        // But the camera lerp below helps smooth out the steps.
        const position = rigidBody.translation();
        const height = (charProps.scale?.[1] || 1); 

        // --- Crouch Logic (Visual) ---
        const standingEyeHeight = height / 2 * 0.9;
        const crouchingEyeHeight = standingEyeHeight * crouchDepth;
        const targetEyeHeight = isCrouching.current ? crouchingEyeHeight : standingEyeHeight;

        if (currentHeightOffset.current === 0) currentHeightOffset.current = standingEyeHeight;
        currentHeightOffset.current = THREE.MathUtils.lerp(currentHeightOffset.current, targetEyeHeight, 10 * delta);

        // --- Camera Sync ---
        const targetCameraPos = new THREE.Vector3(position.x, position.y + currentHeightOffset.current, position.z);

        if (view === 'firstPerson') {
             camera.position.lerp(targetCameraPos, 0.5);
        } else if (view === 'thirdPerson') {
             const focusY = currentHeightOffset.current * 0.8;
             const focusPoint = new THREE.Vector3(position.x, position.y + focusY, position.z);
             const distance = height * 3.0;
             const offset = new THREE.Vector3(0, 0, distance);
             offset.applyQuaternion(camera.quaternion);
             
             const targetThirdPersonPos = focusPoint.clone().add(offset);
             camera.position.lerp(targetThirdPersonPos, 0.5);
        }
    });

    return (
        <>
            {(view === 'firstPerson' || view === 'thirdPerson') && <PointerLockControls />}
        </>
    )
}


import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

export const applyInertialMovement = (
    rigidBody: RapierRigidBody,
    direction: THREE.Vector3,
    speed: number,
    delta: number,
    acceleration: number = 10,
    deceleration: number = 10
) => {
    const vel = rigidBody.linvel();
    const currentVel = new THREE.Vector3(vel.x, 0, vel.z);
    const targetVel = direction.clone().multiplyScalar(speed);

    // If no input, decelerate
    if (direction.lengthSq() < 0.01) {
        currentVel.lerp(targetVel, deceleration * delta);
    } else {
        // Accelerate
        currentVel.lerp(targetVel, acceleration * delta);
    }

    rigidBody.setLinvel({
        x: currentVel.x,
        y: vel.y,
        z: currentVel.z
    }, true);
};

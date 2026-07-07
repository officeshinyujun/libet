
import { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

export const applyDirectMovement = (
    rigidBody: RapierRigidBody,
    direction: THREE.Vector3,
    speed: number
) => {
    const vel = rigidBody.linvel();
    rigidBody.setLinvel({
        x: direction.x * speed,
        y: vel.y,
        z: direction.z * speed
    }, true);
};

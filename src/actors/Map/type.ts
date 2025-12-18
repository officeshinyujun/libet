import { BaseActorType } from "../BaseActor/type";
import * as THREE from "three";

export type MapType = BaseActorType & {
    modelpath : THREE.Group | THREE.Mesh | THREE.Object3D;
    userView ?: string;
    physics?: "fixed" | "none";
}
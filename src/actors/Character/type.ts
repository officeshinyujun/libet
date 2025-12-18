import { BaseActorType } from "../BaseActor/type";
import * as THREE from "three";

export type CharacterType = BaseActorType & {
    modelpath?: THREE.Group | THREE.Mesh | THREE.Object3D;
    controllerID : string;
    speed : number;
    jumpHeight : number;
}
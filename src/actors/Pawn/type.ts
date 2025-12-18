import {BaseActorType} from "../BaseActor/type"
import * as THREE from "three"

export type PawnType = BaseActorType & {
    modelpath: THREE.Group | THREE.Mesh | THREE.Object3D;
}
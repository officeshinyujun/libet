import { PawnType } from "./type";

export default function Pawn(props : PawnType) {
    const {name, modelpath, scale, rotation, position} = props
    return (
        <group>
            <primitive 
            object={modelpath} 
            name={name} 
            scale={scale} 
            rotation={rotation} 
            position={position}
            />
        </group>
    )
}
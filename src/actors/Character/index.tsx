import {CharacterType} from "./type"

export default function Character(props : CharacterType) {
    const {id, tags, scale, rotation, position, modelpath, controllerID, speed, jumpHeight} = props
    return (
        <group>
            {modelpath ? 
            (<primitive 
                object={modelpath} 
                id={id}
                scale={scale}
                rotation={rotation}
                position={position}
            />) 
            : (
                <mesh
                    id={id}
                    scale={scale}
                    rotation={rotation}
                    position={position}
                >
                    <boxGeometry />
                    <meshStandardMaterial />
                </mesh>
            )}
        </group>
    )
}
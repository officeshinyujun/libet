import {CharacterType} from "./type"

export default function Character(props : CharacterType) {
    const {name, tags, scale, rotation, position, modelpath, controllerID, speed, jumpHeight} = props
    return (
        <group>
            {modelpath ? 
            (<primitive 
                object={modelpath} 
                name={name}
                scale={scale}
                rotation={rotation}
                position={position}
            />) 
            : (
                <mesh
                    name={name}
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
import { PointerType } from "./type"

export default function Pointer(props: PointerType){
    const {image, size} = props
    return (
        <div style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none'}}>
            {image && <img src={image} width={size[0]} height={size[1]} alt="pointer" />}
            <svg xmlns="http://www.w3.org/2000/svg" width={size[0]} height={size[1]} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </div>
    )
}
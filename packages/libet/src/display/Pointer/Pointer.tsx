import { useEffect, useRef } from "react"
import { type PointerType } from "./type"

export default function Pointer({ image, size }: PointerType) {
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = document.createElement("div")
    el.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:99999;line-height:0;"
    elRef.current = el

    if (image) {
      const img = document.createElement("img")
      img.src = image
      img.width = size[0]
      img.height = size[1]
      img.style.display = "block"
      el.appendChild(img)
    } else {
      const svgNS = "http://www.w3.org/2000/svg"
      const svg = document.createElementNS(svgNS, "svg")
      svg.setAttribute("width", String(size[0]))
      svg.setAttribute("height", String(size[1]))
      svg.setAttribute("viewBox", "0 0 24 24")
      svg.setAttribute("fill", "none")
      svg.setAttribute("stroke", "#fff")
      svg.setAttribute("stroke-width", "2")
      svg.style.display = "block"

      const p1 = document.createElementNS(svgNS, "path")
      p1.setAttribute("d", "M5 12h14")
      const p2 = document.createElementNS(svgNS, "path")
      p2.setAttribute("d", "M12 5v14")

      svg.appendChild(p1)
      svg.appendChild(p2)
      el.appendChild(svg)
    }

    document.body.appendChild(el)
    return () => { el.remove() }
  }, [image, size[0], size[1]])

  return null
}

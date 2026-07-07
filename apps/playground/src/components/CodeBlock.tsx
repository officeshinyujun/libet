import { useRef, useState, useCallback } from "react"

export function CodeBlock({ code, lang = "tsx" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [code])

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute", top: 8, right: 8,
          background: "rgba(255,255,255,.08)", border: "1px solid var(--c-border)",
          color: "var(--c-text-dim)", padding: "4px 10px", borderRadius: 4,
          cursor: "pointer", fontSize: 11,
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre><code className={`language-${lang}`}>{code}</code></pre>
    </div>
  )
}

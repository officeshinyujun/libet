# Pointer

A crosshair overlay rendered as an absolutely-positioned HTML element on top of the Canvas. Useful for first-person games.

```tsx
import { Pointer } from "@web-game/libet"

// Default crosshair (+ icon)
<Pointer size={[24, 24]} />

// Custom image
<Pointer image="/crosshairs/scope.png" size={[48, 48]} />

// SVG + image hybrid (default SVG fallback if image missing)
<Pointer image="/custom.svg" size={[32, 32]} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | — | Custom crosshair image URL |
| `size` | `[number, number]` | — | Width and height in pixels |

## Default Style

- Position: `fixed` at center of screen (`left: 50%, top: 50%`)
- Default SVG: Plus icon (`lucide-plus`) rendered in white
- `pointer-events: none` — does not block mouse interaction with Canvas

## Notes

- Rendered outside R3F Canvas in DOM overlay
- If `image` is provided, the SVG fallback is also rendered behind it
- Always visible — no toggle prop

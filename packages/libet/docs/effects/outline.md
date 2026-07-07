# OutlineComponent

Adds a highlight outline to a mesh or model. Built on `@react-three/drei` `<Outlines>` with portal rendering for correct depth.

```tsx
import { OutlineComponent, StaticMesh } from "@web-game/libet"

// Always visible outline
<StaticMesh name="chest">
  <OutlineComponent color="gold" thickness={0.05} trigger="always" />
</StaticMesh>

// Hover-only outline (requires InteractionProvider)
<StaticMesh name="door">
  <OutlineComponent color="#00ff88" thickness={0.03} trigger="hover" />
</StaticMesh>

// Click toggle outline
<StaticMesh name="lamp">
  <OutlineComponent color="red" trigger="click" />
</StaticMesh>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `'white'` | Outline color |
| `thickness` | `number` | `0.05` | Outline width (world units) |
| `emission` | `number` | `1` | Emission intensity multiplier |
| `visible` | `boolean` | `true` | Master visibility toggle |
| `trigger` | `'always' \| 'hover' \| 'click'` | `'always'` | When to show the outline |

## Trigger Modes

| Mode | Behavior | Requires InteractionProvider? |
|------|----------|------------------------------|
| `'always'` | Outline is visible when `visible=true` | No |
| `'hover'` | Outline visible when player looks at the mesh | Yes |
| `'click'` | Toggles outline on/off when player clicks while looking at mesh | Yes |

## How It Works

1. `useLayoutEffect` traverses the parent hierarchy to find all `THREE.Mesh` children
2. For each mesh, a `<PortalOutline>` is created using R3F `createPortal`
3. The portal injects `<Outlines>` as a child of the target mesh, so the outline renders at the correct depth
4. When `trigger="hover"` or `"click"`, reads `focusedMeshUuid` from `InteractionContext`

## Notes

- Without `InteractionProvider`, `hover` and `click` modes silently fail (no outline shown)
- `Outlines` uses `toneMapped={false}` for unclamped emission
- Works with GLTF models — automatically finds all meshes in the group
- Multiple `OutlineComponent`s in the same scene each create their own portal

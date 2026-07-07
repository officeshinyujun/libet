# Action

A logic-only component that binds a keyboard key or mouse button to a callback function. Must be a child of `Character`.

```tsx
import { Action, Character } from "@web-game/libet"

<Character name="player">
  <Action
    inputKey="KeyE"
    action={(character) => console.log("Interact!", character.name)}
  />
  <Action
    mouseButton={0}
    action={(character) => console.log("Left clicked on", character.name)}
  />
</Character>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `inputKey` | `string` | Keyboard event code (e.g., `'KeyE'`, `'Space'`, `'Digit1'`) |
| `mouseButton` | `0 \| 1 \| 2` | Mouse button: 0=left, 1=middle, 2=right |
| `action` | `(character: ReturnType<typeof useCharacter>) => void` | Callback executed on trigger |

At least one of `inputKey` or `mouseButton` must be provided.

## Callback

The `action` callback receives the character context:

```tsx
<Action
  inputKey="KeyF"
  action={({ name, rigidBody, props }) => {
    console.log(`Character "${name}" triggered action`)
    // Access props, apply forces, etc.
  }}
/>
```

## Notes

- Renders `null` — no visual output
- Re-renders when `inputKey`, `mouseButton`, or `action` reference changes
- Mouse button actions work while pointer is locked (FPS mode)

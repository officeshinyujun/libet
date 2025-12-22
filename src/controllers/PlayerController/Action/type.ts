import { useCharacter } from "../../../actors/Character/Character";

export interface ActionProps {
    /** The keyboard key to trigger this action (e.g., "KeyE", "Space", "Digit1") */
    inputKey?: string;
    /** The mouse button to trigger this action (0: Left, 1: Middle, 2: Right) */
    mouseButton?: 0 | 1 | 2;
    /** The function to execute when the input is triggered */
    action: (character: ReturnType<typeof useCharacter>) => void;
}

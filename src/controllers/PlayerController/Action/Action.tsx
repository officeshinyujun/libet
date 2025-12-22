import { useEffect } from "react";
import { useCharacter } from "../../../actors/Character/Character";
import { ActionProps } from "./type";

/**
 * Action Component
 * 
 * Must be a child of a Character component.
 * Listens for a specific key press or mouse click and executes the provided action.
 */
export default function Action({ inputKey, mouseButton, action }: ActionProps) {
    const character = useCharacter();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (inputKey && event.code === inputKey) {
                action(character);
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (mouseButton !== undefined && event.button === mouseButton) {
                action(character);
            }
        };

        if (inputKey) window.addEventListener("keydown", handleKeyDown);
        if (mouseButton !== undefined) window.addEventListener("mousedown", handleMouseDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleMouseDown);
        };
    }, [inputKey, mouseButton, action, character]);

    return null; // This is a logic-only component
}

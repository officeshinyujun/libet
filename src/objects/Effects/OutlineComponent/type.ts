export interface OutlineComponentType {
    /**
     * The color of the outline.
     * @default "white"
     */
    color?: string;
    /**
     * The thickness of the outline.
     * @default 0.1
     */
    thickness?: number;
    /**
     * The emission intensity of the outline.
     * @default 1
     */
    emission?: number;
    /**
     * Whether the outline is active.
     * @default true
     */
    visible?: boolean;
    /**
     * When the outline should be displayed.
     * "always": Always visible (if visible prop is true).
     * "hover": Visible only when the player looks at the object.
     * "click": Toggles visibility when the player looks at the object and clicks.
     * @default "always"
     */
    trigger?: "always" | "hover" | "click";
}

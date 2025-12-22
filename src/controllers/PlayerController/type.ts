export type PlayerControllerType = {
    controllerID: string
    view : 'firstPerson' | 'thirdPerson'
    inertia?: boolean
    /** Enable crouching mechanism */
    crouch?: boolean
    /** Key code to trigger crouch (default: 'KeyC' or 'ControlLeft') */
    crouchKey?: string
    /** Ratio of height to reduce when crouching (0.0 to 1.0, default: 0.5) */
    crouchDepth?: number
}
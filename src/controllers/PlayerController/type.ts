export type PlayerControllerType = {
    controllerID: string
    view : 'firstPerson' | 'thirdPerson'
    inertia?: boolean
}
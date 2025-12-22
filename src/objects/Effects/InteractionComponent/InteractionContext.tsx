import { createContext, useContext, useState, ReactNode } from "react";

interface InteractionContextValue {
    focusedMeshUuid: string | null;
    setFocusedMeshUuid: (uuid: string | null) => void;
}

const InteractionContext = createContext<InteractionContextValue | null>(null);

export const useInteractionContext = () => {
    const context = useContext(InteractionContext);
    if (!context) {
        throw new Error("useInteractionContext must be used within an InteractionProvider");
    }
    return context;
};

export const InteractionProvider = ({ children }: { children: ReactNode }) => {
    const [focusedMeshUuid, setFocusedMeshUuid] = useState<string | null>(null);

    return (
        <InteractionContext.Provider value={{ focusedMeshUuid, setFocusedMeshUuid }}>
            {children}
        </InteractionContext.Provider>
    );
};

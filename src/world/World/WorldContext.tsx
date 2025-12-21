import { createContext, useContext, useRef, useCallback } from 'react';
import { RapierRigidBody } from '@react-three/rapier';
import { RefObject } from 'react';

type CharacterData = {
    ref: RefObject<RapierRigidBody | null>;
    props: any;
};

type WorldContextType = {
  registerCharacter: (id: string, ref: RefObject<RapierRigidBody | null>, props: any) => void;
  unregisterCharacter: (id: string) => void;
  getCharacter: (id: string) => CharacterData | undefined;
}

export const WorldContext = createContext<WorldContextType | null>(null);

export const useWorld = () => {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error("useWorld must be used within a World component");
  }
  return context;
}

export const WorldProvider = ({ children }: { children: React.ReactNode }) => {
    const characters = useRef<Map<string, CharacterData>>(new Map());

    const registerCharacter = useCallback((id: string, ref: RefObject<RapierRigidBody | null>, props: any) => {
        characters.current.set(id, { ref, props });
    }, []);

    const unregisterCharacter = useCallback((id: string) => {
        characters.current.delete(id);
    }, []);

    const getCharacter = useCallback((id: string) => {
        return characters.current.get(id);
    }, []);

    return (
        <WorldContext.Provider value={{ registerCharacter, unregisterCharacter, getCharacter }}>
            {children}
        </WorldContext.Provider>
    );
};

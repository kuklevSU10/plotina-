"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type InteractionType = 'idle' | 'tracking' | 'hovering' | 'explaining' | 'error' | 'success' | 'happy';

export interface EveInteraction {
    type: InteractionType;
    targetRef?: React.RefObject<HTMLElement | null>;
    customPosition?: { x: number; y: number };
    thoughtText?: string;
    isVisible?: boolean;
}

interface EveContextType {
    state: EveInteraction;
    setInteraction: (interaction: Partial<EveInteraction>) => void;
    clearInteraction: () => void;
    mousePosition: { x: number; y: number };
    setMousePosition: (pos: { x: number; y: number }) => void;
    isMobile: boolean;
}

const EveContext = createContext<EveContextType | undefined>(undefined);

export function EveProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<EveInteraction>({ type: 'idle', isVisible: true });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    // simple check to disable intensive mouse tracking on mobile if needed
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const setInteraction = useCallback((interaction: Partial<EveInteraction>) => {
        setState(prev => ({ ...prev, ...interaction, type: interaction.type || prev.type }));
    }, []);

    const clearInteraction = useCallback(() => {
        setState({ type: 'idle', isVisible: true });
    }, []);

    return (
        <EveContext.Provider value={{ state, setInteraction, clearInteraction, mousePosition, setMousePosition, isMobile }}>
            {children}
        </EveContext.Provider>
    );
}

export function useEve() {
    const context = useContext(EveContext);
    if (context === undefined) {
        throw new Error('useEve must be used within an EveProvider');
    }
    return context;
}

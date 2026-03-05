"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type InteractionType = 'idle' | 'tracking' | 'hovering' | 'explaining' | 'error' | 'success' | 'happy' | 'clicking';

export interface EveInteraction {
    type: InteractionType;
    targetRef?: React.RefObject<HTMLElement | null>;
    customPosition?: { x: number; y: number };
    thoughtText?: string;
    isVisible?: boolean;
    isGeneric?: boolean; // flag to allow explicit interactions to override generic ones
}

interface EveContextType {
    state: EveInteraction;
    setInteraction: (interaction: Partial<EveInteraction>) => void;
    clearInteraction: (force?: boolean) => void;
    mousePosition: { x: number; y: number };
    setMousePosition: (pos: { x: number; y: number }) => void;
    isMobile: boolean;
    isClicked: boolean; // Tracking global mousedown
}

const EveContext = createContext<EveContextType | undefined>(undefined);

export function EveProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<EveInteraction>({ type: 'idle', isVisible: true });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // simple check to disable intensive mouse tracking on mobile if needed
    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const setInteraction = useCallback((interaction: Partial<EveInteraction>) => {
        setState(prev => {
            // Prevent generic interactions from overriding explicit ones currently active
            if (interaction.isGeneric && !prev.isGeneric && prev.type !== 'idle') {
                return prev;
            }
            return { ...prev, ...interaction, type: interaction.type || prev.type };
        });
    }, []);

    const clearInteraction = useCallback((force: boolean = false) => {
        setState(prev => {
            if (!force && !prev.isGeneric && prev.type !== 'idle') {
                return prev; // don't clear explicit interactions unless forced or explicitly clear
            }
            return { type: 'idle', isVisible: true, isGeneric: true };
        });
    }, []);

    // Global listeners for Smart Hover and Clicks
    React.useEffect(() => {
        if (isMobile) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactiveEl = target.closest('button, a, [role="button"], pre') as HTMLElement;

            if (interactiveEl) {
                if (interactiveEl.hasAttribute('data-eve-ignore')) return;

                let text = "";
                let mood: InteractionType = "hovering";

                if (interactiveEl.tagName === 'PRE') {
                    text = "Analyzing this architecture code...";
                    mood = "explaining";
                } else if (interactiveEl.textContent) {
                    const snippet = interactiveEl.textContent.trim().slice(0, 20);
                    text = `Looking at "${snippet}..."`;
                    if (snippet.toLowerCase().includes('pro')) {
                        mood = 'happy';
                        text = "Oh, the Pro tier! Excellent choice.";
                    }
                }

                // We mutate state using generic flag
                setInteraction({
                    type: mood,
                    thoughtText: text,
                    isGeneric: true,
                    // We can't easily pass a real ref, so we let EVE just float near cursor for generic hovers
                    // By not providing targetRef, she follows cursor or uses custom tracking in EveCompanion
                });
            } else {
                clearInteraction();
            }
        };

        const handleMouseDown = () => setIsClicked(true);
        const handleMouseUp = () => setIsClicked(false);

        document.body.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.body.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isMobile, setInteraction, clearInteraction]);

    return (
        <EveContext.Provider value={{ state, setInteraction, clearInteraction, mousePosition, setMousePosition, isMobile, isClicked }}>
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

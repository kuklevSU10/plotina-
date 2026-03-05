"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { useEve } from "@/contexts/EveContext";

export function EveCompanion() {
    const { state, mousePosition, isMobile } = useEve();
    const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // EVE Physics - Smooth following
    const springConfig = { damping: 20, stiffness: 100, mass: 1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        // Initialize position to center of screen safely on client mount
        if (typeof window !== "undefined") {
            x.set(window.innerWidth / 2);
            y.set(window.innerHeight / 2);
        }
    }, [x, y]);

    useEffect(() => {
        if (isMobile || !state.isVisible) return;

        let targetX = mousePosition.x;
        let targetY = mousePosition.y;

        // Determine where EVE should fly based on interaction type
        switch (state.type) {
            case 'tracking':
            case 'idle':
                // Follow cursor loosely, with an offset so she doesn't block the click
                targetX = mousePosition.x + 40;
                targetY = mousePosition.y - 40;
                break;
            case 'hovering':
            case 'explaining':
            case 'error':
            case 'happy':
            case 'success':
                // Fly to a specific target if provided, otherwise follow cursor
                if (state.targetRef && state.targetRef.current) {
                    const rect = state.targetRef.current.getBoundingClientRect();
                    // Position right next to the element
                    targetX = rect.right + 20;
                    targetY = rect.top + (rect.height / 2);
                } else if (state.customPosition) {
                    targetX = state.customPosition.x;
                    targetY = state.customPosition.y;
                }
                break;
        }

        // Keep EVE on screen
        const padding = 60;
        targetX = Math.max(padding, Math.min(window.innerWidth - padding, targetX));
        targetY = Math.max(padding, Math.min(window.innerHeight - padding, targetY));

        setTargetPos({ x: targetX, y: targetY });
        x.set(targetX);
        y.set(targetY);

    }, [mousePosition, state, isMobile, x, y]);

    // Calculate EVE's mood/look based on state
    const getMoodColor = () => {
        switch (state.type) {
            case 'error': return "#ef4444"; // red
            case 'success': return "#10b981"; // green
            case 'happy': return "#3b82f6"; // bright blue
            default: return "#60a5fa"; // gentle blue
        }
    };

    if (isMobile) return null;

    return (
        <motion.div
            ref={containerRef}
            className="fixed top-0 left-0 pointer-events-none z-[90]"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: state.isVisible ? 1 : 0, scale: state.isVisible ? 1 : 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* EVE's Body (Floating animation independent of position) */}
            <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
            >
                {/* Thought Bubble */}
                <AnimatePresence>
                    {state.thoughtText && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 20, y: 10 }}
                            animate={{ opacity: 1, scale: 1, x: 20, y: -20 }}
                            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                            className="absolute top-0 right-0 translate-x-full min-w-[200px] max-w-[280px] bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm p-3 rounded-2xl rounded-bl-sm shadow-xl"
                        >
                            {state.thoughtText}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SVG Character */}
                <svg width="60" height="70" viewBox="0 0 60 70" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {/* Head */}
                    <motion.ellipse
                        cx="30" cy="20" rx="22" ry="16"
                        fill="#f8fafc"
                        animate={state.type === 'happy' ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5 }}
                    />

                    {/* Body */}
                    <motion.path
                        d="M 15 38 C 15 55, 20 65, 30 65 C 40 65, 45 55, 45 38 C 45 30, 40 28, 30 28 C 20 28, 15 30, 15 38 Z"
                        fill="#f8fafc"
                    />

                    {/* Face Plate */}
                    <ellipse cx="30" cy="20" rx="16" ry="10" fill="#0f172a" />

                    {/* Eyes - Left */}
                    <motion.ellipse
                        cx="24" cy="20" rx="4" ry="2"
                        fill={getMoodColor()}
                        animate={{
                            ry: state.type === 'happy' ? [2, 1, 2] : 2,
                            scaleY: state.type === 'idle' ? [1, 0.1, 1] : 1 // blinking
                        }}
                        transition={
                            state.type === 'idle'
                                ? { duration: 4, repeat: Infinity, repeatDelay: 2 }
                                : { duration: 0.5 }
                        }
                        style={{ filter: `drop-shadow(0 0 4px ${getMoodColor()})` }}
                    />

                    {/* Eyes - Right */}
                    <motion.ellipse
                        cx="36" cy="20" rx="4" ry="2"
                        fill={getMoodColor()}
                        animate={{
                            ry: state.type === 'happy' ? [2, 1, 2] : 2,
                            scaleY: state.type === 'idle' ? [1, 0.1, 1] : 1
                        }}
                        transition={
                            state.type === 'idle'
                                ? { duration: 4, repeat: Infinity, repeatDelay: 2 }
                                : { duration: 0.5 }
                        }
                        style={{ filter: `drop-shadow(0 0 4px ${getMoodColor()})` }}
                    />

                    {/* Scanning Beam (Active during analysis) */}
                    <AnimatePresence>
                        {state.type === 'explaining' && (
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                exit={{ opacity: 0 }}
                                d="M 30 25 L 10 70 L 50 70 Z"
                                fill="url(#scanGradient)"
                            />
                        )}
                    </AnimatePresence>

                    <defs>
                        <linearGradient id="scanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={getMoodColor()} stopOpacity="0.8" />
                            <stop offset="100%" stopColor={getMoodColor()} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>
        </motion.div>
    );
}

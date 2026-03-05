"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence, useTransform } from "framer-motion";
import { useEve } from "@/contexts/EveContext";

export function EveCompanion() {
    const { state, mousePosition, isMobile, isClicked } = useEve();
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

    // EVE Physics
    const eveSpringConfig = { damping: 20, stiffness: 80, mass: 1 };
    const eveX = useSpring(0, eveSpringConfig);
    const eveY = useSpring(0, eveSpringConfig);

    // Cursor Physics
    const cursorSpringConfig = { damping: 30, stiffness: 300, mass: 0.5 };
    const cursorX = useSpring(-100, cursorSpringConfig);
    const cursorY = useSpring(-100, cursorSpringConfig);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
            eveX.set(window.innerWidth - 80); // bottom right corner
            eveY.set(window.innerHeight - 80);

            const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [eveX, eveY]);

    useEffect(() => {
        if (isMobile) return;

        // Update cursor
        cursorX.set(mousePosition.x);
        cursorY.set(mousePosition.y);

        // Update EVE target
        let tX = windowSize.w - 100; // Default idle position
        let tY = windowSize.h - 100;

        if (state.type !== 'idle') {
            if (state.targetRef && state.targetRef.current) {
                const rect = state.targetRef.current.getBoundingClientRect();
                // Position further away, e.g., above and to the right
                tX = rect.right + 60;
                tY = rect.top - 60;
            } else if (state.customPosition) {
                tX = state.customPosition.x;
                tY = state.customPosition.y;
            } else if (state.isGeneric) {
                // If generic hover but no specific bounds, float near the cursor but keep distance
                tX = mousePosition.x + 120;
                tY = mousePosition.y - 120;
            }
        }

        // Keep EVE strictly on screen
        const padding = 80;
        tX = Math.max(padding, Math.min(windowSize.w - padding, tX));
        tY = Math.max(padding, Math.min(windowSize.h - padding, tY));

        eveX.set(tX);
        eveY.set(tY);
    }, [mousePosition, state, isMobile, cursorX, cursorY, eveX, eveY, windowSize]);

    const getMoodColor = () => {
        switch (state.type) {
            case 'error': return "#ef4444"; // red
            case 'success': return "#10b981"; // green
            case 'happy': return "#a855f7"; // purple/cute
            default: return "#10b981"; // emerald default
        }
    };

    const moodColor = getMoodColor();

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">

            {/* Full-screen SVG for Tether Line */}
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <linearGradient id="tether-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={moodColor} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={moodColor} stopOpacity="0.05" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <motion.line
                    x1={eveX}
                    y1={eveY}
                    x2={cursorX}
                    y2={cursorY}
                    stroke="url(#tether-gradient)"
                    strokeWidth={isClicked ? 3 : 1.5}
                    strokeDasharray={isClicked ? "none" : "4 4"}
                    filter="url(#glow)"
                    className="transition-all duration-300"
                />
            </svg>

            {/* Custom Tether Target (Mouse Cursor) */}
            <motion.div
                className="absolute shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center mix-blend-screen"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            >
                <motion.div
                    animate={{
                        scale: isClicked ? 0.5 : 1,
                        backgroundColor: isClicked ? "#fff" : moodColor
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="w-3 h-3 rounded-full bg-emerald-400"
                />

                {/* Clicking Ripple */}
                <AnimatePresence>
                    {isClicked && (
                        <motion.div
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 rounded-full border border-emerald-400"
                            style={{ borderColor: moodColor }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            {/* EVE Companion Body */}
            <motion.div
                className="absolute flex flex-col items-center"
                style={{
                    x: eveX,
                    y: eveY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            >
                {/* EVE Floating Animation */}
                <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex flex-col items-center justify-center"
                >
                    {/* Thought Bubble - Positioned to top-left to avoid covering target */}
                    <AnimatePresence>
                        {state.thoughtText && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: -20, y: 10 }}
                                animate={{ opacity: 1, scale: 1, x: -40, y: -40 }}
                                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                className="absolute bottom-full right-full mb-2 mr-2 min-w-[180px] max-w-[240px] bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium p-3 rounded-2xl rounded-br-sm shadow-[0_4px_30px_rgba(0,0,0,0.3)] pointer-events-none"
                            >
                                {state.thoughtText}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Cute EVE SVG */}
                    <svg width="48" height="60" viewBox="0 0 48 60" className="drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                        {/* Hover Thruster (Bottom glow) */}
                        <motion.ellipse
                            cx="24" cy="56" rx="10" ry="3"
                            fill={moodColor}
                            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            style={{ filter: "blur(4px)" }}
                        />

                        {/* Floating Head - Separated from body, cuter proportions */}
                        <motion.g
                            animate={
                                state.type === 'happy' ? { rotate: [0, -15, 15, 0], y: [-2, 2, -2] } :
                                    state.type === 'explaining' ? { rotate: [0, 5, 0, -5, 0] } :
                                        { y: [-1, 1, -1] }
                            }
                            transition={{ duration: state.type === 'happy' ? 0.6 : 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Head shell */}
                            <ellipse cx="24" cy="14" rx="16" ry="12" fill="#ffffff" />
                            {/* Screen glass */}
                            <ellipse cx="24" cy="14" rx="12" ry="8" fill="#0f172a" />

                            {/* Eyes */}
                            <motion.ellipse
                                cx="19" cy="14" rx="3.5" ry="3.5"
                                fill={moodColor}
                                animate={{
                                    scaleY: state.type === 'idle' ? [1, 0.1, 1] : 1, // blink
                                    ry: state.type === 'happy' ? [3.5, 1, 3.5] : 3.5 // squint
                                }}
                                transition={{ duration: state.type === 'idle' ? 4 : 0.4, repeat: state.type === 'idle' ? Infinity : 0, repeatDelay: 2 }}
                                style={{ filter: `drop-shadow(0 0 3px ${moodColor})` }}
                            />
                            <motion.ellipse
                                cx="29" cy="14" rx="3.5" ry="3.5"
                                fill={moodColor}
                                animate={{
                                    scaleY: state.type === 'idle' ? [1, 0.1, 1] : 1,
                                    ry: state.type === 'happy' ? [3.5, 1, 3.5] : 3.5
                                }}
                                transition={{ duration: state.type === 'idle' ? 4 : 0.4, repeat: state.type === 'idle' ? Infinity : 0, repeatDelay: 2 }}
                                style={{ filter: `drop-shadow(0 0 3px ${moodColor})` }}
                            />
                        </motion.g>

                        {/* Main Body - teardrop/egg shape */}
                        <path
                            d="M 12 34 C 12 48, 18 54, 24 54 C 30 54, 36 48, 36 34 C 36 28, 30 26, 24 26 C 18 26, 12 28, 12 34 Z"
                            fill="#f8fafc"
                        />

                        {/* Body glowing core */}
                        <circle cx="24" cy="38" r="4" fill={moodColor} opacity="0.8" style={{ filter: "blur(2px)" }} />

                        {/* Scanning Beam extending down when explaining */}
                        <AnimatePresence>
                            {(state.type === 'explaining' || state.type === 'error') && (
                                <motion.path
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 0.3, scaleY: 1 }}
                                    exit={{ opacity: 0, scaleY: 0 }}
                                    style={{ transformOrigin: 'top' }}
                                    d="M 24 38 L 8 80 L 40 80 Z"
                                    fill="url(#scanGradient-cute)"
                                />
                            )}
                        </AnimatePresence>
                        <defs>
                            <linearGradient id="scanGradient-cute" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={moodColor} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={moodColor} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}

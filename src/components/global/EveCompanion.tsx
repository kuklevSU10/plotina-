"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { useEve } from "@/contexts/EveContext";

export function EveCompanion() {
    const { state, mousePosition, isMobile, isClicked } = useEve();
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
    const [scrollSpeed, setScrollSpeed] = useState(0);
    const lastScrollY = useRef(0);
    const lastScrollTime = useRef(Date.now());
    const [clickPos, setClickPos] = useState<{ x: number; y: number } | null>(null);
    const [droplets, setDroplets] = useState<Array<{ id: number; angle: number; dist: number }>>([]);

    // ── EVE position springs (cinematic) ──
    const eveX = useSpring(0, { damping: 30, stiffness: 50, mass: 1.2 });
    const eveY = useSpring(0, { damping: 30, stiffness: 50, mass: 1.2 });

    // ── Cursor springs (smooth but responsive — slightly slower than before) ──
    const cursorX = useSpring(-100, { damping: 30, stiffness: 350, mass: 0.2 });
    const cursorY = useSpring(-100, { damping: 30, stiffness: 350, mass: 0.2 });

    // ── Head rotation spring ──
    const headSpring = useSpring(0, { damping: 20, stiffness: 100, mass: 0.5 });
    const [headAngle, setHeadAngle] = useState(0);

    useEffect(() => {
        const unsubscribe = headSpring.on("change", (v) => setHeadAngle(v));
        return () => unsubscribe();
    }, [headSpring]);

    // ── Liquid drop click effect ──
    useEffect(() => {
        if (isClicked) {
            setClickPos({ x: mousePosition.x, y: mousePosition.y });
            // Generate random droplets radiating outward
            const newDroplets = Array.from({ length: 8 }, (_, i) => ({
                id: Date.now() + i,
                angle: (i / 8) * 360 + (Math.random() - 0.5) * 30,
                dist: 20 + Math.random() * 15,
            }));
            setDroplets(newDroplets);
            setTimeout(() => setDroplets([]), 600);
        } else {
            setTimeout(() => setClickPos(null), 400);
        }
    }, [isClicked, mousePosition.x, mousePosition.y]);

    // ── Init window ──
    useEffect(() => {
        if (typeof window === "undefined") return;
        const update = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        update();
        eveX.set(window.innerWidth - 100);
        eveY.set(window.innerHeight * 0.7);
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [eveX, eveY]);

    // ── Scroll speed ──
    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();
            const dy = Math.abs(window.scrollY - lastScrollY.current);
            const dt = Math.max(1, now - lastScrollTime.current);
            setScrollSpeed(dy / dt);
            lastScrollY.current = window.scrollY;
            lastScrollTime.current = now;
            setTimeout(() => setScrollSpeed(0), 200);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ── Main update: position + head ──
    useEffect(() => {
        if (isMobile || windowSize.w === 0) return;

        cursorX.set(mousePosition.x);
        cursorY.set(mousePosition.y);

        // EVE target — default home position
        let targetX = windowSize.w - 100;
        let targetY = windowSize.h * 0.7;

        // Helper: check if an element is reasonably within the viewport
        const isInViewport = (rect: DOMRect) => {
            return rect.top > -50 && rect.bottom < windowSize.h + 50 && rect.left > -50 && rect.right < windowSize.w + 50;
        };

        if (state.type === "thinking" || state.type === "explaining" || state.type === "error" || state.type === "success") {
            if (state.customPosition) {
                // Custom position: only use if it's within viewport bounds
                const cpx = state.customPosition.x;
                const cpy = state.customPosition.y;
                if (cpy > 0 && cpy < windowSize.h && cpx > 0 && cpx < windowSize.w) {
                    targetX = cpx;
                    targetY = cpy;
                }
                // else: stay home
            } else if (state.targetRef?.current) {
                const rect = state.targetRef.current.getBoundingClientRect();
                if (isInViewport(rect)) {
                    targetX = rect.right + 80;
                    targetY = rect.top + rect.height / 2;
                }
                // else: element scrolled out → stay home
            }
            // No fallback to mouse position — that caused erratic movement
        } else if (state.type === "calling") {
            targetX = Math.min(mousePosition.x + 150, windowSize.w - 60);
            targetY = mousePosition.y - 60;
        }

        targetX = Math.max(60, Math.min(windowSize.w - 60, targetX));
        targetY = Math.max(60, Math.min(windowSize.h - 60, targetY));

        eveX.set(targetX);
        eveY.set(targetY);

        // Head
        const evePosX = eveX.get();
        const evePosY = eveY.get();
        const dx = mousePosition.x - evePosX;
        const dist = Math.sqrt(dx * dx + Math.pow(mousePosition.y - evePosY, 2));

        if (state.type === "idle" && dist > 400) {
            headSpring.set(0);
        } else {
            const rawAngle = Math.atan2(dx, 200) * (180 / Math.PI);
            headSpring.set(Math.max(-20, Math.min(20, rawAngle)));
        }
    }, [mousePosition, state, isMobile, cursorX, cursorY, eveX, eveY, windowSize, headSpring]);

    // ── Derived ──
    const moodColor = (() => {
        switch (state.type) {
            case "error": return "#ef4444";
            case "success": return "#10b981";
            case "happy": case "clapping": return "#a855f7";
            case "thinking": return "#3b82f6";
            case "calling": return "#f59e0b";
            default: return "#38bdf8";
        }
    })();

    const eyeColor = state.type === "error" ? "#ef4444" : "#38bdf8";
    const isCodeHover = state.type === "thinking";
    const isFastScroll = scrollSpeed > 2;
    const eveScale = state.scale || 1;

    if (isMobile) return null;

    return (
        <>
            {/* ═══ GLOBAL SPOTLIGHT (BACKGROUND) ═══ */}
            {/* Placed in its own container at z-0 so it sits truly behind page content (z-10+) */}
            {!isMobile && (
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <motion.div
                        className="absolute pointer-events-none"
                        style={{
                            width: 800,
                            height: 800,
                            x: cursorX,
                            y: cursorY,
                            translateX: "-50%",
                            translateY: "-50%",
                            background: "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(59,130,246,0.10) 40%, rgba(168,85,247,0.05) 60%, transparent 70%)",
                            filter: "blur(60px)",
                        }}
                    />
                </div>
            )}

            {/* ═══ EVE COMPANION & CURSOR LAYER ═══ */}
            <div className="fixed inset-0 pointer-events-none z-[100]">

                {/* ═══ CURSOR ═══ */}
                <motion.div
                    className="absolute pointer-events-none cursor-reversion z-[200]"
                    style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
                >
                    {isCodeHover ? (
                        <motion.div
                            className="flex items-center gap-0.5"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <span className="text-emerald-400 text-sm font-mono font-bold" style={{ textShadow: "0 0 8px rgba(52,211,153,0.9)" }}>{'>'}</span>
                            <motion.div
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                                className="w-[2.5px] h-5 bg-emerald-400 rounded-sm ml-0.5"
                                style={{ boxShadow: "0 0 8px rgba(52,211,153,0.8)" }}
                            />
                        </motion.div>
                    ) : (
                        <svg width="44" height="44" viewBox="0 0 44 44" className="overflow-visible">
                            {/* Rotating dashed orbit - very faint and small now */}
                            <motion.circle
                                cx="22" cy="22" r="10"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="0.8"
                                strokeDasharray="3 5"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                style={{ transformOrigin: "22px 22px" }}
                            />

                            {/* Main ring removed as requested */}

                            {/* Crosshair ticks — made "dark" via very low opacity white (since under difference blend on black this results in a dark grey #262626) */}
                            <g stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round">
                                <line x1="22" y1="3" x2="22" y2="9" />
                                <line x1="22" y1="35" x2="22" y2="41" />
                                <line x1="3" y1="22" x2="9" y2="22" />
                                <line x1="35" y1="22" x2="41" y2="22" />
                            </g>

                            {/* Center dot */}
                            <motion.circle
                                cx="22" cy="22"
                                fill={moodColor}
                                animate={{
                                    r: isClicked ? 4.5 : 2.5,
                                    opacity: [0.85, 1, 0.85],
                                }}
                                transition={{
                                    r: { type: "spring", stiffness: 500, damping: 18 },
                                    opacity: { duration: 2, repeat: Infinity },
                                }}
                            />
                            {/* Center glow */}
                            <circle cx="22" cy="22" r="4" fill={moodColor} opacity="0.25" style={{ filter: "blur(5px)" }} />

                            {/* Liquid drop splash on click */}
                            <AnimatePresence>
                                {isClicked && (
                                    <>
                                        {/* Main expanding ring */}
                                        <motion.circle
                                            cx="22" cy="22"
                                            fill="none"
                                            stroke={moodColor}
                                            strokeWidth="2"
                                            initial={{ r: 8, opacity: 0.8 }}
                                            animate={{ r: 30, opacity: 0, strokeWidth: 0.5 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                        {/* Second softer ring */}
                                        <motion.circle
                                            cx="22" cy="22"
                                            fill="none"
                                            stroke={moodColor}
                                            strokeWidth="1"
                                            initial={{ r: 10, opacity: 0.5 }}
                                            animate={{ r: 38, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
                                        />
                                        {/* Radiating droplets */}
                                        {droplets.map((d) => {
                                            const rad = (d.angle * Math.PI) / 180;
                                            const tx = Math.cos(rad) * d.dist;
                                            const ty = Math.sin(rad) * d.dist;
                                            return (
                                                <motion.circle
                                                    key={d.id}
                                                    cx="22" cy="22"
                                                    r="1.5"
                                                    fill={moodColor}
                                                    initial={{ opacity: 0.9, x: 0, y: 0, scale: 1 }}
                                                    animate={{ opacity: 0, x: tx, y: ty, scale: 0.3 }}
                                                    transition={{ duration: 0.45, ease: "easeOut" }}
                                                />
                                            );
                                        })}
                                    </>
                                )}
                            </AnimatePresence>
                        </svg>
                    )}
                </motion.div>

                {/* ═══ EVE ═══ */}
                <motion.div
                    className="absolute"
                    style={{ x: eveX, y: eveY, translateX: "-50%", translateY: "-50%" }}
                    animate={{ scale: eveScale }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <motion.div
                        animate={
                            state.type === "clapping"
                                ? { y: [0, -12, 0] }
                                : { y: [-3, 3, -3] }
                        }
                        transition={
                            state.type === "clapping"
                                ? { duration: 0.35, repeat: Infinity }
                                : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
                        }
                        className="relative flex flex-col items-center"
                    >
                        {/* Thought Bubble */}
                        <AnimatePresence>
                            {state.thoughtText && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.7, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: -8 }}
                                    exit={{ opacity: 0, scale: 0.7, y: 8, transition: { duration: 0.15 } }}
                                    className={`absolute bottom-full mb-3 right-0 bg-white/10 backdrop-blur-lg border border-white/20 text-white text-[11px] font-medium p-2.5 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] whitespace-pre-wrap leading-relaxed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${state.type === 'explaining' || state.type === 'success'
                                        ? 'min-w-[200px] max-w-[320px] max-h-[160px] overflow-y-auto text-left'
                                        : 'min-w-[140px] max-w-[200px] text-center'
                                        }`}
                                >
                                    {state.thoughtText}
                                    <div className="absolute -bottom-1 right-6 w-2 h-2 bg-white/10 border-b border-r border-white/20 rotate-45" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* EVE SVG */}
                        <svg width="70" height="100" viewBox="0 0 70 100" className="drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)] mascot-shadow-themed">
                            <defs>
                                <linearGradient id="eBody" x1="20%" y1="0%" x2="80%" y2="100%">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="40%" stopColor="#f1f5f9" />
                                    <stop offset="100%" stopColor="#c7cdd5" />
                                </linearGradient>
                                <linearGradient id="eHead" x1="30%" y1="0%" x2="70%" y2="100%">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="60%" stopColor="#e2e8f0" />
                                    <stop offset="100%" stopColor="#94a3b8" />
                                </linearGradient>
                                <filter id="eGlow" x="-50%" y="-50%" width="200%" height="200%">
                                    <feGaussianBlur stdDeviation="2.5" result="b" />
                                    <feComposite in="SourceGraphic" in2="b" operator="over" />
                                </filter>
                            </defs>

                            {/* Thruster glow */}
                            <motion.ellipse cx="35" cy="96" rx="12" ry="4" fill={moodColor}
                                animate={{ opacity: [0.15, 0.4, 0.15] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                style={{ filter: "blur(6px)" }}
                            />

                            {/* HEAD */}
                            <g style={{ transform: `rotate(${headAngle}deg)`, transformOrigin: "35px 26px", transition: "transform 0.1s ease-out" }}>
                                <path d="M 12 26 C 12 6, 58 6, 58 26 C 58 35, 48 39, 35 39 C 22 39, 12 35, 12 26 Z" fill="url(#eHead)" />
                                <path d="M 16 26 C 16 15, 54 15, 54 26 C 54 33, 44 36, 35 36 C 26 36, 16 33, 16 26 Z" fill="#0a0f1a" />
                                <path d="M 20 22 C 20 18, 50 18, 50 22 C 50 22, 35 25, 20 22 Z" fill="rgba(255,255,255,0.05)" />

                                {/* Eyes */}
                                <g filter="url(#eGlow)">
                                    <motion.ellipse cx="28" cy="25" rx="5.5" fill={eyeColor}
                                        animate={{ ry: isFastScroll ? 5.5 : state.type === "thinking" ? 2 : (state.type === "happy" || state.type === "clapping") ? [3.5, 1.5, 3.5] : [3.5, 0.3, 3.5] }}
                                        transition={{ duration: isFastScroll ? 0.15 : state.type === "idle" ? 0.25 : 0.5, repeat: state.type === "idle" || state.type === "happy" || state.type === "clapping" ? Infinity : 0, repeatDelay: state.type === "idle" ? 3.5 : 0.8 }}
                                    />
                                </g>
                                <g filter="url(#eGlow)">
                                    <motion.ellipse cx="42" cy="25" rx="5.5" fill={eyeColor}
                                        animate={{ ry: isFastScroll ? 5.5 : state.type === "thinking" ? 2 : (state.type === "happy" || state.type === "clapping") ? [3.5, 1.5, 3.5] : [3.5, 0.3, 3.5] }}
                                        transition={{ duration: isFastScroll ? 0.15 : state.type === "idle" ? 0.25 : 0.5, repeat: state.type === "idle" || state.type === "happy" || state.type === "clapping" ? Infinity : 0, repeatDelay: state.type === "idle" ? 3.5 : 0.8 }}
                                    />
                                </g>

                                {state.type === "thinking" && (
                                    <g>
                                        <motion.circle cx="31" cy="18" r="1.2" fill="#60a5fa" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }} />
                                        <motion.circle cx="35" cy="18" r="1.2" fill="#60a5fa" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.25 }} />
                                        <motion.circle cx="39" cy="18" r="1.2" fill="#60a5fa" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.5 }} />
                                    </g>
                                )}
                                {state.type === "calling" && (
                                    <g>
                                        <motion.path d="M 10 22 Q 6 26 10 30" stroke="#fbbf24" strokeWidth="1.5" fill="none" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.7, repeat: Infinity }} />
                                        <motion.path d="M 60 22 Q 64 26 60 30" stroke="#fbbf24" strokeWidth="1.5" fill="none" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.7, repeat: Infinity }} />
                                    </g>
                                )}
                            </g>

                            <ellipse cx="35" cy="41" rx="14" ry="2.5" fill="rgba(0,0,0,0.06)" />

                            {/* BODY */}
                            <path d="M 18 44 C 16 53, 16 70, 22 82 C 26 88, 31 91, 35 91 C 39 91, 44 88, 48 82 C 54 70, 54 53, 52 44 C 47 45, 41 46, 35 46 C 29 46, 23 45, 18 44 Z" fill="url(#eBody)" />
                            <ellipse cx="35" cy="44" rx="17" ry="2.5" fill="#e8ecf0" />

                            {/* ARMS */}
                            <motion.g animate={{ y: state.type === "clapping" ? [0, -6, 0] : [-0.5, 0.5, -0.5] }}
                                transition={{ duration: state.type === "clapping" ? 0.2 : 3, repeat: Infinity, ease: "easeInOut" }}>
                                <motion.path d="M 14 48 C 10 56, 9 70, 13 78" fill="none" stroke="url(#eBody)" strokeWidth="5.5" strokeLinecap="round"
                                    animate={{ rotate: state.type === "clapping" ? [0, 18, 0] : [0, 2, 0] }}
                                    transition={{ duration: state.type === "clapping" ? 0.2 : 3, repeat: Infinity }}
                                    style={{ transformOrigin: "14px 48px" }} />
                                <motion.path d="M 56 48 C 60 56, 61 70, 57 78" fill="none" stroke="url(#eBody)" strokeWidth="5.5" strokeLinecap="round"
                                    animate={{ rotate: state.type === "clapping" ? [0, -18, 0] : [0, -2, 0] }}
                                    transition={{ duration: state.type === "clapping" ? 0.2 : 3, repeat: Infinity }}
                                    style={{ transformOrigin: "56px 48px" }} />
                            </motion.g>

                            {/* Core */}
                            <motion.ellipse cx="35" cy="64" rx="3" ry="3.5" fill={moodColor}
                                animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                                style={{ filter: "blur(2px)" }} />
                            <ellipse cx="35" cy="64" rx="1.5" ry="2" fill="#fff" />
                        </svg>
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}

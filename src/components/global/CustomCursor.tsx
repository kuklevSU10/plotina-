"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useEve } from "@/contexts/EveContext";

export function CustomCursor() {
    const { isMobile, setMousePosition } = useEve();
    const [isVisible, setIsVisible] = useState(false);

    // Smooth spring configuration for the cursor
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(-100, springConfig);
    const cursorY = useSpring(-100, springConfig);

    useEffect(() => {
        if (isMobile) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 6); // offset by half width
            cursorY.set(e.clientY - 6);
            setMousePosition({ x: e.clientX, y: e.clientY });

            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", moveCursor);
        document.body.addEventListener("mouseleave", handleMouseLeave);
        document.body.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            document.body.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isMobile, cursorX, cursorY, isVisible, setMousePosition]);

    if (isMobile) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-3 h-3 bg-emerald-400 rounded-full pointer-events-none z-[100] mix-blend-screen"
            style={{
                x: cursorX,
                y: cursorY,
                opacity: isVisible ? 1 : 0,
                boxShadow: "0 0 10px 2px rgba(16, 185, 129, 0.5)"
            }}
        />
    );
}

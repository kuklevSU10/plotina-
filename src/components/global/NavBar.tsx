"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ThemeToggle } from "@/components/global/ThemeToggle";

const navLinks = [
    { label: "Architecture", href: "#architecture" },
    { label: "Features", href: "#features" },
    { label: "Security", href: "#security" },
    { label: "Pricing", href: "#pricing" },
];

export function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    // Track active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-40% 0px -55% 0px" }
        );

        navLinks.forEach((link) => {
            const el = document.querySelector(link.href);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-50 nav-themed"
            initial={{ y: -80 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className={`transition-all duration-500 ${scrolled
                    ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/20"
                    : "bg-transparent border-b border-transparent"
                }`}>
                <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 h-16">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-300">
                                <span className="text-zinc-950 font-black text-sm tracking-tighter">P</span>
                            </div>
                            <div className="absolute -inset-1 bg-emerald-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white nav-brand">
                            Plotina
                            <span className="text-zinc-500 font-normal text-sm ml-1.5">2026</span>
                        </span>
                    </a>

                    {/* Center nav links */}
                    <div className="hidden md:flex items-center gap-1 bg-white/[0.03] backdrop-blur-md rounded-full px-1.5 py-1 border border-white/[0.06]">
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.href.replace("#", "");
                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    aria-label={`View ${link.label}`}
                                    className="relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full nav-link"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navActiveIndicator"
                                            className="absolute inset-0 bg-white/[0.08] rounded-full border border-white/[0.1]"
                                            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                        />
                                    )}
                                    <span className={`relative z-10 ${isActive
                                            ? "text-emerald-400"
                                            : "text-zinc-400 hover:text-zinc-200"
                                        }`}>
                                        {link.label}
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            aria-label="Sign in to your account"
                            className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white px-4 py-2 rounded-full transition-colors duration-300 nav-signin"
                        >
                            Sign In
                        </button>
                        <button
                            aria-label="Get early access to Plotina"
                            className="text-sm font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 px-5 py-2 rounded-full transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Get Early Access
                        </button>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}

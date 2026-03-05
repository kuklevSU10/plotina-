"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Terminal, Shield, Lock, Users, Server, Zap } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useEve } from "@/contexts/EveContext";

export function RetryLoopSection() {
    const [step, setStep] = useState(0);
    const { setInteraction, clearInteraction } = useEve();
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animation sequence logic
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % 4);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Sync EVE's mood with the terminal step
        if (step === 0) {
            setInteraction({ type: 'idle' });
        } else if (step === 1) {
            setInteraction({ type: 'idle' });
        } else if (step === 2) {
            setInteraction({ type: 'error', targetRef: terminalRef, thoughtText: "Uh oh, Attribute Error!" });
        } else if (step === 3) {
            setInteraction({ type: 'explaining', targetRef: terminalRef, thoughtText: "Scanning traceback... applying patch." });
        }
    }, [step, setInteraction]);

    return (
        <SectionWrapper id="retry-loop" className="py-24 bg-zinc-950">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="order-2 lg:order-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium"
                    >
                        <Zap className="w-4 h-4" />
                        Auto-Healing Architecture
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    >
                        Code fails?<br />
                        <span className="text-emerald-400">Plotina fixes it.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-zinc-400 max-w-lg"
                    >
                        Our intelligent retry loop analyzes Revit tracebacks and auto-corrects code in milliseconds. You never see the error, only the success.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="order-1 lg:order-2"
                    ref={terminalRef}
                >
                    <GlassCard className="p-0 overflow-hidden border-zinc-800 bg-[#121212] flex flex-col h-[320px]">
                        <div className="bg-[#1e1e1e] px-4 py-3 flex items-center border-b border-black/40">
                            <Terminal className="w-4 h-4 text-zinc-500 mr-2" />
                            <span className="text-xs text-zinc-400 font-mono">execution_engine.log</span>
                        </div>
                        <div className="p-6 font-mono text-xs md:text-sm flex-1 flex flex-col justify-end space-y-3">
                            <div className="text-zinc-500">&gt; Starting script execution...</div>

                            <div className={cn("transition-opacity duration-300", step >= 1 ? "opacity-100" : "opacity-0")}>
                                <span className="text-emerald-400">Info:</span> Initializing Transaction 'Update Walls'
                            </div>

                            <div className={cn("transition-opacity duration-300", step >= 2 ? "opacity-100" : "opacity-0")}>
                                <span className="text-red-400 font-semibold">Traceback (most recent call last):</span><br />
                                <span className="text-red-400/80 ml-4">AttributeError: 'Wall' object has no attribute 'Set'</span>
                            </div>

                            <div className={cn("transition-opacity duration-300", step >= 3 ? "opacity-100" : "opacity-0")}>
                                <span className="text-orange-400 flex items-center gap-2">
                                    <span className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                                    Plotina is analyzing the traceback...
                                </span>
                                <span className="text-zinc-500 ml-5 block mt-1">Applying patch: wall.get_Parameter().Set()</span>
                            </div>

                            {/* Loop point */}
                            <div className={cn("transition-opacity duration-300", step === 0 ? "opacity-100" : "opacity-0 absolute bottom-6")}>
                                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                    ✓ Code corrected. Execution successful.
                                </span>
                                <span className="text-zinc-500 block mt-2">&gt; Waiting for next prompt...</span>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </SectionWrapper>
    );
}

const securityItems = [
    {
        icon: <Server className="w-8 h-8 text-blue-400" />,
        title: "Cloud-Managed IP",
        description: "Prompts and generation logic live on our secure Hetzner backend. Your proprietary workflows are never exposed in the local Add-in."
    },
    {
        icon: <Shield className="w-8 h-8 text-emerald-400" />,
        title: "Stateless Execution",
        description: "We don't store your BIM models. We only process metadata and tracebacks to train the contextual engine, immediately discarding the rest."
    },
    {
        icon: <Users className="w-8 h-8 text-purple-400" />,
        title: "Instant Revocation",
        description: "SaaS license keys allow you to manage team access, rotate keys, and revoke tokens instantly through our enterprise portal."
    }
];

export function SecuritySection() {
    const secRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: secRef, offset: ["start end", "end start"] });
    const headY = useTransform(scrollYProgress, [0, 1], [25, -25]);

    return (
        <SectionWrapper id="security" className="py-24 relative overflow-hidden" ref={secRef}>
            <motion.div className="text-center mb-16" style={{ y: headY }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
                >
                    Enterprise Grade Security.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-400 text-lg max-w-2xl mx-auto"
                >
                    Built for firms that require absolute control over their intellectual property.
                </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
                {securityItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                        whileHover={{
                            y: -10,
                            scale: 1.02,
                            rotateX: 2,
                            rotateY: -2,
                            transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        <GlassCard className="p-8 h-full bg-zinc-900/40 hover:bg-zinc-900/80 border-zinc-800/50 hover:border-emerald-500/30 transition-colors duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                            {/* Subtle hover gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <motion.div
                                className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 relative z-10"
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                {item.icon}
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-3 relative z-10 group-hover:text-emerald-400 transition-colors duration-300">{item.title}</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm md:text-base relative z-10 group-hover:text-zinc-300 transition-colors duration-300">
                                {item.description}
                            </p>

                            {/* SVG Decorative Corner */}
                            <svg className="absolute bottom-0 right-0 w-24 h-24 text-zinc-800/20 group-hover:text-emerald-500/10 transition-colors duration-500 transform translate-x-1/4 translate-y-1/4" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" fill="currentColor" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4">
                                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="20s" repeatCount="indefinite" />
                                </circle>
                            </svg>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}

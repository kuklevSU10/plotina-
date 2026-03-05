"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Layers, Lock, Cpu, Play } from "lucide-react";

const steps = [
    {
        title: "Native Integration",
        description: "WPF Panel inside Revit captures your intent.",
        icon: <Layers className="w-6 h-6 text-emerald-400" />
    },
    {
        title: "Secure Transport",
        description: "C# Add-in routes data via WebSocket.",
        icon: <Lock className="w-6 h-6 text-blue-400" />
    },
    {
        title: "AI Brain",
        description: "FastAPI Backend routes to Gemini/Claude based on complexity.",
        icon: <Cpu className="w-6 h-6 text-purple-400" />
    },
    {
        title: "Execution",
        description: "IronPython Runner executes the generated code locally.",
        icon: <Play className="w-6 h-6 text-orange-400" />
    }
];

export function ArchitectureSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });
    const headingY = useTransform(scrollYProgress, [0, 1], [30, -30]);

    return (
        <SectionWrapper id="architecture" className="py-24 relative" ref={sectionRef}>
            <motion.div className="text-center mb-16" style={{ y: headingY }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
                >
                    Engineered for Precision and Scale.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-400 text-lg max-w-2xl mx-auto"
                >
                    A seamless, secure pipeline from your natural language prompt to Revit model execution.
                </motion.p>
            </motion.div>

            <div className="relative max-w-5xl mx-auto py-8">
                {/* SVG Connecting lines for desktop */}
                <div className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 hidden md:block pointer-events-none z-0">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <line x1="12%" y1="50%" x2="88%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="6 6" className="arch-line-base" />
                        <motion.line
                            x1="12%" y1="50%" x2="88%" y2="50%"
                            stroke="url(#archGradientDesktop)"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            animate={{ strokeDashoffset: [24, 0] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="archGradientDesktop" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="50%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* SVG Connecting lines for mobile */}
                <div className="absolute top-0 bottom-0 left-[24px] w-4 mt-12 mb-12 md:hidden pointer-events-none z-0 -translate-x-1/2">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="6 6" className="arch-line-base" />
                        <motion.line
                            x1="50%" y1="0%" x2="50%" y2="100%"
                            stroke="url(#archGradientMobile)"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                            animate={{ strokeDashoffset: [24, 0] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <defs>
                            <linearGradient id="archGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="50%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 relative z-10 pl-16 md:pl-0">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <GlassCard className="p-6 h-full flex flex-col items-start md:items-center text-left md:text-center bg-zinc-950/80 hover:-translate-y-2 transition-transform duration-300">
                                <div className="absolute left-[-56px] top-1/2 -translate-y-1/2 md:static md:translate-y-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center md:mb-4 border border-white/20 shadow-lg">
                                    {step.icon}
                                </div>
                                <div className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Step {index + 1}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-sm text-zinc-400">{step.description}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}

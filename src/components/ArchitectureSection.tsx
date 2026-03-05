"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Layers, Lock, Cpu, Play } from "lucide-react";

const steps = [
    {
        title: "Native Integration",
        description: "WPF Panel inside Revit captures your intent.",
        icon: <Layers className="w-6 h-6 text-emerald-400" />,
        color: "#10b981",
    },
    {
        title: "Secure Transport",
        description: "C# Add-in routes data via WebSocket.",
        icon: <Lock className="w-6 h-6 text-blue-400" />,
        color: "#3b82f6",
    },
    {
        title: "AI Brain",
        description: "FastAPI Backend routes to Gemini/Claude based on complexity.",
        icon: <Cpu className="w-6 h-6 text-purple-400" />,
        color: "#a855f7",
    },
    {
        title: "Execution",
        description: "IronPython Runner executes the generated code locally.",
        icon: <Play className="w-6 h-6 text-orange-400" />,
        color: "#f97316",
    }
];

export function ArchitectureSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pipelineRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(pipelineRef, { once: true, margin: "-100px" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });
    const headingY = useTransform(scrollYProgress, [0, 1], [30, -30]);

    // Scroll-driven beam progress (0→1 as section scrolls through)
    const { scrollYProgress: beamProgress } = useScroll({
        target: pipelineRef,
        offset: ["start 0.8", "center 0.4"]
    });

    const beamScaleX = useTransform(beamProgress, [0, 1], [0, 1]);
    const orbLeft = useTransform(beamProgress, [0, 1], [12, 88]);

    // Card reveal thresholds
    const cardThresholds = [0.1, 0.35, 0.6, 0.85];

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

            <div className="relative max-w-5xl mx-auto py-8" ref={pipelineRef}>
                {/* Desktop: horizontal connecting lines */}
                <div className="absolute top-1/2 left-0 right-0 h-4 -translate-y-1/2 hidden md:block pointer-events-none z-0">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        {/* Static base track */}
                        <line x1="12%" y1="50%" x2="88%" y2="50%" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />

                        {/* Dashed subtle track */}
                        <line x1="12%" y1="50%" x2="88%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="6 6" />

                        <defs>
                            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="40%" stopColor="#3b82f6" />
                                <stop offset="70%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Scroll-driven progress beam */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full"
                        style={{
                            left: "12%",
                            width: "76%",
                            scaleX: beamScaleX,
                            transformOrigin: "left",
                            background: "linear-gradient(90deg, #10b981, #3b82f6, #a855f7, #f97316)",
                            boxShadow: "0 0 20px rgba(16,185,129,0.5), 0 0 40px rgba(59,130,246,0.3)",
                        }}
                    />

                    {/* Traveling orb */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-400"
                        style={{
                            left: useTransform(orbLeft, v => `${v}%`),
                            boxShadow: "0 0 12px rgba(16,185,129,0.9), 0 0 24px rgba(16,185,129,0.4)",
                        }}
                    />
                </div>

                {/* Mobile: vertical connecting line */}
                <div className="absolute top-0 bottom-0 left-[24px] w-4 mt-12 mb-12 md:hidden pointer-events-none z-0 -translate-x-1/2">
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
                    </svg>
                    {/* Vertical scroll beam */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] rounded-full"
                        style={{
                            height: "100%",
                            scaleY: beamScaleX,
                            transformOrigin: "top",
                            background: "linear-gradient(180deg, #10b981, #3b82f6, #a855f7, #f97316)",
                            boxShadow: "0 0 12px rgba(16,185,129,0.4)",
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 relative z-10 pl-16 md:pl-0">
                    {steps.map((step, index) => {
                        const threshold = cardThresholds[index];
                        return (
                            <ArchCard
                                key={index}
                                step={step}
                                index={index}
                                beamProgress={beamProgress}
                                threshold={threshold}
                                isInView={isInView}
                            />
                        );
                    })}
                </div>
            </div>
        </SectionWrapper>
    );
}

/** Individual card that reveals when the beam reaches it */
function ArchCard({ step, index, beamProgress, threshold, isInView }: {
    step: typeof steps[number];
    index: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beamProgress: any;
    threshold: number;
    isInView: boolean;
}) {
    const opacity = useTransform(
        beamProgress,
        [Math.max(0, threshold - 0.1), threshold],
        [0.3, 1]
    );
    const y = useTransform(
        beamProgress,
        [Math.max(0, threshold - 0.1), threshold],
        [30, 0]
    );
    const glowOpacity = useTransform(
        beamProgress,
        [Math.max(0, threshold - 0.05), threshold, threshold + 0.15],
        [0, 1, 0.3]
    );

    return (
        <motion.div
            style={isInView ? { opacity, y } : { opacity: 0 }}
        >
            <GlassCard className="p-6 h-full flex flex-col items-start md:items-center text-left md:text-center bg-zinc-950/80 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
                {/* Glow pulse when beam arrives */}
                <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                        opacity: glowOpacity,
                        boxShadow: `inset 0 0 30px ${step.color}20, 0 0 20px ${step.color}15`,
                        borderColor: step.color,
                    }}
                />
                <div className="absolute left-[-56px] top-1/2 -translate-y-1/2 md:static md:translate-y-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center md:mb-4 border border-white/20 shadow-lg">
                    {step.icon}
                </div>
                <div className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Step {index + 1}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.description}</p>
            </GlassCard>
        </motion.div>
    );
}

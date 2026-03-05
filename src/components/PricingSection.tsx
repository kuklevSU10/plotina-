"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Check, Star } from "lucide-react";
import { useEve } from "@/contexts/EveContext";

export function PricingSection() {
    const [isAnnual, setIsAnnual] = useState(false);
    const { setInteraction, clearInteraction } = useEve();

    const tiers = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for exploring Plotina's capabilities on small residential projects.",
            features: [
                "100 AI executions per month",
                "Standard Gemini/Claude models",
                "Community Support",
                "Basic code generation"
            ],
            highlighted: false,
            cta: "Get Started Free"
        },
        {
            name: "Pro",
            price: isAnnual ? "$39" : "$49",
            period: "/month",
            description: "For professionals needing unlimited power and precision for complex models.",
            features: [
                "500 AI executions per month",
                "Access to Claude 3.7 Sonnet for complex logic",
                "Priority Email Support",
                "Auto-Healing Retry Loop",
                "Custom system prompts"
            ],
            highlighted: true,
            cta: "Start 14-Day Trial"
        },
        {
            name: "Team",
            price: "Custom",
            description: "Enterprise-grade deployment with SSO and dedicated account management.",
            features: [
                "Unlimited executions",
                "Custom Model Fine-tuning",
                "SSO & Role-Based Access",
                "Dedicated Slack Channel",
                "On-premise deployment options"
            ],
            highlighted: false,
            cta: "Contact Sales"
        }
    ];

    return (
        <SectionWrapper id="pricing" className="py-24 bg-zinc-950 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
                >
                    Simple, transparent pricing.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10"
                >
                    No hidden fees. Scale your automation as your team grows.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center items-center gap-4"
                >
                    <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>

                    <button
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="w-14 h-7 rounded-full bg-zinc-800 border border-zinc-700 p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        aria-label="Toggle annual billing"
                    >
                        <motion.div
                            className="w-5 h-5 rounded-full bg-emerald-400 shadow-sm"
                            layout
                            animate={{
                                x: isAnnual ? 26 : 0,
                                backgroundColor: isAnnual ? "#10b981" : "#a1a1aa"
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>

                    <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-zinc-500'}`}>
                        Annually
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
                    </span>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                {tiers.map((tier, index) => (
                    <motion.div
                        key={index}
                        onMouseEnter={(e) => {
                            let mood: any = 'hovering';
                            let text = "";
                            let scale = 1;

                            if (tier.name === "Free") {
                                mood = 'hovering';
                                text = "A solid starting point.";
                                scale = 1.1;
                            } else if (tier.name === "Pro") {
                                mood = 'happy';
                                text = "This is my favorite plan!";
                                scale = 1.5;
                            } else if (tier.name === "Team") {
                                mood = 'clapping';
                                text = "WOW! Enterprise scale unlocked!";
                                scale = 1.9;
                            }

                            setInteraction({
                                type: mood,
                                thoughtText: text,
                                scale: scale,
                                targetRef: { current: e.currentTarget } as React.RefObject<HTMLElement>
                            });
                        }}
                        onMouseLeave={() => {
                            clearInteraction();
                        }}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, duration: 0.5 }}
                        className={tier.highlighted ? "relative z-10 cursor-none" : "cursor-none"}
                    >
                        <GlassCard
                            glow={tier.highlighted}
                            className={`p-8 h-full flex flex-col bg-zinc-950 hover:-translate-y-2 transition-transform duration-300 ${tier.highlighted ? "border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] md:scale-105" : "border-white/10"
                                }`}
                        >
                            {tier.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Star className="w-3 h-3 fill-current" /> Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                                <div className="flex items-end gap-1 mb-3 h-12">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={`${tier.name}-${tier.price}`}
                                            initial={{ rotateX: -90, opacity: 0 }}
                                            animate={{ rotateX: 0, opacity: 1 }}
                                            exit={{ rotateX: 90, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-4xl font-bold text-white inline-block"
                                            style={{ transformOrigin: 'bottom' }}
                                        >
                                            {tier.price}
                                        </motion.span>
                                    </AnimatePresence>
                                    {tier.period && <span className="text-zinc-400 mb-1">{tier.period}</span>}
                                </div>
                                <p className="text-sm text-zinc-400 min-h-[40px]">{tier.description}</p>
                            </div>

                            <div className="flex-1">
                                <ul className="space-y-4 mb-8">
                                    {tier.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start gap-3">
                                            <Check className={`w-5 h-5 shrink-0 ${tier.highlighted ? "text-emerald-400" : "text-zinc-500"}`} />
                                            <span className="text-sm text-zinc-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${tier.highlighted
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
                                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                    }`}
                            >
                                {tier.cta}
                            </button>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}

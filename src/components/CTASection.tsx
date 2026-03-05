"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Rocket, BookOpen } from "lucide-react";

export function CTASection() {
    return (
        <SectionWrapper className="py-32 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-emerald-950/20 to-zinc-950 pointer-events-none cta-section-bg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-8">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"
                >
                    Ready to automate your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                        Revit workflow
                    </span>
                    ?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-xl text-zinc-400 max-w-xl mx-auto"
                >
                    Just describe what you need in plain language — Plotina writes the code and runs it for you, right inside Revit.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <button
                        aria-label="Start automating with Plotina for free"
                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 primary-glow hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <Rocket className="w-5 h-5" />
                        Start Free
                    </button>
                    <button
                        aria-label="Read the Plotina documentation"
                        className="w-full sm:w-auto bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
                    >
                        <BookOpen className="w-5 h-5" />
                        Read the Docs
                    </button>
                </motion.div>

                {/* Trust line */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="text-sm font-semibold text-zinc-400 pt-4"
                >
                    No credit card required · 100 free tasks · Revit 2022-2025
                </motion.p>
            </div>
        </SectionWrapper>
    );
}

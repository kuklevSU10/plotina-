"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { useEve } from "@/contexts/EveContext";
import { useRef, useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";

/* ═══ Human-like typing engine ═══ */
interface TypingEvent {
    type: "add" | "delete" | "pause";
    char?: string;
    delay: number;
}

function buildHumanTypingSequence(text: string): TypingEvent[] {
    const events: TypingEvent[] = [];
    const typoChance = 0.06; // 6% chance of typo on each char
    const nearbyKeys: Record<string, string> = {
        a: "s", s: "a", d: "f", f: "d", g: "h", h: "g", j: "k", k: "j", l: ";",
        q: "w", w: "q", e: "r", r: "e", t: "y", y: "t", u: "i", i: "u", o: "p", p: "o",
        z: "x", x: "z", c: "v", v: "c", b: "n", n: "b", m: "n",
    };

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Occasional typo: type wrong char, pause, delete, type correct
        if (Math.random() < typoChance && char.match(/[a-z]/i) && nearbyKeys[char.toLowerCase()]) {
            const wrongChar = nearbyKeys[char.toLowerCase()];
            events.push({ type: "add", char: wrongChar, delay: 40 + Math.random() * 60 });
            events.push({ type: "pause", delay: 200 + Math.random() * 300 }); // notice mistake
            events.push({ type: "delete", delay: 60 });
            events.push({ type: "add", char, delay: 80 + Math.random() * 40 }); // correct it
            continue;
        }

        // Variable typing speed
        let delay: number;
        if (char === " ") {
            delay = 60 + Math.random() * 80; // slightly slower on spaces
        } else if (char === "." || char === "," || char === "?") {
            delay = 150 + Math.random() * 200; // long pause on punctuation
        } else if (char === char.toUpperCase() && char.match(/[A-Z]/)) {
            delay = 80 + Math.random() * 60; // slight pause for shift key
        } else {
            delay = 35 + Math.random() * 75; // normal typing 35-110ms
        }

        // Occasional thinking pause mid-word (2% chance)
        if (Math.random() < 0.02 && char.match(/[a-z]/i)) {
            events.push({ type: "pause", delay: 300 + Math.random() * 400 });
        }

        events.push({ type: "add", char, delay });
    }

    return events;
}

/* ═══ Prompts collection ═══ */
const PROMPTS = [
    `Count all doors without a mark on Level 1`,
    `Rename all rooms that contain "Office" to "Workspace"`,
    `Find all walls thinner than 200mm and highlight them`,
    `Place a floor tag in every room on Level 2`,
    `List all unplaced rooms in the model`,
    `Change all interior door types to 900mm single`,
    `Export a schedule of all windows with their sizes`,
];

export function HeroSection() {
    const { setInteraction, clearInteraction } = useEve();
    const terminalRef = useRef<HTMLDivElement>(null);

    // ── Human typing state ──
    const [displayedPrompt, setDisplayedPrompt] = useState("");
    const [promptIndex, setPromptIndex] = useState(0);
    const [isTypingPrompt, setIsTypingPrompt] = useState(false);

    // ── EVE explanation state ──
    const [showExplanation, setShowExplanation] = useState(false);
    const [streamedText, setStreamedText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    // Human-like prompt typing animation
    useEffect(() => {
        const prompt = PROMPTS[promptIndex % PROMPTS.length];
        const events = buildHumanTypingSequence(prompt);
        let currentText = "";
        let eventIdx = 0;
        let timeout: ReturnType<typeof setTimeout>;
        setIsTypingPrompt(true);

        // Initial pause before starting
        const startDelay = setTimeout(() => {
            const processEvent = () => {
                if (eventIdx >= events.length) {
                    setIsTypingPrompt(false);
                    // Wait 3s, then clear and type next
                    timeout = setTimeout(() => {
                        // Rapid delete animation
                        let delLen = currentText.length;
                        const deleteInterval = setInterval(() => {
                            if (delLen > 0) {
                                delLen--;
                                setDisplayedPrompt(currentText.slice(0, delLen));
                            } else {
                                clearInterval(deleteInterval);
                                setPromptIndex((prev) => prev + 1);
                            }
                        }, 20);
                    }, 3000);
                    return;
                }

                const event = events[eventIdx];
                eventIdx++;

                if (event.type === "add") {
                    currentText += event.char;
                    setDisplayedPrompt(currentText);
                } else if (event.type === "delete") {
                    currentText = currentText.slice(0, -1);
                    setDisplayedPrompt(currentText);
                }
                // pause just waits

                timeout = setTimeout(processEvent, event.delay);
            };

            processEvent();
        }, 1500);

        return () => {
            clearTimeout(startDelay);
            clearTimeout(timeout);
        };
    }, [promptIndex]);

    // ── Code ──
    const codeString = `
<span class="text-pink-400">from</span> Autodesk.Revit.DB <span class="text-pink-400">import</span> *

<span class="text-zinc-500"># Auto-generated by Plotina AI</span>
collector = FilteredElementCollector(doc)
doors = collector.OfCategory(BuiltInCategory.OST_Doors)\\\\
                 .WhereElementIsNotElementType()\\\\
                 .ToElements()

unmarked_count = <span class="text-orange-300">0</span>
<span class="text-pink-400">for</span> door <span class="text-pink-400">in</span> doors:
    level = doc.GetElement(door.LevelId)
    <span class="text-pink-400">if</span> level <span class="text-pink-400">and</span> level.Name == <span class="text-emerald-300">"Level 1"</span>:
        mark = door.get_Parameter(BuiltInParameter.ALL_MODEL_MARK).AsString()
        <span class="text-pink-400">if not</span> mark:
            unmarked_count += <span class="text-orange-300">1</span>

<span class="text-cyan-300">print</span>(<span class="text-emerald-300">f"Found {unmarked_count} doors without marks"</span>)
`.trim();

    const explanationText = `This script scans every door in your Revit model on Level 1 and checks if it has a "Mark" parameter filled in. It helps you quickly find doors that are missing labels — so you can fix them before submitting the model for review.`;

    const startStreaming = useCallback(() => {
        if (isStreaming) return;
        setShowExplanation(true);
        setIsStreaming(true);
        setStreamedText("");

        // EVE's explanation streams in her thought bubble above her head
        let text = "";
        let i = 0;
        const interval = setInterval(() => {
            if (i < explanationText.length) {
                text += explanationText[i];
                setStreamedText(text);
                // Update EVE's thought bubble with streaming text
                setInteraction({
                    type: 'explaining',
                    thoughtText: text + (i < explanationText.length - 1 ? "▍" : ""),
                    targetRef: terminalRef,
                });
                i++;
            } else {
                clearInterval(interval);
                setIsStreaming(false);
                setInteraction({
                    type: 'success',
                    thoughtText: "All clear! ✨",
                    targetRef: terminalRef,
                });
                setTimeout(() => {
                    clearInteraction(true);
                    setShowExplanation(false);
                }, 4000);
            }
        }, 18);

        return () => clearInterval(interval);
    }, [isStreaming, explanationText, setInteraction, clearInteraction]);

    const pipelineSteps = [
        { label: "Your Prompt", icon: "💬", color: "#10b981" },
        { label: "Plotina AI", icon: "🧠", color: "#3b82f6" },
        { label: "Script", icon: "⚡", color: "#f59e0b" },
        { label: "Revit", icon: "🏗️", color: "#a855f7" },
    ];

    return (
        <SectionWrapper className="relative pt-24 pb-16 flex flex-col justify-center min-h-[90vh] overflow-hidden">
            {/* Animated BG */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.circle cx="20%" cy="30%" r="150" fill="url(#glowGrad)"
                        animate={{ r: [150, 180, 150], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.circle cx="80%" cy="70%" r="200" fill="url(#glowGrad)"
                        animate={{ r: [200, 230, 200], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
                </svg>
            </div>

            {/* Hero Copy */}
            <div className="relative z-10 text-center max-w-4xl mx-auto mb-16 space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4 backdrop-blur-md"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Now available for Revit 2022–2025
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold tracking-tight text-white"
                >
                    Just tell Revit{" "}
                    <span className="text-gradient from-emerald-400 to-emerald-600 bg-gradient-to-r">
                        what you need
                    </span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl mx-auto"
                >
                    Plotina is your AI assistant for Autodesk Revit. Describe your task in plain words — get it done automatically.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
                >
                    <button aria-label="Try Plotina for free" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 primary-glow hover:scale-105">
                        Try for Free
                    </button>
                    <button aria-label="Watch how Plotina works" className="w-full sm:w-auto bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-8 py-3.5 rounded-full font-medium transition-all duration-300 backdrop-blur-sm">
                        Watch Demo
                    </button>
                </motion.div>
            </div>

            {/* Pipeline */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative z-10 max-w-3xl mx-auto mb-16"
            >
                <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-[10%] right-[10%] h-px bg-zinc-800 -translate-y-1/2" />
                    <motion.div
                        className="absolute top-1/2 left-[10%] h-px bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 -translate-y-1/2"
                        initial={{ width: "0%" }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 2.5, delay: 1.2, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                        animate={{ left: ["10%", "90%"] }}
                        transition={{ duration: 3, delay: 1.2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                    />
                    {pipelineSteps.map((step, i) => (
                        <motion.div
                            key={step.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + i * 0.4, duration: 0.5 }}
                            className="relative z-10 flex flex-col items-center gap-2"
                        >
                            <motion.div
                                className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shadow-lg"
                                whileHover={{ scale: 1.1, borderColor: step.color }}
                                animate={{ borderColor: ["rgba(39,39,42,1)", step.color, "rgba(39,39,42,1)"] }}
                                transition={{ duration: 3, delay: 1.2 + i * 0.4, repeat: Infinity, repeatDelay: 2 }}
                                style={{ boxShadow: `0 0 20px ${step.color}15` }}
                            >
                                {step.icon}
                            </motion.div>
                            <span className="text-xs font-medium text-zinc-400">{step.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Code Demo */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-6xl mx-auto w-full"
            >
                {/* User prompt — HUMAN TYPING */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-zinc-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                    <GlassCard className="p-8 relative">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                                <span className="text-sm font-semibold text-zinc-300">U</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl rounded-tl-sm text-zinc-200 shadow-sm border border-white/10 relative overflow-hidden min-h-[52px] font-medium">
                                {displayedPrompt}
                                {isTypingPrompt && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                        className="inline-block w-[2px] h-[18px] bg-emerald-400 ml-0.5 align-middle"
                                    />
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Code terminal + Explain button */}
                <div className="space-y-4">
                    <div
                        className="relative group"
                        onMouseEnter={() => setInteraction({
                            type: 'thinking',
                            thoughtText: "I can explain what this does...",
                            targetRef: terminalRef
                        })}
                        onMouseLeave={() => { if (!showExplanation) clearInteraction(); }}
                        ref={terminalRef}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-zinc-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                        <GlassCard className="p-0 overflow-hidden border-zinc-800/50 bg-[#1e1e1e]/90 backdrop-blur-xl relative">
                            <div className="bg-[#2d2d2d]/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-black/20 terminal-header">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                    </div>
                                    <span className="text-xs text-zinc-400 font-mono">auto-generated.py</span>
                                </div>
                                <button
                                    onClick={startStreaming}
                                    disabled={isStreaming}
                                    className="pointer-events-auto flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all disabled:opacity-50"
                                    aria-label="Ask EVE to explain this code"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {isStreaming ? "Explaining..." : "Explain"}
                                </button>
                            </div>
                            <div className="p-6 font-mono text-sm text-zinc-300 h-[280px] overflow-hidden relative code-block-dark">
                                <motion.pre
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 1.2 }}
                                >
                                    <motion.code
                                        className="block"
                                        initial={{ clipPath: "polygon(0 0, 10% 0, 10% 100%, 0 100%)" }}
                                        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                                        transition={{ duration: 3, delay: 1.5, ease: "linear" }}
                                        dangerouslySetInnerHTML={{ __html: codeString }}
                                    />
                                </motion.pre>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </motion.div>
        </SectionWrapper>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { Rocket, BookOpen, Sparkles, Terminal, CheckCircle2 } from "lucide-react";

const presetPrompts = [
    {
        label: "Extract door widths",
        prompt: "Extract all door widths grouped by type to a CSV file.",
        code: `collector = FilteredElementCollector(doc)
collector.OfCategory(BuiltInCategory.OST_Doors)
doors = collector.WhereElementIsNotElementType().ToElements()

data = {}
for door in doors:
    type_name = door.Name
    width = door.get_Parameter(BuiltInParameter.DOOR_WIDTH).AsDouble()
    width_mm = round(width * 304.8)
    if type_name not in data:
        data[type_name] = []
    data[type_name].append(width_mm)

export_to_csv(data, "door_widths.csv")`,
        result: "✓ 94 doors exported to door_widths.csv"
    },
    {
        label: "Rename views",
        prompt: "Rename all floor plan views to include their level name prefix.",
        code: `t = Transaction(doc, 'Rename Views')
t.Start()

views = FilteredElementCollector(doc).OfClass(View).ToElements()
renamed = 0

for v in views:
    if v.ViewType == ViewType.FloorPlan and not v.IsTemplate:
        level = v.GenLevel
        if level and not v.Name.startswith(level.Name):
            v.Name = f"{level.Name} - {v.Name}"
            renamed += 1

t.Commit()`,
        result: "✓ 18 views renamed successfully"
    },
    {
        label: "Find unplaced rooms",
        prompt: "Find all unplaced rooms and list them with their department.",
        code: `rooms = FilteredElementCollector(doc)
rooms = rooms.OfCategory(BuiltInCategory.OST_Rooms)
rooms = rooms.WhereElementIsNotElementType().ToElements()

unplaced = []
for room in rooms:
    if room.Area == 0:  # Unplaced rooms have 0 area
        dept = room.get_Parameter(
            BuiltInParameter.ROOM_DEPARTMENT
        ).AsString() or "No Department"
        unplaced.append({
            "name": room.get_Parameter(
                BuiltInParameter.ROOM_NAME
            ).AsString(),
            "department": dept
        })

TaskDialog.Show("Unplaced Rooms", str(unplaced))`,
        result: "✓ Found 7 unplaced rooms"
    },
    {
        label: "Delete empty sheets",
        prompt: "Delete all sheets that have no views placed on them.",
        code: `t = Transaction(doc, 'Delete Empty Sheets')
t.Start()

sheets = FilteredElementCollector(doc).OfClass(ViewSheet).ToElements()
deleted = 0

for sheet in sheets:
    placed = sheet.GetAllPlacedViews()
    if placed.Count == 0:
        doc.Delete(sheet.Id)
        deleted += 1

t.Commit()`,
        result: "✓ 3 empty sheets deleted"
    }
];

export function CTASection() {
    const [selectedPrompt, setSelectedPrompt] = useState<typeof presetPrompts[number] | null>(null);
    const [inputValue, setInputValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [displayedCode, setDisplayedCode] = useState("");
    const [showResult, setShowResult] = useState(false);

    const handleGenerate = useCallback(() => {
        const prompt = selectedPrompt || presetPrompts[0];
        if (!prompt || isGenerating) return;

        setIsGenerating(true);
        setDisplayedCode("");
        setShowResult(false);

        const code = prompt.code;
        let charIndex = 0;

        const interval = setInterval(() => {
            charIndex += 2;
            setDisplayedCode(code.slice(0, charIndex));
            if (charIndex >= code.length) {
                clearInterval(interval);
                setIsGenerating(false);
                setShowResult(true);
            }
        }, 15);

        return () => clearInterval(interval);
    }, [selectedPrompt, isGenerating]);

    const handleChipClick = (preset: typeof presetPrompts[number]) => {
        setSelectedPrompt(preset);
        setInputValue(preset.prompt);
        setDisplayedCode("");
        setShowResult(false);
    };

    // Auto-generate on chip click
    useEffect(() => {
        if (selectedPrompt && inputValue === selectedPrompt.prompt) {
            const timer = setTimeout(() => handleGenerate(), 400);
            return () => clearTimeout(timer);
        }
    }, [selectedPrompt, inputValue, handleGenerate]);

    return (
        <SectionWrapper className="py-32 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-emerald-950/20 to-zinc-950 pointer-events-none cta-section-bg" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"
                    >
                        Try your first{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                            prompt
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-xl text-zinc-400 max-w-xl mx-auto"
                    >
                        Pick a task or type your own — see the code Plotina would generate.
                    </motion.p>
                </div>

                {/* Prompt chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    {presetPrompts.map((preset) => (
                        <button
                            key={preset.label}
                            onClick={() => handleChipClick(preset)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${selectedPrompt?.label === preset.label
                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                    : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 hover:border-white/20"
                                }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </motion.div>

                {/* Interactive playground */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <GlassCard className="p-0 overflow-hidden border-zinc-800 bg-[#121212]">
                        {/* Input bar */}
                        <div className="flex items-center gap-3 p-4 border-b border-white/5 bg-white/[0.02]">
                            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setSelectedPrompt(null);
                                }}
                                placeholder="Describe your Revit task in plain language..."
                                className="flex-1 bg-transparent text-zinc-200 placeholder:text-zinc-600 outline-none text-base font-medium"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !inputValue}
                                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/30 disabled:text-zinc-500 text-zinc-950 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 shrink-0"
                            >
                                <Terminal className="w-4 h-4" />
                                {isGenerating ? "Generating..." : "Generate"}
                            </button>
                        </div>

                        {/* Code output */}
                        <AnimatePresence mode="wait">
                            {(displayedCode || isGenerating) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-[#1e1e1e]">
                                        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-black/40">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                                </div>
                                                <span className="text-xs text-zinc-500 font-mono">generated_script.py</span>
                                            </div>
                                            {isGenerating && (
                                                <motion.div
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{ duration: 1.2, repeat: Infinity }}
                                                    className="text-xs text-emerald-400 font-mono"
                                                >
                                                    generating...
                                                </motion.div>
                                            )}
                                        </div>
                                        <pre className="p-6 font-mono text-sm text-[#d4d4d4] overflow-x-auto max-h-[350px]">
                                            <code>
                                                {displayedCode.split('\n').map((line, i) => {
                                                    let formatted = line;
                                                    formatted = formatted.replace(/(import|from|for|in|if|and|not|continue|return|def|class)/g, '<span class="text-pink-400">$1</span>');
                                                    formatted = formatted.replace(/(FilteredElementCollector|Transaction|ViewPlan|TaskDialog)/g, '<span class="text-emerald-300">$1</span>');
                                                    formatted = formatted.replace(/('.*?'|".*?")/g, '<span class="text-yellow-300">$1</span>');
                                                    formatted = formatted.replace(/(#.*)/g, '<span class="text-green-600/70">$1</span>');
                                                    return (
                                                        <div key={i} className="flex min-w-0">
                                                            <span className="text-zinc-600 text-right w-6 mr-4 shrink-0 select-none">
                                                                {i + 1}
                                                            </span>
                                                            <span dangerouslySetInnerHTML={{ __html: formatted || ' ' }} />
                                                        </div>
                                                    );
                                                })}
                                            </code>
                                        </pre>

                                        {/* Result badge */}
                                        <AnimatePresence>
                                            {showResult && selectedPrompt && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="px-6 pb-4"
                                                >
                                                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        {selectedPrompt.result}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </GlassCard>
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
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
                    className="text-sm font-semibold text-zinc-400 text-center"
                >
                    No credit card required · 100 free tasks · Revit 2022-2025
                </motion.p>
            </div>
        </SectionWrapper>
    );
}

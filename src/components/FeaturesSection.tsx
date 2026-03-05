"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Database, Copy, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEve } from "@/contexts/EveContext";

const features = [
    {
        id: "extraction",
        title: "Data Extraction",
        icon: <Database className="w-5 h-5" />,
        prompt: "Extract all structural column volumes grouped by level to a CSV.",
        code: `import csv\ncollector = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_StructuralColumns)\ncolumns = collector.WhereElementIsNotElementType().ToElements()\n\ndata = []\nfor col in columns:\n    vol = col.get_Parameter(BuiltInParameter.HOST_VOLUME_COMPUTED).AsDouble()\n    level = doc.GetElement(col.LevelId).Name\n    data.append([level, vol])\n\n# ... writing to CSV`,
        successMessage: "142 elements extracted in 0.8s",
        explanation: "I grab all columns using a FilteredElementCollector, pull out the computed volume parameter from each, and map them to their Level names!"
    },
    {
        id: "editing",
        title: "Mass Editing",
        icon: <Copy className="w-5 h-5" />,
        prompt: "Change all generic 200mm walls to 250mm brick walls on Level 2.",
        code: `t = Transaction(doc, 'Mass Edit Walls')\nt.Start()\n\nwalls = FilteredElementCollector(doc).OfClass(Wall).ToElements()\nnew_type_id = GetWallTypeIdByName(doc, "250mm Brick")\n\nfor w in walls:\n    if w.Name == "Generic - 200mm" and doc.GetElement(w.LevelId).Name == "Level 2":\n        w.ChangeTypeId(new_type_id)\n\nt.Commit()`,
        successMessage: "86 walls updated in 1.2s",
        explanation: "I open a Transaction, find the internal ID for '250mm Brick', and loop through Level 2 to instantly swap out the wall types."
    },
    {
        id: "coordination",
        title: "BIM Coordination",
        icon: <CheckCircle2 className="w-5 h-5" />,
        prompt: "Find all pipes clashing with structural framing.",
        code: `pipes = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_PipeCurves).ToElements()\nframing = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_StructuralFraming).ToElements()\n\nclashes = []\nfor p in pipes:\n    p_box = p.get_BoundingBox(None)\n    if not p_box: continue\n    outline = Outline(p_box.Min, p_box.Max)\n    filter = BoundingBoxIntersectsFilter(outline)\n    \n    clashing_frames = FilteredElementCollector(doc, framing.Select(lambda x: x.Id).ToList()).WherePasses(filter).ToElements()\n    if clashing_frames:\n        clashes.append((p.Id, [f.Id for f in clashing_frames]))`,
        successMessage: "Identified 14 clash instances",
        explanation: "I create a 3D BoundingBox around each pipe and run a super-fast IntersectionFilter against the structural framing elements to find clashes."
    },
    {
        id: "documentation",
        title: "Documentation",
        icon: <FileText className="w-5 h-5" />,
        prompt: "Create floor plan views for all levels and apply 'Architectural' view template.",
        code: `t = Transaction(doc, 'Create Views')\nt.Start()\n\nlevels = FilteredElementCollector(doc).OfClass(Level).ToElements()\nview_family = GetViewFamilyType(doc, ViewFamily.FloorPlan)\ntemplate = GetViewTemplateByName(doc, "Architectural")\n\nfor l in levels:\n    view = ViewPlan.Create(doc, view_family.Id, l.Id)\n    if template:\n        view.ViewTemplateId = template.Id\n\nt.Commit()`,
        successMessage: "Created 12 views with templates",
        explanation: "I loop through every Level in the project, generate a new Floor Plan view for each, and assign the 'Architectural' template in one go!"
    }
];

export function FeaturesSection() {
    const { setInteraction, clearInteraction } = useEve();
    const [activeTab, setActiveTab] = useState(features[0].id);

    const activeFeature = features.find(f => f.id === activeTab) || features[0];

    return (
        <SectionWrapper id="features" className="py-24 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="text-center mb-16 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
                >
                    Limitless automation. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
                        Zero API knowledge required.
                    </span>
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto relative z-10">
                {/* Left sidebar tabs */}
                <div className="lg:col-span-4 flex flex-row overflow-x-auto snap-x snap-mandatory gap-2 pb-2 lg:pb-0 scrollbar-hide lg:flex-col lg:overflow-visible">
                    {features.map((feature) => {
                        const isActive = activeTab === feature.id;
                        return (
                            <button
                                key={feature.id}
                                onClick={() => setActiveTab(feature.id)}
                                className={cn(
                                    "flex items-center shrink-0 w-[240px] lg:w-auto gap-4 text-left p-4 rounded-xl transition-all duration-300 border backdrop-blur-md relative overflow-hidden group snap-center",
                                    isActive
                                        ? "feature-tab-active bg-zinc-800/80 border-emerald-500/30 text-white shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                        : "feature-tab-inactive bg-transparent border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <div className={cn(
                                    "p-2 rounded-lg transition-colors duration-300",
                                    isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-zinc-500 group-hover:text-zinc-300 group-hover:bg-white/10"
                                )}>
                                    {feature.icon}
                                </div>
                                <div className="font-semibold text-sm md:text-base">
                                    {feature.title}
                                </div>
                                <div className={cn(
                                    "ml-auto transition-transform duration-300",
                                    isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                                )}>
                                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Right content area */}
                <div className="lg:col-span-8">
                    <GlassCard className="h-full min-h-[450px] overflow-hidden flex flex-col bg-[#121212] border-zinc-800">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col h-full"
                            >
                                {/* Prompt Section */}
                                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                    <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Natural Language Prompt</div>
                                    <div className="text-lg md:text-xl text-zinc-200 font-medium">
                                        "{activeFeature.prompt}"
                                    </div>
                                </div>

                                {/* Code Window */}
                                <div className="flex-1 bg-[#1e1e1e] p-0 flex flex-col relative">
                                    <div className="bg-[#2d2d2d] px-4 py-2 flex items-center border-b border-black/40">
                                        <div className="text-xs text-zinc-400 font-mono">script.py</div>
                                    </div>
                                    <pre className="p-6 font-mono text-sm leading-relaxed text-[#d4d4d4] overflow-x-auto">
                                        <code>
                                            {activeFeature.code.split('\n').map((line, i) => {
                                                let formattedLine = line;
                                                formattedLine = formattedLine.replace(/(import|from|for|in|if|and|not|continue)/g, '<span class="text-pink-400">$1</span>');
                                                formattedLine = formattedLine.replace(/(FilteredElementCollector|Transaction|Outline|BoundingBoxIntersectsFilter)/g, '<span class="text-emerald-300">$1</span>');
                                                formattedLine = formattedLine.replace(/('.*?'|".*?")/g, '<span class="text-yellow-300">$1</span>');
                                                formattedLine = formattedLine.replace(/(#.*)/g, '<span class="text-green-600/70">$1</span>');

                                                return (
                                                    <div
                                                        key={i}
                                                        className="flex hover:bg-white/[0.03] transition-colors duration-150 -mx-6 px-6 group/line"
                                                    >
                                                        <span className="text-zinc-600 text-right w-8 mr-4 shrink-0 select-none group-hover/line:text-zinc-400 transition-colors">
                                                            {i + 1}
                                                        </span>
                                                        <span dangerouslySetInnerHTML={{ __html: formattedLine || ' ' }} />
                                                    </div>
                                                );
                                            })}
                                        </code>
                                    </pre>

                                    {/* Success Badge & Explain Button */}
                                    <div className="absolute bottom-6 right-6 flex items-center gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onMouseEnter={(e) => {
                                                setInteraction({
                                                    type: 'explaining',
                                                    thoughtText: activeFeature.explanation,
                                                    targetRef: { current: e.currentTarget } as React.RefObject<HTMLElement>
                                                })
                                            }}
                                            onMouseLeave={() => clearInteraction()}
                                            className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-md flex items-center gap-2 hover:bg-blue-500/30 transition-colors"
                                        >
                                            Explain Code
                                        </motion.button>

                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                            className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-md flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            {activeFeature.successMessage}
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </GlassCard>
                </div>
            </div>
        </SectionWrapper>
    );
}

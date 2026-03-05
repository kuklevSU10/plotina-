"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Sparkles } from "lucide-react";
import { useState } from "react";

export function Footer() {
    const [prompt, setPrompt] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setPrompt("");
            }, 3000);
        }
    };

    return (
        <footer className="footer-themed bg-zinc-950 pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
            {/* Subtle animated bg */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Try your first prompt — interactive mini-input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 max-w-xl mx-auto"
                >
                    <div className="text-center mb-4">
                        <span className="text-sm text-zinc-400 font-medium flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            Try your first prompt
                        </span>
                    </div>
                    <form onSubmit={handleSubmit} className="relative group">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Count all unplaced rooms in the model..."
                            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl px-5 py-3.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 pr-24 font-mono"
                        />
                        <button
                            type="submit"
                            aria-label="Generate code from prompt"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-medium px-4 py-2 rounded-lg border border-emerald-500/30 transition-colors"
                        >
                            {submitted ? "✓ Sent!" : "Generate"}
                        </button>
                    </form>
                    {submitted && (
                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-emerald-400 text-center mt-2"
                        >
                            Sign up for free to see the generated IronPython code →
                        </motion.p>
                    )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center border border-white/10">
                                <span className="text-white font-bold text-sm">P</span>
                            </div>
                            <div className="text-xl font-bold tracking-tight text-white">
                                Plotina<span className="text-emerald-500">.</span>
                            </div>
                        </div>
                        <p className="text-sm text-zinc-400 mb-6 max-w-xs">
                            Your AI-powered assistant for Autodesk Revit. Describe tasks in plain words and let Plotina handle the rest.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" aria-label="Follow us on Twitter" className="footer-icon text-zinc-500 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" aria-label="View our GitHub repository" className="footer-icon text-zinc-500 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" aria-label="Connect with us on LinkedIn" className="footer-icon text-zinc-500 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-3">
                            <li><Link href="#features" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Download Plugin</Link></li>
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Community Forum</Link></li>
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Prompt Library</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-sm text-zinc-400 hover:text-emerald-400 transition-colors">Security</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-zinc-500">
                        © {new Date().getFullYear()} Plotina. Automating the built environment.
                    </p>
                    <div className="flex gap-6 text-xs text-zinc-500">
                        <span>Built for Revit 2022-2025</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

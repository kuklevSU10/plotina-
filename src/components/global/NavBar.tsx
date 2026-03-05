"use client";

import { ThemeToggle } from "@/components/global/ThemeToggle";

export function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1e1e1e] border-b border-white/10 shadow-md nav-themed">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 h-14">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-emerald-500 rounded flex items-center justify-center shadow-inner">
                            <span className="text-[#1e1e1e] font-black text-xs tracking-tighter">P</span>
                        </div>
                        <div className="text-lg font-semibold tracking-tight text-zinc-100 nav-brand">
                            Plotina 2026
                        </div>
                    </div>

                    {/* Revit ribbon style tabs */}
                    <div className="hidden md:flex items-center h-full ml-4">
                        <a href="#features" aria-label="View features" className="h-14 px-4 flex items-center text-xs font-medium text-zinc-400 hover:text-emerald-400 hover:bg-white/5 border-b-2 border-transparent hover:border-emerald-500 transition-colors nav-link">Features</a>
                        <a href="#security" aria-label="View security details" className="h-14 px-4 flex items-center text-xs font-medium text-zinc-400 hover:text-emerald-400 hover:bg-white/5 border-b-2 border-transparent hover:border-emerald-500 transition-colors nav-link">Security</a>
                        <a href="#pricing" aria-label="View pricing plans" className="h-14 px-4 flex items-center text-xs font-medium text-zinc-400 hover:text-emerald-400 hover:bg-white/5 border-b-2 border-transparent hover:border-emerald-500 transition-colors nav-link">Pricing</a>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button aria-label="Sign in to your account" className="text-xs font-medium text-white bg-zinc-700 hover:bg-zinc-600 px-4 py-1.5 rounded transition-colors border border-white/10 shadow-sm nav-signin">
                        Sign In
                    </button>
                    <button aria-label="Get early access to Plotina" className="text-xs font-medium text-[#1e1e1e] bg-emerald-500 hover:bg-emerald-400 px-4 py-1.5 rounded transition-colors shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        Get Early Access
                    </button>
                </div>
            </div>
        </nav>
    );
}

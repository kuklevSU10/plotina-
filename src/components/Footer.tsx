import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-zinc-950 pt-20 pb-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
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
                            The intelligent infrastructure layer bridging natural language and Autodesk Revit automation.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-zinc-500 hover:text-white transition-colors">
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

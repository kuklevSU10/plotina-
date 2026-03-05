import { cn } from "@/lib/utils";
import React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    glow?: boolean;
}

export function GlassCard({ className, children, glow = false, ...props }: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300",
                glow && "border-white/20 shadow-[0_0_30px_rgba(34,197,94,0.15)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

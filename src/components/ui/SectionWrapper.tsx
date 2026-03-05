"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React, { forwardRef } from "react";

export interface SectionWrapperProps extends HTMLMotionProps<"section"> { }

export const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
    function SectionWrapper({ className, children, ...props }, ref) {
        return (
            <motion.section
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn("py-24 px-6 md:px-12 max-w-7xl mx-auto w-full", className)}
                {...props}
            >
                {children}
            </motion.section>
        );
    }
);

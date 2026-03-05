import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plotina | AI-Powered Revit Automation",
  description: "The infrastructure layer for BIM automation. Turn natural language into executable IronPython instantly.",
};

import { EveProvider } from "@/contexts/EveContext";
import { CustomCursor } from "@/components/global/CustomCursor";
import { EveCompanion } from "@/components/global/EveCompanion";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans bg-zinc-950 text-zinc-100 cursor-none`}
      >
        <EveProvider>
          <CustomCursor />
          <EveCompanion />
          {children}
        </EveProvider>
      </body>
    </html>
  );
}

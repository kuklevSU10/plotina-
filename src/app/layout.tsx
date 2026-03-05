import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plotina | AI Assistant for Autodesk Revit",
  description: "Describe your Revit task in plain words — Plotina writes the code and runs it for you. AI-powered automation for architects and engineers.",
  openGraph: {
    title: "Plotina | AI Assistant for Autodesk Revit",
    description: "Describe your Revit task in plain words — Plotina writes the code and runs it for you.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plotina | AI Assistant for Autodesk Revit",
    description: "Describe your Revit task in plain words — Plotina writes the code and runs it for you.",
  },
};

import { EveProvider } from "@/contexts/EveContext";
import { CustomCursor } from "@/components/global/CustomCursor";
import { EveCompanion } from "@/components/global/EveCompanion";
import { ThemeProvider } from "@/components/global/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#09090b' }}>
      <head>
        {/* Inline script to set theme before paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('plotina-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');document.documentElement.style.backgroundColor='#ffffff'}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased font-sans cursor-none`}
      >
        <ThemeProvider>
          <EveProvider>
            <CustomCursor />
            <EveCompanion />
            {children}
          </EveProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

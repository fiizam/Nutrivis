// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "NutriVision AI | Advanced Diet Protocol",
  description: "Sistem Rekomendasi Diet Presisi Tinggi berbasis AI dan Dataset TKPI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth dark">
      <body className={`${inter.variable} ${space.variable} font-sans antialiased bg-[#050505] text-neutral-200 flex flex-col min-h-screen selection:bg-[#00FFB2]/30 selection:text-white`}>
        <div className="bg-aurora"></div>
        <Navbar />
        <main className="relative z-10 flex-grow pt-24 pb-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
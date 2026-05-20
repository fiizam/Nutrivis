// src/app/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 text-center relative">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00FFB2] animate-pulse"></span>
          <span className="text-xs font-semibold text-neutral-300 tracking-wider uppercase">System Ready & Optimized</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl font-space font-extrabold text-white tracking-tighter leading-tight">
          Precision Nutrition.<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FFB2] to-[#00A3FF]">Powered by AI.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
          Kalkulasi target diet dinamis dan protokol olahraga personal menggunakan Algoritma Greedy berbasis dataset pangan Nusantara (TKPI).
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link href="/planner">
            <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 hover:bg-[#00FFB2] hover:shadow-[0_0_30px_rgba(0,255,178,0.3)] transition-all duration-300">
              Mulai Analisis <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </motion.div>

      </motion.div>

      {/* Feature Cards Floating */}
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
        {[
          { icon: Target, title: "Dynamic Targets", desc: "TDEE adaptif menyesuaikan fase diet (Surplus, Defisit, atau Maintenance)." },
          { icon: Zap, title: "Greedy Optimization", desc: "Pemilihan menu paling optimal dengan Constraint Satisfaction Problem." },
          { icon: ShieldCheck, title: "Validated Data", desc: "Dataset tervalidasi Kemenkes, USDA, dan Compendium of Physical Activities." }
        ].map((feature, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (idx * 0.1) }}
            className="glass-panel p-8 text-left hover:border-white/20 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#00FFB2]/10 group-hover:text-[#00FFB2] group-hover:border-[#00FFB2]/30 transition-all">
              <feature.icon className="w-6 h-6 text-neutral-300 group-hover:text-[#00FFB2]" />
            </div>
            <h3 className="text-xl font-space font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-neutral-500 text-sm leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
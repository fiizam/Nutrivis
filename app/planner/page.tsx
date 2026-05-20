// src/app/planner/page.tsx
'use client';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Plus, Minus, Activity, Eye, X, Flame, Target, Utensils, 
  Info, CheckCircle2, ChevronRight, Droplets, Moon, Award, ArrowRightLeft,
  Coffee, Footprints, Zap, ArrowDownToLine, Scale, ArrowUpToLine, Leaf, Orbit, Beef,
  TrendingDown, TrendingUp, AlertTriangle, CalendarDays, Sparkles, LayoutDashboard, Dumbbell, Apple
} from 'lucide-react';
import { FormDataUser, HasilRekomendasi } from '@/types';
import { calculateEnergi } from '@/lib/algorithms'; 
import Link from 'next/link';

// CUSTOM BENTO COMPONENT
const BentoNumberInput = ({ label, value, onChange, unit, min = 0, placeholder="0" }: any) => {
  return (
    <div className={`relative flex flex-col p-3 rounded-2xl border bg-black/40 backdrop-blur-md transition-all duration-300 ${(value > 0 || placeholder!=="0") ? 'border-white/10 hover:border-[#00FFB2]/40' : 'border-red-500/50'}`}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">{label}</span>
      <div className="flex items-end gap-1 mb-3">
        <input 
          type="number" 
          value={value || ''} 
          onChange={(e) => onChange(Number(e.target.value) || 0)} 
          placeholder={placeholder}
          className="w-full bg-transparent text-2xl font-space font-bold text-white outline-none placeholder:text-neutral-700 p-0 m-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
        />
        <span className="text-xs font-medium text-neutral-600 mb-1">{unit}</span>
      </div>
      <div className="flex justify-between items-center mt-auto border-t border-white/5 pt-2">
        <button type="button" onClick={() => onChange(value > min ? value - 1 : min)} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 text-neutral-400 active:scale-90 transition-all"><Minus className="w-3 h-3" /></button>
        <button type="button" onClick={() => onChange(value + 1)} className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#00FFB2]/20 hover:text-[#00FFB2] text-neutral-400 active:scale-90 transition-all"><Plus className="w-3 h-3" /></button>
      </div>
    </div>
  );
};

export default function PlannerPage() {
  const [formData, setFormData] = useState<FormDataUser>({ 
    berat: 0, tinggi: 0, umur: 0, target_berat: 0, 
    gender: 'pria', aktivitas: 'moderate', targetDiet: 'stabil', preferensi: 'seimbang', pantangan: '' 
  });
  
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState<HasilRekomendasi | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'meals' | 'workout'>('dashboard');

  const derivedTargetDiet = (!formData.target_berat || formData.target_berat === formData.berat) 
    ? 'stabil' 
    : (formData.berat > formData.target_berat ? 'turun' : 'naik');

  const isFormValid = formData.berat > 0 && formData.tinggi > 0 && formData.umur > 0;

  const handlePreview = () => {
    if (!isFormValid) return alert("Biometrik wajib (Berat, Tinggi, Usia) tidak valid.");
    const { bmr, tdeeDasar } = calculateEnergi(formData.umur, formData.gender, formData.berat, formData.tinggi, formData.aktivitas);
    setPreviewData({ bmr: Math.round(bmr), tdee: Math.round(tdeeDasar) });
    setShowModal(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setLoading(true);
    
    const payload = { ...formData, targetDiet: derivedTargetDiet };

    try {
      const res = await fetch('/api/planner', { method: 'POST', body: JSON.stringify(payload) });
      const data = await res.json();
      if(data.success) { 
        setHasil(data.data); 
        setActiveTab('dashboard'); 
      }
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00FFB2] selection:text-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4 pb-12 items-start">
        
        {/* ================= PANEL KIRI: FORM HUD ================= */}
        <div className="lg:col-span-5 space-y-6 relative z-10 lg:sticky lg:top-24">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Link href="/" className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-4"><ChevronRight className="w-3 h-3 mr-1 rotate-180" /> Back to Core</Link>
            <h2 className="text-3xl font-space font-bold text-white mb-1 leading-tight">Biometric<br/><span className="text-[#00FFB2]">Calibration</span></h2>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute -inset-4 bg-[#050505]/80 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-3xl">
                  <div className="relative"><div className="w-16 h-16 rounded-full border-2 border-[#00FFB2]/20 animate-ping absolute inset-0"></div><Loader2 className="w-16 h-16 text-[#00FFB2] animate-spin relative z-10" /></div>
                  <p className="text-[#00FFB2] font-space font-semibold mt-4 text-xs uppercase animate-pulse">Running Neural Protocols...</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <BentoNumberInput label="Berat" value={formData.berat} onChange={(v:number) => setFormData({...formData, berat: v})} unit="Kg" />
              <BentoNumberInput label="Tinggi" value={formData.tinggi} onChange={(v:number) => setFormData({...formData, tinggi: v})} unit="Cm" />
              <BentoNumberInput label="Usia" value={formData.umur} onChange={(v:number) => setFormData({...formData, umur: v})} unit="Th" />
              <BentoNumberInput label="Target (Opt)" value={formData.target_berat} onChange={(v:number) => setFormData({...formData, target_berat: v})} unit="Kg" placeholder="-" />
            </div>

            <div className="bg-black/40 border border-white/10 p-1.5 rounded-2xl flex relative">
              <div className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] bg-white/10 rounded-xl transition-transform duration-500" style={{ transform: formData.gender === 'wanita' ? 'translateX(100%)' : 'translateX(0)' }}></div>
              <button type="button" onClick={() => setFormData({...formData, gender: 'pria'})} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest z-10 transition-colors ${formData.gender === 'pria' ? 'text-white' : 'text-neutral-500'}`}>Pria</button>
              <button type="button" onClick={() => setFormData({...formData, gender: 'wanita'})} className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest z-10 transition-colors ${formData.gender === 'wanita' ? 'text-white' : 'text-neutral-500'}`}>Wanita</button>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Level Aktivitas Fisik</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sedentary', label: 'Sedentary', desc: 'Jarang gerak', icon: Coffee },
                  { id: 'light', label: 'Light', desc: '1-3x Seminggu', icon: Footprints },
                  { id: 'moderate', label: 'Moderate', desc: '3-5x Seminggu', icon: Activity },
                  { id: 'active', label: 'Active', desc: 'Sangat rutin', icon: Zap },
                ].map((opt) => (
                  <button type="button" key={opt.id} onClick={() => setFormData({...formData, aktivitas: opt.id})}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all duration-300 ${formData.aktivitas === opt.id ? 'bg-[#00FFB2]/10 border-[#00FFB2]' : 'bg-black/40 border-white/5'}`}>
                    <opt.icon className={`w-5 h-5 flex-shrink-0 ${formData.aktivitas === opt.id ? 'text-[#00FFB2]' : 'text-neutral-600'}`} />
                    <div><div className={`text-xs font-bold ${formData.aktivitas === opt.id ? 'text-white' : 'text-neutral-400'}`}>{opt.label}</div></div>
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={handlePreview} className="w-full py-3 border border-white/10 bg-white/5 text-neutral-400 hover:text-[#00FFB2] flex justify-center items-center gap-2 text-xs font-bold uppercase rounded-xl transition-all hover:bg-[#00FFB2]/10"><Eye className="w-4 h-4"/> Scan TDEE Dasar</button>

            <div className="bg-gradient-to-r from-black/60 to-black/20 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">AI Target Mode</p>
                    <div className="flex items-center gap-1">
                      {derivedTargetDiet === 'turun' ? <span className="text-[#00FFB2] font-space font-bold flex items-center gap-1 text-sm"><ArrowDownToLine className="w-4 h-4"/> Defisit (Turun BB)</span> :
                       derivedTargetDiet === 'naik' ? <span className="text-[#00A3FF] font-space font-bold flex items-center gap-1 text-sm"><ArrowUpToLine className="w-4 h-4"/> Surplus (Naik BB)</span> :
                       <span className="text-white font-space font-bold flex items-center gap-1 text-sm"><Scale className="w-4 h-4"/> Maintenance (Stabil)</span>}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Sparkles className={`w-4 h-4 ${derivedTargetDiet==='turun'?'text-[#00FFB2]':derivedTargetDiet==='naik'?'text-[#00A3FF]':'text-white'}`} />
                  </div>
               </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 block">Preferensi Makro Nutrisi</label>
              <div className="grid grid-cols-1 gap-1.5 bg-black/50 p-1.5 rounded-xl border border-white/5">
                {[ 
                  { id: 'seimbang', icon: Orbit, label: 'Balanced Macro', recFor: ['stabil', 'naik'] }, 
                  { id: 'rendah_karbo', icon: Leaf, label: 'Low Carbohydrate', recFor: ['turun'] }, 
                  { id: 'tinggi_protein', icon: Beef, label: 'High Protein', recFor: ['turun', 'naik'] } 
                ].map(opt => {
                  const isRecommended = opt.recFor.includes(derivedTargetDiet);
                  return (
                  <button type="button" key={opt.id} onClick={() => setFormData({...formData, preferensi: opt.id})} 
                    className={`w-full py-2.5 px-3 rounded-lg flex items-center justify-between text-xs font-bold transition-all ${formData.preferensi === opt.id ? 'bg-[#00FFB2]/10 text-[#00FFB2] border border-[#00FFB2]/30' : 'text-neutral-400 hover:text-neutral-200 border border-transparent hover:bg-white/5'}`}>
                    <div className="flex items-center gap-2"><opt.icon className="w-4 h-4" /> {opt.label}</div>
                    {isRecommended && <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#00A3FF]/20 text-[#00A3FF] border border-[#00A3FF]/30">Disarankan AI</span>}
                  </button>
                )})}
              </div>
            </div>

            <div className="relative group">
              <input type="text" value={formData.pantangan} onChange={(e) => setFormData({...formData, pantangan: e.target.value})} placeholder=" " className="block w-full pt-5 pb-2 px-0 text-white bg-transparent border-0 border-b-2 border-white/20 focus:outline-none focus:ring-0 focus:border-[#00FFB2] peer transition-colors text-sm" />
              <label className="absolute text-xs text-neutral-500 duration-300 transform -translate-y-4 scale-75 top-3.5 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[#00FFB2]">Alergi (Cth: Susu, Kacang)</label>
            </div>

            <button type="submit" disabled={!isFormValid || loading} className="w-full h-14 rounded-xl bg-white text-black font-space font-bold text-base hover:bg-[#00FFB2] hover:shadow-[0_0_30px_rgba(0,255,178,0.3)] transition-all disabled:opacity-30 active:scale-[0.98]">Initialize Neural Protocol</button>
          </form>
        </div>

        {/* ================= PANEL KANAN: HASIL AI ================= */}
        <div className="lg:col-span-7">
          {!hasil ? (
            <div className="h-full min-h-[600px] rounded-3xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center">
              <Target className="w-12 h-12 opacity-30 text-white mb-4"/>
              <p className="font-space text-xl text-neutral-500">System Standby</p>
              <p className="text-xs text-neutral-600 mt-2">Menunggu parameter untuk kalkulasi.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col h-full space-y-4">
              
              <div className="flex space-x-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'dashboard' ? 'bg-white/10 text-white shadow-md' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}>
                  <LayoutDashboard className="w-4 h-4"/> Overview
                </button>
                <button onClick={() => setActiveTab('meals')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'meals' ? 'bg-[#00FFB2]/20 text-[#00FFB2] border border-[#00FFB2]/30 shadow-[0_0_15px_rgba(0,255,178,0.1)]' : 'text-neutral-500 hover:text-[#00FFB2] hover:bg-white/5'}`}>
                  <Apple className="w-4 h-4"/> Nutrisi
                </button>
                <button onClick={() => setActiveTab('workout')} className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === 'workout' ? 'bg-[#8A2BE2]/20 text-[#8A2BE2] border border-[#8A2BE2]/30 shadow-[0_0_15px_rgba(138,43,226,0.1)]' : 'text-neutral-500 hover:text-[#8A2BE2] hover:bg-white/5'}`}>
                  <Dumbbell className="w-4 h-4"/> Latihan
                </button>
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  
                  {activeTab === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#050505] to-[#00A3FF]/10 border border-[#00A3FF]/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A3FF]/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                          <h3 className="text-xl font-space font-bold text-white flex items-center gap-2"><CalendarDays className="w-5 h-5 text-[#00A3FF]" /> Prediction Timeline</h3>
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${hasil.prediksi.warning ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-[#00A3FF]/20 text-[#00A3FF] border border-[#00A3FF]/50'}`}>
                            {hasil.prediksi.kalori_harian_status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-black/60 border border-white/5 p-4 rounded-2xl relative z-10 mb-4">
                          <div className="text-center">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Current</p>
                            <p className="font-space font-bold text-2xl text-white">{formData.berat}<span className="text-sm font-sans text-neutral-500">kg</span></p>
                          </div>
                          <div className="flex-1 px-4 relative flex flex-col items-center">
                            <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut" }} className={`absolute top-0 left-0 h-full ${derivedTargetDiet === 'turun' ? 'bg-gradient-to-r from-transparent to-[#00FFB2]' : derivedTargetDiet === 'naik' ? 'bg-gradient-to-r from-transparent to-[#00A3FF]' : 'bg-neutral-500'}`}></motion.div>
                            </div>
                            {hasil.prediksi.minggu_estimasi > 0 && (
                              <div className="absolute -top-3 px-2 py-0.5 bg-[#050505] border border-white/10 rounded-full text-[10px] text-neutral-300 font-bold flex items-center gap-1">
                                {derivedTargetDiet === 'turun' ? <TrendingDown className="w-3 h-3 text-[#00FFB2]"/> : derivedTargetDiet === 'naik' ? <TrendingUp className="w-3 h-3 text-[#00A3FF]"/> : null}
                                ETA: {hasil.prediksi.minggu_estimasi} Minggu
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Target</p>
                            <p className="font-space font-bold text-2xl text-white">{formData.target_berat || formData.berat}<span className="text-sm font-sans text-neutral-500">kg</span></p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                          <div className="bg-white/5 p-3 rounded-xl">
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Rate of Change</p>
                            <p className="font-space font-bold text-white text-lg">{hasil.prediksi.perubahan_per_minggu} <span className="text-xs font-sans text-neutral-400">kg/Mgg</span></p>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl flex items-center">
                            <p className="text-[10px] text-neutral-300 leading-tight">{hasil.prediksi.rekomendasi_konsistensi}</p>
                          </div>
                        </div>
                        <div className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2 relative z-10 ${hasil.prediksi.warning ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-[#00FFB2]/10 border-[#00FFB2]/30 text-[#00FFB2]'}`}>
                          {hasil.prediksi.warning ? <AlertTriangle className="w-4 h-4 flex-shrink-0" /> : <Info className="w-4 h-4 flex-shrink-0" />}
                          <p>{hasil.prediksi.pesan_realistis}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-center"><Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-2"/><p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Hidrasi</p><p className="text-xl font-space font-bold text-white">{hasil.holistic.air_liter}L</p></div>
                        <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl text-center"><Moon className="w-5 h-5 text-indigo-400 mx-auto mb-2"/><p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-1">Tidur</p><p className="text-sm font-space font-bold text-white mt-1">{hasil.holistic.tidur_jam}</p></div>
                        <div className="bg-gradient-to-t from-[#0a0a0a] to-[#00FFB2]/10 border border-[#00FFB2]/20 p-4 rounded-2xl text-center"><Award className="w-5 h-5 text-[#00FFB2] mx-auto mb-2"/><p className="text-[10px] text-[#00FFB2] uppercase font-bold tracking-widest mb-1">AI Score</p><p className="text-xl font-space font-bold text-white">{hasil.holistic.ai_health_score}<span className="text-xs text-[#00FFB2]/70">/100</span></p></div>
                      </div>

                      <div className="rounded-3xl p-6 bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
                        <div className="flex justify-between items-end mb-5 relative z-10">
                          <h3 className="text-xl font-space font-bold text-white">Macro Tracker</h3>
                          <div className="text-right"><p className="text-[10px] text-neutral-500 uppercase">Target TDEE</p><p className="text-3xl font-space text-[#00FFB2] font-bold">{hasil.energi.tdeeTarget}</p></div>
                        </div>
                        <div className="space-y-4 relative z-10">
                          {[ { label: "Protein", val: (hasil.menu.sarapan.totalProtein+hasil.menu.siang.totalProtein+hasil.menu.malam.totalProtein), tar: hasil.macroTargets.protein, color: "bg-red-500" },
                             { label: "Lemak", val: (hasil.menu.sarapan.totalLemak+hasil.menu.siang.totalLemak+hasil.menu.malam.totalLemak), tar: hasil.macroTargets.lemak, color: "bg-yellow-500" },
                             { label: "Karbohidrat", val: (hasil.menu.sarapan.totalKarbo+hasil.menu.siang.totalKarbo+hasil.menu.malam.totalKarbo), tar: hasil.macroTargets.karbo, color: "bg-blue-500" },
                          ].map(m => (
                            <div key={m.label}>
                              <div className="flex justify-between text-xs text-white mb-1.5 font-semibold"><span>{m.label}</span><span>{Math.round(m.val)}g / {m.tar}g</span></div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className={`h-full ${m.color}`} style={{width: `${Math.min((m.val/m.tar)*100, 100)}%`}}></div></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'meals' && (
                    <motion.div key="meals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                      
                      <div className="rounded-2xl p-5 bg-gradient-to-r from-black/40 to-[#00FFB2]/5 border border-white/5 relative overflow-hidden">
                         <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#00FFB2]/10 border border-[#00FFB2]/20 flex items-center justify-center flex-shrink-0">
                              <Award className="w-5 h-5 text-[#00FFB2]" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white mb-1">AI Scientific Insight</h4>
                              <p className="text-xs text-neutral-400 leading-relaxed">{hasil.prediksi.smart_nutrition_insight}</p>
                            </div>
                         </div>
                      </div>

                      {(['sarapan', 'siang', 'malam'] as const).map(sesi => {
                        const targetSesi = Math.round(hasil.energi.tdeeTarget * (sesi === 'siang' ? 0.4 : 0.3));
                        const persentase = Math.min((hasil.menu[sesi].totalKalori / targetSesi) * 100, 100);

                        return (
                          <div key={sesi} className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden relative">
                            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#00FFB2] to-[#00A3FF]" style={{ width: `${persentase}%` }}></div>
                            <div className="p-5">
                              <div className="flex justify-between items-center mb-4">
                                <h5 className="font-space text-lg font-bold text-white capitalize flex items-center gap-2"><Utensils className="w-4 h-4 text-[#00A3FF]"/> {sesi}</h5>
                                <div className="text-right bg-white/5 px-2 py-1 rounded-lg border border-white/5"><span className="text-sm font-bold text-white">{Math.round(hasil.menu[sesi].totalKalori)}</span><span className="text-[10px] uppercase text-neutral-500 ml-1">/ {targetSesi} kcal</span></div>
                              </div>

                              <div className="space-y-3">
                                {hasil.menu[sesi].menu.length === 0 ? (
                                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-neutral-500 flex items-center gap-2"><Info className="w-4 h-4"/> Tidak ada kandidat lolos filter CSP.</div>
                                ) : (
                                  hasil.menu[sesi].menu.map((item, i) => (
                                    <div key={i} className="bg-black/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
                                      <div className="flex justify-between items-start gap-3">
                                        <div>
                                          <span className="px-2 py-1 bg-white/10 text-neutral-300 rounded text-[8px] font-bold uppercase tracking-widest mb-1.5 inline-block border border-white/5">Basis: {item.nama_bahan}</span>
                                          <p className="font-semibold text-white text-base leading-tight">{item.nama_masakan}</p>
                                          <p className="text-[10px] text-neutral-500 mt-1">Sajian: {item.ukuran_sajian} • Na: {item.natrium}mg</p>
                                        </div>
                                        <span className="font-space font-bold text-xl text-[#00FFB2] whitespace-nowrap">{item.kalori} <span className="text-[10px] text-neutral-500 font-sans font-normal">kcal</span></span>
                                      </div>
                                      <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed border-t border-white/5 pt-2"><span className="text-[#00A3FF] font-semibold">Insight:</span> {item.alasan}</p>
                                      
                                      {item.alternatif_olahan.length > 0 && (
                                        <div className="mt-1 pt-2 border-t border-white/5">
                                          <p className="text-[9px] text-neutral-500 uppercase flex items-center gap-1 mb-1.5 font-bold tracking-widest"><ArrowRightLeft className="w-3 h-3"/> Food Substitution</p>
                                          <div className="flex flex-wrap gap-1.5">
                                            {item.alternatif_olahan.slice(0,3).map(alt => (
                                              <span key={alt} className="text-[9px] px-2 py-1 bg-[#00A3FF]/10 rounded border border-[#00A3FF]/20 text-[#00A3FF]">{alt}</span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {activeTab === 'workout' && (
                    <motion.div key="workout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                      {hasil.olahraga.map((ol, idx) => (
                        <div key={idx} className="rounded-3xl p-6 bg-[#0a0a0a] border border-white/10 relative overflow-hidden group">
                          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#8A2BE2]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-[#8A2BE2] mb-1.5">{ol.kategori} &bull; {ol.intensitas}</div>
                              <h4 className="font-space text-lg font-bold text-white">{ol.nama}</h4>
                            </div>
                            <div className="flex items-center gap-3 bg-black/60 border border-white/10 p-2.5 rounded-xl">
                              <div className="text-center px-3 border-r border-white/10"><div className="text-[9px] text-neutral-500 uppercase font-bold tracking-widest mb-0.5">Durasi</div><div className="font-space font-bold text-white text-base">{ol.durasi_menit}m</div></div>
                              <div className="text-center px-3"><div className="text-[9px] text-orange-500 uppercase font-bold tracking-widest mb-0.5 flex items-center gap-1"><Flame className="w-2.5 h-2.5"/> Terbakar</div><div className="font-space font-bold text-orange-400 text-base">~{ol.estimasi_kalori_terbakar}</div></div>
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-relaxed border-t border-white/10 pt-3 relative z-10">{ol.alasan}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          )}
        </div>

        {/* ================= MODAL PREVIEW TDEE ================= */}
        <AnimatePresence>
          {showModal && previewData && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050505]/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-md p-8 relative overflow-hidden bg-black border border-white/10 rounded-[2rem] shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FFB2]/20 rounded-full blur-[60px] pointer-events-none"></div>
                <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-neutral-500 hover:text-white bg-white/5 p-2 rounded-full border border-white/10"><X className="w-4 h-4" /></button>
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#00FFB2]/10 flex items-center justify-center border border-[#00FFB2]/20"><CheckCircle2 className="w-5 h-5 text-[#00FFB2]" /></div>
                  <div><h3 className="font-space text-xl font-bold text-white">Scan Complete</h3><p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-1">Biometric Analysis</p></div>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Basal Metabolic Rate</p>
                    <p className="text-4xl font-space font-bold text-white">{previewData.bmr} <span className="text-sm font-sans font-normal text-neutral-500">kcal</span></p>
                  </div>
                  <div className="bg-gradient-to-r from-[#00FFB2]/10 to-[#00A3FF]/10 p-5 rounded-2xl border border-[#00FFB2]/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#00FFB2] mb-2">Total Daily Energy Exp (TDEE)</p>
                    <p className="text-5xl font-space font-extrabold text-white">{previewData.tdee}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="w-full mt-8 py-4 rounded-xl bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-[#00FFB2] transition-all relative z-10">Tutup & Lanjutkan Form</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
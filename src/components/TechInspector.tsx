import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Zap, Thermometer, ShieldCheck, RefreshCw, BarChart3, Radio, Layers } from 'lucide-react';
import { Language } from '../translations';

interface TechInspectorProps {
  isDarkMode: boolean;
  lang: Language;
}

type DeviceKey = 'laptop' | 'desktop' | 'phone';

export default function TechInspector({ isDarkMode, lang }: TechInspectorProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceKey>('laptop');
  const [workload, setWorkload] = useState<number>(75); // 0% to 100% slider value

  // Localized Copy
  const copy = {
    en: {
      badge: "Real-Time Hardware Diagnostics",
      title: "Tactical Telemetry & Live Benchmarks",
      subtitle: "Interactively test how our custom-engineered 4U PRO components scale under extreme workflow pressure versus standard mass-market consumer devices.",
      selectDevice: "Select Core Grid:",
      overclockLabel: "System Workload & Overclock Node:",
      extremeMode: "ACTIVE OVERDRIVE",
      safetyWarning: "TEMPORARY THERMAL REDUCTION SUSPENDED",
      normalMode: "STABLE BASELINE WAVE",
      frequency: "Core Frequency",
      renderEfficiency: "Compilation & Render Speeds",
      thermalIndex: "Active Liquid Nitrogen Loop",
      encryptionShield: "Quantum Encryption Seal",
      specifications: "Selected Rig Diagnostics",
      versusTitle: "4U PRO Rig vs Standard Market Devices",
      customRigLabel: "4U PRO Custom Build",
      standardRigLabel: "Standard Consumer Model",
      devices: {
        laptop: {
          name: "Quantumbook-X",
          tag: "Mobile Computation Lab",
          mHz: 5.8,
          proRenderVal: 240, // frames/min at 100%
          stdRenderVal: 78,
          proTemp: 32, // Celsius
          stdTemp: 74,
          proLat: 1.2, // ms
          stdLat: 28.5,
          advantageText: "Features a self-healing carbon-titanium frame with liquid nitrogen vapor cooling loop."
        },
        desktop: {
          name: "Desk Server-Omega",
          tag: "Sub-Space Compute Tower",
          mHz: 6.4,
          proRenderVal: 580,
          stdRenderVal: 195,
          proTemp: 24,
          stdTemp: 82,
          proLat: 0.8,
          stdLat: 42.1,
          advantageText: "Equipped with dual 4U Hyperion-X graphics processors with independent cryogenic heat isolation chambers."
        },
        phone: {
          name: "X-Enigma Phone",
          tag: "Flagship Telemetry Core",
          mHz: 4.2,
          proRenderVal: 155,
          stdRenderVal: 48,
          proTemp: 28,
          stdTemp: 62,
          proLat: 1.5,
          stdLat: 34.0,
          advantageText: "Secured with a multi-spectral anti-scatter lightwave lens and real-time biometric network shielding."
        }
      }
    },
    ar: {
      badge: "لوحة القياس والتحليل العتادي المباشر",
      title: "محاكي الأداء وتحديد الترددات الحية",
      subtitle: "اختبر أداء عتاد ومكونات 4U PRO المخصصة تحت ضغط العمل الشاق وكسر السرعات مقارنة بالأجهزة التجارية التقليدية المتاحة بالأسواق.",
      selectDevice: "اختر النواة المراد قياسها:",
      overclockLabel: "معدل ضغط العمل وكسر سرعة النواة:",
      extremeMode: "نمط الأداء الأقصى الفائق",
      safetyWarning: "الحماية الحرارية التلقائية نشطة وغير مقيدة",
      normalMode: "نمط ضغط التشغيل المتزن",
      frequency: "تردد المعالج الأساسي",
      renderEfficiency: "سرعة تجميع البيانات والرندرة / ثانية",
      thermalIndex: "حرارة نظام التبريد السائل والنيتروجين",
      encryptionShield: "قوة التشفير ودرع الأمان السيبراني",
      specifications: "التشخيص الفني الدقيق للنواة",
      versusTitle: "مقارنة حية: 4U PRO ضد الأجهزة والأسواق التقليدية",
      customRigLabel: "تجهيز 4U PRO المخصص",
      standardRigLabel: "الأجهزة التجارية المنافسة بالأسواق",
      devices: {
        laptop: {
          name: "كمبيوتر Quantumbook-X المطور",
          tag: "مختبر حوسبة محمول ذو قدرة فائقة",
          mHz: 5.8,
          proRenderVal: 240,
          stdRenderVal: 78,
          proTemp: 32,
          stdTemp: 74,
          proLat: 1.2,
          stdLat: 28.5,
          advantageText: "يتميز بهيكل كربون-تيتانيوم متطور ومقاوم مع دائرة تبريد النيتروجين المفرغة."
        },
        desktop: {
          name: "حاسوب التجميعة الاحترافية Server-Omega",
          tag: "برج حوسبة معالجة شاقة فائق",
          mHz: 6.4,
          proRenderVal: 580,
          stdRenderVal: 195,
          proTemp: 24,
          stdTemp: 82,
          proLat: 0.8,
          stdLat: 42.1,
          advantageText: "مجهز ببطاقة رسوميات مزدوجة الأداء وغرف تشريد حراري كهرومغناطيسية منفصلة."
        },
        phone: {
          name: "هاتف X-Enigma الذكي الخارق",
          tag: "درع الاتصال الهولوغرافي الفخم",
          mHz: 4.2,
          proRenderVal: 155,
          stdRenderVal: 48,
          proTemp: 28,
          stdTemp: 62,
          proLat: 1.5,
          stdLat: 34.0,
          advantageText: "مؤمن بالكامل بمستشعر تصوير خفيف فائق وتشفير شبكي لا مركزي نشط كلياً."
        }
      }
    }
  }[lang];

  const currentDevice = copy.devices[selectedDevice];

  // Dynamic calculations as a function of workload
  const calculatedFreq = ((workload / 100) * (currentDevice.mHz - 1.2) + 1.2).toFixed(2);
  const calculatedProRender = Math.round((workload / 100) * currentDevice.proRenderVal);
  const calculatedStdRender = Math.round((workload / 100) * currentDevice.stdRenderVal);
  
  // High workload reduces latency slightly (more resource pooling), raises temperature
  const calculatedProTemp = Math.round(currentDevice.proTemp + (workload / 100) * 12);
  const calculatedStdTemp = Math.round(currentDevice.stdTemp + (workload / 100) * 26);
  
  const calculatedProLat = (currentDevice.proLat - (workload / 200) * 0.4).toFixed(1);
  const calculatedStdLat = (currentDevice.stdLat + (workload / 100) * 8).toFixed(1);

  return (
    <section id="tech-inspector" className={`py-24 relative overflow-hidden border-b ${
      isDarkMode ? 'border-neutral-900 bg-[#0E1015]/40' : 'border-neutral-200 bg-white'
    }`}>
      {/* Dynamic light emission lines */}
      <div className="absolute inset-0 z-0 bg-tech-grid opacity-[0.08] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-x-2 text-neon-purple text-xs font-mono uppercase tracking-widest bg-neon-purple/5 px-3 py-1 rounded-md border border-neon-purple/20 animate-pulse">
            <Radio className="w-3.5 h-3.5 text-neon-purple" />
            <span>{copy.badge}</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight uppercase">
            {copy.title}
          </h2>
          <p className={`font-sans text-xs sm:text-sm font-light leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {copy.subtitle}
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start rounded-2xl border p-5 sm:p-8 backdrop-blur-md ${
          isDarkMode ? 'bg-[#0E1119]/80 border-neon-cyan/20' : 'bg-neutral-50/70 border-neutral-200'
        }`}>
          
          {/* Column A: Interactive Controls (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-8 text-left rtl:text-right">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3">
                {copy.selectDevice}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['laptop', 'desktop', 'phone'] as DeviceKey[]).map((device) => (
                  <button
                    key={device}
                    onClick={() => setSelectedDevice(device)}
                    className={`py-3 px-1.5 rounded-xl border font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-y-2 transition-all cursor-pointer ${
                      selectedDevice === device
                        ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : isDarkMode
                          ? 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <Layers className={`w-4 h-4 ${selectedDevice === device ? 'text-neon-cyan' : 'text-neutral-500'}`} />
                    <span>{copy.devices[device].name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Overclock Gauge Slider Core */}
            <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-neutral-200'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">{copy.overclockLabel}</span>
                <span className={`text-xs font-mono font-black py-0.5 px-2 rounded ${workload >= 85 ? 'text-neon-pink bg-neon-pink/15' : 'text-neon-cyan bg-neon-cyan/15'}`}>
                  {workload}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={workload}
                onChange={(e) => setWorkload(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
              />

              <div className="flex justify-between font-mono text-[9px] text-neutral-500 mt-2">
                <span>0% Baseline</span>
                <span>50% Loaded</span>
                <span>100% MAXIMUM</span>
              </div>

              {/* Live Signal Wave diagnostics feedback */}
              <div className={`mt-5 pt-4 border-t ${isDarkMode ? 'border-neutral-800' : 'border-neutral-250'} flex items-center gap-x-3`}>
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${workload >= 85 ? 'bg-neon-pink/10 animate-pulse' : 'bg-neon-cyan/10 animate-pulse'}`}>
                  <Zap className={`w-2.5 h-2.5 ${workload >= 85 ? 'text-neon-pink' : 'text-neon-cyan'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-mono text-[9px] font-black tracking-wide text-white uppercase">
                    {workload >= 85 ? copy.extremeMode : copy.normalMode}
                  </span>
                  <span className="block text-[8px] font-mono text-neutral-500 truncate lowercase">
                    {calculatedFreq} GHz ACTIVE COUPLING CORE FREQUENCY
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed advantage description */}
            <div className={`p-4 rounded-xl border font-sans text-xs ${isDarkMode ? 'bg-neutral-900/20 border-neutral-850 text-neutral-300' : 'bg-white border-neutral-150 text-neutral-600'}`}>
              <div className="flex items-center gap-x-2 mb-2 font-mono text-[9px] font-bold text-neon-purple uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-neon-purple" />
                <span>{copy.specifications}</span>
              </div>
              <p className="leading-relaxed">
                {currentDevice.advantageText}
              </p>
            </div>
          </div>

          {/* Column B: Telemetry Visualization Graphs (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-7">
            <h3 className="text-left rtl:text-right font-orbitron font-extrabold text-sm uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neon-cyan select-none">
              {copy.versusTitle}
            </h3>

            {/* Metric Chart Array */}
            <div className="space-y-6">
              
              {/* Graphic Spec 1: Render Speeds (higher frames/min is best) */}
              <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-[#111420]/50 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <div className="flex justify-between items-center mb-3 text-left rtl:text-right">
                  <div className="flex items-center gap-x-2">
                    <BarChart3 className="w-4 h-4 text-neon-cyan" />
                    <span className="font-mono text-xs font-bold text-white block uppercase">{copy.renderEfficiency}</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500">{calculatedProRender} vs {calculatedStdRender} Frames/m</span>
                </div>

                {/* Overlapped visual bar chart indicator */}
                <div className="space-y-3 font-mono text-[10px]">
                  {/* 4U Pro Bar */}
                  <div>
                    <div className="flex justify-between mb-1 text-neon-cyan font-bold">
                      <span>{copy.customRigLabel}</span>
                      <span>{calculatedProRender} FPM</span>
                    </div>
                    <div className="w-full h-3.5 rounded-md bg-neutral-905 overflow-hidden p-[1px] border border-neon-cyan/20">
                      <motion.div
                        className="h-full rounded-md bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(calculatedProRender / 580) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Standard Bar */}
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400 font-medium">
                      <span>{copy.standardRigLabel}</span>
                      <span>{calculatedStdRender} FPM</span>
                    </div>
                    <div className="w-full h-2.5 rounded-md bg-neutral-905 overflow-hidden p-[1px] border border-neutral-800">
                      <motion.div
                        className="h-full rounded-md bg-neutral-600"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(calculatedStdRender / 580) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Spec 2: Termals (lower temperatures in celsius are best under load) */}
              <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-[#111420]/50 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <div className="flex justify-between items-center mb-3 text-left rtl:text-right">
                  <div className="flex items-center gap-x-2">
                    <Thermometer className="w-4 h-4 text-neon-pink" />
                    <span className="font-mono text-xs font-bold text-white block uppercase">{copy.thermalIndex}</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500">{calculatedProTemp}°C vs {calculatedStdTemp}°C</span>
                </div>

                {/* Overlapped visual bar chart for temperatures */}
                <div className="space-y-3 font-mono text-[10px]">
                  {/* 4U Pro Bar */}
                  <div>
                    <div className="flex justify-between mb-1 text-neon-pink font-bold">
                      <span>{copy.customRigLabel} (Cryo Vapor Loop)</span>
                      <span>{calculatedProTemp}°C</span>
                    </div>
                    <div className="w-full h-3.5 rounded-md bg-neutral-905 overflow-hidden p-[1px] border border-neon-pink/20">
                      <motion.div
                        className="h-full rounded-md bg-gradient-to-r from-neon-purple to-neon-pink shadow-[0_0_12px_rgba(255,0,127,0.4)]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(calculatedProTemp / 110) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Standard Bar */}
                  <div>
                    <div className="flex justify-between mb-1 text-neutral-400 font-medium">
                      <span>{copy.standardRigLabel} (Standard Heatsink)</span>
                      <span>{calculatedStdTemp}°C</span>
                    </div>
                    <div className="w-full h-2.5 rounded-md bg-neutral-905 overflow-hidden p-[1px] border border-neutral-800">
                      <motion.div
                        className="h-full rounded-md bg-red-650"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(calculatedStdTemp / 110) * 100}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Spec 3: Signal Network ping latency speed (lower is best) */}
              <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-[#111420]/50 border-neutral-800' : 'bg-white border-neutral-200'}`}>
                <div className="flex justify-between items-center mb-3 text-left rtl:text-right">
                  <div className="flex items-center gap-x-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span className="font-mono text-xs font-bold text-white block uppercase">{copy.encryptionShield} (Latency Rate)</span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500">{calculatedProLat}ms vs {calculatedStdLat}ms</span>
                </div>

                <div className="space-y-3 font-mono text-[10px]">
                  {/* Pro Latency Bar - Extremely short width is good! */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-1">
                    <span className="text-gray-400">{copy.customRigLabel} (AeroSync Tunnel):</span>
                    <div className="flex items-center gap-x-2">
                      <div className="w-32 bg-neutral-805 h-2 rounded overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${(parseFloat(calculatedProLat) / 50) * 100}%` }} />
                      </div>
                      <span className="text-emerald-400 font-black">{calculatedProLat} ms (ULTRA-STABLE)</span>
                    </div>
                  </div>

                  {/* Std Latency Bar - Long latency is bad */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-1">
                    <span className="text-gray-400">{copy.standardRigLabel} (Standard Connection):</span>
                    <div className="flex items-center gap-x-2">
                      <div className="w-32 bg-neutral-805 h-2 rounded overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${(parseFloat(calculatedStdLat) / 50) * 100}%` }} />
                      </div>
                      <span className="text-amber-500 font-black">{calculatedStdLat} ms (LATENCY SPIKES)</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

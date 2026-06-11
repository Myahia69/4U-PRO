import React from 'react';
import { Product, CartItem } from '../types';
import { X, Check, ArrowRightLeft, Smartphone, Sparkles, Cpu, Zap, ShieldCheck, Scale, Signal, Star, Sliders } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../translations';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatPrice } from '../lib/priceUtils';

interface PhoneComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOpenCustomizer: (prodId: string) => void;
  lang: Language;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isDarkMode: boolean;
}

export default function PhoneComparisonModal({
  isOpen,
  onClose,
  products,
  onOpenCustomizer,
  lang,
  setCart,
  isDarkMode
}: PhoneComparisonModalProps) {
  if (!isOpen) return null;

  // Extract flagships
  const enigma = products.find((p) => p.id === 'phone-enigma');
  const titan = products.find((p) => p.id === 'phone-titan');

  if (!enigma || !titan) return null;

  // Localized texts
  const tComp = {
    en: {
      title: "Tactical Telemetry & Comparison Matrix",
      subtitle: "Side-by-side structural diagnostics of our elite handheld devices.",
      trendTitle: "Historical Acquisition Valuation Matrix",
      trendSubtitle: "Price fluctuation index over previous deployment lifecycle phases.",
      metric: "System Metric",
      processor: "Core Engine",
      display: "Holo Display Panel",
      camera: "Optic Vector Array",
      battery: "Power Cell Capacity",
      armor: "Frame Metallurgy",
      storage: "Data Matrix",
      security: "Comm Isolation",
      highlights: "Direct Advantages",
      colors: "Available Shells",
      ratingCount: "Hype Rating",
      price: "System Acquisition",
      allocate: "Allocate to Cart",
      configure: "Configure Matrix",
      or: "OR",
      vs: "VS",
      dimensions: "Scale Index",
      weight: "Net Weight",
      advantages: {
        enigma: [
          "Liquid-Graphene Self-Healing Chassis",
          "0 to 120W charge in 8.5 mins flat",
          "Advanced under-display holo projections",
          "Stategrade Quantum-Net Network shielding"
        ],
        titan: [
          "Tactical Military Carbon-Titanium Armor",
          "Dual sub-space range signal array booster",
          "Active-cooling dual thermal loop v3",
          "Deep military dark-stealth chassis theme"
        ]
      }
    },
    ar: {
      title: "مصفوفة مقارنة عتاد الاتصال الرائد",
      subtitle: "مقارنة تقنية مجهرية للهياكل والقدرات الحوسبية للهواتف الرائدة.",
      trendTitle: "مؤشر تغير وقيمة الاستحواذ المالي",
      trendSubtitle: "تتبع وحساب قيمة الأجهزة ومراحل استقرار الأسعار عبر دورة حياة الترقيات السابقة والإنتاج.",
      metric: "المواصفة الفنية",
      processor: "وحدة معالجة النواة",
      display: "واجهة عرض الشاشة",
      camera: "مصفوفة البصريات والعدسات",
      battery: "خلية الطاقة والشحن سريع",
      armor: "فيزياء وتعدين الهيكل",
      storage: "مصفوفة الذاكرة وسرعة النقل",
      security: "عزل وتشفير الاتصالات",
      highlights: "الميزات الميدانية المتفوقة",
      colors: "ألوان الهيكل النشطة",
      ratingCount: "تقييم أجهزة المراقبة",
      price: "قيمة نظام الاستحواذ",
      allocate: "إضافة سريعة مجهزة",
      configure: "تعديل ومحاكاة البناء",
      or: "أو",
      vs: "ضد",
      dimensions: "مقياس الأبعاد الهيكلية",
      weight: "الوزن الصافي للنواة",
      advantages: {
        enigma: [
          "هيكل الجرافين السائل المطور ذاتي المعالجة",
          "شحن كامل بقوة 120 واط خلال 8.5 دقائق",
          "مجهر هولوغرام مدمج يسقط من الشاشة",
          "تشفير شبكي كمي نشط ضد الاختراق"
        ],
        titan: [
          "درع التيتانيوم الكربوني المعتمد عسكرياً",
          "هوائيات مصفوفة فرعية لتقوية البث الفضائي",
          "نظام تبريد حراري ثنائي المراوح مغلق v3",
          "هيكل غير لامع للاختفاء البصري والسرية"
        ]
      }
    }
  }[lang];

  const handleInstantBuy = (product: Product) => {
    const defaultColor = product.colors[0].name;
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.selectedColor === defaultColor);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { product, selectedColor: defaultColor, quantity: 1, customSpec: 'Standard Edition' }];
      }
    });

    // visual animation feedback
    const btn = document.getElementById(`modal-compar-buy-${product.id}`);
    if (btn) {
      btn.innerText = lang === 'en' ? "ALLOCATED!" : "تمت الإضافة!";
      btn.classList.add('bg-green-500', 'text-white');
      setTimeout(() => {
        btn.innerText = tComp.allocate;
        btn.classList.remove('bg-green-500', 'text-white');
      }, 1500);
    }
  };

  return (
    <div
      id="phone-comparison-overlay"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative w-full max-w-5xl rounded-2xl border p-5 sm:p-8 my-10 overflow-hidden cursor-default shadow-[0_20px_50px_rgba(0,0,0,0.6)] ${
          isDarkMode
            ? 'bg-[#0A0D14]/98 border-neon-cyan/30 text-white'
            : 'bg-white border-neutral-300 text-neutral-900'
        }`}
      >
        {/* Futury Glow Panels */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/5 rounded-full filter blur-[100px] pointer-events-none" />

        {/* Modal Close - Fixed floating button so that it is ALWAYS accessible while scrolling specifications */}
        <button
          onClick={onClose}
          id="close-comparison-modal-btn"
          className={`fixed top-6 right-6 rtl:right-auto rtl:left-6 z-[120] p-2.5 rounded-lg border shadow-xl transition-all hover:scale-110 duration-300 hover:text-neon-pink cursor-pointer ${
            isDarkMode 
              ? 'border-neon-cyan/30 text-neon-cyan bg-obsidian-card backdrop-blur-md hover:border-neon-pink/50 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]' 
              : 'border-neutral-300 text-neutral-800 bg-white shadow-md hover:border-neutral-400'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-left rtl:text-right mb-6 pr-8 rtl:pr-0 rtl:pl-8">
          <div className="inline-flex items-center gap-x-2 text-neon-cyan text-xs font-mono uppercase tracking-widest bg-neon-cyan/5 px-2.5 py-1 rounded-md border border-neon-cyan/25 mb-3">
            <ArrowRightLeft className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry Matrix</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl tracking-tight uppercase">
            {tComp.title}
          </h2>
          <p className={`font-sans text-xs sm:text-sm font-light leading-relaxed mt-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            {tComp.subtitle}
          </p>
        </div>

        {/* Comparison Structure */}
        <div className="overflow-x-auto select-none">
          <table className="w-full text-left rtl:text-right border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                {/* Metric Title Label */}
                <th className="py-4 px-3 font-orbitron font-black text-[11px] tracking-wider uppercase text-neutral-450 dark:text-neutral-500 w-[24%]">
                  {tComp.metric}
                </th>
                
                {/* Enigma Head */}
                <th className="py-4 px-4 w-[38%] relative">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative w-28 h-28 flex items-center justify-center p-2 rounded-xl bg-neon-purple/5 border border-neon-purple/15">
                      <img
                        src={enigma.image}
                        alt={enigma.name}
                        className="object-contain w-full h-full max-h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-2 bg-neon-purple text-white text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">ALPHA</span>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-extrabold text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neon-purple">
                        {enigma.name}
                      </h3>
                      <p className="font-mono text-[9px] text-[#C216FF] tracking-wider uppercase">{enigma.tagline}</p>
                    </div>
                  </div>
                </th>

                {/* VS column border or aesthetic item */}
                <th className="py-4 px-4 w-[38%] relative border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/65">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative w-28 h-28 flex items-center justify-center p-2 rounded-xl bg-neon-cyan/5 border border-neon-cyan/15">
                      <img
                        src={titan.image}
                        alt={titan.name}
                        className="object-contain w-full h-full max-h-24 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-2 bg-neon-cyan text-black text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">ARMOR</span>
                    </div>
                    <div>
                      <h3 className="font-orbitron font-extrabold text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#00F0FF]">
                        {titan.name}
                      </h3>
                      <p className="font-mono text-[9px] text-neon-cyan tracking-wider uppercase">{titan.tagline}</p>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Acquisition Value */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-450 dark:text-neutral-500">
                  {tComp.price}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="font-mono text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-pink">
                    ${enigma.price.toLocaleString()}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50">
                  <span className="font-mono text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-blue-400">
                    ${titan.price.toLocaleString()}
                  </span>
                </td>
              </tr>

              {/* Core Processor */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-neon-purple" />
                  <span>{tComp.processor}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">{enigma.specs[0].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">4nm Nano-Mesh AI Superprocessor</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">{titan.specs[0].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Dual-Threaded Tactical Computing Node</span>
                </td>
              </tr>

              {/* Screen Display */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>{tComp.display}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">{enigma.specs[1].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Holographic Projecting Interface</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">{titan.specs[1].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Super High Brightness Tactical Glass</span>
                </td>
              </tr>

              {/* Camera array */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
                  <span>{tComp.camera}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">{enigma.specs[2].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Multi-Spectral Array Sensor</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">Dual Optical Laser (Tactical Focal)</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Adaptive Laser-Range Distance Sensing</span>
                </td>
              </tr>

              {/* Battery Core */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-green-400" />
                  <span>{tComp.battery}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">{enigma.specs[3].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Hyper Charge Loop (0-100% in 8.5m)</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">5500mAh Solid-State Pack</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Extreme Temp Resistant Core</span>
                </td>
              </tr>

              {/* Shield & Armor */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{tComp.armor}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">Advanced Graphene Nano Alloy</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Self-Healing Micro Scratch Resistance</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">{titan.specs[2].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Shock Absorption Fused Armor Matrix</span>
                </td>
              </tr>

              {/* Storage systems */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-orange-400" />
                  <span>{tComp.storage}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">512GB High-Speed Flash Core</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Biometric Bios Level Cryptographic Lock</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">{titan.specs[3].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Low Resistance Super-Conductive SSD</span>
                </td>
              </tr>

              {/* Signal/Connectivity */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <Signal className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{tComp.security}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">{enigma.specs[4].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Quantum-encrypted Mesh Connections</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">{titan.specs[4].value}</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Sub-Space Dual Satellite Relay Booster</span>
                </td>
              </tr>

              {/* Physical details: Weight and scale */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <Scale className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{tComp.dimensions}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <span className="font-extrabold block text-white">162.5 x 74.8 x 8.1 mm</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Lighter profile, optimized handle ({tComp.weight}: 188g)</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <span className="font-extrabold block text-white">165.2 x 77.4 x 9.8 mm</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">Industrial reinforcement frame ({tComp.weight}: 235g)</span>
                </td>
              </tr>

              {/* Real Hype/Review scores */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440 flex items-center gap-x-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>{tComp.ratingCount}</span>
                </td>
                <td className="py-3.5 px-4 text-center font-sans text-xs">
                  <div className="flex items-center justify-center gap-x-1 text-amber-500 font-bold mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{enigma.rating}</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 block">({enigma.reviewsCount.toLocaleString()} Transmissions)</span>
                </td>
                <td className="py-3.5 px-4 text-center border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50 font-sans text-xs">
                  <div className="flex items-center justify-center gap-x-1 text-amber-500 font-bold mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{titan.rating}</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 block">({titan.reviewsCount.toLocaleString()} Transmissions)</span>
                </td>
              </tr>

              {/* Color Swatch Arrays */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800/50' : 'border-neutral-200/50'} hover:bg-neutral-800/10 transition-colors`}>
                <td className="py-3.5 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440">
                  {tComp.colors}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex justify-center gap-x-2">
                    {enigma.colors.map((c) => (
                      <span
                        key={c.name}
                        className={`w-3.5 h-3.5 rounded-full border ${c.previewColor}`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4 border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50">
                  <div className="flex justify-center gap-x-2">
                    {titan.colors.map((c) => (
                      <span
                        key={c.name}
                        className={`w-3.5 h-3.5 rounded-full border ${c.previewColor}`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </td>
              </tr>

              {/* Direct Advantage Bullet Points */}
              <tr className={`border-b ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                <td className="py-4 px-3 font-mono text-[10px] uppercase font-bold text-neutral-440">
                  {tComp.highlights}
                </td>
                <td className="py-4 px-4 text-left rtl:text-right">
                  <ul className="space-y-1.5 list-none">
                    {tComp.advantages.enigma.map((adv: string, i: number) => (
                      <li key={i} className="flex items-start gap-x-1.5 text-[11px] leading-tight font-sans text-gray-300">
                        <Check className="w-3.5 h-3.5 text-neon-purple mt-0.5 shrink-0" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-4 text-left rtl:text-right border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50">
                  <ul className="space-y-1.5 list-none">
                    {tComp.advantages.titan.map((adv: string, i: number) => (
                      <li key={i} className="flex items-start gap-x-1.5 text-[11px] leading-tight font-sans text-gray-300">
                        <Check className="w-3.5 h-3.5 text-neon-cyan mt-0.5 shrink-0" />
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Action Rows */}
              <tr>
                <td className="py-5 px-3"></td>
                {/* Enigma actions */}
                <td className="py-5 px-4">
                  <div className="flex flex-col gap-2.5 items-center">
                    <button
                      id={`modal-compar-buy-${enigma.id}`}
                      onClick={() => handleInstantBuy(enigma)}
                      className="w-full max-w-[190px] py-2 rounded-lg font-orbitron font-extrabold text-xs tracking-wider text-black bg-neon-purple/90 hover:bg-neon-purple hover:opacity-100 transition-all text-center flex items-center justify-center gap-x-1.5 cursor-pointer shadow-[0_0_15px_rgba(189,0,255,0.2)]"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>{tComp.allocate}</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCustomizer(enigma.id);
                      }}
                      className="text-xs font-mono font-bold text-neutral-400 hover:text-neon-cyan transition-colors flex items-center gap-x-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{tComp.configure}</span>
                    </button>
                  </div>
                </td>
                
                {/* Titan actions */}
                <td className="py-5 px-4 border-l rtl:border-l-0 rtl:border-r border-dashed border-neutral-800/50">
                  <div className="flex flex-col gap-2.5 items-center">
                    <button
                      id={`modal-compar-buy-${titan.id}`}
                      onClick={() => handleInstantBuy(titan)}
                      className="w-full max-w-[190px] py-2 rounded-lg font-orbitron font-extrabold text-xs tracking-wider text-black bg-neon-cyan/90 hover:bg-neon-cyan hover:opacity-100 transition-all text-center flex items-center justify-center gap-x-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>{tComp.allocate}</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCustomizer(titan.id);
                      }}
                      className="text-xs font-mono font-bold text-neutral-400 hover:text-neon-cyan transition-colors flex items-center gap-x-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{tComp.configure}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Value Over Time Trend Chart (Recharts Integration) */}
        <div className={`mt-8 mb-4 p-5 sm:p-6 rounded-2xl border ${
          isDarkMode 
            ? 'bg-neutral-900/30 border-neutral-800' 
            : 'bg-neutral-50 border-neutral-200'
        }`}>
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-3 mb-6">
            <div>
              <div className="flex items-center gap-x-1.5 text-neutral-400 font-mono text-[9px] uppercase tracking-widest mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>{lang === 'en' ? 'VALUATION TELEMETRY' : 'بيانات التقييم المالي'}</span>
              </div>
              <h3 className="font-orbitron font-extrabold text-xs sm:text-sm text-neutral-200 dark:text-white tracking-wide uppercase">
                {tComp.trendTitle}
              </h3>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                {tComp.trendSubtitle}
              </p>
            </div>
            
            {/* Legend indicators */}
            <div className="flex gap-x-4 font-mono text-[10px]">
              <div className="flex items-center gap-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-purple shadow-[0_0_8px_rgba(189,0,255,0.4)]" />
                <span className="text-neutral-300">{enigma.name}</span>
              </div>
              <div className="flex items-center gap-x-2 border-l pl-4 border-neutral-800">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
                <span className="text-neutral-300">{titan.name}</span>
              </div>
            </div>
          </div>

          {/* Recharts responsive block */}
          <div className="w-full h-64 sm:h-72 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={[
                  { name: lang === 'en' ? 'Launch' : 'الإطلاق', enigma: Math.round(enigma.price * 1.15), titan: Math.round(titan.price * 1.12) },
                  { name: lang === 'en' ? 'Phase 1' : 'المرحلة 1', enigma: Math.round(enigma.price * 1.10), titan: Math.round(titan.price * 1.08) },
                  { name: lang === 'en' ? 'Phase 2' : 'المرحلة 2', enigma: Math.round(enigma.price * 1.05), titan: Math.round(titan.price * 1.06) },
                  { name: lang === 'en' ? 'Phase 3' : 'المرحلة 3', enigma: Math.round(enigma.price * 1.02), titan: Math.round(titan.price * 1.03) },
                  { name: lang === 'en' ? 'Phase 4' : 'المرحلة 4', enigma: Math.round(enigma.price * 1.01), titan: Math.round(titan.price * 1.01) },
                  { name: lang === 'en' ? 'Current' : 'الحالي', enigma: enigma.price, titan: titan.price },
                ]} 
                margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke={isDarkMode ? '#6B7280' : '#4B5563'} 
                  fontSize={10} 
                  tickLine={false}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke={isDarkMode ? '#6B7280' : '#4B5563'} 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  fontFamily="monospace"
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => formatPrice(val, enigma.currency || 'USD', lang).replace(/\s[أ-ي\.\w]+$/, '')}
                />
                <Tooltip 
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className={`p-4 rounded-xl border font-sans text-xs shadow-2xl backdrop-blur-md ${
                          isDarkMode 
                            ? 'bg-[#0A0D14]/95 border-neon-cyan/25 text-white' 
                            : 'bg-white border-neutral-200 text-neutral-900 shadow-lg'
                        }`}>
                          <p className="font-orbitron font-extrabold mb-2.5 text-[10px] tracking-wider text-neutral-400">
                            {label}
                          </p>
                          {payload.map((entry: any, index: number) => {
                            const isEnigma = entry.dataKey === 'enigma';
                            const name = isEnigma ? enigma.name : titan.name;
                            const color = isEnigma ? '#BD00FF' : '#00F0FF';
                            return (
                              <div key={index} className="flex items-center gap-x-2 mt-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-neutral-400 dark:text-neutral-400 font-medium">{name}:</span>
                                <span className="font-bold font-mono" style={{ color: color }}>
                                  {formatPrice(entry.value, isEnigma ? (enigma.currency || 'USD') : (titan.currency || 'USD'), lang)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="enigma" 
                  stroke="#BD00FF" 
                  strokeWidth={3}
                  activeDot={{ r: 6, stroke: '#BD00FF', strokeWidth: 1, fill: '#FFFFFF' }}
                  dot={{ r: 4, stroke: '#BD00FF', strokeWidth: 2, fill: '#0A0D14' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="titan" 
                  stroke="#00F0FF" 
                  strokeWidth={3}
                  activeDot={{ r: 6, stroke: '#00F0FF', strokeWidth: 1, fill: '#FFFFFF' }}
                  dot={{ r: 4, stroke: '#00F0FF', strokeWidth: 2, fill: '#0A0D14' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

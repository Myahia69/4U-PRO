import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { X, ShieldCheck, Terminal, Heart, Sparkles, Check, ArrowRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../translations';
import { formatPrice } from '../lib/priceUtils';

interface ProductCustomizerModalProps {
  productId: string | null;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isDarkMode: boolean;
  lang: Language;
  products: Product[];
}

export default function ProductCustomizerModal({ productId, onClose, cart, setCart, isDarkMode, lang, products }: ProductCustomizerModalProps) {
  const p = products.find(prod => prod.id === productId);

  const t = translations[lang];

  // States
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('Standard Build');
  const [coolingOverclock, setCoolingOverclock] = useState<boolean>(false);
  const [laserEngraving, setLaserEngraving] = useState<string>('');
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [buildSuccess, setBuildSuccess] = useState<boolean>(false);

  // Synced initial properties when active product loads
  useEffect(() => {
    if (p) {
      setSelectedColor(p.colors[0].name);
      setSelectedStorage('Standard Build');
      setCoolingOverclock(false);
      setLaserEngraving('');
      setCalculatedPrice(p.price);
    }
  }, [p]);

  // Recalculate prices based on configurations chosen
  useEffect(() => {
    if (!p) return;
    let base = p.price;
    if (selectedStorage === 'Pro Ultra-Core' || selectedStorage === 'ترقية القوة الاحترافية' || selectedStorage === t.customizer.proUltra) base += 220;
    if (selectedStorage === 'Sub-Space Quantum Tier' || selectedStorage === 'مصفوفة الكم الفائقة' || selectedStorage === t.customizer.quantumTier) base += 380;
    if (coolingOverclock) base += 140;
    if (laserEngraving.trim().length > 0) base += 25; // custom laser printing
    setCalculatedPrice(base);
  }, [p, selectedStorage, coolingOverclock, laserEngraving]);

  if (!p) return null;

  const handleAssembleBuild = () => {
    const modelTierLabel = selectedStorage === 'Standard Build' ? t.customizer.standardBuild :
                           selectedStorage === 'Pro Ultra-Core' ? t.customizer.proUltra : t.customizer.quantumTier;

    const customConfigName = `${modelTierLabel}${coolingOverclock ? ` + ${t.customizer.thermalCryo}` : ''}${laserEngraving ? ` (${laserEngraving.toUpperCase()})` : ''}`;
    
    setCart(prev => {
      // Find if matched item
      const existingIdx = prev.findIndex(
        item => item.product.id === p.id 
        && item.selectedColor === selectedColor 
        && item.customSpec === customConfigName
      );

      const modifiedProductObj = { ...p, price: calculatedPrice };

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, {
          product: modifiedProductObj,
          selectedColor,
          quantity: 1,
          customSpec: customConfigName
        }];
      }
    });

    setBuildSuccess(true);
    setTimeout(() => {
      setBuildSuccess(false);
      onClose();
    }, 1800);
  };

  const getColorTranslation = (colorName: string) => {
    const prodCol = t.productsData[p.id as keyof typeof t.productsData]?.colors;
    if (prodCol) {
      const cLower = colorName.toLowerCase();
      const key = cLower.includes('black') || cLower.includes('obsidian') ? 'dark' :
                  cLower.includes('grey') || cLower.includes('silver') || cLower.includes('titan') ? 'light' :
                  cLower.includes('gold') ? 'gold' :
                  cLower.includes('pink') ? 'pink' :
                  cLower.includes('purple') || cLower.includes('laser') ? 'purple' :
                  cLower.includes('blue') ? 'blue' : null;
      if (key && prodCol[key as keyof typeof prodCol]) {
        return prodCol[key as keyof typeof prodCol];
      }
    }
    return colorName;
  };

  const currentCategoryLabel = p.category === 'computer' ? t.bento.tagComp : p.category === 'phone' ? t.bento.tagPhone : t.bento.tagAcc;

  // Localized title for selected storage options
  const getStorageTranslation = (tier: string) => {
    if (tier === 'Standard Build') return t.customizer.standardBuild;
    if (tier === 'Pro Ultra-Core') return t.customizer.proUltra;
    if (tier === 'Sub-Space Quantum Tier') return t.customizer.quantumTier;
    return tier;
  };

  return (
    <AnimatePresence>
      {productId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950 backdrop-blur-xs"
          />

          {/* Modal layout panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className={`relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border ${
              isDarkMode 
                ? 'bg-obsidian text-gray-100 border-neon-cyan/20' 
                : 'bg-white text-neutral-900 border-neutral-300'
            } z-10`}
          >
            {buildSuccess && (
              <div className="absolute inset-0 z-50 bg-neutral-950/95 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 rounded-full bg-neon-cyan/10 border border-neon-cyan animate-pulse">
                  <Check className="w-12 h-12 text-neon-cyan" />
                </div>
                <h4 className="font-orbitron font-extrabold text-lg text-neon-cyan tracking-widest animate-pulse">
                  {t.customizer.couplingSuccess}
                </h4>
                <p className="text-xs text-neutral-450 dark:text-neutral-400 font-sans">
                  {t.customizer.successSub}
                </p>
              </div>
            )}

            {/* Header */}
            <div className={`p-6 border-b flex items-center justify-between ${
              isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
            }`}>
              <div className="flex items-center gap-x-2">
                <Terminal className="w-5 h-5 text-neon-cyan animate-pulse" />
                <h3 className="font-orbitron font-extrabold tracking-wider text-sm sm:text-base uppercase leading-none">
                  {t.customizer.assemblyBadge}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive grid section */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Visual display and real-time specs feedback */}
              <div className={`lg:col-span-5 p-8 flex flex-col items-center justify-center relative ${
                isDarkMode ? 'bg-neutral-900/10' : 'bg-neutral-50'
              }`}>
                
                {/* Visual Backdrop Halo */}
                <div className="absolute w-48 h-48 rounded-full bg-neon-purple/5 filter blur-3xl pointer-events-none" />
                
                <h4 className="font-orbitron font-bold text-sm tracking-wider text-neon-cyan uppercase text-center mb-6">
                  {getColorTranslation(selectedColor)} {t.customizer.previewTitle}
                </h4>

                <div className="relative w-48 aspect-square flex items-center justify-center mb-6 animate-slow-orbit" style={{ animationDuration: '24s' }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="object-contain w-full h-full max-h-[170px] drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
                  />
                  
                  {/* Glowing highlights indicators */}
                  <div className="absolute inset-0 border border-dashed border-neon-cyan/20 rounded-full" />
                </div>

                {/* Telemetry diagnostics box */}
                <div className="w-full space-y-2 text-left rtl:text-right font-mono text-[10px] bg-black/60 dark:bg-black/50 p-4 rounded-xl border border-neutral-805 dark:border-neutral-800/80">
                  <div className="flex justify-between border-b pb-1 border-neutral-800 text-neon-cyan font-bold">
                    <span>{t.customizer.telemetryHeader}</span>
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>{t.customizer.chassisResidence}</span>
                    <span className="text-white font-bold">{p.name}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>{t.customizer.sectorIntegration}</span>
                    <span className="text-white uppercase font-bold">{currentCategoryLabel}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 font-bold">
                    <span>{t.customizer.upgradeGrid}</span>
                    <span className="text-neon-purple uppercase font-bold">{getStorageTranslation(selectedStorage)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>{t.customizer.nitrogenIntercept}</span>
                    <span className="text-white font-bold">{coolingOverclock ? (lang === 'ar' ? 'نشط (كسر السرعة)' : 'ACTIVE OVERCLOCK') : (lang === 'ar' ? 'تجاوز قياسي' : 'BYPASS STANDARD')}</span>
                  </div>
                  {laserEngraving && (
                    <div className="flex justify-between text-neutral-400">
                      <span>{t.customizer.signaturePrint}</span>
                      <span className="text-neon-pink font-bold">"{laserEngraving.toUpperCase()}"</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Customizer Selector Fields */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 max-h-[580px] overflow-y-auto text-left rtl:text-right">
                
                {/* Selector 1: Colors */}
                <div className="space-y-3">
                  <h4 className="font-orbitron font-extrabold text-xs text-neutral-510 dark:text-gray-400 uppercase tracking-widest font-bold">
                    {t.customizer.platingTitle}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-sans">
                    {p.colors.map((c) => (
                      <button
                        key={c.name}
                        id={`btn-color-${c.name.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => setSelectedColor(c.name)}
                        className={`p-3 rounded-xl border flex items-center gap-x-2.5 transition-all text-xs cursor-pointer ${
                          selectedColor === c.name
                            ? 'border-neon-cyan bg-neon-cyan/5 text-neutral-900 dark:text-white ring-1 ring-neon-cyan/30 font-extrabold'
                            : isDarkMode 
                              ? 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/30 text-neutral-400'
                              : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0 ${c.previewColor}`} />
                        <span className="font-medium">{getColorTranslation(c.name)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector 2: Storage Upgrade Matrix */}
                <div className="space-y-3">
                  <h4 className="font-orbitron font-extrabold text-xs text-neutral-510 dark:text-gray-400 uppercase tracking-widest font-bold">
                    {t.customizer.procTitle}
                  </h4>
                  <div className="space-y-2.5 font-sans">
                    {/* Tier 1 */}
                    <button
                      id="tier-standard"
                      onClick={() => setSelectedStorage('Standard Build')}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        selectedStorage === 'Standard Build'
                          ? 'border-neon-purple bg-neon-purple/5 text-neutral-900 dark:text-white font-bold'
                          : isDarkMode
                            ? 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/35 text-neutral-405'
                            : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <div className="space-y-0.5 text-left rtl:text-right">
                        <span className={`font-semibold text-xs block ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{t.customizer.standardBuild}</span>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-mono">{t.customizer.standardDesc}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-500">{t.customizer.included}</span>
                    </button>

                    {/* Tier 2 */}
                    <button
                      id="tier-pro"
                      onClick={() => setSelectedStorage('Pro Ultra-Core')}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        selectedStorage === 'Pro Ultra-Core'
                          ? 'border-neon-purple bg-neon-purple/5 text-neutral-900 dark:text-white font-bold'
                          : isDarkMode
                            ? 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/35 text-neutral-405'
                            : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <div className="space-y-0.5 text-left rtl:text-right">
                        <span className={`font-semibold text-xs block ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{t.customizer.proUltra}</span>
                        <span className="text-[10px] text-neon-cyan block font-mono">{t.customizer.proDesc}</span>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-neon-purple">{t.customizer.securedAdd}</span>
                    </button>

                    {/* Tier 3 */}
                    <button
                      id="tier-quantum"
                      onClick={() => setSelectedStorage('Sub-Space Quantum Tier')}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        selectedStorage === 'Sub-Space Quantum Tier'
                          ? 'border-neon-pink bg-neon-pink/5 text-neutral-900 dark:text-white font-bold'
                          : isDarkMode
                            ? 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/35 text-neutral-405'
                            : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <div className="space-y-0.5 text-left rtl:text-right">
                        <span className={`font-semibold text-xs block ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{t.customizer.quantumTier}</span>
                        <span className="text-[10px] text-neon-pink block font-mono">{t.customizer.quantumDesc}</span>
                      </div>
                      <span className="font-mono text-xs font-extrabold text-neon-pink">{t.customizer.securedAddPink}</span>
                    </button>
                  </div>
                </div>

                {/* Selector 3: Overdrive Switch */}
                <div className="space-y-3">
                  <h4 className="font-orbitron font-extrabold text-xs text-neutral-510 dark:text-gray-400 uppercase tracking-widest font-bold">
                    {t.customizer.cryoTitle}
                  </h4>
                  <button
                    id="cryo-toggle"
                    onClick={() => setCoolingOverclock(!coolingOverclock)}
                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      coolingOverclock
                        ? 'border-neon-cyan bg-neon-cyan/5 text-neutral-900 dark:text-white font-bold'
                        : isDarkMode
                          ? 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/35 text-neutral-405'
                          : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    <div className="space-y-0.5 text-left rtl:text-right font-sans">
                      <div className="flex items-center gap-x-1.5 flex-wrap">
                        <span className={`font-semibold text-xs block ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>{t.customizer.liquidNitro}</span>
                        <span className="text-[9px] font-mono tracking-widest uppercase bg-neon-cyan/15 text-neon-cyan px-1 rounded font-black">{t.customizer.thermalCryo}</span>
                      </div>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">{t.customizer.noiseLabel}</span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
                      coolingOverclock ? 'border-neon-cyan bg-neon-cyan text-black' : isDarkMode ? 'border-neutral-850' : 'border-neutral-300'
                    }`}>
                      {coolingOverclock && <Check className="w-4.5 h-4.5 font-bold" />}
                    </div>
                  </button>
                </div>

                {/* Selector 4: Personalized Signature Block */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-orbitron font-extrabold text-xs text-neutral-510 dark:text-gray-400 uppercase tracking-widest font-bold">
                      {t.customizer.laserTitle}
                    </h4>
                    <span className="text-[9px] font-mono text-neon-pink">{t.customizer.laserAccredited}</span>
                  </div>
                  <div className="relative">
                    <input
                      id="laser-input"
                      type="text"
                      maxLength={18}
                      placeholder={lang === 'ar' ? 'مثال: 4U-PRO-HERO' : 'e.g. 4U-PRO-SOLDIER'}
                      value={laserEngraving}
                      onChange={(e) => setLaserEngraving(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/40 focus:border-neon-cyan hover:border-neutral-700 transition-all font-mono text-xs uppercase tracking-widest focus:outline-none text-white placeholder-neutral-500"
                    />
                    <span className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-[9px] font-mono text-neutral-500">
                      {laserEngraving.length}/18 {lang === 'ar' ? 'حرف' : 'CHARS'}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 block leading-tight">
                    {t.customizer.laserSubText}
                  </span>
                </div>

                {/* Pricing & Deployment Panel footer */}
                <div className={`p-5 rounded-2xl border ${
                  isDarkMode 
                    ? 'bg-neutral-900/40 border-neutral-800' 
                    : 'bg-neutral-50 border-neutral-200'
                } flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-8`}>
                  
                  <div className="text-left rtl:text-right">
                    <span className="text-[9px] font-mono text-neutral-400 tracking-wider block leading-none">{t.customizer.calculatedValue}</span>
                    <div className="flex items-baseline gap-x-2 mt-2">
                      <span className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-neutral-950 dark:from-white to-neon-cyan">
                        {formatPrice(calculatedPrice, p.currency, lang)}
                      </span>
                      <span className="text-[10px] font-mono text-green-400 uppercase font-bold">{t.customizer.syncing}</span>
                    </div>
                  </div>

                  <button
                    id="add-custom-build-btn"
                    onClick={handleAssembleBuild}
                    className="px-6 py-4 rounded-xl font-orbitron font-extrabold text-xs tracking-wider text-black bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-95 active:scale-95 transition-all text-center flex items-center justify-center gap-x-2 cursor-pointer"
                  >
                    <span>{t.customizer.assembleBtn}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                </div>

              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

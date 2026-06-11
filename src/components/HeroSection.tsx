import { useState } from 'react';
import { Sparkles, Terminal, ShieldAlert, Cpu, Layers, Disc, CircleDot, Zap, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../translations';
import phoneEnigmaImg from '../assets/images/cyberpunk_phone_3d_1781150520556.png';

interface HeroSectionProps {
  onOpenCustomizer: (prodId: string) => void;
  isDarkMode: boolean;
  lang: Language;
}

export default function HeroSection({ onOpenCustomizer, isDarkMode, lang }: HeroSectionProps) {
  // Selected visual hue of the smartphone glow in the heroic showcase
  const [activeGlow, setActiveGlow] = useState<'cyan' | 'purple' | 'pink'>('cyan');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const t = translations[lang];

  // Specifications overlay highlights for interactive hotspots
  const hotspots = [
    {
      id: 'lens', 
      label: t.hero.hotspotLensLabel, 
      desc: t.hero.hotspotLensDesc,
      top: '18%', 
      left: '42%'
    },
    {
      id: 'chip', 
      label: t.hero.hotspotChipLabel, 
      desc: t.hero.hotspotChipDesc,
      top: '46%', 
      left: '58%'
    },
    {
      id: 'cell', 
      label: t.hero.hotspotCellLabel, 
      desc: t.hero.hotspotCellDesc,
      top: '78%', 
      left: '32%'
    }
  ];

  const handleScrollToProducts = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const glowStyles = {
    cyan: 'from-neon-cyan/20 to-transparent shadow-[0_0_50px_rgba(0,240,255,0.25)] border-neon-cyan/30 text-neon-cyan',
    purple: 'from-neon-purple/20 to-transparent shadow-[0_0_50px_rgba(189,0,255,0.25)] border-neon-purple/30 text-neon-purple',
    pink: 'from-neon-pink/20 to-transparent shadow-[0_0_50px_rgba(255,0,127,0.25)] border-neon-pink/30 text-neon-pink',
  };

  const glowColorsHex = {
    cyan: '#00F0FF',
    purple: '#BD00FF',
    pink: '#FF007F',
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-tech-grid"
    >
      {/* Background radial atmosphere glow depending on selected color */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 75% 45%, ${glowColorsHex[activeGlow]}12 0%, transparent 60%),
                       radial-gradient(circle at 25% 65%, ${isDarkMode ? '#0a0b0d' : '#ffffff'} 10%, transparent 80%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Text & Pitch */}
          <div className="lg:col-span-7 space-y-8 text-left rtl:text-right">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1.5 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 text-neon-cyan text-xs font-mono select-none"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="tracking-widest uppercase">{t.hero.shieldBadge}</span>
            </motion.div>

            {/* Main Stunning Headings */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-orbitron font-black text-4xl sm:text-5xl xl:text-6xl tracking-tight leading-tight"
              >
                4U PRO:{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-fast-glow">
                  {t.hero.mainTitleGlow}
                </span>{' '}
                {t.hero.mainTitleLast}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={`font-sans text-base sm:text-lg max-w-xl font-light leading-relaxed ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                {t.hero.subParagraph}
              </motion.p>
            </div>

            {/* Micro Specs Teaser */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`grid grid-cols-3 gap-4 py-6 border-y ${
                isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
              } max-w-lg`}
            >
              <div className="text-left rtl:text-right">
                <div className="font-mono text-neon-cyan text-xl sm:text-2xl font-bold">180Hz</div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-sans mt-1">{t.hero.holoStage}</div>
              </div>
              <div className="text-left rtl:text-right">
                <div className="font-mono text-neon-purple text-xl sm:text-2xl font-bold">Terabeat</div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-sans mt-1">{t.hero.neuralEngine}</div>
              </div>
              <div className="text-left rtl:text-right">
                <div className="font-mono text-neon-pink text-xl sm:text-2xl font-bold">8.5m</div>
                <div className="text-xs text-neutral-400 uppercase tracking-wider font-sans mt-1">{t.hero.chargerLink}</div>
              </div>
            </motion.div>

            {/* Main Interactive CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                id="cta-explore"
                onClick={handleScrollToProducts}
                className="px-8 py-4 rounded-xl font-orbitron font-black text-sm tracking-widest text-black bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90 active:scale-95 transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] text-center flex items-center justify-center gap-x-2 group cursor-pointer"
              >
                <span>{t.hero.exploreBtn}</span>
                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
              </button>

              <button
                id="config-neo-phone"
                onClick={() => onOpenCustomizer('comp-quantumbook')}
                className={`px-7 py-3.5 rounded-xl font-orbitron font-bold text-xs tracking-wider border transition-all text-center flex items-center justify-center gap-x-2 cursor-pointer ${
                  isDarkMode
                    ? 'border-neutral-800 bg-neutral-900/30 text-white hover:border-neon-cyan/50 hover:bg-neutral-900/60'
                    : 'border-neutral-300 bg-neutral-50 text-neutral-800 hover:border-neon-purple hover:bg-neutral-100'
                }`}
              >
                <Terminal className="w-4 h-4 text-neon-purple animate-pulse" />
                <span>{t.hero.buildBtn}</span>
               </button>
            </motion.div>

            {/* Safety Indicator */}
            <div className="flex items-center gap-x-2 text-[11px] font-mono text-neutral-500 pt-1 select-none">
              <CircleDot className="w-3 h-3 text-neon-cyan animate-ping" />
              <span>{t.hero.syncAlert}</span>
            </div>

            {/* Owner/Engineer welcome card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`p-5 rounded-2xl border relative overflow-hidden max-w-lg mt-6 shadow-xl transition-all ${
                isDarkMode 
                  ? 'border-neon-cyan/20 bg-neutral-900/40 backdrop-blur-md shadow-[0_4px_30px_rgba(0,240,255,0.03)] text-white' 
                  : 'border-neutral-200 bg-white/95 text-neutral-900 shadow-md'
              }`}
            >
              {/* Corner tech details decoration */}
              <div className="absolute top-0 right-0 h-full w-[110px] bg-gradient-to-l from-neon-cyan/5 to-transparent pointer-events-none" />
              <div className="absolute top-2 right-2 ltr:right-2 rtl:left-2 rtl:right-auto font-mono text-[7px] text-neutral-500 select-none">{t.hero.welcomeReg}</div>

              <div className="flex items-center gap-x-4">
                {/* Visual Avatar Hologram Frame */}
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-cyan p-[1px] flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center relative overflow-hidden">
                    <Cpu className="w-6 h-6 text-neon-cyan animate-pulse animate-duration-1000" />
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neon-cyan animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 min-w-0 text-left rtl:text-right">
                  <div className="flex items-center gap-x-2 leading-none">
                    <span className="font-mono text-[8px] tracking-wider text-neon-cyan uppercase font-black bg-neon-cyan/10 px-1.5 py-0.5 rounded border border-neon-cyan/25">
                      {t.hero.welcomePresident}
                    </span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  
                  {/* Name and Designation */}
                  <h4 className="font-orbitron font-extrabold text-lg sm:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neon-cyan dark:from-white dark:via-neutral-100 dark:to-neon-cyan mt-1 leading-none">
                    {t.hero.welcomeName}
                  </h4>
                  <p className="font-mono text-[9px] sm:text-[10px] text-neon-purple tracking-widest font-extrabold uppercase mt-0.5">
                    {t.hero.welcomeRole}
                  </p>
                </div>
              </div>

              {/* Welcoming statement */}
              <p className={`font-sans text-xs font-light leading-relaxed mt-3.5 border-t pt-3 text-left rtl:text-right ${
                isDarkMode ? 'border-neutral-800 text-neutral-300' : 'border-neutral-150 text-neutral-600'
              }`}>
                {t.hero.welcomeQuote}
              </p>

              {/* Interactive Phone Link */}
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3.5 border-t pt-3 text-[11px] font-mono ${
                isDarkMode ? 'border-neutral-850' : 'border-neutral-150'
              }`}>
                <span className="text-neutral-500 uppercase font-semibold">{t.hero.welcomeSupportLine}</span>
                <a 
                  href="tel:01017668384"
                  className="inline-flex items-center gap-x-1.5 text-neon-cyan hover:text-neon-pink active:scale-95 transition-all font-bold group"
                >
                  <Zap className="w-3.5 h-3.5 text-neon-cyan group-hover:text-neon-pink group-hover:scale-110 transition-transform" />
                  <span className="underline decoration-neon-cyan/30 hover:decoration-neon-pink/50 tracking-wider">
                    01017668384
                  </span>
                </a>
              </div>
            </motion.div>

          </div>

          {/* Right: Stunning 3D Floating Smartphone Layout */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Color Orbit Control Panel */}
            <div className="absolute right-0 top-0 ltr:right-0 rtl:left-0 rtl:right-auto z-20 flex flex-col space-y-3 p-3 rounded-2xl glass-panel border border-neutral-800 backdrop-blur-md">
              <span className="text-[9px] font-mono text-gray-400 text-center uppercase tracking-widest">{t.hero.glowHue}</span>
              <button
                id="hue-cyan"
                onClick={() => setActiveGlow('cyan')}
                className={`w-6 h-6 rounded-full bg-[#00F0FF] border-2 transition-transform cursor-pointer ${
                  activeGlow === 'cyan' ? 'border-white scale-110 shadow-[0_0_12px_#00F0FF]' : 'border-transparent hover:scale-105'
                }`}
                title="Cyan Light"
              />
              <button
                id="hue-purple"
                onClick={() => setActiveGlow('purple')}
                className={`w-6 h-6 rounded-full bg-[#BD00FF] border-2 transition-transform cursor-pointer ${
                  activeGlow === 'purple' ? 'border-white scale-110 shadow-[0_0_12px_#BD00FF]' : 'border-transparent hover:scale-105'
                }`}
                title="Purple Light"
              />
              <button
                id="hue-pink"
                onClick={() => setActiveGlow('pink')}
                className={`w-6 h-6 rounded-full bg-[#FF007F] border-2 transition-transform cursor-pointer ${
                  activeGlow === 'pink' ? 'border-white scale-110 shadow-[0_0_12px_#FF007F]' : 'border-transparent hover:scale-105'
                }`}
                title="Pink Light"
              />
            </div>

            {/* Interactive Stage Canvas Container */}
            <div className="relative w-full aspect-square max-w-[420px] flex items-center justify-center">
              
              {/* Outer Decorative Orbit Ring */}
              <div 
                className="absolute inset-0 rounded-full border border-dashed animate-slow-orbit z-0 transition-colors duration-500"
                style={{ borderColor: `${glowColorsHex[activeGlow]}30` }}
              />

              {/* Inner Soft Gradient Glow mesh backing */}
              <div 
                className="absolute w-72 h-72 rounded-full filter blur-[70px] opacity-40 transition-all duration-1000 z-0"
                style={{ backgroundColor: glowColorsHex[activeGlow] }}
              />

              {/* Holographic Specification Widget floating to the top-left */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute top-4 left-0 ltr:left-0 rtl:right-0 rtl:left-auto z-20 p-3 rounded-xl glass-panel border border-neon-cyan/15 max-w-[145px] font-mono text-[10px] text-left rtl:text-right"
              >
                <div className="flex items-center gap-x-1 text-neon-cyan leading-none">
                  <Cpu className="w-3.5 h-3.5 animate-pulse" />
                  <span className="font-bold">4U-OS PRO v9.1</span>
                </div>
                <div className="mt-1 text-gray-405 text-neutral-400">Signal: 100% Locked</div>
                <div className="text-gray-405 text-neutral-400 mt-0.5">Packet: SECURE</div>
                {/* Simulated activity bar */}
                <div className="w-full h-1 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-neon-cyan w-3/4 animate-pulse" />
                </div>
              </motion.div>

              {/* High-Resolution Renders subject */}
              <motion.div
                className="relative z-10 w-64 sm:w-72 aspect-auto animate-slow-orbit"
                style={{ animationDuration: '8s' }}
              >
                <img
                  src={phoneEnigmaImg}
                  alt="4U PRO X-Enigma Flagship Smart Device"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)] filter contrast-105 saturate-110"
                />

                {/* Hotspot triggers overlay */}
                {hotspots.map((hs) => (
                  <div
                    key={hs.id}
                    className="absolute z-30 animate-fade-in"
                    style={{ top: hs.top, left: hs.left }}
                  >
                    <button
                      id={`hotspot-${hs.id}`}
                      onMouseEnter={() => setActiveHotspot(hs.id)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all bg-black/90 border cursor-pointer ${
                        activeHotspot === hs.id
                          ? 'border-neon-cyan ring-4 ring-neon-cyan/20 scale-110'
                          : 'border-white/40 hover:border-neon-cyan hover:scale-105'
                      }`}
                      aria-label={`Inspect ${hs.label}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${
                        activeHotspot === hs.id ? 'bg-neon-cyan animate-ping' : 'bg-neon-purple'
                      }`} />
                    </button>

                    {/* Popup Info Panel */}
                    <AnimatePresence>
                      {activeHotspot === hs.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute left-6 rtl:right-6 rtl:left-auto top-1/2 -translate-y-1/2 z-40 p-4 rounded-xl glass-panel border border-neon-cyan/20 w-52 text-left rtl:text-right shadow-2xl"
                        >
                          <h5 className="font-orbitron font-extrabold text-[11px] text-neon-cyan uppercase tracking-wider">
                            {hs.label}
                          </h5>
                          <p className={`text-[10px] font-sans mt-1 leading-relaxed ${
                            isDarkMode ? 'text-neutral-300' : 'text-neutral-700'
                          }`}>
                            {hs.desc}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>

              {/* Interactive Quick Stats Box bottom-right */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-4 right-0 ltr:right-0 rtl:left-0 rtl:right-auto z-20 p-3 rounded-xl glass-panel border border-neon-purple/20 max-w-[155px] font-mono text-[9px] text-right rtl:text-left"
              >
                <div className="text-neon-purple uppercase font-extrabold">{t.hero.activeStatus}</div>
                <div className="text-gray-405 text-neutral-400 mt-1">{t.hero.latencyLabel}</div>
                <div className="text-gray-450 text-neutral-400">{t.hero.chassisLabel}</div>
                <div className="flex items-center justify-end rtl:justify-start gap-x-1 mt-1.5 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
                  <span className="text-white text-[8px] tracking-wide">{t.hero.signalReady}</span>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-12 animate-bounce">
          <button
            onClick={handleScrollToProducts}
            className="flex flex-col items-center text-neutral-500 hover:text-neon-cyan transition-colors group cursor-pointer"
            aria-label="Scroll down to catalog"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest mb-1.5">{t.hero.initCatalog}</span>
            <ArrowDown className="w-4 h-4 group-hover:text-neon-cyan transition-colors" />
          </button>
        </div>

      </div>
    </section>
  );
}

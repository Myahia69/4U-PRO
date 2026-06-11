import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { Sparkles, Star, ChevronRight, Zap, ListFilter, Cpu, Headphones, Smartphone, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../translations';
import PhoneComparisonModal from './PhoneComparisonModal';
import { formatPrice } from '../lib/priceUtils';

interface BentoCategoryGridProps {
  onOpenCustomizer: (prodId: string) => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isDarkMode: boolean;
  lang: Language;
  products: Product[];
}

export default function BentoCategoryGrid({ onOpenCustomizer, cart, setCart, isDarkMode, lang, products }: BentoCategoryGridProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'computer' | 'phone' | 'accessory'>('all');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, string>>({
    'comp-quantumbook': 'Obsidian Black',
    'comp-deskomega': 'Obsidian Black',
    'phone-enigma': 'Obsidian Black',
    'phone-titan': 'Titan Grey',
    'acc-headphone': 'Laser Purple',
    'acc-watch': 'Neon Blue'
  });

  const t = translations[lang];

  const handleMouseMove3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotating tilt (max 8 degrees for premium, high-end feel)
    const rotateX = ((centerY - y) / centerY) * 8; 
    const rotateY = ((x - centerX) / centerX) * 8;
    
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
    card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave3D = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  };

  const filteredProducts = products.filter(p => {
    if (activeFilter === 'all') return true;
    return p.category === activeFilter;
  });

  const handleInstantBuy = (product: Product) => {
    const selectedColor = selectedColorMap[product.id] || product.colors[0].name;
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.selectedColor === selectedColor);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { product, selectedColor, quantity: 1, customSpec: 'Standard Edition' }];
      }
    });

    // Pulse notification effect
    const btn = document.getElementById(`buy-btn-${product.id}`);
    if (btn) {
      btn.classList.add('scale-95', 'bg-green-500');
      setTimeout(() => btn.classList.remove('scale-95', 'bg-green-500'), 300);
    }
  };

  const handleColorSelect = (prodId: string, colorName: string) => {
    setSelectedColorMap(prev => ({ ...prev, [prodId]: colorName }));
  };

  const getColorTranslation = (prodId: string, colorName: string) => {
    const prodCol = t.productsData[prodId as keyof typeof t.productsData]?.colors;
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

  return (
    <section id="catalog" className="py-24 relative overflow-hidden">
      {/* Absolute decorative glow effects behind grids */}
      <div className="absolute right-10 top-1/3 w-80 h-80 rounded-full bg-neon-purple/5 filter blur-[80px] pointer-events-none" />
      <div className="absolute left-10 bottom-1/4 w-80 h-80 rounded-full bg-neon-cyan/5 filter blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center md:text-left rtl:md:text-right md:flex md:items-end md:justify-between mb-16 space-y-4 md:space-y-0"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-x-2 text-neon-purple text-xs font-mono uppercase tracking-widest bg-neon-purple/5 px-3 py-1 rounded-md border border-neon-purple/15">
              <Zap className="w-3.5 h-3.5" />
              <span>{t.bento.gridTitle}</span>
            </div>
            <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl tracking-tight">
              {t.bento.selectYour} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple font-black">{t.bento.ecosystemCore}</span>
            </h2>
            <p className={`font-sans text-sm font-light max-w-lg ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {t.bento.subDescription}
            </p>
          </div>

          {/* Controls for filtering category nodes */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {/* Compare Phones trigger */}
            <button
              id="compare-phones-btn"
              onClick={() => setIsComparisonOpen(true)}
              className="px-4 py-2 rounded-lg font-orbitron font-bold text-xs tracking-wider transition-all duration-300 border border-neon-cyan/45 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/20 cursor-pointer flex items-center gap-x-2 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:border-neon-cyan"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{lang === 'en' ? 'Compare Phones' : 'مقارنة الهواتف'}</span>
            </button>

            <button
              id="filter-all"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg font-orbitron font-bold text-xs tracking-wider transition-all duration-300 border flex items-center gap-x-2 cursor-pointer ${
                activeFilter === 'all'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>{t.bento.allCores}</span>
            </button>
            <button
              id="filter-computers"
              onClick={() => setActiveFilter('computer')}
              className={`px-4 py-2 rounded-lg font-orbitron font-bold text-xs tracking-wider transition-all duration-300 border flex items-center gap-x-2 cursor-pointer ${
                activeFilter === 'computer'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
              <span>{t.bento.computationRigs}</span>
            </button>
            <button
              id="filter-phones"
              onClick={() => setActiveFilter('phone')}
              className={`px-4 py-2 rounded-lg font-orbitron font-bold text-xs tracking-wider transition-all duration-300 border flex items-center gap-x-2 cursor-pointer ${
                activeFilter === 'phone'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.bento.sensoryLabs}</span>
            </button>
            <button
              id="filter-accessories"
              onClick={() => setActiveFilter('accessory')}
              className={`px-4 py-2 rounded-lg font-orbitron font-bold text-xs tracking-wider transition-all duration-300 border flex items-center gap-x-2 cursor-pointer ${
                activeFilter === 'accessory'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  : 'border-neutral-800 hover:border-neutral-700 text-neutral-400'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>{t.bento.eliteGears}</span>
            </button>
          </div>
        </motion.div>

        {/* Bento Grid layout */}
        <div id="bento-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {filteredProducts.map((p, index) => {
            // Distribute grid columns to look like a true asymmetric bento layout
            const gridSpan = index % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5';
            const selectedColor = selectedColorMap[p.id] || p.colors[0].name;

            // Fetch dynamic product translation from data dictionary
            const prodTrans = t.productsData[p.id as keyof typeof t.productsData] || {
              name: p.name,
              tagline: p.tagline,
              description: p.description,
              specs: p.specs
            };

            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.1 }}
                onMouseMove={handleMouseMove3D}
                onMouseEnter={() => setHoveredCardId(p.id)}
                onMouseLeave={(e) => {
                  handleMouseLeave3D(e);
                  setHoveredCardId(null);
                }}
                className={`${gridSpan} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group border ${
                  isDarkMode
                    ? 'bg-obsidian-card border-neutral-800 hover:border-neon-cyan/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]'
                    : 'bg-white border-neutral-200 hover:border-neon-purple/40 shadow-sm'
                }`}
                style={{
                  transform: hoveredCardId === p.id 
                    ? 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale3d(1.02, 1.02, 1.02)' 
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                  transformStyle: 'preserve-3d',
                  transition: hoveredCardId === p.id
                    ? 'transform 0.08s ease-out, border-color 0.3s, shadow 0.3s'
                    : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s, shadow 0.5s'
                }}
              >
                {/* Interactive Dynamic 3D Laser Refraction / Glare Layer */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-350 z-20"
                  style={{
                    background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.18) 0%, transparent 65%)',
                    mixBlendMode: 'overlay',
                  }}
                />

                {/* Background glow when hovered */}
                <div
                  className="absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100 bg-radial pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${p.category === 'computer' ? '#00F0FF12' : p.category === 'phone' ? '#BD00FF12' : '#FF007F12'} 0%, transparent 60%)`
                  }}
                />

                {/* Card Top: Tags, Star Ratings & Original Price */}
                <div className="flex justify-between items-start z-10" style={{ transform: 'translateZ(15px)' }}>
                  <span className={`text-[10px] sm:text-[11px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-neutral-900 text-neutral-450 dark:text-neutral-400 border border-neutral-800`}>
                    {p.category === 'computer' ? t.bento.tagComp : p.category === 'phone' ? t.bento.tagPhone : t.bento.tagAcc}
                  </span>
                  <div className="flex items-center gap-x-1 font-mono text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                {/* Card Middle */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-6 z-10">
                  {/* Left part: product description and features */}
                  <div className="sm:col-span-7 space-y-3 order-2 sm:order-1 text-left rtl:text-right">
                    <h3 className="font-orbitron font-extrabold text-2xl tracking-tight leading-none group-hover:text-neon-cyan transition-colors">
                      {prodTrans.name}
                    </h3>
                    <p className={`font-mono text-[11px] leading-relaxed uppercase tracking-wider text-neon-purple`}>
                      {prodTrans.tagline}
                    </p>
                    <p className={`font-sans text-xs font-light line-clamp-3 leading-relaxed ${
                      isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
                    }`}>
                      {prodTrans.description}
                    </p>

                    {/* Specifications mini bullet grids */}
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-2">
                      {prodTrans.specs.slice(0, 4).map((spec: any, sIdx: number) => (
                        <div key={sIdx} className="text-left rtl:text-right font-mono text-[9px]">
                          <span className="text-neutral-550 dark:text-neutral-500 block leading-tight">{spec.label}</span>
                          <span className={`font-medium tracking-tight block truncate leading-tight ${
                            isDarkMode ? 'text-gray-300' : 'text-neutral-700'
                          }`}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right part: stunning 3D image with glass backdrop & hover scaling */}
                  <div 
                    className="sm:col-span-5 order-1 sm:order-2 flex justify-center items-center relative aspect-square max-h-[180px]"
                    style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
                  >
                    <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-neon-cyan/5 to-neon-purple/5 filter blur-xl group-hover:scale-125 transition-all duration-770" />
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="object-contain w-full h-full max-h-[160px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:scale-110 filter contrast-105 transition-transform duration-500"
                      style={{ transform: 'translateZ(40px)' }}
                    />
                  </div>
                </div>

                {/* Card Bottom: Options Selector, Price Tag, and CTAs */}
                <div className={`pt-4 border-t z-10 flex flex-wrap gap-4 items-center justify-between ${
                  isDarkMode ? 'border-neutral-800' : 'border-neutral-200'
                }`}>
                  
                  {/* Active Color Selector */}
                  <div className="flex flex-col space-y-1 text-left rtl:text-right">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">{t.bento.hueSelection}</span>
                    <div className="flex items-center gap-x-1.5 pt-0.5">
                      {p.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => handleColorSelect(p.id, c.name)}
                          className={`w-4 h-4 rounded-full border cursor-pointer transition-all hover:scale-110 ${c.previewColor} ${
                            selectedColor === c.name ? 'scale-110 ring-2 ring-neon-cyan/60' : ''
                          }`}
                          title={`${getColorTranslation(p.id, c.name)}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* High Quality Price Bracket with neon text shadow */}
                  <div className="flex flex-col text-right rtl:text-left">
                    <div className="flex items-center gap-x-2 justify-end rtl:justify-start">
                      {p.originalPrice && (
                        <span className="text-xs line-through text-neutral-500 font-mono">
                          {formatPrice(p.originalPrice, p.currency, lang)}
                        </span>
                      )}
                      <span className="font-mono text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neon-cyan">
                        {formatPrice(p.price, p.currency, lang)}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest font-black">
                      {t.bento.inStock}
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-x-2 w-full sm:w-auto">
                    
                    {/* Phone comparison contextual trigger */}
                    {p.category === 'phone' && (
                      <button
                        onClick={() => setIsComparisonOpen(true)}
                        className="p-2.5 rounded-lg border border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 transition-all flex items-center justify-center cursor-pointer"
                        title={lang === 'en' ? "Compare Flagship Specs" : "مقارنة الهواتف الرائدة"}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Secondary Customizer Launcher */}
                    <button
                      id={`customizer-trigger-${p.id}`}
                      onClick={() => onOpenCustomizer(p.id)}
                      className="p-2.5 rounded-lg border border-neutral-700 hover:border-neon-cyan hover:bg-neutral-800 transition-all text-neutral-450 hover:text-white flex items-center justify-center cursor-pointer"
                      title="Custom Builder Specs"
                    >
                      <Cpu className="w-4 h-4 text-neon-purple animate-pulse" />
                    </button>

                    {/* Primary Instant Allocator */}
                    <button
                      id={`buy-btn-${p.id}`}
                      onClick={() => handleInstantBuy(p)}
                      className="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg font-orbitron font-extrabold text-xs tracking-wider text-black bg-neon-cyan hover:opacity-95 active:scale-95 transition-all text-center flex items-center justify-center gap-x-1 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>{t.bento.instantBuyBtn}</span>
                    </button>

                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>

      {/* Flagship Phones Comparison Diagnostic Modals */}
      <AnimatePresence>
        {isComparisonOpen && (
          <PhoneComparisonModal
            isOpen={isComparisonOpen}
            onClose={() => setIsComparisonOpen(false)}
            products={products}
            onOpenCustomizer={onOpenCustomizer}
            lang={lang}
            setCart={setCart}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

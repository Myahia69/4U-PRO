import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BentoCategoryGrid from './components/BentoCategoryGrid';
import TechInspector from './components/TechInspector';
import ProDifference from './components/ProDifference';
import TestimonialsSlider from './components/TestimonialsSlider';
import Footer from './components/Footer';
import ProductCustomizerModal from './components/ProductCustomizerModal';
import AdminPanelModal from './components/AdminPanelModal';
import { CartItem, Product } from './types';
import { products as initialProducts } from './data';
import { Sparkles, ShoppingBag, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from './translations';

export default function App() {
  // Load productsList with local storage persistence
  const [productsList, setProductsList] = useState<Product[]>(() => {
    const saved = localStorage.getItem('4u_pro_productsList_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialProducts;
  });

  // Persist products to localStorage
  useEffect(() => {
    localStorage.setItem('4u_pro_productsList_v2', JSON.stringify(productsList));
  }, [productsList]);

  // Admin modal open/close state
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  const handleResetCatalog = () => {
    setProductsList(initialProducts);
  };

  // Theme state persisting in session storage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('4u_pro_theme_v2');
    return saved !== 'light'; // Default to premium dark mode
  });

  // Language state persisting in storage (defaulting to ar as requested)
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('4u_pro_lang_v2');
    return (saved as Language) || 'ar';
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Selected product identifier for custom builder modal
  const [customizerId, setCustomizerId] = useState<string | null>(null);

  // Sync isDarkMode to HTML node
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('light-theme');
      localStorage.setItem('4u_pro_theme_v2', 'dark');
    } else {
      root.classList.add('light-theme');
      localStorage.setItem('4u_pro_theme_v2', 'light');
    }
  }, [isDarkMode]);

  // Sync language and document orientation
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  // Handle opening builder drawers
  const handleOpenCustomizer = (productId: string) => {
    setCustomizerId(productId);
  };

  const handleCloseCustomizer = () => {
    setCustomizerId(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleLanguage = () => {
    setLang(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      localStorage.setItem('4u_pro_lang_v2', next);
      return next;
    });
  };

  return (
    <div
      id="app-container"
      className={`min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500 selection:bg-neon-cyan selection:text-black ${
        isDarkMode ? 'bg-[#0B0C10] text-neutral-100' : 'bg-neutral-50 text-neutral-900'
      }`}
    >
      {/* Mesh atmosphere backing across entire layout */}
      <div className="absolute inset-0 z-0 mesh-gradient-overlay pointer-events-none" />

      {/* Elegant Dark dynamic glow elements */}
      {isDarkMode && (
        <>
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#BD00FF]/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#00F0FF]/10 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="absolute top-[35%] left-[10%] w-[600px] h-[600px] bg-[#BD00FF]/05 rounded-full blur-[150px] pointer-events-none z-0" />
          <div className="absolute top-[65%] right-[5%] w-[600px] h-[600px] bg-[#00F0FF]/05 rounded-full blur-[150px] pointer-events-none z-0" />
        </>
      )}

      {/* Futuristic Header with scroll gauge & cart */}
      <Navbar
        cart={cart}
        setCart={setCart}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        onOpenCustomizer={handleOpenCustomizer}
        lang={lang}
        toggleLanguage={toggleLanguage}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Structural Layout blocks */}
      <main className="relative z-10">
        
        {/* Unit 1: Hero Scene with rotating 3D phone and spec points */}
        <HeroSection
          onOpenCustomizer={handleOpenCustomizer}
          isDarkMode={isDarkMode}
          lang={lang}
        />

        {/* Unit 2: Bento Category Grid containing phones isAccessories cards */}
        <BentoCategoryGrid
          onOpenCustomizer={handleOpenCustomizer}
          cart={cart}
          setCart={setCart}
          isDarkMode={isDarkMode}
          lang={lang}
          products={productsList}
        />

        {/* Real-time Cybernetic Hardware Test Diagnostics */}
        <TechInspector
          isDarkMode={isDarkMode}
          lang={lang}
        />

        {/* Unit 3: Premium Pro Difference highlight points (USPs) */}
        <ProDifference
          isDarkMode={isDarkMode}
          lang={lang}
        />

        {/* Unit 4: Testimonials social feed */}
        <TestimonialsSlider
          isDarkMode={isDarkMode}
          lang={lang}
        />

      </main>

      {/* Multi-tier Spec Builder overlay drawer */}
      <ProductCustomizerModal
        productId={customizerId}
        onClose={handleCloseCustomizer}
        cart={cart}
        setCart={setCart}
        isDarkMode={isDarkMode}
        lang={lang}
        products={productsList}
      />

      {/* Secure Admin Control Console */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanelModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            lang={lang}
            productsList={productsList}
            setProductsList={setProductsList}
            isDarkMode={isDarkMode}
            onResetCatalog={handleResetCatalog}
          />
        )}
      </AnimatePresence>

      {/* Footer block with glowing input, brand and credentials links */}
      <Footer
        isDarkMode={isDarkMode}
        lang={lang}
      />
    </div>
  );
}

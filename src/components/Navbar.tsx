import React, { useState, useEffect } from 'react';
import { ShoppingCart, Moon, Sun, Sparkles, X, Trash2, Plus, Minus, CheckCircle, ArrowRight, Globe, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../translations';
import { formatPrice } from '../lib/priceUtils';

interface NavbarProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenCustomizer: (prodId: string) => void;
  lang: Language;
  toggleLanguage: () => void;
  onOpenAdmin: () => void;
}

export default function Navbar({ cart, setCart, isDarkMode, toggleTheme, onOpenCustomizer, lang, toggleLanguage, onOpenAdmin }: NavbarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'form' | 'processing' | 'success'>('idle');
  const [txId, setTxId] = useState('');

  // Customer checkout inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [checkoutError, setCheckoutError] = useState('');

  const t = translations[lang];

  const checkoutT = {
    en: {
      customerDetails: 'Delivery & Customer Details',
      name: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address (Optional)',
      address: 'Delivery Address',
      backToCart: 'Back to Cart',
      confirmPurchase: 'Confirm Order & Submit',
      nameRequired: 'Name and Phone are required for delivery pairing.',
      addressPlaceholder: 'Street details, City, Egypt',
      phonePlaceholder: '01xxxxxxxxx',
    },
    ar: {
      customerDetails: 'تفاصيل المستلم وعنوان التوصيل',
      name: 'الاسم الكامل المعتمد',
      phone: 'رقم هاتف الاتصال للعميل',
      email: 'البريد الإلكتروني (اختياري)',
      address: 'عنوان شحن وتسليم المنتج',
      backToCart: 'العودة لعربة التسوق',
      confirmPurchase: 'تأكيد وحجز الطلب للإنتاج',
      nameRequired: 'يرجى إدخال الاسم ورقم الهاتف على الأقل لتسجيل وحجز طلبك.',
      addressPlaceholder: 'الشارع، المنطقة، المحافظة، مصر',
      phonePlaceholder: '01xxxxxxxxx',
    }
  }[lang];

  // Creates the persistent order in localStorage so the admin panel can view it!
  const createNewOrder = (transactionId: string) => {
    const currentOrdersStr = localStorage.getItem('4u_pro_orders_v1');
    let currentOrders: any[] = [];
    if (currentOrdersStr) {
      try {
        currentOrders = JSON.parse(currentOrdersStr);
      } catch (e) {
        console.error(e);
      }
    }

    const nextInvoiceSeq = 1000 + currentOrders.length + 1;
    const invoiceNumber = `INV-${nextInvoiceSeq}`;

    const newOrder = {
      id: transactionId,
      invoiceNumber: invoiceNumber,
      customerName: customerName.trim() || (lang === 'ar' ? 'عميل كودي' : 'Standard Node User'),
      customerPhone: customerPhone.trim() || '---',
      customerEmail: customerEmail.trim() || '---',
      customerAddress: customerAddress.trim() || (lang === 'ar' ? 'استلام من التوكيل الرئيسي' : 'Primary Lab Pickup'),
      date: new Date().toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US'),
      items: cart,
      totalPrice: cartTotal,
      status: 'pending', // 'pending' | 'paid' | 'delivered'
      currency: cart[0]?.product.currency || 'USD'
    };

    currentOrders.unshift(newOrder);
    localStorage.setItem('4u_pro_orders_v1', JSON.stringify(currentOrders));
  };

  // Track scroll activity
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setScrollProgress((window.scrollY / scrollHeight) * 100);
      }
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set transactions ID on checkout
  const handleProcessCheckout = () => {
    if (checkoutStep === 'idle') {
      // Transition to info collection form
      setCheckoutStep('form');
      return;
    }

    if (checkoutStep === 'form') {
      if (!customerName.trim() || !customerPhone.trim()) {
        setCheckoutError(checkoutT.nameRequired);
        return;
      }
      
      setCheckoutError('');
      setCheckoutStep('processing');
      const generatedTxId = `TX-${Math.floor(100000 + Math.random() * 90000).toString(16).toUpperCase()}`;
      
      setTimeout(() => {
        createNewOrder(generatedTxId);
        setTxId(generatedTxId);
        setCheckoutStep('success');
      }, 2500);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index] = { ...copy[index], quantity: newQty };
      }
      return copy;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getCartTotalDisplay = () => {
    const usd = cart.reduce((acc, item) => item.product.currency !== 'EGP' ? acc + item.product.price * item.quantity : acc, 0);
    const egp = cart.reduce((acc, item) => item.product.currency === 'EGP' ? acc + item.product.price * item.quantity : acc, 0);
    
    const parts = [];
    if (usd > 0) {
      parts.push(formatPrice(usd, 'USD', lang));
    }
    if (egp > 0) {
      parts.push(formatPrice(egp, 'EGP', lang));
    }
    if (parts.length === 0) {
      return formatPrice(0, 'USD', lang);
    }
    return parts.join(' + ');
  };

  return (
    <>
      {/* Scroll Progress Meter */}
      <div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink z-[100] transition-all duration-75 shadow-[0_0_12px_rgba(0,240,255,0.95),_0_0_6px_rgba(189,0,255,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? 'bg-[#0B0C10]/90 backdrop-blur-md border-b border-neon-cyan/20 shadow-[0_4px_30px_rgba(0,240,255,0.05)]'
              : 'bg-white/85 backdrop-blur-md border-b border-neutral-200 shadow-md'
            : 'bg-transparent border-b border-transparent'
        }`}
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center animate-fade-in">
              <a href="#hero" className="flex flex-col items-start group select-none">
                <div className="flex items-end space-x-1.5 leading-none rtl:space-x-reverse">
                  <span className={`font-orbitron font-black text-3xl sm:text-4xl tracking-tight transition-all duration-300 group-hover:text-neon-cyan ${
                    isDarkMode 
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]' 
                      : 'text-neutral-900 group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                  }`}>
                    4U
                  </span>
                  <span className="font-orbitron font-extrabold text-[9px] sm:text-[10px] tracking-wider bg-gradient-to-r from-neon-pink to-neon-purple text-white py-0.5 px-1.5 rounded border border-neon-purple/30 bg-neutral-900/60 uppercase leading-none transform translate-y-[-2px] inline-block shadow-[0_0_6px_rgba(189,0,255,0.3)]">
                    PRO
                  </span>
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] text-neutral-400 dark:text-neutral-300 group-hover:text-neon-cyan transition-colors mt-1 font-bold whitespace-nowrap uppercase leading-none">
                  {t.navbar.sublogo}
                </span>
                {/* Modern premium curved phone stack inspired directly by the uploaded image */}
                <div className="flex items-center justify-center w-full mt-2 h-4 select-none pointer-events-none relative">
                  <div className="flex items-center -space-x-1 sm:-space-x-1.5">
                    {/* Left curved phone */}
                    <div className="w-[8px] sm:w-[10px] h-[13px] sm:h-[15px] rounded-[2px] border-[0.5px] border-neutral-600/60 bg-neutral-900/95 shadow-sm transform -rotate-[15deg] translate-y-[1px] relative overflow-hidden transition-all duration-300 group-hover:border-neon-purple/40">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-900 to-neutral-800" />
                      <div className="absolute inset-x-[1px] top-[1px] bottom-[1px] bg-neon-purple/10 rounded-[1px]" />
                    </div>
                    {/* Center flagship phone (facing front, beautifully illuminated with screen gloss) */}
                    <div className="w-[11px] sm:w-[13px] h-[16px] sm:h-[18px] rounded-[2.5px] border-[0.5px] border-neon-cyan bg-neutral-950 shadow-[0_0_10px_rgba(0,240,255,0.7)] z-10 transform scale-110 relative overflow-hidden transition-all duration-300 group-hover:scale-120 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.9)]">
                      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-950" />
                      {/* Gloss gloss bar */}
                      <div className="absolute inset-x-[0.5px] top-[0.5px] h-[7px] bg-gradient-to-b from-neon-cyan/40 via-neon-cyan-[10%]/5 to-transparent rounded-[1.5px] z-20" />
                      <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent transform rotate-45 translate-y-[-50%] z-15" />
                      {/* Dynamic tiny screen detail */}
                      <div className="absolute bottom-[2px] inset-x-[1px] h-[4px] bg-gradient-to-t from-neon-purple/50 to-transparent rounded-[0.5px]" />
                    </div>
                    {/* Right curved phone */}
                    <div className="w-[8px] sm:w-[10px] h-[13px] sm:h-[15px] rounded-[2px] border-[0.5px] border-neutral-600/60 bg-neutral-900/95 shadow-sm transform rotate-[15deg] translate-y-[1px] relative overflow-hidden transition-all duration-300 group-hover:border-neon-pink/40">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-neutral-900 to-neutral-800" />
                      <div className="absolute inset-x-[1px] top-[1px] bottom-[1px] bg-neon-pink/10 rounded-[1px]" />
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-center gap-x-8">
              <a href="#hero" className="font-sans hover:text-neon-cyan font-medium transition-colors text-sm hover:translate-y-[-1px] transform">
                {t.navbar.home}
              </a>
              <a href="#catalog" className="font-sans hover:text-neon-cyan font-medium transition-colors text-sm hover:translate-y-[-1px] transform">
                {t.navbar.products}
              </a>
              <a href="#usp" className="font-sans hover:text-neon-cyan font-medium transition-colors text-sm hover:translate-y-[-1px] transform">
                {t.navbar.ecosystem}
              </a>
              <a href="#reviews" className="font-sans hover:text-neon-cyan font-medium transition-colors text-sm hover:translate-y-[-1px] transform">
                {t.navbar.reviews}
              </a>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-x-3 sm:gap-x-4">
              {/* Language Switch */}
              <button
                id="language-toggle"
                onClick={toggleLanguage}
                aria-label="Toggle Language"
                className={`p-2 rounded-lg border transition-all duration-300 flex items-center justify-center gap-x-1 select-none cursor-pointer ${
                  isDarkMode
                    ? 'border-neon-pink/20 bg-obsidian-light hover:bg-[#1C1D24] hover:border-neon-pink text-neon-pink shadow-[0_0_12px_rgba(255,0,127,0.1)]'
                    : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                <Globe className="w-4 h-4 text-neon-pink" />
                <span className="font-orbitron font-extrabold text-[10px] tracking-wider leading-none">
                  {lang === 'ar' ? 'EN' : 'العربية'}
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-neon-pink animate-ping" />
              </button>

              {/* Light/Dark Toggle */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle Theme Schema"
                className={`p-2 rounded-lg border transition-all duration-300 relative cursor-pointer ${
                  isDarkMode
                    ? 'border-neon-cyan/20 bg-obsidian-light hover:bg-neutral-800 hover:border-neon-cyan text-neon-cyan'
                    : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Secure Admin Gate Button */}
              <button
                id="admin-terminal-trigger"
                onClick={onOpenAdmin}
                title={lang === 'ar' ? "لوحة تحكم المشرف (أدمن)" : "Admin Control Terminal"}
                aria-label="Admin Access Portal"
                className={`p-2 rounded-lg border transition-all duration-300 relative flex items-center justify-center cursor-pointer ${
                  isDarkMode
                    ? 'border-neon-cyan/20 bg-obsidian-light hover:bg-neutral-800 hover:border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                    : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 hover:border-neutral-400'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-neon-cyan" />
              </button>

              {/* Shopping Cart Button */}
              <button
                id="cart-trigger"
                onClick={() => setIsCartOpen(true)}
                aria-label="Toggle Cyber Cart"
                className={`p-2 rounded-lg border transition-all duration-300 relative flex items-center justify-center cursor-pointer ${
                  isDarkMode
                    ? 'border-neon-purple/20 bg-obsidian-light hover:bg-neutral-800 hover:border-neon-purple text-neon-purple'
                    : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-gradient-to-tr from-neon-pink to-neon-purple text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Slideout Holographic Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCartOpen(false);
                if (checkoutStep === 'success') {
                  setCart([]);
                  setCheckoutStep('idle');
                }
              }}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs"
            />

            {/* Panel */}
            <div className="fixed inset-y-0 right-0 ltr:right-0 rtl:left-0 max-w-full flex pl-10 rtl:pr-10 rtl:pl-0">
              <motion.div
                initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
                animate={{ x: 0 }}
                exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`w-screen max-w-md pointer-events-auto h-full ${
                  isDarkMode ? 'bg-obsidian-card text-gray-100 border-l rtl:border-r rtl:border-l-0 border-neon-cyan/15' : 'bg-white text-neutral-900 border-l rtl:border-r rtl:border-l-0 border-neutral-200'
                } flex flex-col`}
              >
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                  <div className="flex items-center gap-x-2">
                    <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
                    <h3 className="font-orbitron font-bold text-lg tracking-wider">{t.navbar.cartTitle}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      if (checkoutStep === 'success') {
                        setCart([]);
                        setCheckoutStep('idle');
                      }
                    }}
                    className="p-1 rounded-full hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content body based on checkout step */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                  {checkoutStep === 'idle' ? (
                    cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 rounded-full bg-neutral-900/40 border border-neutral-800">
                          <ShoppingCart className="w-12 h-12 text-neutral-500" />
                        </div>
                        <p className="font-medium text-neutral-400 font-sans">{t.navbar.emptyCart}</p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="px-5 py-2.5 rounded-lg font-orbitron text-xs font-semibold bg-gradient-to-tr from-neon-cyan to-neon-purple text-white hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer"
                        >
                          {t.navbar.initializeFeed}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item, idx) => (
                          <div
                            key={`${item.product.id}-${idx}`}
                            className={`p-4 rounded-xl border ${
                              isDarkMode ? 'bg-neutral-900/30 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
                            } flex gap-x-4`}
                          >
                            <div className="w-16 h-16 rounded-lg bg-neutral-900/50 flex items-center justify-center overflow-hidden border border-neutral-800/60 flex-shrink-0 animate-fade-in">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="object-contain w-14 h-14"
                              />
                            </div>
                            <div className="flex-1 min-w-0 text-left rtl:text-right">
                              <h4 className="font-semibold text-sm truncate font-sans">{item.product.name}</h4>
                              <p className="text-xs text-neon-cyan font-mono mt-0.5">
                                {t.navbar.specLabel}: {item.customSpec || 'STD'} {t.navbar.modelLabel}
                              </p>
                              <div className="flex items-center gap-x-2 mt-1">
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                                  {item.selectedColor}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                {/* Qty selector */}
                                <div className="flex items-center gap-x-1.5">
                                  <button
                                    onClick={() => updateQuantity(idx, -1)}
                                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(idx, 1)}
                                    className="p-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-x-2">
                                  <span className="font-mono text-sm font-bold text-neon-purple">
                                    {formatPrice(item.product.price * item.quantity, item.product.currency, lang)}
                                  </span>
                                  <button
                                    onClick={() => removeFromCart(idx)}
                                    className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : checkoutStep === 'form' ? (
                    <div className="space-y-5 text-left rtl:text-right">
                      <div className="pb-2 border-b border-neutral-800/40 flex items-center justify-between">
                        <h4 className="font-orbitron font-extrabold text-sm text-neon-cyan uppercase tracking-wide">
                          {checkoutT.customerDetails}
                        </h4>
                        <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                      </div>

                      {checkoutError && (
                        <div className="p-3 text-[11px] font-mono bg-red-950/20 border border-red-500/30 text-rose-400 rounded-lg">
                          {checkoutError}
                        </div>
                      )}

                      <div className="space-y-3.5">
                        {/* Name Input */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            {checkoutT.name} <span className="text-neon-pink">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder={lang === 'ar' ? 'الاسم الثلاثي المعتمد' : 'Full Registered Name'}
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                              isDarkMode ? 'bg-[#0E0F14] border-neutral-800 text-white focus:border-neon-cyan/40' : 'bg-neutral-50 border-neutral-300 text-black focus:border-neon-cyan'
                            }`}
                          />
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            {checkoutT.phone} <span className="text-neon-pink">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder={checkoutT.phonePlaceholder}
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none font-mono tracking-wide transition-all ${
                              isDarkMode ? 'bg-[#0E0F14] border-neutral-800 text-white focus:border-neon-cyan/40' : 'bg-neutral-50 border-neutral-300 text-black focus:border-neon-cyan'
                            }`}
                          />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            {checkoutT.email}
                          </label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="user@neon-node.com"
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none font-mono transition-all ${
                              isDarkMode ? 'bg-[#0E0F14] border-neutral-800 text-white focus:border-neon-cyan/40' : 'bg-neutral-50 border-neutral-300 text-black focus:border-neon-cyan'
                            }`}
                          />
                        </div>

                        {/* Address Input */}
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                            {checkoutT.address}
                          </label>
                          <textarea
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            placeholder={checkoutT.addressPlaceholder}
                            rows={2}
                            className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all resize-none ${
                              isDarkMode ? 'bg-[#0E0F14] border-neutral-800 text-white focus:border-neon-cyan/40' : 'bg-neutral-50 border-neutral-300 text-black focus:border-neon-cyan'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Go back action */}
                      <button
                        onClick={() => {
                          setCheckoutStep('idle');
                          setCheckoutError('');
                        }}
                        className={`text-[9px] font-mono uppercase tracking-widest flex items-center gap-x-1.5 transition-colors cursor-pointer mt-4 py-1 px-2.5 rounded border ${
                          isDarkMode ? 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 text-neutral-400 hover:text-white' : 'border-neutral-300 hover:border-neutral-400 bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {lang === 'ar' ? '← العودة لسلة المشتريات' : '← Back to Cart'}
                      </button>
                    </div>
                  ) : checkoutStep === 'processing' ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-neutral-800 border-t-neon-cyan animate-spin" />
                        <Sparkles className="w-6 h-6 text-neon-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-orbitron font-bold text-base tracking-wider text-neon-cyan animate-pulse">
                          {t.navbar.miningBlock}
                        </h4>
                        <p className="text-xs text-neutral-400 max-w-xs font-sans">
                          {t.navbar.miningDesc}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
                      <div className="p-4 rounded-full bg-neon-cyan/10 border border-neon-cyan/40">
                        <CheckCircle className="w-14 h-14 text-neon-cyan animate-bounce" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-orbitron font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
                          {t.navbar.transactionMemeBed}
                        </h4>
                        <p className="text-xs text-neutral-300 font-sans px-2">
                          {t.navbar.ecoReserveAllocated}
                        </p>
                      </div>

                      {/* Quantum Receipt Box */}
                      <div className="p-4 rounded-xl border border-neon-cyan/20 bg-black/80 font-mono text-left rtl:text-right w-full space-y-2 text-[11px] text-green-400 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
                        <div className="text-center border-b border-dashed border-green-800 pb-2 text-xs font-bold text-green-300">
                          --- NEON PROTOCOL RECEIPT ---
                        </div>
                        <div className="flex justify-between">
                          <span>SIGN TXID:</span>
                          <span className="text-white font-bold">{txId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CUSTOMER:</span>
                          <span className="text-white truncate max-w-[140px]">{customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t.navbar.gateway}:</span>
                          <span>4UPRO-BLOCK-72E</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t.navbar.signature}:</span>
                          <span>SHA256::CERT</span>
                        </div>
                        <div className="border-t border-dashed border-green-800 pt-2 my-1" />
                        {cart.map((item, id) => (
                          <div key={id} className="flex justify-between text-[10px]">
                            <span>{item.quantity}x {item.product.name.slice(0, 16)}..</span>
                            <span className="text-white">{formatPrice(item.product.price * item.quantity, item.product.currency, lang)}</span>
                          </div>
                        ))}
                        <div className="border-t border-dashed border-green-800 pt-2 my-1" />
                        <div className="flex justify-between font-bold text-xs text-green-300">
                          <span>{t.navbar.totalSecured}:</span>
                          <span>{getCartTotalDisplay()}</span>
                        </div>
                        <div className="text-center pt-2 text-[9px] text-neutral-500">
                          {t.navbar.stableSync}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                {cart.length > 0 && (checkoutStep === 'idle' || checkoutStep === 'form') && (
                  <div className={`p-6 border-t ${isDarkMode ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-200 bg-neutral-50'} space-y-4`}>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-neutral-400 font-sans">
                        <span>{t.navbar.allocatedSubtotal}</span>
                        <span>{getCartTotalDisplay()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-neutral-400 font-sans">
                        <span>{t.navbar.ecosystemShipping}</span>
                        <span className="text-neon-cyan">{t.navbar.freeNode}</span>
                      </div>
                      <div className="border-t border-neutral-800 pt-2 flex justify-between items-baseline font-sans">
                        <span className="text-sm font-semibold">{t.navbar.totalPoolBalance}</span>
                        <span className="text-xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-cyan to-white">
                          {getCartTotalDisplay()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleProcessCheckout}
                      className="w-full py-4 rounded-xl font-orbitron font-extrabold text-sm tracking-wider text-black bg-gradient-to-r from-neon-cyan via-spark to-neon-purple hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      style={{ backgroundColor: '#00F0FF' }}
                    >
                      <span className="text-black">
                        {checkoutStep === 'idle' ? t.navbar.secureOrder : checkoutT.confirmPurchase}
                      </span>
                      <ArrowRight className="w-4 h-4 text-black animate-pulse" />
                    </button>
                  </div>
                )}

                {/* Complete Flow Continuation */}
                {checkoutStep === 'success' && (
                  <div className={`p-6 border-t ${isDarkMode ? 'border-neutral-800 bg-neutral-900/10' : 'border-neutral-200 bg-neutral-50'}`}>
                    <button
                      onClick={() => {
                        setCart([]);
                        setCheckoutStep('idle');
                        setIsCartOpen(false);
                      }}
                      className="w-full py-3.5 rounded-xl font-orbitron font-bold text-xs tracking-wider border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/5 transition-all text-center cursor-pointer"
                    >
                      {t.navbar.flushReceipt}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

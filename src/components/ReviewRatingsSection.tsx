import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Filter, CheckCircle2, Sparkles, AlertCircle, ShoppingBag, Globe, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../translations';
import { Product } from '../types';

interface ReviewRatingsSectionProps {
  isDarkMode: boolean;
  lang: Language;
  products: Product[];
}

export interface UserReview {
  id: string;
  name: string;
  targetType: 'page' | 'product';
  targetId?: string; // product id if targetType is 'product'
  targetName: string; // "الصفحة" or Product Name
  rating: number;
  comment: string;
  timestamp: string;
  avatarSeed: number; // to generate consistent placeholder avatar colors
}

export default function ReviewRatingsSection({ isDarkMode, lang, products }: ReviewRatingsSectionProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [filter, setFilter] = useState<'all' | 'page' | 'products'>('all');
  
  // Form states
  const [name, setName] = useState('');
  const [targetType, setTargetType] = useState<'page' | 'product'>('page');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  
  // UI states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Translations
  const t = {
    ar: {
      sectionBadge: 'حلقة بث التقييمات التفاعلية',
      sectionTitleGlow: 'تقييمات مجتمع 4U PRO',
      sectionTitleLast: 'الحية',
      sectionDesc: 'اطلع على آراء النخبة والمقتنين التقنيين، أو سجل تقييمك الخاص بالخدمة والموقع أو أحد أجهزتنا الذكية المطوية.',
      
      // Form
      formTitle: 'لوحة إرسال التقييم الرقمي',
      formDesc: 'قم بتسجيل تجربتك السيبرانية ورفع التقييم الفوري لمنصات الجودة.',
      labelName: 'الاسم الكامل أو المعرّف التقني',
      placeholderName: 'مثال: المهندس أحمد الحربي',
      labelType: 'الجهة المُراد تقييمها',
      optPage: 'الموقع والخدمة العامة (الويب)',
      optProduct: 'منتج وجهاز ذكي محدد',
      labelProduct: 'اختر الجهاز المطلوب تقييمه',
      labelStars: 'معدل التقييم الإشاري (النجوم)',
      starActive: 'تقييم ممتاز',
      labelComment: 'تفاصيل المراجعة والتعليق النصي التوثيقي',
      placeholderComment: 'اكتب تجربتك الحقيقية مع العتاد أو جودة التصفح والخدمات هنا...',
      btnSubmit: 'إرسال وتثبيت التقييم بالشبكة',
      submitting: 'جاري المصادقة والبث...',
      
      // Feed
      feedTitle: 'سجل التقييمات والمراجعات النشطة',
      feedBadge: 'بث حي وموثق',
      filterAll: 'الكل',
      filterPage: 'تقييمات الموقع',
      filterProducts: 'تقييمات المنتجات',
      avgRating: 'متوسط التقييم العام',
      totalReviews: 'إجمالي التقييمات',
      emptyReviews: 'لا توجد مراجعات مسجلة في هذا القسم بعد.',
      verifiedBuyer: 'مشترٍ معتمد وموثق',
      dateJustNow: 'منذ قليل',
      errorEmpty: 'يرجى كتابة الاسم والتعليق النصي لإكمال إرسال تقييمك.',
      successSaved: 'تم إرسال ونشر تقييمك العتادي بنجاح! شكراً لمشاركتك الفعالة.'
    },
    en: {
      sectionBadge: 'INTERACTIVE FEEDBACK TELEMETRY',
      sectionTitleGlow: 'Community Feedback',
      sectionTitleLast: 'hub',
      sectionDesc: 'Explore public ratings from digital enthusiasts, or submit your own performance review for our online platform or specialized smart hardware.',
      
      // Form
      formTitle: 'DIGITAL FEEDBACK CONSOLE',
      formDesc: 'Submit your telemetry logs regarding our performance, systems, or cyber products.',
      labelName: 'Full Name or Alias',
      placeholderName: 'e.g., Liam Archer',
      labelType: 'Target of Your Review',
      optPage: 'The Website & General Service',
      optProduct: 'A Specific Smart Product',
      labelProduct: 'Select the Cyber Product',
      labelStars: 'Star Metric Evaluation',
      starActive: 'Excellent Rating',
      labelComment: 'Textual Review & Performance Commentary',
      placeholderComment: 'Write your honest feedback regarding hardware performance or site design here...',
      btnSubmit: 'TRANSMIT REVIEW TO CLOUD',
      submitting: 'Broadcasting telemetry...',
      
      // Feed
      feedTitle: 'ACTIVE RATING FEEDSTREAM',
      feedBadge: 'VERIFIED LOGS',
      filterAll: 'All Reviews',
      filterPage: 'Website-Only',
      filterProducts: 'Products-Only',
      avgRating: 'Global Score',
      totalReviews: 'Total Logs',
      emptyReviews: 'No telemetry reviews matching this scale yet.',
      verifiedBuyer: 'Verified Purchaser',
      dateJustNow: 'Just now',
      errorEmpty: 'Please fill out both your name and review comment before broadcasting.',
      successSaved: 'Feedback successfully logged & broadcasted to the terminal network! Thank you.'
    }
  }[lang];

  // Default seeded reviews if empty
  const defaultReviews: UserReview[] = [
    {
      id: 'rev-seeded-1',
      name: lang === 'ar' ? 'أنس الحربي' : 'Anas Al-Harbi',
      targetType: 'page',
      targetName: lang === 'ar' ? 'الصفحة والموقع العام' : 'Website & General Service',
      rating: 5,
      comment: lang === 'ar' 
        ? 'الموقع مذهل وسلس للغاية، الاستجابة الفورية والأشكال ثلاثية الأبعاد تعطي إحساساً مستقبلياً من درجة فاخرة! الألوان متناسقة ومريحة للعين.' 
        : 'The interface is incredibly modular and beautiful. The holographic 3D design renders instantly and provides an unparalleled cyber aesthetic!',
      timestamp: '2026-06-10T14:35:00Z',
      avatarSeed: 4
    },
    {
      id: 'rev-seeded-2',
      name: lang === 'ar' ? 'الدكتور عمر حنفي' : 'Dr. Omar Hanafy',
      targetType: 'product',
      targetId: 'phone-enigma',
      targetName: '4U PRO X-Enigma',
      rating: 5,
      comment: lang === 'ar' 
        ? 'لقد اشتريت هاتف X-Enigma لتجريب وحدة التشفير المطورة حنفي. التبريد المائى يعمل بكفاءة والسرعة استثنائية تحت أشد الضغوط والمهام الحوسبية الشاقة.' 
        : 'Bought the X-Enigma to evaluate its hardware-level cryptography. Thermals run flawlessly cool, and multitasking is seamless even under massive compute loads.',
      timestamp: '2026-06-11T01:20:00Z',
      avatarSeed: 9
    },
    {
      id: 'rev-seeded-3',
      name: lang === 'ar' ? 'سارة الشمري' : 'Sarah Al-Shimari',
      targetType: 'product',
      targetId: 'comp-quantumbook',
      targetName: '4U PRO Quantumbook-X',
      rating: 4,
      comment: lang === 'ar' 
        ? 'شاشة النيون ليد تقدم تجربة بصرية نقية جداً والألوان مفعمة بالحيوية والعمق، لوحة المقاتيح ميكانيكية ومرضية في الكتابة البرمجية المطولة!' 
        : 'The mechanical keyboard is typing perfection. Screens are incredibly bright and the color palette makes coding for hours very comfortable.',
      timestamp: '2026-06-09T09:44:00Z',
      avatarSeed: 12
    },
    {
      id: 'rev-seeded-4',
      name: lang === 'ar' ? 'جوانا لي' : 'Joanna Lee',
      targetType: 'page',
      targetName: lang === 'ar' ? 'الصفحة والموقع العام' : 'Website & General Service',
      rating: 5,
      comment: lang === 'ar' 
        ? 'آلية تفصيل مواصفات الأجهزة (Product Customizer) تجعلك تشعر بأنك تصمم عتادك القتالي السيبراني الخاص بك. دعم فني مبهر وتجربة تتيح الانتقال الفوري للعمليات.' 
        : 'The dynamic product customizer makes you feel like custom assembling high-tech military gear. Extremely intuitive UX with stunning micro-transitions.',
      timestamp: '2026-06-11T06:15:00Z',
      avatarSeed: 18
    }
  ];

  // Admin state listener
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('4u_pro_admin_logged_in') === 'true';
  });

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('4u_pro_admin_logged_in') === 'true');
    };
    window.addEventListener('admin-login-changed', checkAdmin);
    window.addEventListener('storage', checkAdmin);
    return () => {
      window.removeEventListener('admin-login-changed', checkAdmin);
      window.removeEventListener('storage', checkAdmin);
    };
  }, []);

  // Load reviews on initial load and setup sync triggers (Limiting to 20 entries max)
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('4u_pro_user_reviews_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Always slice to maximum 20 to conform with the strict 20 reviews requirement
          setReviews(parsed.slice(0, 20));
        } catch (e) {
          console.error('Failed to parse user reviews', e);
        }
      } else {
        // Enforce max 20 even on seeded defaults
        const slicedDefaults = defaultReviews.slice(0, 20);
        setReviews(slicedDefaults);
        localStorage.setItem('4u_pro_user_reviews_v3', JSON.stringify(slicedDefaults));
      }
    };

    handleSync();
    
    window.addEventListener('storage', handleSync);
    window.addEventListener('reviews-updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('reviews-updated', handleSync);
    };
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !comment.trim()) {
      setErrorMsg(t.errorEmpty);
      return;
    }

    let itemTargetName = t.optPage;
    if (targetType === 'product') {
      const selectedProd = products.find(p => p.id === selectedProductId);
      itemTargetName = selectedProd ? selectedProd.name : 'Unknown Product';
    }

    const newReview: UserReview = {
      id: 'review-' + Date.now(),
      name: name.trim(),
      targetType,
      targetId: targetType === 'product' ? selectedProductId : undefined,
      targetName: itemTargetName,
      rating,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      avatarSeed: Math.floor(Math.random() * 100)
    };

    // Prepend the new review, then limit the absolute total reviews displayed/saved to 20 maximum.
    const updatedReviews = [newReview, ...reviews].slice(0, 20);
    setReviews(updatedReviews);
    localStorage.setItem('4u_pro_user_reviews_v3', JSON.stringify(updatedReviews));
    window.dispatchEvent(new Event('reviews-updated'));

    // Clear form
    setName('');
    setComment('');
    setRating(5);
    setSuccessMsg(t.successSaved);

    // Dynamic auto fade out of success message
    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  };

  const handleDeleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem('4u_pro_user_reviews_v3', JSON.stringify(updated));
    window.dispatchEvent(new Event('reviews-updated'));
  };

  // Filter logic
  const filteredReviews = reviews.filter(rev => {
    if (filter === 'all') return true;
    if (filter === 'page') return rev.targetType === 'page';
    if (filter === 'products') return rev.targetType === 'product';
    return true;
  });

  // Calculate Average rating stats
  const totalCount = filteredReviews.length;
  const averageRating = totalCount > 0 
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '0.0';

  // Soft aesthetic placeholder avatars
  const avatarColors = [
    'from-pink-500 to-rose-500', 
    'from-cyan-500 to-blue-500', 
    'from-purple-500 to-indigo-500', 
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500'
  ];

  const getAvatarColor = (seed: number) => {
    return avatarColors[seed % avatarColors.length];
  };

  return (
    <section id="client-feedback" className={`py-24 relative overflow-hidden border-t border-b ${
      isDarkMode ? 'bg-[#090A0D]/90 border-neutral-900' : 'bg-[#FDFDFD] border-neutral-200'
    }`}>
      {/* Decorative cyber grid lights */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-x-2 text-neon-cyan text-xs font-mono uppercase tracking-widest bg-neon-cyan/5 px-3 py-1 rounded-md border border-neon-cyan/15">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>{t.sectionBadge}</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
            {t.sectionTitleGlow} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple uppercase">{t.sectionTitleLast}</span>
          </h2>
          <p className={`font-sans text-sm font-light max-w-2xl mx-auto ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {t.sectionDesc}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Review Sender Terminal (Form) */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 sm:p-8 rounded-2xl border ${
              isDarkMode 
                ? 'bg-obsidian-card border-neutral-800 shadow-2xl' 
                : 'bg-white border-neutral-200 shadow-md'
            } relative overflow-hidden`}>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Box Header */}
              <div className="space-y-1 mb-6 border-b pb-4 border-neutral-800/20 dark:border-neutral-800/80">
                <h3 className="font-orbitron font-extrabold text-base tracking-wider text-neon-cyan uppercase">
                  {t.formTitle}
                </h3>
                <p className="text-xs text-neutral-400">
                  {t.formDesc}
                </p>
              </div>

              {/* Form block */}
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-410 dark:text-neutral-300">
                    {t.labelName}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.placeholderName}
                    id="input-review-name"
                    required
                    className={`w-full px-4 py-2.5 rounded-xl border outline-none text-xs transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-900/60 border-neutral-800 text-white focus:border-neon-cyan/60' 
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-450'
                    }`}
                  />
                </div>

                {/* Target Type Selector (Page or Product) */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-410 dark:text-neutral-300">
                    {t.labelType}
                  </label>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="opt-target-page"
                      onClick={() => setTargetType('page')}
                      className={`py-2.5 px-3 rounded-xl border text-[11px] font-bold font-orbitron tracking-wider transition-all cursor-pointer flex items-center justify-center gap-x-1.5 ${
                        targetType === 'page'
                          ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)]'
                          : isDarkMode
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            : 'bg-neutral-100 border-neutral-250 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{t.optPage}</span>
                    </button>

                    <button
                      type="button"
                      id="opt-target-product"
                      onClick={() => setTargetType('product')}
                      className={`py-2.5 px-3 rounded-xl border text-[11px] font-bold font-orbitron tracking-wider transition-all cursor-pointer flex items-center justify-center gap-x-1.5 ${
                        targetType === 'product'
                          ? 'bg-neon-pink/15 border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(236,72,153,0.1)]'
                          : isDarkMode
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                            : 'bg-neutral-100 border-neutral-250 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.optProduct}</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Product Dropdown */}
                <AnimatePresence>
                  {targetType === 'product' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-410 dark:text-neutral-300">
                        {t.labelProduct}
                      </label>
                      <select
                        value={selectedProductId}
                        id="select-review-product"
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none text-xs font-sans transition-all cursor-pointer ${
                          isDarkMode 
                            ? 'bg-neutral-900 border-neutral-800 text-white focus:border-neon-pink/60' 
                            : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                        }`}
                      >
                        {products.map(prod => (
                          <option key={prod.id} value={prod.id} className={isDarkMode ? 'bg-neutral-950 text-white' : 'bg-white text-neutral-900'}>
                            {prod.name}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Star Evaluator interactive stars */}
                <div className="space-y-1.5 py-1">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-410 dark:text-neutral-300">
                      {t.labelStars}
                    </label>
                    <span className="text-[10px] text-amber-500 font-bold tracking-wider font-mono">
                      {rating}/5
                    </span>
                  </div>

                  <div className="flex items-center gap-x-2 select-none" id="star-rating-selector">
                    {[1, 2, 3, 4, 5].map((starIdx) => {
                      const isActive = hoverRating !== null ? starIdx <= hoverRating : starIdx <= rating;
                      return (
                        <button
                          key={starIdx}
                          type="button"
                          id={`star-${starIdx}`}
                          onMouseEnter={() => setHoverRating(starIdx)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(starIdx)}
                          className={`p-1 rounded-md transition-all cursor-pointer ${
                            isActive 
                              ? 'scale-110 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]' 
                              : 'opacity-40 filter grayscale hover:opacity-75'
                          }`}
                          aria-label={`Give ${starIdx} Stars`}
                        >
                          <Star 
                            className={`w-7 h-7 ${
                              isActive 
                                ? 'text-amber-500 fill-amber-500' 
                                : isDarkMode ? 'text-neutral-700' : 'text-neutral-300'
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review Copywriter */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-410 dark:text-neutral-300">
                    {t.labelComment}
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    id="input-review-comment"
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.placeholderComment}
                    required
                    className={`w-full px-4 py-3 rounded-xl border outline-none text-xs transition-all resize-none ${
                      isDarkMode 
                        ? 'bg-neutral-900/60 border-neutral-800 text-white focus:border-neon-cyan/60' 
                        : 'bg-neutral-50 border-neutral-300 text-neutral-900 focus:border-neutral-450'
                    }`}
                  />
                </div>

                {/* Alerts / Success / Failure feedbacks */}
                {successMsg && (
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-x-2 animate-fade-in uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-450 text-rose-400 text-xs flex items-center gap-x-2 animate-fade-in uppercase">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  id="btn-submit-review"
                  className={`w-full py-3.5 rounded-xl text-xs font-orbitron font-black uppercase tracking-widest text-black flex items-center justify-center gap-x-2 transition-all cursor-pointer ${
                    targetType === 'page'
                      ? 'bg-gradient-to-r from-neon-cyan to-[#0099FF] hover:shadow-[0_0_15px_rgba(0,186,255,0.3)]'
                      : 'bg-gradient-to-r from-neon-pink to-neon-purple hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.btnSubmit}</span>
                </button>

              </form>

            </div>
          </div>

          {/* Column 2: Live Streams Feed (Feed Stream) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Quick stats and filters bar */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-y-4 ${
              isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-100/60 border-neutral-250'
            }`}>
              {/* Aggregated ratings overview */}
              <div className="flex items-center gap-x-4">
                <div className="text-left rtl:text-right font-sans">
                  <div className="flex items-center gap-x-1.5">
                    <span className="font-orbitron font-extrabold text-2xl text-amber-500">{averageRating}</span>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <span className="text-[10px] text-neutral-450 dark:text-neutral-400 block mt-0.5">{t.avgRating} ({totalCount} {lang === 'ar' ? 'تقييم' : 'reviews'})</span>
                </div>
                
                <div className="w-[1px] h-8 bg-neutral-800" />

                <div className="text-left rtl:text-right font-mono">
                  <span className="font-bold text-lg text-white block leading-none">{filteredReviews.length}</span>
                  <span className="text-[9px] text-neutral-450 dark:text-neutral-400 mt-1 block uppercase tracking-wider">{t.totalReviews}</span>
                </div>
              </div>

              {/* Filtering segmented control tabs */}
              <div className="flex bg-neutral-950/40 dark:bg-black/40 border border-neutral-800 p-0.5 rounded-xl gap-x-1">
                {([
                  { id: 'all', label: t.filterAll },
                  { id: 'page', label: t.filterPage },
                  { id: 'products', label: t.filterProducts }
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                      filter === tab.id
                        ? 'bg-neutral-900 border border-neutral-800 text-neon-cyan shadow-sm font-extrabold'
                        : 'text-neutral-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic review cards viewport */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scroll">
              <AnimatePresence mode="popLayout">
                {filteredReviews.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 text-center rounded-2xl border border-dashed border-neutral-800/60 text-neutral-500 bg-neutral-950/10"
                  >
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30 text-neon-cyan animate-pulse" />
                    <p className="text-xs">{t.emptyReviews}</p>
                  </motion.div>
                ) : (
                  filteredReviews.map((rev) => (
                    <motion.div
                      layout
                      key={rev.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className={`p-5 rounded-2xl border transition-all hover:border-neutral-700/60 ${
                        isDarkMode 
                          ? 'bg-neutral-950/40 border-neutral-800/80 hover:bg-neutral-950/65' 
                          : 'bg-white border-neutral-200 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-x-4">
                        {/* Profile Info & Avatar */}
                        <div className="flex items-center gap-x-3 text-left rtl:text-right">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarColor(rev.avatarSeed)} flex items-center justify-center text-white font-black font-orbitron text-sm shadow-md`}>
                            {rev.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-sans text-left rtl:text-right">
                            <h4 className="font-bold text-xs text-neutral-200 dark:text-white uppercase tracking-wider">{rev.name}</h4>
                            <div className="flex items-center gap-x-2 mt-0.5">
                              <span className="font-mono text-[9px] text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded border border-[#22C55E]/20 font-bold">
                                {t.verifiedBuyer}
                              </span>
                              <span className="text-[9px] text-neutral-450 dark:text-neutral-500 font-mono">
                                {rev.timestamp.includes('Z') ? new Date(rev.timestamp).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short' }) : t.dateJustNow}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Targeted Entity Label */}
                        <div className="text-right rtl:text-left flex items-center gap-x-2">
                          <span className={`inline-block font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                            rev.targetType === 'page'
                              ? 'text-neon-cyan bg-neon-cyan/5 border-neon-cyan/20'
                              : 'text-neon-pink bg-neon-pink/5 border-neon-pink/20'
                          }`}>
                            {rev.targetName}
                          </span>
                          
                          {/* Admin Only Direct Delete Option */}
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev.id)}
                              title={lang === 'ar' ? 'حذف هذا التقييم' : 'Delete this review'}
                              className="p-1 px-1.5 rounded bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-red-300 transition-all cursor-pointer flex items-center justify-center self-center"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Score metrics */}
                      <div className="flex items-center gap-x-1 my-3 bg-neutral-900/30 p-1.5 rounded-lg w-fit">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating 
                                ? 'text-amber-500 fill-amber-500' 
                                : 'text-neutral-805 dark:text-neutral-800'
                            }`} 
                          />
                        ))}
                        <span className="font-mono text-[9px] text-neutral-400 pl-1.5 font-bold">{rev.rating}/5</span>
                      </div>

                      {/* Content block comment text */}
                      <p className={`font-sans text-[12px] sm:text-[13px] leading-relaxed font-light ${
                        isDarkMode ? 'text-neutral-300' : 'text-neutral-700'
                      }`}>
                        "{rev.comment}"
                      </p>

                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

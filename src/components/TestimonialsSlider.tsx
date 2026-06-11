import { useState, useEffect } from 'react';
import { testimonials } from '../data';
import { Star, ChevronLeft, ChevronRight, MessageSquare, Quote, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../translations';

interface TestimonialsSliderProps {
  isDarkMode: boolean;
  lang: Language;
}

export default function TestimonialsSlider({ isDarkMode, lang }: TestimonialsSliderProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const t = translations[lang];

  const baseTest = testimonials[index];
  // Map translated testimonial fields from static translation's testimonials.items array
  const localizedTest = t.testimonials.items[index] || {
    name: baseTest.name,
    role: baseTest.role,
    comment: baseTest.comment
  };

  const handleNext = () => {
    setDirection('right');
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-tech-grid">
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-neon-cyan/5 filter blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center animate-fade-in">
        
        {/* Header */}
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center gap-x-2 text-neon-pink text-xs font-mono uppercase tracking-widest bg-neon-pink/5 px-3 py-1 rounded-md border border-neon-pink/15">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.testimonials.feedbackBadge}</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
            {t.testimonials.mainTitleFirst} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple">{t.testimonials.mainTitleGlow}</span>
          </h2>
          <p className={`font-sans text-sm font-light max-w-md mx-auto ${
            isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
          }`}>
            {t.testimonials.subDesc}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-neon-purple/20 via-neutral-800/45 to-neon-cyan/20 border border-neutral-800/60 max-w-3xl mx-auto shadow-2xl overflow-hidden group">
          
          <div className={`p-8 sm:p-12 rounded-2xl relative overflow-hidden select-none text-left rtl:text-right ${
            isDarkMode ? 'bg-obsidian-card' : 'bg-white'
          }`}>
            
            {/* Quote Icon Backdrop */}
            <Quote className="absolute right-8 top-8 rtl:left-8 rtl:right-auto w-24 h-24 text-neutral-800/10 z-0" />

            <div className="relative z-10 space-y-8">
              
              {/* Star Rating Section */}
              <div className="flex items-center gap-x-1.5 justify-start">
                {[...Array(baseTest.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                ))}
                <span className="font-mono text-[10px] text-neutral-450 dark:text-neutral-400 pl-2 rtl:pr-2 rtl:pl-0 uppercase tracking-widest">{baseTest.platform}</span>
              </div>

              {/* Influencer review message */}
              <p className={`font-sans text-base sm:text-lg leading-relaxed font-light ${
                isDarkMode ? 'text-neutral-200' : 'text-neutral-800'
              }`}>
                "{localizedTest.comment}"
              </p>

              {/* Bio & Avatar */}
              <div className="flex items-center justify-between pointer-events-none flex-wrap gap-4">
                <div className="flex items-center gap-x-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700/50 p-0.5 overflow-hidden flex items-center justify-center">
                    <img
                      src={baseTest.avatar}
                      alt={localizedTest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-left rtl:text-right font-sans">
                    <h4 className={`font-orbitron font-extrabold text-xs uppercase tracking-wider ${
                      isDarkMode ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {localizedTest.name}
                    </h4>
                    <p className="text-[10px] text-neon-cyan font-mono mt-0.5 font-bold">
                      {localizedTest.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-1.5 text-neutral-500 text-[10px] font-mono">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t.testimonials.syncSignature}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Navigation Overlay Buttons */}
          <div className="absolute right-6 top-6 rtl:left-6 rtl:right-auto flex items-center gap-x-1.5 z-20">
            <button
              id="slide-chevron-left"
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-neutral-800 hover:border-neon-cyan bg-neutral-900 hover:text-neon-cyan transition-all cursor-pointer text-neutral-400"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="slide-chevron-right"
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-neutral-800 hover:border-neon-cyan bg-neutral-900 hover:text-neon-cyan transition-all cursor-pointer text-neutral-400"
              aria-label="Next Review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bullet Dots indicators */}
        <div className="flex items-center justify-center gap-x-2 mt-8">
          {testimonials.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setIndex(dotIdx)}
              className={`h-1.5 transition-all cursor-pointer ${
                index === dotIdx ? 'w-8 bg-neon-cyan rounded-full' : 'w-2 bg-neutral-700 hover:bg-neutral-600 rounded-full'
              }`}
              aria-label={`Show user review slide ${dotIdx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

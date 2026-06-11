import React, { useState } from 'react';
import { Send, Sparkles, Shield, Github, Twitter, Youtube, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { translations, Language } from '../translations';

interface FooterProps {
  isDarkMode: boolean;
  lang: Language;
}

export default function Footer({ isDarkMode, lang }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = translations[lang];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg(t.footer.errorMsg);
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4500);
  };

  return (
    <footer className={`py-12 border-t relative overflow-hidden ${
      isDarkMode ? 'border-neutral-900 bg-obsidian-card' : 'border-neutral-200 bg-white'
    }`}>
      
      {/* Footer Ambient Glow */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-80 h-32 rounded-full bg-neon-purple/5 filter blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-fade-in">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start text-left rtl:text-right">
          
          {/* Column 1: Brand pitch and corporate alignment */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex flex-col items-start select-none">
              <div className="flex items-end space-x-1.5 leading-none rtl:space-x-reverse">
                <span className={`font-orbitron font-black text-2xl tracking-tight transition-all duration-300 ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  4U
                </span>
                <span className="font-orbitron font-extrabold text-[8px] tracking-wider bg-gradient-to-r from-neon-pink to-neon-purple text-white py-0.5 px-1 rounded border border-neon-purple/20 bg-neutral-900/40 uppercase leading-none transform translate-y-[-1px] inline-block">
                  PRO
                </span>
              </div>
              <span className="font-mono text-[7.5px] tracking-[0.24em] text-neutral-450 dark:text-neutral-300 transition-colors mt-0.5 font-bold uppercase leading-none">
                {t.navbar.sublogo}
              </span>
            </div>
            <p className={`font-sans text-xs font-light tracking-wide max-w-sm leading-relaxed ${
              isDarkMode ? 'text-neutral-450' : 'text-neutral-600'
            }`}>
              {t.footer.brandDesc}
            </p>
            
            {/* Social Grid */}
            <div className="flex items-center gap-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X Profile Link"
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neon-cyan text-gray-400 hover:text-neon-cyan transition-all flex items-center justify-center cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Developer Portal Link"
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neon-purple text-gray-400 hover:text-neon-purple transition-all flex items-center justify-center cursor-pointer"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Youtube Channel Link"
                className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neon-pink text-gray-400 hover:text-neon-pink transition-all flex items-center justify-center cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Tech Directory links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className={`font-orbitron font-bold text-xs uppercase tracking-widest mb-4 ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                {t.footer.directory}
              </h4>
              <ul className={`space-y-2 text-xs font-sans ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                <li><a href="#hero" className="hover:text-neon-cyan transition-colors">{t.navbar.home}</a></li>
                <li><a href="#catalog" className="hover:text-neon-cyan transition-colors">{t.navbar.products}</a></li>
                <li><a href="#usp" className="hover:text-neon-cyan transition-colors">{t.navbar.ecosystem}</a></li>
                <li><a href="#reviews" className="hover:text-neon-cyan transition-colors">{t.navbar.reviews}</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-orbitron font-bold text-xs uppercase tracking-widest mb-4 ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                {t.footer.protocol}
              </h4>
              <ul className={`space-y-2 text-xs font-sans ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                <li><a href="#cookies" className="hover:text-neon-cyan transition-colors">{t.footer.cookieCrypts}</a></li>
                <li><a href="#security" className="hover:text-neon-cyan transition-colors">{t.footer.securityNodes}</a></li>
                <li><a href="#terms" className="hover:text-neon-cyan transition-colors">{t.footer.handshakeSpec}</a></li>
                <li><a href="#privacy" className="hover:text-neon-cyan transition-colors">{t.footer.privacyShield}</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: Newsletter Broadcast Station */}
          <div className="md:col-span-4 space-y-4">
            <h4 className={`font-orbitron font-extrabold text-xs uppercase tracking-widest flex items-center gap-x-2 ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
              <span>{t.footer.newsletterTitle}</span>
            </h4>
            <p className={`font-sans text-xs font-light leading-relaxed ${
              isDarkMode ? 'text-neutral-450' : 'text-neutral-600'
            }`}>
              {t.footer.newsletterDesc}
            </p>

            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div className="flex items-center relative">
                <input
                  id="newsletter-email"
                  type="text"
                  placeholder={t.footer.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 sm:p-3.5 rounded-xl border border-neutral-800 bg-neutral-900/60 focus:border-neon-cyan hover:border-neutral-700 transition-all font-mono text-xs text-white placeholder-neutral-500 focus:outline-none pr-12 rtl:pl-12 rtl:pr-3 shadow-inner"
                  title="Subscribe stream email"
                />
                <button
                  id="newsletter-submit-btn"
                  type="submit"
                  aria-label="Subscribe Newsletter Broadcast"
                  className="absolute right-1.5 rtl:left-1.5 rtl:right-auto top-1/2 -translate-y-1/2 p-2 rounded-lg bg-neon-cyan hover:opacity-90 active:scale-95 transition-all text-black flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                </button>
              </div>

              {/* Glowing feedback messages */}
              <AnimatePresence>
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 right-0 mt-2 p-3 rounded-lg border border-neon-cyan/20 bg-neutral-900/90 text-left rtl:text-right flex items-center gap-x-2 z-20 font-mono text-[10px] text-green-400"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-400 animate-bounce" />
                    <span>{t.footer.successMsg}</span>
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 right-0 mt-2 p-3 rounded-lg border border-red-500/20 bg-neutral-900/90 text-left rtl:text-right flex items-center gap-x-2 z-20 font-mono text-[10px] text-red-400"
                  >
                    <Shield className="w-4 h-4 text-red-500" />
                    <span>{errorMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

        </div>

        {/* Corporate copyright signature details bar */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-neutral-500 ${
          isDarkMode ? 'border-neutral-900' : 'border-neutral-200'
        }`}>
          <div>
            © 2026 4U PRO CORPS. {t.footer.secured}
          </div>
          <div className="flex items-center gap-x-2 text-neutral-450 dark:text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            <span>{t.footer.networkStatus}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

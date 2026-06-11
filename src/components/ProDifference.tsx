import { ShieldCheck, Cpu, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { translations, Language } from '../translations';

interface ProDifferenceProps {
  isDarkMode: boolean;
  lang: Language;
}

export default function ProDifference({ isDarkMode, lang }: ProDifferenceProps) {
  const t = translations[lang];

  const points = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-neon-cyan" />,
      title: t.usp.points[0].title,
      desc: t.usp.points[0].desc,
      highlight: t.usp.points[0].highlight,
      glowColor: 'rgba(0, 240, 255, 0.4)'
    },
    {
      icon: <Cpu className="w-8 h-8 text-neon-purple" />,
      title: t.usp.points[1].title,
      desc: t.usp.points[1].desc,
      highlight: t.usp.points[1].highlight,
      glowColor: 'rgba(189, 0, 255, 0.4)'
    },
    {
      icon: <Layers className="w-8 h-8 text-neon-pink" />,
      title: t.usp.points[2].title,
      desc: t.usp.points[2].desc,
      highlight: t.usp.points[2].highlight,
      glowColor: 'rgba(255, 0, 127, 0.4)'
    }
  ];

  return (
    <section id="usp" className={`py-24 relative overflow-hidden border-y ${
      isDarkMode ? 'border-neutral-900 bg-neutral-950/20' : 'border-neutral-200 bg-neutral-50/50'
    }`}>
      {/* Absolute design accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-tech-grid opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-x-2 text-neon-cyan text-xs font-mono uppercase tracking-widest bg-neon-cyan/5 px-3 py-1 rounded-md border border-neon-cyan/15 animate-fade-in">
            <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
            <span>{t.usp.integrityBadge}</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight select-none">
            {t.usp.mainTitleFirst} <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple/80">{t.usp.mainTitleGlow}</span> {t.usp.mainTitleLast}
          </h2>
          <p className={`font-sans text-sm font-light leading-relaxed max-w-xl mx-auto ${
            isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
          }`}>
            {t.usp.subDesc}
          </p>
        </motion.div>

        {/* USP Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left rtl:text-right">
          {points.map((pt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              className={`p-8 rounded-2xl border transition-all duration-500 group relative overflow-hidden flex flex-col justify-between ${
                isDarkMode
                  ? 'bg-obsidian-card border-neutral-800 hover:border-transparent hover:shadow-[0_0_30px_rgba(0,240,255,0.06)]'
                  : 'bg-white border-neutral-200 hover:border-transparent hover:shadow-lg'
              }`}
            >
              {/* Pulse boundary overlay */}
              <div
                className="absolute inset-[0.5px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 p-[1px]"
                style={{
                  background: `linear-gradient(135deg, ${idx === 0 ? '#00F0FF' : idx === 1 ? '#BD00FF' : '#FF007F'}, transparent)`
                }}
              >
                <div className={`w-full h-full rounded-2xl ${isDarkMode ? 'bg-[#0E1015]' : 'bg-white'}`} />
              </div>

              <div className="space-y-6 relative z-10">
                {/* Glowing Icon Stage */}
                <div className="relative w-14 h-14 rounded-xl flex items-center justify-center bg-neutral-900 border border-neutral-800 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <div
                    className="absolute inset-0 rounded-xl filter blur-md opacity-20 group-hover:opacity-60 transition-opacity"
                    style={{ backgroundColor: pt.glowColor }}
                  />
                  {pt.icon}
                </div>

                <div className="space-y-2">
                  <h3 className={`font-orbitron font-extrabold text-lg group-hover:text-neon-cyan transition-colors ${
                    isDarkMode ? 'text-white' : 'text-neutral-900'
                  }`}>
                    {pt.title}
                  </h3>
                  <p className={`font-sans text-xs leading-relaxed font-light ${
                    isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
                  }`}>
                    {pt.desc}
                  </p>
                </div>
              </div>

              {/* Tag Highlight block */}
              <div className="mt-8 pt-4 border-t border-neutral-850 dark:border-neutral-800 relative z-10 flex items-center justify-between">
                <span className="font-mono text-[9px] text-neutral-500">{t.usp.tagAtomicProtocol}</span>
                <span className={`font-mono text-[9px] font-bold ${
                  idx === 0 ? 'text-neon-cyan' : idx === 1 ? 'text-neon-purple' : 'text-neon-pink'
                }`}>
                  {pt.highlight}
                </span>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

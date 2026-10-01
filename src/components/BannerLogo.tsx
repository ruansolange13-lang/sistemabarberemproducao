import { motion } from 'motion/react';
import logoImg from '../assets/images/lupumba_logo_1790704735654.jpg';
import { useSaaS } from '../context/SaaSContext';

export default function BannerLogo() {
  const { currentTenant } = useSaaS();

  return (
    <header className="relative w-full p-0 flex flex-col items-center overflow-hidden border-b border-zinc-900/60 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full overflow-hidden select-none"
      >
        {/* Banner Canvas */}
        <div className="relative w-full aspect-[530/230] min-h-[210px] sm:min-h-[235px] bg-[#09090b] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(248,193,5,0.18),transparent_65%)] pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#f8c105]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#f8c105]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Geometric Barber Carbon Lines */}
          <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(45deg,#f8c105_1px,transparent_1px),linear-gradient(-45deg,#f8c105_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Brand Emblem */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* Real Logo Emblem */}
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#f8c105]/90 uppercase mb-1.5 font-bold flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#f8c105]" />
              SNAKE BARBER
            </span>

            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 flex items-center justify-center">
              {/* Golden Outer Shield Halo */}
              <div className="absolute -inset-1 rounded-full border border-[#f8c105]/40 bg-gradient-to-b from-[#f8c105]/20 via-black/80 to-black shadow-[0_0_28px_rgba(248,193,5,0.35)] pointer-events-none" />
              
              <img
                src={currentTenant.logoUrl || logoImg}
                alt={`${currentTenant.name} Logo`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full relative z-10 border border-[#f8c105]/50 shadow-inner"
              />
            </div>

            {/* Typography */}
            <div className="flex flex-col items-center">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-[0.22em] uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {currentTenant.name.replace(' BARBEARIA', '')}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="h-[1px] w-5 sm:w-8 bg-gradient-to-r from-transparent to-zinc-400/50" />
                <span className="font-display font-extrabold text-[10.5px] sm:text-[12px] tracking-[0.35em] uppercase text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                  BARBEARIA
                </span>
                <span className="h-[1px] w-5 sm:w-8 bg-gradient-to-l from-transparent to-zinc-400/50" />
              </div>
            </div>
          </motion.div>

          {/* Bottom subtle edge stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f8c105]/40 to-transparent" />
        </div>
      </motion.div>
    </header>
  );
}

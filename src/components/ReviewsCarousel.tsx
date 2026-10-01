import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, Star, ZoomIn } from 'lucide-react';
import { reviewsList } from '../data/barbeariaData';

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const totalReviews = reviewsList.length;
  const currentReview = reviewsList[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === totalReviews - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [totalReviews]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === totalReviews - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? totalReviews - 1 : prev - 1));
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      filter: 'blur(3px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 220, damping: 25 },
        opacity: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0,
      filter: 'blur(3px)',
      transition: {
        x: { type: 'spring' as const, stiffness: 220, damping: 25 },
        opacity: { duration: 0.25 },
      },
    }),
  };

  return (
    <div id="avaliacoes" className="w-full select-none">
      {/* Top Banner Box */}
      <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-3 sm:p-3.5 mb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          {/* Google G Logo */}
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-inner">
            <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66.86-1.18 1.83-1.18 2.86z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-black text-xs tracking-wide text-zinc-100 uppercase">
                Avaliações do Google
              </h3>
              <div className="flex items-center gap-0.5 bg-[#f8c105]/10 text-[#f8c105] text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded border border-[#f8c105]/20">
                <CheckCircle2 size={9} className="stroke-[3]" />
                <span>100% REAIS</span>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-zinc-100 text-[11px] font-black">5.0</span>
              <div className="flex text-amber-400 items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} className="fill-current text-amber-400" />
                ))}
              </div>
              <span className="text-[9px] text-zinc-400 font-medium">Lupumba Barbearia</span>
            </div>
          </div>
        </div>

        {/* Counter and Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 border-t sm:border-t-0 border-zinc-800/60 pt-2 sm:pt-0">
          <span className="text-[9px] text-zinc-500 font-mono sm:mr-1">
            {currentIndex + 1} de {totalReviews} clientes
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Avaliação anterior"
              className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-[#f8c105] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Próxima avaliação"
              className="w-7 h-7 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-[#f8c105] flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Review Card */}
      <div className="relative w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 overflow-hidden shadow-xl min-h-[175px] sm:min-h-[150px] flex flex-col justify-between text-left">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#f8c105]/5 rounded-full blur-2xl pointer-events-none" />

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex-1 flex flex-col justify-between gap-3.5"
          >
            {/* Review Header: User + Rating + Verified */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-display font-extrabold text-xs shadow-md overflow-hidden ${
                    currentReview.avatarBg || 'bg-[#f8c105]/20 text-[#f8c105]'
                  }`}
                >
                  {getInitials(currentReview.name)}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-extrabold text-xs sm:text-sm text-zinc-100 hover:text-[#f8c105] transition-colors">
                      {currentReview.name}
                    </span>
                    <span className="text-[8px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 inline-flex items-center gap-0.5">
                      ✓ Cliente
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex text-amber-400">
                      {[...Array(currentReview.rating)].map((_, i) => (
                        <Star key={i} size={9} className="fill-current text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">{currentReview.date}</span>
                    <span className="text-[9px] text-[#f8c105]/70 font-semibold">• {currentReview.serviceUsed}</span>
                  </div>
                </div>
              </div>

              {/* Verified on Google pill */}
              <div className="flex items-center gap-1 text-zinc-400 text-[9px] font-medium bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-800">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#4285F4]" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="hidden xs:inline">Verificada</span>
              </div>
            </div>

            {/* Comment + Photo Preview */}
            <div className="flex items-start justify-between gap-3.5">
              <div className="flex-1">
                <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed italic font-medium">
                  "{currentReview.comment}"
                </p>
              </div>

              {currentReview.studentPhotoUrl && (
                <div
                  onClick={() => {
                    setSelectedPhoto(currentReview.studentPhotoUrl || null);
                    setIsPhotoModalOpen(true);
                  }}
                  className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0 shadow-md cursor-zoom-in transition-all duration-300 hover:border-[#f8c105]/60 hover:scale-105 active:scale-95"
                  title="Clique para ampliar foto do corte"
                >
                  <img
                    src={currentReview.studentPhotoUrl}
                    alt={`${currentReview.name} - Resultado do corte`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ZoomIn size={12} className="text-[#f8c105] animate-pulse" />
                  </div>
                </div>
              )}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1 mt-1 border-t border-zinc-800/40 pt-2.5">
              {reviewsList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Ir para avaliação ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-4 bg-[#f8c105]' : 'w-1.5 bg-zinc-800 hover:bg-zinc-700'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Photo Modal Zoom */}
      <AnimatePresence>
        {isPhotoModalOpen && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsPhotoModalOpen(false)}
          >
            <div className="w-full max-w-lg mb-3 flex items-center justify-between text-zinc-400 text-xs">
              <div>
                <p className="font-display font-extrabold text-sm text-[#f8c105] uppercase">
                  {currentReview.name}
                </p>
                <p>Foto compartilhada na avaliação do Google</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold hover:bg-zinc-800 active:scale-95 transition-all"
              >
                Fechar
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-full max-h-[80vh] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto}
                alt="Foto do Corte Ampliada"
                className="max-w-full max-h-[75vh] object-contain block mx-auto rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <p className="text-zinc-500 text-[10px] mt-3 uppercase tracking-widest font-mono">
              Clique em qualquer lugar para voltar
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

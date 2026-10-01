import { useState, useEffect } from 'react';
import BannerLogo from '../BannerLogo';
import QuickLinkButton from '../QuickLinkButton';
import LocationCard from '../LocationCard';
import CutsVideoGallery from '../CutsVideoGallery';
import ReviewsCarousel from '../ReviewsCarousel';
import FaqSection from '../FaqSection';
import Footer from '../Footer';
import BookingModal from '../BookingModal';
import { useSaaS } from '../../context/SaaSContext';
import { AlertTriangle, Send, Sparkles } from 'lucide-react';

export default function MiniCentralView() {
  const { currentTenant, notification } = useSaaS();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Sync document title to reflect platform + tenant
  useEffect(() => {
    if (currentTenant?.name) {
      document.title = `Snake Barber — ${currentTenant.name}`;
    }
  }, [currentTenant]);

  const scrollToReviews = () => {
    const el = document.getElementById('avaliacoes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-start font-sans relative overflow-x-hidden selection:bg-[#f8c105] selection:text-black">
      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-[300] max-w-sm p-3.5 rounded-xl shadow-2xl backdrop-blur-md border text-xs font-bold transition-all animate-bounce bg-zinc-900 border-zinc-700 text-white">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                notification.type === 'success'
                  ? 'bg-emerald-400'
                  : notification.type === 'error'
                  ? 'bg-red-400'
                  : 'bg-[#f8c105]'
              }`}
            />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Subtle Platform Indicator Bar at top */}
      <header className="w-full bg-zinc-950/80 border-b border-zinc-900/60 backdrop-blur-md py-1.5 px-4 text-center z-20">
        <div className="max-w-[530px] mx-auto flex items-center justify-between text-[10px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 font-bold tracking-widest text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f8c105]" />
            SNAKE BARBER
          </span>
          <span className="text-zinc-500 uppercase tracking-wider truncate max-w-[200px]">
            {currentTenant.name}
          </span>
        </div>
      </header>

      {/* Background Radial Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-[#0a0a0d] to-[#040405] pointer-events-none" />

      {/* Decorative vertical border lines on large screens */}
      <div className="hidden lg:block absolute left-1/2 -ml-[320px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#f8c105]/20 to-transparent pointer-events-none" />
      <div className="hidden lg:block absolute left-1/2 ml-[320px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#f8c105]/20 to-transparent pointer-events-none" />

      {/* Central Card Shell (matches original structure max-w-[530px]) */}
      <div className="relative z-10 w-full max-w-[530px] flex flex-col min-h-screen bg-zinc-950/85 shadow-[0_0_50px_rgba(0,0,0,0.85)] border-x border-zinc-900/40 backdrop-blur-3xl pb-6">
        {/* RULE BANNER: If miniCentralAtiva is FALSE, notify visitor that online booking is paused */}
        {!currentTenant.miniCentralAtiva && (
          <div className="bg-amber-500/15 border-b border-amber-500/40 px-4 py-2.5 flex items-center justify-between gap-2.5 text-left">
            <div className="flex items-center gap-2 text-amber-300 text-xs">
              <AlertTriangle size={16} className="text-amber-400 shrink-0" />
              <span>
                <strong>Modo Pausa:</strong> Agendamentos online temporariamente desativados por manutenção.
              </span>
            </div>
            <a
              href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(
                `Olá! Vi que o agendamento online da ${currentTenant.name} está pausado. Gostaria de verificar horários disponíveis diretamente.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-[#25D366] text-black text-[10px] font-bold font-mono uppercase tracking-wider shrink-0 flex items-center gap-1 hover:brightness-110 transition-all"
            >
              <Send size={10} /> WhatsApp
            </a>
          </div>
        )}

        {/* 1. BANNER / LOGO */}
        <BannerLogo />

        {/* MAIN BODY SECTIONS */}
        <main className="flex-1 px-4 sm:px-6 py-4 space-y-6">
          {/* 2. LINKS RÁPIDOS */}
          <section className="space-y-3.5" aria-label="Links rápidos">
            {/* WHATSAPP */}
            <QuickLinkButton
              title="WhatsApp"
              subtitle={`Converse com a ${currentTenant.name}`}
              iconType="whatsapp"
              href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(
                `Olá! Gostaria de agendar ou tirar dúvidas com a ${currentTenant.name}.`
              )}`}
            />

            {/* INSTAGRAM */}
            <QuickLinkButton
              title="Instagram"
              subtitle="Veja nossos cortes e novidades"
              iconType="instagram"
              href={currentTenant.instagramUrl}
            />

            {/* AGENDAR HORÁRIO (Most prominent button) */}
            <QuickLinkButton
              title="Agendar Horário"
              subtitle={
                currentTenant.miniCentralAtiva
                  ? 'Escolha seu serviço e reserve seu horário'
                  : 'Agendamentos online pausados no momento'
              }
              iconType="booking"
              onClick={() => setIsBookingOpen(true)}
            />

            {/* AVALIAÇÕES / LOCALIZAÇÃO */}
            <QuickLinkButton
              title="Avaliações do Google"
              subtitle={`A experiência de quem já passou pela ${currentTenant.name.replace(' BARBEARIA', '')}`}
              iconType="google"
              onClick={scrollToReviews}
            />
          </section>

          {/* 3. LOCALIZAÇÃO */}
          <section className="pt-1">
            <LocationCard />
          </section>

          {/* 4. VITRINE DE FOTOS DOS CORTES */}
          <section className="pt-1">
            <CutsVideoGallery onOpenBooking={() => setIsBookingOpen(true)} />
          </section>

          {/* 5. AVALIAÇÕES */}
          <section className="pt-1">
            <ReviewsCarousel />
          </section>

          {/* 6. FAQ */}
          <section className="pt-1">
            <FaqSection />
          </section>
        </main>

        {/* 7. RODAPÉ (com Área do Barbeiro e Super Admin discretos) */}
        <Footer />
      </div>

      {/* MODAL DE AGENDAMENTO */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}

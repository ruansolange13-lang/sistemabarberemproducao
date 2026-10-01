import { Clock, Instagram, Lock, Phone, Scissors, Shield, Sparkles } from 'lucide-react';
import { useSaaS } from '../context/SaaSContext';

export default function Footer() {
  const { currentTenant, setCurrentView } = useSaaS();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-8 bg-zinc-950 border-t border-zinc-900 py-6 px-4 space-y-6">
      {/* 2-column contact info grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-left pl-1 select-none">
        {/* Atendimento */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#f8c105] text-[10px] font-black uppercase tracking-wider">
            <Clock size={11} className="stroke-[2.5]" />
            <span>Atendimento</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium leading-relaxed">
            {currentTenant.hours}
          </p>
        </div>

        {/* Telefone / WhatsApp */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#f8c105] text-[10px] font-black uppercase tracking-wider">
            <Phone size={11} className="stroke-[2.5]" />
            <span>Telefone</span>
          </div>
          <a
            href={`tel:${currentTenant.phoneRaw}`}
            className="text-[10px] sm:text-xs text-gray-400 font-bold hover:text-[#f8c105] transition-colors inline-block"
          >
            {currentTenant.phone}
          </a>
        </div>

        {/* WhatsApp Direct */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#f8c105] text-[10px] font-black uppercase tracking-wider">
            <svg viewBox="0 0 32 32" className="w-3 h-3 fill-[#f8c105]" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.12 7.42L2 30l6.76-2.06C10.84 29.18 13.34 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.56c-2.38 0-4.62-.68-6.52-1.86l-.46-.28-4.32 1.32 1.34-4.22-.3-.48C4.46 19.98 3.8 18.04 3.8 16 3.8 9.28 9.28 3.8 16 3.8S28.2 9.28 28.2 16 22.72 27.56 16 27.56zm7.26-8.5c-.4-.2-2.36-1.16-2.72-1.3-.36-.14-.62-.2-.88.2s-1.02 1.3-1.26 1.56-.46.3-.86.1a10.86 10.86 0 01-3.2-1.98 12.02 12.02 0 01-2.22-2.76c-.24-.4 0-.62.2-.82.18-.18.4-.46.6-.7.2-.24.26-.4.4-.66.14-.26.06-.5-.04-.7s-.88-2.12-1.2-2.9c-.32-.78-.64-.66-.88-.68h-.76c-.26 0-.68.1-1.04.5s-1.36 1.32-1.36 3.22 1.4 3.74 1.6 4c.2.26 2.76 4.22 6.68 5.92.94.4 1.66.64 2.24.82.94.3 1.8.26 2.48.16.76-.12 2.36-.96 2.7-1.9.34-.92.34-1.72.24-1.9-.1-.18-.36-.28-.76-.48z" />
            </svg>
            <span>WhatsApp</span>
          </div>
          <a
            href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(
              `Olá! Gostaria de falar com a ${currentTenant.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-xs text-gray-400 font-bold hover:text-[#f8c105] text-left transition-colors block"
          >
            {currentTenant.whatsappFormatted}
          </a>
        </div>

        {/* Instagram */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[#f8c105] text-[10px] font-black uppercase tracking-wider">
            <Instagram size={11} className="stroke-[2.5]" />
            <span>Instagram</span>
          </div>
          <a
            href={currentTenant.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] sm:text-xs text-gray-400 font-bold hover:text-[#f8c105] block truncate"
          >
            @{currentTenant.instagram}
          </a>
        </div>
      </div>

      {/* Slogan Ribbon */}
      <div className="relative w-full overflow-hidden bg-[#f8c105] text-black uppercase font-display font-black text-xs py-3 px-4 rounded-xl flex items-center justify-between select-none shadow-md">
        <div className="absolute right-0 top-0 bottom-0 w-24 opacity-25 flex pointer-events-none">
          <div className="w-4 h-full bg-black skew-x-[-25deg] translate-x-2" />
          <div className="w-4 h-full bg-black skew-x-[-25deg] translate-x-4" />
          <div className="w-4 h-full bg-black skew-x-[-25deg] translate-x-6" />
          <div className="w-4 h-full bg-black skew-x-[-25deg] translate-x-8" />
          <div className="w-4 h-full bg-black skew-x-[-25deg] translate-x-10" />
        </div>

        <div className="flex items-center gap-1.5 z-10 shrink-0">
          <Scissors size={14} className="stroke-[2.8]" />
          <span className="tracking-wide">ESTILO, PRESENÇA E PRECISÃO.</span>
        </div>
      </div>

      {/* Address */}
      <div className="text-center text-[10px] text-zinc-500 font-sans tracking-wide leading-relaxed px-4 pt-1 select-none">
        {currentTenant.address} — {currentTenant.neighborhood}, {currentTenant.city}
      </div>

      {/* Acessos discretos: Área do Barbeiro e Super Administrador */}
      <div className="pt-3 border-t border-zinc-900/90 flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* ÁREA DO BARBEIRO */}
        <button
          type="button"
          onClick={() => {
            setCurrentView('barber-login');
            if (typeof window !== 'undefined' && window.location.pathname !== '/') {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800/60 transition-colors text-[11px] font-mono font-medium cursor-pointer"
        >
          <Lock size={11} className="text-[#f8c105]" />
          <span>Área do Barbeiro</span>
        </button>

        {/* SUPER ADMINISTRADOR */}
        <button
          type="button"
          onClick={() => {
            setCurrentView('super-admin-login');
            if (typeof window !== 'undefined' && window.location.pathname !== '/super-admin') {
              window.history.pushState({}, '', '/super-admin');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-transparent hover:bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 border border-zinc-900 transition-colors text-[10px] font-mono cursor-pointer"
        >
          <Shield size={11} className="text-purple-400" />
          <span>Super Administrador</span>
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center text-[9px] text-zinc-600 font-mono select-none pt-1">
        <span>© {currentYear} {currentTenant.name}. Desenvolvido sobre a plataforma Snake Barber.</span>
      </div>
    </footer>
  );
}

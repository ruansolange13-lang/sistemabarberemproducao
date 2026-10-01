import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { useSaaS } from '../context/SaaSContext';

// Imagem de localização fornecida pelo usuário (https://imgur.com/Ng86RoO)
const LOCAL_MAP_URL = '/mapa-localizacao.jpg';
const LOCAL_MAP_PNG = '/mapa-localizacao.png';
const FALLBACK_MAP_URL = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.imgur.com%2FNg86RoO.png';

export default function LocationCard() {
  const { currentTenant } = useSaaS();
  const [imgSrc, setImgSrc] = useState(LOCAL_MAP_URL);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (imgSrc === LOCAL_MAP_URL) {
      setImgSrc(LOCAL_MAP_PNG);
    } else if (imgSrc === LOCAL_MAP_PNG) {
      setImgSrc(FALLBACK_MAP_URL);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-zinc-800/90 bg-zinc-950/85 shadow-xl backdrop-blur-md transition-all hover:border-zinc-700/80">
      {/* Refined Header Ribbon */}
      <div className="bg-zinc-900/95 px-4 py-3 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#f8c105]/10 border border-[#f8c105]/30 flex items-center justify-center shrink-0">
            <Navigation size={13} className="text-[#f8c105] fill-[#f8c105]/30 stroke-[2.2]" />
          </div>
          <h2 className="font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase text-zinc-100">
            VENHA PARA A {currentTenant.name.replace(' BARBEARIA', '')}
          </h2>
        </div>
        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest hidden sm:inline">
          Localização
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="space-y-3.5 pl-1 text-left select-none">
          {/* Address Item */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <MapPin size={17} className="text-[#f8c105] stroke-[2]" />
            </div>
            <div>
              <p className="text-zinc-100 font-sans font-bold text-sm sm:text-base tracking-wide leading-tight">
                {currentTenant.address}
              </p>
              <p className="text-zinc-400 font-sans font-medium text-xs mt-0.5">
                {currentTenant.neighborhood} — {currentTenant.city}
              </p>
            </div>
          </div>

          {/* Opening Hours Item */}
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
              <Clock size={17} className="text-[#f8c105] stroke-[2]" />
            </div>
            <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed">
              <span className="text-[#f8c105] font-bold mr-1.5">Atendimento:</span>
              <span className="font-medium text-zinc-200">{currentTenant.hours}</span>
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <motion.a
          href={currentTenant.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f8c105]/10 via-[#f8c105]/15 to-[#f8c105]/10 hover:from-[#f8c105]/20 hover:to-[#f8c105]/20 border border-[#f8c105]/40 font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase text-[#f8c105] hover:text-[#ffe27a] flex items-center justify-center gap-2 transition-all cursor-pointer group shadow-md"
        >
          <ExternalLink size={14} className="text-[#f8c105] group-hover:scale-110 transition-transform" />
          <span>ABRIR NO GOOGLE MAPS</span>
        </motion.a>

        {/* Visual Map Representation */}
        <motion.a
          href={currentTenant.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="relative block w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/90 group cursor-pointer shadow-md transition-all hover:border-[#f8c105]/50"
        >
          {!hasError ? (
            <img
              src={imgSrc}
              referrerPolicy="no-referrer"
              alt="Mapa de Localização - Lupumba Barbearia"
              className="w-full h-auto object-cover max-h-[340px] transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="relative w-full aspect-[16/8] bg-zinc-900 flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="w-10 h-10 rounded-full bg-[#f8c105] text-black flex items-center justify-center shadow-lg mb-2">
                <MapPin size={22} className="stroke-[2.5]" />
              </div>
              <p className="font-display font-black text-xs uppercase text-white tracking-wider">
                {currentTenant.name}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {currentTenant.address} — {currentTenant.neighborhood}, {currentTenant.city}
              </p>
            </div>
          )}

          {/* Gradient Overlay for legibility & subtle hover effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />

          {/* Map Overlay Prompt */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/90 backdrop-blur-sm text-[9.5px] sm:text-[10px] text-zinc-300 font-medium px-2.5 py-1 rounded-lg border border-zinc-700/80 group-hover:text-[#f8c105] group-hover:border-[#f8c105]/50 transition-colors flex items-center gap-1.5 shadow-xl">
            <span>Abrir no Google Maps</span>
            <ExternalLink size={11} className="text-[#f8c105]" />
          </div>
        </motion.a>
      </div>
    </div>
  );
}

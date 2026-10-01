import { motion } from 'motion/react';
import { Calendar, ChevronRight, MapPin, Scissors } from 'lucide-react';
import React from 'react';

interface QuickLinkButtonProps {
  title: string;
  subtitle: string;
  iconType: 'whatsapp' | 'instagram' | 'booking' | 'google' | 'location';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export default function QuickLinkButton({
  title,
  subtitle,
  iconType,
  onClick,
  href,
  disabled = false,
}: QuickLinkButtonProps) {
  const isBooking = iconType === 'booking' && !disabled;

  const renderIcon = () => {
    switch (iconType) {
      case 'whatsapp':
        return (
          <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0 shadow-md bg-zinc-900 border border-zinc-800">
            <svg viewBox="0 0 32 32" className="w-7 h-7 fill-[#25D366]" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.12 7.42L2 30l6.76-2.06C10.84 29.18 13.34 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.56c-2.38 0-4.62-.68-6.52-1.86l-.46-.28-4.32 1.32 1.34-4.22-.3-.48C4.46 19.98 3.8 18.04 3.8 16 3.8 9.28 9.28 3.8 16 3.8S28.2 9.28 28.2 16 22.72 27.56 16 27.56zm7.26-8.5c-.4-.2-2.36-1.16-2.72-1.3-.36-.14-.62-.2-.88.2s-1.02 1.3-1.26 1.56-.46.3-.86.1a10.86 10.86 0 01-3.2-1.98 12.02 12.02 0 01-2.22-2.76c-.24-.4 0-.62.2-.82.18-.18.4-.46.6-.7.2-.24.26-.4.4-.66.14-.26.06-.5-.04-.7s-.88-2.12-1.2-2.9c-.32-.78-.64-.66-.88-.68h-.76c-.26 0-.68.1-1.04.5s-1.36 1.32-1.36 3.22 1.4 3.74 1.6 4c.2.26 2.76 4.22 6.68 5.92.94.4 1.66.64 2.24.82.94.3 1.8.26 2.48.16.76-.12 2.36-.96 2.7-1.9.34-.92.34-1.72.24-1.9-.1-.18-.36-.28-.76-.48z" />
            </svg>
          </div>
        );
      case 'instagram':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shrink-0 shadow-md">
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </div>
        );
      case 'booking':
        return (
          <div className="w-12 h-12 rounded-xl bg-black border border-[#f8c105]/70 flex items-center justify-center shrink-0 shadow-md">
            <Scissors className="w-6 h-6 text-[#f8c105]" />
          </div>
        );
      case 'google':
        return (
          <div className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center shrink-0 shadow-md">
            <svg viewBox="0 0 24 24" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.66.86-1.18 1.83-1.18 2.86z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>
        );
      case 'location':
        return (
          <div className="w-12 h-12 rounded-xl bg-black border border-[#f8c105]/50 flex items-center justify-center shrink-0 shadow-md">
            <MapPin className="w-6 h-6 text-[#f8c105]" />
          </div>
        );
    }
  };

  const content = (
    <div className="flex items-center gap-4 w-full relative z-10">
      {renderIcon()}
      <div className="flex-1 min-w-0 text-left">
        <h3
          className={`font-display font-extrabold ${
            disabled
              ? 'text-zinc-500'
              : isBooking
              ? 'text-[#f8c105] group-hover:text-yellow-300'
              : 'text-[#f8c105] group-hover:text-[#ffd700]'
          } text-sm tracking-wide uppercase transition-colors`}
        >
          {title}
        </h3>
        <p className={`${disabled ? 'text-zinc-500' : 'text-gray-300'} text-xs mt-0.5 font-sans font-medium line-clamp-1`}>
          {subtitle}
        </p>
      </div>
      {!disabled && (
        <ChevronRight className="text-[#f8c105] w-5 h-5 shrink-0 transition-transform group-hover:translate-x-1" />
      )}
    </div>
  );

  const containerClasses = disabled
    ? 'w-full flex items-center bg-zinc-950/40 p-3 rounded-xl border border-zinc-900/60 opacity-60 backdrop-blur-md cursor-not-allowed select-none shadow-md'
    : isBooking
    ? 'w-full flex items-center bg-zinc-950 p-3 rounded-xl border border-transparent backdrop-blur-md transition-all duration-300 group shadow-[0_0_20px_rgba(248,193,5,0.2)] hover:shadow-[0_0_28px_rgba(248,193,5,0.35)] relative overflow-hidden cursor-pointer'
    : 'w-full flex items-center bg-zinc-950/70 p-3 rounded-xl border border-[#f8c105]/50 glow-card hover:border-[#f8c105] backdrop-blur-md transition-all duration-300 group shadow-lg cursor-pointer';

  if (disabled) {
    return <div className={containerClasses}>{content}</div>;
  }

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={containerClasses}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={containerClasses}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isBooking && (
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-[1.5px] rounded-[10.5px] bg-zinc-950/95 z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350%] h-[350%] z-0">
            <div
              className="w-full h-full bg-[conic-gradient(from_0deg,transparent_40%,#f8c105_70%,#ffe484_90%,transparent_100%)] rounded-full animate-spin"
              style={{ animationDuration: '3.5s' }}
            />
          </div>
        </div>
      )}
      {content}
    </motion.button>
  );
}

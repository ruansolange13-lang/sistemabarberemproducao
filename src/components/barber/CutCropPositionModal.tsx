import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, RotateCcw, Move, Sparkles, ZoomIn, Eye } from 'lucide-react';
import { CutImage } from '../../types';

interface CutCropPositionModalProps {
  cut: CutImage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cutId: string, objectPosition: string, scale?: number) => void;
}

export default function CutCropPositionModal({
  cut,
  isOpen,
  onClose,
  onSave,
}: CutCropPositionModalProps) {
  if (!isOpen || !cut) return null;

  // Parse existing objectPosition (e.g., "50% 30%") or default to "50% 50%"
  const initialPos = cut.objectPosition || '50% 50%';
  const [posX, setPosX] = useState<number>(() => {
    const parts = initialPos.split(' ');
    if (parts.length >= 1) {
      const val = parseFloat(parts[0]);
      return isNaN(val) ? 50 : val;
    }
    return 50;
  });

  const [posY, setPosY] = useState<number>(() => {
    const parts = initialPos.split(' ');
    if (parts.length >= 2) {
      const val = parseFloat(parts[1]);
      return isNaN(val) ? 50 : val;
    }
    return 50;
  });

  const [scale, setScale] = useState<number>(cut.scale || 1);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number }>({
    startX: 0,
    startY: 0,
    startPosX: 50,
    startPosY: 50,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset values when cut changes
  useEffect(() => {
    if (cut) {
      const parts = (cut.objectPosition || '50% 50%').split(' ');
      const x = parts.length >= 1 ? parseFloat(parts[0]) : 50;
      const y = parts.length >= 2 ? parseFloat(parts[1]) : 50;
      setPosX(isNaN(x) ? 50 : x);
      setPosY(isNaN(y) ? 50 : y);
      setScale(cut.scale || 1);
    }
  }, [cut]);

  // Pointer dragging handlers for intuitive direct manipulation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: posX,
      startPosY: posY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    // Moving mouse left increases objectPosition X (reveals right side of image)
    const factor = 100 / (rect.width || 300);
    const newX = Math.max(0, Math.min(100, Math.round(dragStartRef.current.startPosX - deltaX * factor * 0.8)));
    const newY = Math.max(0, Math.min(100, Math.round(dragStartRef.current.startPosY - deltaY * factor * 0.8)));

    setPosX(newX);
    setPosY(newY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handleSave = () => {
    const objectPosition = `${posX}% ${posY}%`;
    onSave(cut.id, objectPosition, scale);
    onClose();
  };

  const applyPreset = (presetX: number, presetY: number, presetScale: number = 1) => {
    setPosX(presetX);
    setPosY(presetY);
    setScale(presetScale);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/90 bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#f8c105]/15 border border-[#f8c105]/40 flex items-center justify-center text-[#f8c105]">
                <Move size={16} />
              </div>
              <div>
                <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                  Ajustar Posição & Enquadramento
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Arraste na foto para posicionar o foco do corte perfeitamente
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-5 overflow-y-auto">
            {/* Interactive Viewport / Canvas */}
            <div className="flex flex-col items-center">
              <div className="text-[11px] font-mono text-[#f8c105] mb-2 flex items-center gap-1.5 font-bold">
                <Sparkles size={12} />
                <span>Clique e arraste diretamente sobre a foto abaixo:</span>
              </div>

              {/* Square viewport matching Mini Central card */}
              <div
                ref={containerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border-2 shadow-2xl bg-zinc-900 select-none ${
                  isDragging
                    ? 'border-[#f8c105] cursor-grabbing shadow-[0_0_25px_rgba(248,193,5,0.35)]'
                    : 'border-zinc-700 hover:border-[#f8c105]/70 cursor-grab'
                }`}
              >
                <img
                  src={cut.imageUrl}
                  alt={cut.alt || cut.title}
                  draggable={false}
                  style={{
                    objectPosition: `${posX}% ${posY}%`,
                    transform: `scale(${scale})`,
                    transformOrigin: `${posX}% ${posY}%`,
                  }}
                  className="w-full h-full object-cover transition-transform duration-75 pointer-events-none"
                />

                {/* Subtle alignment grid & crosshair */}
                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl grid grid-cols-3 grid-rows-3 opacity-25">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#f8c105]/80 animate-ping" />
                  </div>
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>

                {/* Drag status indicator overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-[10px] text-zinc-300 flex items-center justify-between pointer-events-none">
                  <span className="font-mono">
                    Posição: <strong>X: {posX}% | Y: {posY}%</strong>
                  </span>
                  <span className="text-[#f8c105] font-bold">
                    {scale > 1 ? `Zoom: ${scale.toFixed(1)}x` : '1.0x'}
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-zinc-500 mt-2 font-mono">
                Dica: Arraste para cima/baixo para focar no topo do cabelo ou na barba.
              </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-300 block">Atalhos de Enquadramento:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset(50, 15, scale)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex flex-col items-center gap-0.5 ${
                    posY <= 25
                      ? 'bg-[#f8c105]/15 text-[#f8c105] border-[#f8c105]/50'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>💈 Topo / Cabelo</span>
                  <span className="text-[9px] font-mono text-zinc-500">Y: 15%</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset(50, 50, scale)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex flex-col items-center gap-0.5 ${
                    posY > 25 && posY < 75
                      ? 'bg-[#f8c105]/15 text-[#f8c105] border-[#f8c105]/50'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>✂️ Centro (Padrão)</span>
                  <span className="text-[9px] font-mono text-zinc-500">Y: 50%</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset(50, 85, scale)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex flex-col items-center gap-0.5 ${
                    posY >= 75
                      ? 'bg-[#f8c105]/15 text-[#f8c105] border-[#f8c105]/50'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>🧔 Base / Barba</span>
                  <span className="text-[9px] font-mono text-zinc-500">Y: 85%</span>
                </button>
              </div>
            </div>

            {/* Sliders for precise tuning */}
            <div className="space-y-3 bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="font-bold">Posição Vertical (Y):</span>
                  <span className="font-mono text-[#f8c105]">{posY}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={posY}
                  onChange={(e) => setPosY(parseInt(e.target.value))}
                  className="w-full accent-[#f8c105] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>0% (Topo do cabelo)</span>
                  <span>50% (Centro)</span>
                  <span>100% (Base/Pescoço)</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="font-bold">Posição Horizontal (X):</span>
                  <span className="font-mono text-[#f8c105]">{posX}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={posX}
                  onChange={(e) => setPosX(parseInt(e.target.value))}
                  className="w-full accent-[#f8c105] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="font-bold">Zoom / Escala da Foto:</span>
                  <span className="font-mono text-[#f8c105]">{scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1.8"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-[#f8c105] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-zinc-800 bg-zinc-900/90">
            <button
              type="button"
              onClick={() => {
                setPosX(50);
                setPosY(50);
                setScale(1);
              }}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Redefinir</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black font-display font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Check size={14} className="stroke-[3]" />
                <span>Salvar Posição</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

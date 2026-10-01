import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  X,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Move,
  GripVertical,
  Check,
  Save,
  Crop,
  Settings2,
} from 'lucide-react';
import { useSaaS } from '../context/SaaSContext';
import { CutImage } from '../types';
import CutCropPositionModal from './barber/CutCropPositionModal';

interface CutsVideoGalleryProps {
  onOpenBooking?: () => void;
}

export default function CutsVideoGallery({ onOpenBooking }: CutsVideoGalleryProps) {
  const { currentTenant, updateCurrentTenant, isBarberLoggedIn, showNotification } = useSaaS();
  const cutsList = currentTenant.cuts && currentTenant.cuts.length > 0 ? currentTenant.cuts : [];

  const [localCuts, setLocalCuts] = useState<CutImage[]>([...cutsList]);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const openTimestampRef = useRef<number>(0);

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Crop / focal adjustment
  const [cutToCrop, setCutToCrop] = useState<CutImage | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  // Sync localCuts when currentTenant changes
  useEffect(() => {
    setLocalCuts([...cutsList]);
  }, [currentTenant.cuts]);

  const selectedImage: CutImage | null =
    selectedImageIndex !== null ? localCuts[selectedImageIndex] : null;

  const openImageAtIndex = (index: number) => {
    if (isReorderMode) return;
    openTimestampRef.current = Date.now();
    setSelectedImageIndex(index);
  };

  // Close modal with ghost-click guard
  const handleCloseModal = () => {
    if (Date.now() - openTimestampRef.current < 250) {
      return;
    }
    setSelectedImageIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex === null) return;
    openTimestampRef.current = Date.now();
    setSelectedImageIndex((prev) => (prev! === localCuts.length - 1 ? 0 : prev! + 1));
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImageIndex === null) return;
    openTimestampRef.current = Date.now();
    setSelectedImageIndex((prev) => (prev! === 0 ? localCuts.length - 1 : prev! - 1));
  };

  // Drag handlers
  const handleDragStart = (index: number) => {
    if (!isReorderMode) return;
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (!isReorderMode) return;
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isReorderMode) return;
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (!isReorderMode || draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...localCuts];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, removed);
    setLocalCuts(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    showNotification(`Posição do corte alterada para #${targetIndex + 1}!`, 'info');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSavePositions = () => {
    updateCurrentTenant({ cuts: localCuts });
    setIsReorderMode(false);
    showNotification('Nova ordem e posições dos cortes salvas com sucesso!', 'success');
  };

  const handleOpenCrop = (e: React.MouseEvent, cut: CutImage) => {
    e.stopPropagation();
    setCutToCrop(cut);
    setIsCropModalOpen(true);
  };

  const handleSaveCrop = (cutId: string, objectPosition: string, scale?: number) => {
    const updated = localCuts.map((c) =>
      c.id === cutId ? { ...c, objectPosition, scale } : c
    );
    setLocalCuts(updated);
    updateCurrentTenant({ cuts: updated });
    showNotification('Enquadramento e posição da foto atualizados!', 'success');
  };

  // Keyboard navigation & Escape key to close
  useEffect(() => {
    if (selectedImageIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev! === localCuts.length - 1 ? 0 : prev! + 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev! === 0 ? localCuts.length - 1 : prev! - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, localCuts.length]);

  return (
    <div className="w-full select-none" id="nossos-cortes">
      {/* Section Header Ribbon */}
      <div className="w-full bg-zinc-900/95 px-4 py-3 rounded-t-2xl flex items-center justify-between border border-zinc-800 text-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#f8c105]/10 border border-[#f8c105]/30 flex items-center justify-center font-black text-xs shrink-0 text-[#f8c105]">
            <Scissors size={13} className="stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-zinc-100 text-xs sm:text-sm tracking-wider uppercase leading-tight">
              NOSSOS CORTES
            </h2>
          </div>
        </div>

        {/* Gallery Badge & Quick Drag Mode Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsReorderMode(!isReorderMode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-sans text-[11px] font-semibold tracking-wider transition-all cursor-pointer border ${
              isReorderMode
                ? 'bg-[#f8c105] text-black border-[#f8c105] shadow-[0_0_12px_rgba(248,193,5,0.4)]'
                : 'bg-zinc-800/80 hover:bg-zinc-700/80 border-zinc-700/60 text-zinc-300'
            }`}
            title="Arrastar e ajustar posições dos cortes na vitrine"
          >
            <Move size={12} className={isReorderMode ? 'text-black' : 'text-[#f8c105]'} />
            <span>{isReorderMode ? 'Ajustando Posições' : 'Ajustar Posições'}</span>
          </button>
        </div>
      </div>

      {/* Main Single Card Body */}
      <div className="border-x border-b border-zinc-800/90 rounded-b-2xl bg-zinc-950/85 p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Subtitle & Usage Prompt or Reorder Controls */}
        {isReorderMode ? (
          <div className="p-3 rounded-xl bg-zinc-900 border border-[#f8c105]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f8c105]">
                <Sparkles size={13} />
                <span>Modo de Ajuste Ativado: Arraste os cards para trocar de posição!</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Segure e arraste qualquer card para a posição desejada ou clique em "Enquadrar" para ajustar o foco da foto.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setLocalCuts([...cutsList]);
                  setIsReorderMode(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSavePositions}
                className="px-4 py-1.5 rounded-lg bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Save size={13} />
                <span>Salvar Posições</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-left">
            <p className="text-zinc-200 text-xs sm:text-sm font-sans font-semibold">
              Galeria de cortes com padrão de excelência.
            </p>
            <p className="text-[10px] sm:text-[11px] text-[#f8c105] font-sans font-medium flex items-center gap-1">
              <Sparkles size={11} className="shrink-0" />
              <span>Toque na foto para ampliar</span>
            </p>
          </div>
        )}

        {/* 3x3 Standard Image Grid - Supports Drag and Drop Positioning */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {localCuts.map((cut, index) => {
            const isBeingDragged = isReorderMode && draggedIndex === index;
            const isOver = isReorderMode && dragOverIndex === index && draggedIndex !== index;

            return (
              <div
                key={cut.id}
                role="button"
                tabIndex={0}
                draggable={isReorderMode}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                onDragEnd={handleDragEnd}
                aria-label={`Ver foto ampliada do corte`}
                onClick={() => openImageAtIndex(index)}
                onMouseEnter={() => setActiveHoverId(cut.id)}
                onMouseLeave={() => setActiveHoverId(null)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openImageAtIndex(index);
                  }
                }}
                className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border transition-all duration-300 group shadow-md ${
                  isBeingDragged
                    ? 'opacity-40 border-dashed border-[#f8c105] scale-95'
                    : isOver
                    ? 'border-2 border-[#f8c105] scale-102 shadow-[0_0_20px_rgba(248,193,5,0.4)]'
                    : isReorderMode
                    ? 'cursor-grab active:cursor-grabbing border-zinc-700 hover:border-[#f8c105]'
                    : 'cursor-pointer border-zinc-800/90 hover:border-[#f8c105]/80 hover:shadow-[0_0_18px_rgba(248,193,5,0.25)] active:scale-95'
                }`}
              >
                {/* Pure Cut Photo with applied objectPosition & scale */}
                <img
                  src={cut.imageUrl}
                  alt={cut.alt || 'Foto de corte de cabelo da Lupumba Barbearia'}
                  loading="lazy"
                  draggable={false}
                  style={{
                    objectPosition: cut.objectPosition || 'center center',
                    transform: cut.scale ? `scale(${cut.scale})` : undefined,
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 pointer-events-none"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('unsplash')) {
                      target.src = 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />

                {/* Subtle hover gradient and darken */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />

                {/* If in Reorder Mode: show position tag and framing tool */}
                {isReorderMode ? (
                  <>
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono text-[#f8c105] font-bold border border-zinc-800 shadow pointer-events-none">
                      <GripVertical size={10} />
                      <span>#{index + 1}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleOpenCrop(e, cut)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/85 hover:bg-[#f8c105] hover:text-black text-white flex items-center justify-center transition-all shadow border border-zinc-700/80 cursor-pointer"
                      title="Ajustar enquadramento da foto"
                    >
                      <Crop size={11} />
                    </button>

                    <div className="absolute bottom-1 inset-x-1 text-center pointer-events-none">
                      <span className="text-[9px] bg-black/80 text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                        Arraste para mover
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Minimal Zoom Indicator in Top-Right on Hover */}
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 backdrop-blur-sm border border-zinc-700/60 text-white flex items-center justify-center shadow pointer-events-none opacity-85 group-hover:opacity-100 group-hover:bg-[#f8c105] group-hover:text-black transition-all">
                      <ZoomIn size={11} className="stroke-[2.5]" />
                    </div>

                    {/* Active hover border glow */}
                    {activeHoverId === cut.id && (
                      <div className="absolute inset-0 border border-[#f8c105]/70 rounded-xl pointer-events-none" />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Disclaimer / Rodapé do Card */}
        <p className="text-[10px] text-zinc-500 font-mono tracking-wide text-center pt-2 border-t border-zinc-900">
          * Trabalhos e estilos realizados com padrão LUPUMBA. Toque em qualquer foto para ver em tela cheia.
        </p>
      </div>

      {/* Modal for adjusting cut framing/position when clicked in gallery */}
      <CutCropPositionModal
        cut={cutToCrop}
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        onSave={handleSaveCrop}
      />

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseModal}
            className="fixed inset-0 z-[250] bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-4 cursor-pointer select-none"
            aria-modal="true"
            role="dialog"
          >
            {/* Top Bar with Brand and Close button */}
            <div className="w-full max-w-sm sm:max-w-md flex items-center justify-between mb-2 text-zinc-300 pointer-events-none">
              <div className="text-left flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#f8c105]/15 border border-[#f8c105]/40 flex items-center justify-center text-[#f8c105]">
                  <Scissors size={12} className="stroke-[2.5]" />
                </div>
                <h3 className="font-display font-black text-xs sm:text-sm text-white uppercase tracking-wider">
                  {currentTenant.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex items-center gap-1.5 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-full shadow-lg transition-colors cursor-pointer"
                >
                  <X size={14} className="text-[#f8c105]" />
                  <span className="text-[11px] font-bold">Fechar</span>
                </button>
              </div>
            </div>

            {/* Standard Pure Image Frame */}
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm sm:max-w-[420px] aspect-square rounded-2xl overflow-hidden bg-zinc-950 border-2 border-[#f8c105]/70 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex items-center justify-center cursor-default"
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.alt || 'Foto de corte em alta resolução'}
                style={{
                  objectPosition: selectedImage.objectPosition || 'center center',
                }}
                className="w-full h-full object-cover block"
              />

              {/* Watermark / Brand Badge on Top */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 pointer-events-none">
                <Scissors size={12} className="text-[#f8c105]" />
                <span className="font-display font-black text-[10px] text-white tracking-widest uppercase">
                  {currentTenant.name}
                </span>
              </div>

              {/* Navigation Arrows inside Frame */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Foto anterior"
                className="pointer-events-auto absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 hover:bg-[#f8c105] hover:text-black border border-zinc-700 text-white flex items-center justify-center transition-all shadow-xl active:scale-90 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Próxima foto"
                className="pointer-events-auto absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 hover:bg-[#f8c105] hover:text-black border border-zinc-700 text-white flex items-center justify-center transition-all shadow-xl active:scale-90 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </motion.div>

            {/* Bottom Actions */}
            <div className="mt-3 flex flex-col items-center gap-2 text-center pointer-events-none">
              <div className="bg-black/85 border border-zinc-800 px-3.5 py-1 rounded-full text-zinc-300 text-[11px] font-sans flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f8c105] animate-pulse" />
                <span>Toque fora da foto para fechar</span>
              </div>

              {/* Agendar Horário Button */}
              <div className="flex items-center gap-2 mt-1 pointer-events-auto">
                {onOpenBooking ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(null);
                      onOpenBooking();
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#f8c105] to-[#e0ab00] hover:from-[#ffe27a] hover:to-[#f8c105] text-black font-display font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                  >
                    <Calendar size={15} />
                    <span>Agendar com Este Estilo</span>
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Scissors,
  Image as ImageIcon,
  Upload,
  Palette,
  Users,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
} from 'lucide-react';
import { ServiceItem, ProfessionalItem } from '../../types';

interface ServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit: ServiceItem | null;
  onSave: (service: ServiceItem) => void;
  allServices: ServiceItem[];
  professionals: ProfessionalItem[];
}

// Color palette options matching the design in the user's screenshot
const PALETTE_COLORS = [
  '#2563eb', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber / Yellow
  '#f97316', // Orange
  '#ef4444', // Red
  '#b91c1c', // Crimson
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#6366f1', // Indigo
];

const DURATION_PRESETS = [15, 30, 45, 60, 90];

export default function ServiceDrawer({
  isOpen,
  onClose,
  serviceToEdit,
  onSave,
  allServices,
  professionals,
}: ServiceDrawerProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('50');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);
  const [isPopular, setIsPopular] = useState(false);
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);
  const [isAddonsOpen, setIsAddonsOpen] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Populate form when editing or resetting for new
  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setPrice(serviceToEdit.price.toString());
      const numMatch = serviceToEdit.duration.match(/\d+/);
      setDurationMinutes(numMatch ? parseInt(numMatch[0], 10) : 30);
      setDescription(serviceToEdit.description || '');
      setColor(serviceToEdit.color || '#2563eb');
      setImageUrl(serviceToEdit.imageUrl);
      setIsActive(serviceToEdit.isActive !== false);
      setIsPopular(Boolean(serviceToEdit.isPopular));
      setSelectedProfessionals(
        serviceToEdit.allowedProfessionals || professionals.map((p) => p.name)
      );
      setSelectedAddons(serviceToEdit.suggestedAddons || []);
    } else {
      setName('');
      setPrice('50');
      setDurationMinutes(30);
      setDescription('');
      setColor('#2563eb');
      setImageUrl(undefined);
      setIsActive(true);
      setIsPopular(false);
      setSelectedProfessionals(professionals.map((p) => p.name));
      setSelectedAddons([]);
    }
  }, [serviceToEdit, professionals, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleProfessional = (profName: string) => {
    if (selectedProfessionals.includes(profName)) {
      if (selectedProfessionals.length > 1) {
        setSelectedProfessionals(selectedProfessionals.filter((p) => p !== profName));
      }
    } else {
      setSelectedProfessionals([...selectedProfessionals, profName]);
    }
  };

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.includes(addonId)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addonId));
    } else {
      setSelectedAddons([...selectedAddons, addonId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseFloat(price.replace(',', '.')) || 40;
    const finalService: ServiceItem = {
      id: serviceToEdit ? serviceToEdit.id : `srv-${Date.now()}`,
      name: name.trim(),
      price: parsedPrice,
      duration: `${durationMinutes} min`,
      description: description.trim() || `${name.trim()} com acabamento e padrão de excelência.`,
      color,
      imageUrl,
      isActive,
      isPopular,
      allowedProfessionals: selectedProfessionals,
      suggestedAddons: selectedAddons,
      order: serviceToEdit?.order,
    };

    onSave(finalService);
    onClose();
  };

  const initials = (profName: string) => {
    const parts = profName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return profName.slice(0, 2).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[260] overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        {/* Slide-over Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-md bg-white text-slate-900 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Top Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
              <h3 className="font-display font-black text-lg text-slate-900 tracking-tight">
                {serviceToEdit ? 'Editar serviço' : 'Novo serviço'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60 text-left">
              {/* 1. TOP LIVE PREVIEW CARD (Matching Screenshot) */}
              <div className="p-3.5 rounded-2xl bg-[#eef5ff] border border-[#d9e8ff] flex items-center gap-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-[#dbeafe] text-[#2563eb] flex items-center justify-center shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <Scissors size={20} className="stroke-[2.5]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 truncate">
                      {name.trim() || 'Nome do serviço'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {durationMinutes} min · R${' '}
                    {parseFloat(price.replace(',', '.') || '0')
                      .toFixed(2)
                      .replace('.', ',')}
                  </p>
                </div>
              </div>

              {/* 2. SECTION: BÁSICO */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Scissors size={16} className="text-[#2563eb]" />
                  <span>Básico</span>
                </div>

                {/* Image Uploader */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Prévia" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} />
                    )}
                  </div>

                  <div>
                    <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                      <Upload size={14} />
                      <span>Enviar imagem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl(undefined)}
                        className="block text-[11px] text-red-500 hover:underline mt-1 cursor-pointer"
                      >
                        Remover imagem
                      </button>
                    )}
                  </div>
                </div>

                {/* Input: Nome */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Nome:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Corte masculino"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563eb] text-slate-900 text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>

                {/* Row: Duração & Preço */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Duração:</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        max="240"
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 15)}
                        className="w-full pr-10 pl-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563eb] text-slate-900 text-xs sm:text-sm outline-none font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                        min
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">Preço:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                        R$
                      </span>
                      <input
                        type="text"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563eb] text-slate-900 text-xs sm:text-sm outline-none font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration Preset Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {DURATION_PRESETS.map((m) => {
                    const isSelected = durationMinutes === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setDurationMinutes(m)}
                        className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#eef5ff] text-[#2563eb] border-[#2563eb] font-bold shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {m} min
                      </button>
                    );
                  })}
                </div>

                {/* Optional Description */}
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-bold text-slate-700 block">Descrição adicional:</label>
                  <textarea
                    rows={2}
                    placeholder="Descrição opcional com os diferenciais deste serviço..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563eb] text-slate-900 text-xs outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 3. SECTION: APARÊNCIA */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Palette size={16} className="text-[#2563eb]" />
                  <span>Aparência</span>
                </div>
                <p className="text-[11px] text-slate-500">Cor exibida na agenda para este serviço.</p>

                {/* Palette color circles */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 select-none">
                  {PALETTE_COLORS.map((c) => {
                    const isSelected = color === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 transition-transform cursor-pointer flex items-center justify-center shadow-xs ${
                          isSelected ? 'scale-115 ring-3 ring-offset-2 ring-slate-400' : 'hover:scale-105'
                        }`}
                      >
                        {isSelected && <Check size={14} className="text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. SECTION: QUEM ATENDE */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Users size={16} className="text-[#2563eb]" />
                  <span>Quem atende</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Selecione os profissionais habilitados para executar este serviço.
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  {professionals.map((prof) => {
                    const isSelected = selectedProfessionals.includes(prof.name);
                    return (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => toggleProfessional(prof.name)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#eef5ff] text-[#2563eb] border-[#93c5fd] font-bold shadow-2xs'
                            : 'bg-slate-50 text-slate-500 border-slate-200 opacity-60'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-[#2563eb]/10 text-[#2563eb] text-[10px] font-black flex items-center justify-center font-mono">
                          {initials(prof.name)}
                        </span>
                        <span>{prof.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. SECTION: ADICIONAIS SUGERIDOS */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                <button
                  type="button"
                  onClick={() => setIsAddonsOpen(!isAddonsOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                    <Sparkles size={16} className="text-[#2563eb]" />
                    <span>Adicionais sugeridos</span>
                  </div>
                  {isAddonsOpen ? (
                    <ChevronUp size={16} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-400" />
                  )}
                </button>

                {isAddonsOpen && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <p className="text-[11px] text-slate-500">
                      Sugira serviços complementares para o cliente adicionar durante a reserva.
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {allServices
                        .filter((s) => s.id !== serviceToEdit?.id)
                        .map((addon) => {
                          const isChecked = selectedAddons.includes(addon.id);
                          return (
                            <div
                              key={addon.id}
                              onClick={() => toggleAddon(addon.id)}
                              className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-[#eef5ff] border-[#93c5fd] text-slate-900 font-medium'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                                    isChecked
                                      ? 'bg-[#2563eb] text-white border-[#2563eb]'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isChecked && <Check size={10} className="stroke-[3]" />}
                                </div>
                                <span>{addon.name}</span>
                              </div>
                              <span className="font-mono text-slate-500">
                                R$ {addon.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {/* 6. SECTION: ATIVO */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Ativo</h4>
                  <p className="text-xs text-slate-500">Visível para agendamento na Mini Central.</p>
                </div>

                {/* iOS Style Toggle Switch */}
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                    isActive ? 'bg-[#2563eb]' : 'bg-slate-300'
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: 'spring', damping: 22, stiffness: 400 }}
                    className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform ${
                      isActive ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Salvar
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

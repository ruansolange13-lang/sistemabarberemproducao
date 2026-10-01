import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Lock,
  Palette,
  Info,
  Camera,
  Trash2,
  Check,
  User,
  Sparkles,
} from 'lucide-react';
import { ProfessionalItem } from '../../types';

interface BarberStaffDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  professionalToEdit: ProfessionalItem | null;
  onSave: (prof: ProfessionalItem) => void;
  onDelete?: (id: string) => void;
}

const PRESET_COLORS = [
  '#e68a00', // Amber / Orange (from screenshot)
  '#f59e0b', // Golden Amber
  '#2563eb', // Royal Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#64748b', // Slate
];

export default function BarberStaffDrawer({
  isOpen,
  onClose,
  professionalToEdit,
  onSave,
  onDelete,
}: BarberStaffDrawerProps) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [email, setEmail] = useState('');
  const [accessCategory, setAccessCategory] = useState<'Barbeiro' | 'Administrador' | 'Recepcionista'>('Barbeiro');
  const [color, setColor] = useState('#e68a00');
  const [commissionPercent, setCommissionPercent] = useState('40');
  const [phone, setPhone] = useState('(47) 99623-9122');
  const [acceptsBooking, setAcceptsBooking] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (professionalToEdit) {
      setName(professionalToEdit.name || '');
      setSpecialty(professionalToEdit.specialty || professionalToEdit.role || '');
      setEmail(professionalToEdit.email || '');
      setAccessCategory(professionalToEdit.accessCategory || 'Barbeiro');
      setColor(professionalToEdit.color || '#e68a00');
      setCommissionPercent(String(professionalToEdit.commissionPercent ?? 40));
      setPhone(professionalToEdit.phone || '(47) 99623-9122');
      setAcceptsBooking(professionalToEdit.acceptsBooking !== false);
      setIsActive(professionalToEdit.isActive !== false);
      setAvatarUrl(professionalToEdit.avatarUrl);
    } else {
      setName('');
      setSpecialty('');
      setEmail('');
      setAccessCategory('Barbeiro');
      setColor('#e68a00');
      setCommissionPercent('40');
      setPhone('(47) 99623-9122');
      setAcceptsBooking(true);
      setIsActive(true);
      setAvatarUrl(undefined);
    }
    setIsPaletteOpen(false);
    setShowConfirmDelete(false);
  }, [professionalToEdit, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const commVal = parseInt(commissionPercent, 10);
    const validCommission = isNaN(commVal) ? 40 : Math.min(100, Math.max(0, commVal));

    const updated: ProfessionalItem = {
      id: professionalToEdit ? professionalToEdit.id : `prof-${Date.now()}`,
      name: name.trim(),
      role: accessCategory,
      specialty: specialty.trim() || undefined,
      phone: phone.trim() || '(47) 99623-9122',
      email: email.trim() || undefined,
      accessCategory,
      color,
      avatarUrl,
      commissionPercent: validCommission,
      isActive,
      acceptsBooking,
    };

    onSave(updated);
    onClose();
  };

  const getInitials = (fullName: string) => {
    if (!fullName) return 'SB';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Container (Always Dark) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-lg bg-zinc-950 text-white h-full flex flex-col shadow-2xl z-10 border-l border-zinc-800 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/95 sticky top-0 z-20">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{professionalToEdit ? 'Editar funcionário' : 'Novo funcionário'}</span>
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Avatar Section */}
              <div className="flex flex-col items-center justify-center pt-1 pb-3">
                <div className="relative group cursor-pointer">
                  <div
                    className="w-24 h-24 rounded-full border-4 border-zinc-800 shadow-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
                    style={{ backgroundColor: color }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-white drop-shadow font-display">
                        {getInitials(name || 'Barbeiro')}
                      </span>
                    )}
                  </div>

                  <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-700 shadow flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer transition-colors">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <span className="text-[11px] text-zinc-400 mt-2 font-medium">
                  {avatarUrl ? 'Clique na câmera para alterar foto' : 'Foto do profissional'}
                </span>
              </div>

              {/* Basic Info: Nome & Especialidade */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ruan santos"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c105]/30 focus:border-[#f8c105] transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Especialidade
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Ex: Cortes clássicos"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c105]/30 focus:border-[#f8c105] transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Card 1: Acesso */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Lock size={15} className="stroke-[2.5]" />
                  <span>Acesso</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    E-mail de acesso
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="—"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Categoria de acesso
                    </label>
                    <div className="group relative cursor-help">
                      <Info size={13} className="text-zinc-400" />
                      <div className="absolute right-0 bottom-full mb-1 w-52 p-2 bg-zinc-900 text-[11px] text-zinc-200 rounded-lg shadow-xl border border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Define os privilégios de visualização e permissões dentro do painel.
                      </div>
                    </div>
                  </div>
                  <select
                    value={accessCategory}
                    onChange={(e) => setAccessCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Barbeiro">Barbeiro</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Recepcionista">Recepcionista</option>
                  </select>
                </div>
              </div>

              {/* Card 2: Detalhes */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Palette size={15} className="stroke-[2.5]" />
                  <span>Detalhes</span>
                </div>

                <div className="grid grid-cols-2 gap-3 items-start">
                  {/* Cor */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Cor
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                        className="w-full h-10 rounded-xl border border-zinc-700 shadow-inner flex items-center justify-between px-3 cursor-pointer transition-transform active:scale-[0.98]"
                        style={{ backgroundColor: color }}
                        title="Clique para escolher a cor de identificação do barbeiro"
                      >
                        <span className="text-[11px] font-mono font-bold text-white drop-shadow uppercase">
                          {color}
                        </span>
                        <Palette size={14} className="text-white drop-shadow" />
                      </button>

                      {/* Expanded Palette Selector */}
                      {isPaletteOpen && (
                        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-4 gap-2 animate-in fade-in zoom-in-95">
                          {PRESET_COLORS.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setColor(c);
                                setIsPaletteOpen(false);
                              }}
                              className="h-7 rounded-lg transition-transform hover:scale-110 flex items-center justify-center shadow cursor-pointer"
                              style={{ backgroundColor: c }}
                            >
                              {color === c && <Check size={12} className="text-white stroke-[3]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comissão % */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Comissão %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={commissionPercent}
                      onChange={(e) => setCommissionPercent(e.target.value)}
                      placeholder="40"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c105]/30 focus:border-[#f8c105] transition-all text-center"
                    />
                  </div>
                </div>

                {/* Telefone / WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    WhatsApp para contato
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(47) 99623-9122"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f8c105]/30 focus:border-[#f8c105] transition-all font-mono"
                  />
                </div>
              </div>

              {/* Card 3: Recebe agendamento */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    Recebe agendamento
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                    Aparece como profissional no site e na agenda.
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => setAcceptsBooking(!acceptsBooking)}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    acceptsBooking ? 'bg-blue-600' : 'bg-zinc-700'
                  }`}
                >
                  <motion.div
                    className="bg-white w-5 h-5 rounded-full shadow-md"
                    animate={{ x: acceptsBooking ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Status Ativo Toggle */}
              <div className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800/90 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">
                    Status do Profissional
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                    Permite pausar temporariamente as atividades sem excluir o histórico.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    isActive ? 'bg-emerald-600' : 'bg-zinc-700'
                  }`}
                >
                  <motion.div
                    className="bg-white w-5 h-5 rounded-full shadow-md"
                    animate={{ x: isActive ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Delete Confirmation Box (if editing) */}
              {professionalToEdit && onDelete && (
                <div className="pt-2">
                  {!showConfirmDelete ? (
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(true)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 font-semibold py-2 px-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Excluir funcionário</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-800/60 space-y-2 text-left">
                      <p className="text-xs text-red-200 font-medium">
                        Tem certeza que deseja remover <strong>{professionalToEdit.name}</strong>?
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(professionalToEdit.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                        >
                          Sim, excluir
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirmDelete(false)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Sticky Drawer Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/95 flex items-center justify-end gap-3 sticky bottom-0 z-20">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Check size={15} className="stroke-[3]" />
                <span>Salvar alterações</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

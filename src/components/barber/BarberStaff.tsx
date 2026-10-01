import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Check,
  User,
  Shield,
  Percent,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { ProfessionalItem } from '../../types';
import BarberStaffDrawer from './BarberStaffDrawer';

export default function BarberStaff() {
  const { currentTenant, updateCurrentTenant, showNotification } = useSaaS();
  const [professionals, setProfessionals] = useState<ProfessionalItem[]>([
    ...currentTenant.professionals,
  ]);
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync state if currentTenant.professionals changes externally
  React.useEffect(() => {
    setProfessionals([...currentTenant.professionals]);
  }, [currentTenant.professionals]);

  const handleOpenNew = () => {
    setSelectedProfessional(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (prof: ProfessionalItem) => {
    setSelectedProfessional(prof);
    setIsDrawerOpen(true);
  };

  const handleSave = (savedProf: ProfessionalItem) => {
    let updated: ProfessionalItem[];
    const exists = professionals.some((p) => p.id === savedProf.id);

    if (exists) {
      updated = professionals.map((p) => (p.id === savedProf.id ? savedProf : p));
      showNotification(`Cadastro de ${savedProf.name} atualizado com sucesso!`, 'success');
    } else {
      updated = [...professionals, savedProf];
      showNotification(`Novo funcionário ${savedProf.name} cadastrado com sucesso!`, 'success');
    }

    setProfessionals(updated);
    updateCurrentTenant({ professionals: updated });
  };

  const handleDelete = (id: string) => {
    const profToDelete = professionals.find((p) => p.id === id);
    const updated = professionals.filter((p) => p.id !== id);
    setProfessionals(updated);
    updateCurrentTenant({ professionals: updated });
    showNotification(
      `Profissional ${profToDelete?.name || ''} removido com sucesso.`,
      'info'
    );
  };

  const getInitials = (name: string) => {
    if (!name) return 'SB';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-zinc-900">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
            Equipe & Funcionários
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cadastre e gerencie sua equipe de barbeiros, comissões e dados de acesso.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer self-start sm:self-auto transition-all"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Novo Barbeiro</span>
        </button>
      </div>

      {/* Barbers list header counter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-display font-black text-zinc-400 uppercase tracking-widest">
            BARBEIROS CADASTRADOS <span className="text-[#f8c105] font-mono ml-1">({professionals.length})</span>
          </span>
          <span className="text-[11px] text-zinc-500">
            Clique no ícone de lápis para editar o cadastro
          </span>
        </div>

        {/* List of Barbers cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {professionals.map((prof) => {
            const profColor = prof.color || '#e68a00';
            const isActive = prof.isActive !== false;

            return (
              <div
                key={prof.id}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all shadow-sm flex items-center justify-between gap-4 group"
              >
                {/* Left: Avatar + Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Initials Circle with Custom Color */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-black text-base text-white shadow-sm shrink-0 overflow-hidden"
                    style={{ backgroundColor: profColor }}
                  >
                    {prof.avatarUrl ? (
                      <img
                        src={prof.avatarUrl}
                        alt={prof.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{getInitials(prof.name)}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-bold text-sm sm:text-base text-white truncate">
                        {prof.name}
                      </h4>
                      {isActive ? (
                        <span className="text-[10px] bg-emerald-950/70 text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Ativa
                        </span>
                      ) : (
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 font-medium px-2 py-0.5 rounded-full border border-zinc-700">
                          Inativo
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 truncate">
                      {prof.specialty || prof.email || '—'}
                    </p>

                    {/* Tag badges at bottom */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <span className="text-[10px] bg-zinc-900 text-zinc-300 font-medium px-2 py-0.5 rounded-md border border-zinc-800">
                        {prof.accessCategory || prof.role || 'Barbeiro'}
                      </span>
                      <span className="text-[10px] bg-zinc-900 text-zinc-300 font-medium px-2 py-0.5 rounded-md border border-zinc-800 font-mono">
                        Comissão {prof.commissionPercent}%
                      </span>
                      {prof.acceptsBooking === false && (
                        <span className="text-[10px] bg-amber-950/50 text-amber-400 font-medium px-1.5 py-0.5 rounded-md border border-amber-800/40">
                          Sem agenda pública
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Pencil edit button */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(prof)}
                  title="Editar cadastro do funcionário"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all cursor-pointer shrink-0"
                >
                  <Pencil size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Staff Edit/Create Drawer Component */}
      <BarberStaffDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        professionalToEdit={selectedProfessional}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

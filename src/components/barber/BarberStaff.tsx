import { useState } from 'react';
import { User, Plus, Phone, Check, ShieldCheck } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { ProfessionalItem } from '../../types';

export default function BarberStaff() {
  const { currentTenant, updateCurrentTenant, showNotification } = useSaaS();
  const [professionals, setProfessionals] = useState<ProfessionalItem[]>([...currentTenant.professionals]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Barbeiro');
  const [phone, setPhone] = useState('(47) 99623-9122');
  const [commission, setCommission] = useState('50');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newProf: ProfessionalItem = {
      id: `prof-${Date.now()}`,
      name,
      role,
      phone,
      commissionPercent: parseInt(commission, 10) || 50,
      isActive: true,
    };
    const updated = [...professionals, newProf];
    setProfessionals(updated);
    updateCurrentTenant({ professionals: updated });
    setIsModalOpen(false);
    setName('');
    showNotification(`Profissional ${name} cadastrado com sucesso!`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
            Equipe & Funcionários
          </h2>
          <p className="text-xs text-zinc-400">
            Cadastre os profissionais que atendem na barbearia e aparecem na seleção de agendamento online.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Novo Barbeiro</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {professionals.map((prof) => (
          <div
            key={prof.id}
            className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-display font-black text-base text-[#f8c105]">
                {prof.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-display font-bold text-sm sm:text-base text-white">{prof.name}</h4>
                <p className="text-xs text-[#f8c105]">{prof.role}</p>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">📞 {prof.phone}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono">Comissão</span>
              <span className="font-mono font-bold text-sm text-emerald-400">
                {prof.commissionPercent}%
              </span>
              <span className="block mt-1 text-[9px] bg-emerald-950 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase">
                Ativo
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-display font-black text-sm uppercase text-white">Cadastrar Barbeiro</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-zinc-300 block mb-1">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Cargo / Especialidade:</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Barbeiro Especialista em Fade"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">WhatsApp:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Comissão (%):</label>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105] font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-900 text-zinc-400 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#f8c105] text-black font-black uppercase tracking-wider"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

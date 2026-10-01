import { TrendingUp, Award, Star, Clock, Calendar, CheckCircle, Scissors } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function BarberPerformance() {
  const { currentTenant, appointments } = useSaaS();

  const tenantAppointments = appointments.filter((a) => a.tenantId === currentTenant.id);
  const totalCuts = tenantAppointments.length + 65; // realistic base
  const totalRevenue = tenantAppointments.reduce((acc, curr) => acc + curr.totalPrice, 0) + 3450;
  const avgRating = 4.9;

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
          Meu Desempenho
        </h2>
        <p className="text-xs text-zinc-400">
          Acompanhe suas métricas individuais, cortes concluídos, faturamento e avaliações.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-bold uppercase">Cortes no Mês</span>
            <Scissors size={14} className="text-[#f8c105]" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-white block">
            {totalCuts}
          </span>
          <p className="text-[11px] text-emerald-400 font-mono">+18% que mês passado</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-bold uppercase">Faturamento Pessoal</span>
            <TrendingUp size={14} className="text-emerald-400" />
          </div>
          <span className="font-mono font-black text-2xl sm:text-3xl text-emerald-400 block">
            R$ {totalRevenue.toFixed(2).replace('.', ',')}
          </span>
          <p className="text-[11px] text-zinc-500 font-mono">Meta: R$ 5.000,00</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-bold uppercase">Avaliação Média</span>
            <Star size={14} className="text-[#f8c105] fill-[#f8c105]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-2xl sm:text-3xl text-white">
              {avgRating}
            </span>
            <span className="text-xs text-[#f8c105] font-bold">/ 5.0</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">48 avaliações Google</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-bold uppercase">Pontualidade</span>
            <Clock size={14} className="text-blue-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-white block">
            96%
          </span>
          <p className="text-[11px] text-blue-400 font-mono">Tempo médio: 32 min</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <h3 className="font-display font-bold text-sm uppercase text-white tracking-wider">
            Horários de Maior Movimento
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
              <span className="text-zinc-300">Quinta a Sábado (17h - 20h)</span>
              <span className="font-mono font-bold text-[#f8c105]">98% Ocupado</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900">
              <span className="text-zinc-300">Sábado Manhã (09h - 12h)</span>
              <span className="font-mono font-bold text-[#f8c105]">92% Ocupado</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-zinc-300">Terça e Quarta (13h - 16h)</span>
              <span className="font-mono font-bold text-zinc-500">45% Ocupado (Oportunidade)</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <h3 className="font-display font-bold text-sm uppercase text-white tracking-wider">
            Destaques de Satisfação
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Seus clientes elogiam principalmente a <strong>precisão do degradê navalhado</strong>, a <strong>pontualidade</strong> no horário marcado e o <strong>ambiente descontraído</strong> da barbearia.
          </p>
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800/80 text-[11px] text-zinc-300 italic">
            &quot;Melhor atendimento de Itajaí! O corte do Luan é impecável, na régua sem nenhum defeito.&quot;
          </div>
        </div>
      </div>
    </div>
  );
}

import { Check, Shield, Zap, Sparkles, CreditCard, Calendar } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function BarberPlan() {
  const { currentTenant } = useSaaS();

  const features = [
    'Mini Central Pública exclusiva (divulgação por WhatsApp/Instagram)',
    'Agenda Inteligente com agendamento online 24/7',
    'Sem limite de clientes ou agendamentos mensais',
    'Notificações e confirmação de corte via WhatsApp',
    'Módulo de Marketing IA para recuperação de clientes',
    'Cartão Fidelidade Digital integrado',
    'Controle Financeiro de receitas e despesas',
    'Suporte prioritário e backup em nuvem',
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            Assinatura Ativa
          </span>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider mt-1">
          Meu Plano na Plataforma
        </h2>
        <p className="text-xs text-zinc-400">
          Detalhes da assinatura SaaS da barbearia, recursos inclusos e próxima fatura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Plan Card */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-950 border border-[#f8c105]/50 space-y-5 shadow-[0_0_35px_rgba(248,193,5,0.1)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-900 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#f8c105]">
                Plano Atual
              </span>
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-wide">
                {currentTenant.plan}
              </h3>
              <p className="text-xs text-zinc-400">
                Plataforma completa de gestão e Mini Central para barbearias de alto padrão.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-mono font-black text-2xl text-emerald-400">
                R$ {currentTenant.planPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-xs text-zinc-400 font-mono block">/ mês</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <span className="text-xs font-bold text-zinc-300 block uppercase tracking-wider">
              Recursos Habilitados na sua Conta:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-zinc-300">
                  <div className="w-4 h-4 rounded-full bg-[#f8c105]/20 text-[#f8c105] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={10} className="stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Billing details card */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm uppercase text-white tracking-wider border-b border-zinc-900 pb-2">
              Status da Cobrança
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Status:</span>
                <span className="font-bold text-emerald-400 uppercase font-mono">Em Dia</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-900">
                <span className="text-zinc-400">Membro desde:</span>
                <span className="font-mono text-zinc-300">{currentTenant.memberSince}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Próxima renovação:</span>
                <span className="font-mono font-bold text-[#f8c105]">
                  {currentTenant.nextBillingDate}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 leading-snug">
            💡 Dúvidas sobre seu plano ou faturamento? Fale com o suporte master da plataforma.
          </div>
        </div>
      </div>
    </div>
  );
}

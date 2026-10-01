import { Sparkles, TrendingUp, Lightbulb, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function BarberAiConsultant() {
  const { currentTenant, setBarberActiveTab } = useSaaS();

  const suggestions = [
    {
      title: 'Aumentar Ticket Médio com Combos de Barba',
      impact: '+ R$ 680,00 / mês',
      description:
        'Cerca de 65% dos seus clientes agendam apenas Degradê (R$ 50). Se você sugerir a Barba alinhada na navalha com toalha quente por + R$ 15, seu ticket médio sobe para R$ 65 sem aumentar seu tempo de cadeira significativamente.',
      actionLabel: 'Ver Serviços e Preços',
      actionTab: 'servicos' as const,
    },
    {
      title: 'Campanha de Ocupação para Terça e Quarta',
      impact: '+ 12 cortes / semana',
      description:
        'Os dados da sua agenda mostram que o período das 14h às 17h nas terças-feiras opera com apenas 40% de ocupação. Disparar a campanha de desconto pelo WhatsApp na segunda à noite pode lotar esses horários.',
      actionLabel: 'Abrir Marketing IA',
      actionTab: 'marketing-ia' as const,
    },
    {
      title: 'Compartilhamento em Stories do Instagram',
      impact: 'Mais Clientes Novos',
      description:
        'Sua Mini Central tem taxa de conversão excelente quando aberta no celular. Adicionar o link direto na bio do Instagram @' +
        currentTenant.instagram +
        ' e colocar adesivos de link nos Stories dos seus cortes pode gerar até 15 novos agendamentos por semana.',
      actionLabel: 'Personalizar Mini Central',
      actionTab: 'minicentral-editor' as const,
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#f8c105]/20 text-[#f8c105] px-2.5 py-0.5 rounded-full border border-[#f8c105]/30">
            Inteligência de Negócio
          </span>
        </div>
        <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider mt-1">
          Consultor IA da Barbearia
        </h2>
        <p className="text-xs text-zinc-400">
          Insights práticos gerados com base no movimento da sua barbearia para aumentar lucros e fidelização.
        </p>
      </div>

      <div className="space-y-4">
        {suggestions.map((s, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 shadow-sm hover:border-zinc-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-900 pb-2.5">
              <div className="flex items-center gap-2">
                <Lightbulb size={18} className="text-[#f8c105]" />
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  {s.title}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 self-start sm:self-auto">
                Estimativa: {s.impact}
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">{s.description}</p>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setBarberActiveTab(s.actionTab)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[#f8c105] border border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{s.actionLabel}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

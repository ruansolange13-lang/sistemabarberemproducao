import { useState } from 'react';
import { Sparkles, MessageSquare, Send, Copy, Check, Users, Flame } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function BarberMarketingIA() {
  const { currentTenant, clients, showNotification } = useSaaS();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const campaigns = [
    {
      id: 'camp-1',
      title: 'Recuperar Clientes Inativos (+20 dias)',
      badge: 'Alta Conversão',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      description: 'Mensagem com tom amigável para chamar clientes que não cortam há mais de 3 semanas.',
      template: `Fala meu parceiro, tudo na paz? 🔥
Aqui é o ${currentTenant.barbeiro} da *${currentTenant.name}*!

Notei que já faz um tempinho que você não passa por aqui pra dar aquele talento no disfarce.
Tô abrindo a agenda desta semana e lembrei de você!

Bora alinhar o visual?
Clica aqui no link da nossa Mini Central pra garantir seu horário:
${window.location.origin}

Tamo junto! 💈✂️`,
    },
    {
      id: 'camp-2',
      title: 'Promoção Terça & Quarta na Régua',
      badge: 'Preencher Horários Ociosos',
      badgeColor: 'bg-[#f8c105]/15 text-[#f8c105] border-[#f8c105]/30',
      description: 'Ideal para disparar no início da semana e movimentar os dias mais tranquilos.',
      template: `Fala chefe! ✂️
Quer começar a semana no estilo pagando menos?

Nesta *terça e quarta-feira*, quem agendar pelo link da nossa Mini Central ganha um combo especial com finalização premium de brinde! ⚡

Aproveita que restam poucos horários:
${window.location.origin}

Te espero na cadeira! 💈`,
    },
    {
      id: 'camp-3',
      title: 'Lembrete de Manutenção do Fade',
      badge: 'Retenção',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      description: 'Lembrete educado para clientes que cortam degradê manterem a régua afiada.',
      template: `Salve irmão! Tudo certo?
Passando rapidinho pra avisar que aquele seu fade navalhado já tá pedindo um retoque de respeito! 👊

Não deixa o visual perder a linha. Acesse nossa Mini Central e marque em 1 minuto:
${window.location.origin}

Grande abraço da equipe *${currentTenant.name}*!`,
    },
  ];

  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showNotification('Mensagem copiada para a área de transferência!', 'success');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              Inteligência de Vendas
            </span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider mt-1">
            Marketing IA & Automação WhatsApp
          </h2>
          <p className="text-xs text-zinc-400">
            Dispare campanhas inteligentes para recuperar clientes ausentes e lotar a agenda da barbearia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map((camp) => {
          const isCopied = copiedId === camp.id;
          return (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2">
                <span
                  className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${camp.badgeColor}`}
                >
                  {camp.badge}
                </span>
                <h3 className="font-display font-black text-sm text-white">{camp.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{camp.description}</p>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {camp.template}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(camp.id, camp.template)}
                  className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
                >
                  {isCopied ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(camp.template)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-black text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  title="Abrir no WhatsApp"
                >
                  <Send size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

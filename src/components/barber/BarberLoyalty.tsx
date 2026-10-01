import { useState, useMemo } from 'react';
import { Award, Plus, Check, Sparkles, Gift, Search, X, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function BarberLoyalty() {
  const { clients, addFidelityStamp, redeemFreeCut, setBarberActiveTab, showNotification } = useSaaS();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'brinde' | 'andamento'>('todos');

  // Filter clients by search query and filter tab
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        c.phone.includes(searchTerm.trim());

      if (!matchSearch) return false;

      const stamps = c.fidelityPoints || 0;
      const isComplete = Boolean(c.hasFreeCutReward || stamps >= 10);

      if (filterType === 'brinde') {
        return isComplete;
      }
      if (filterType === 'andamento') {
        return !isComplete;
      }
      return true;
    });
  }, [clients, searchTerm, filterType]);

  const totalRewardsReady = useMemo(() => {
    return clients.filter((c) => c.hasFreeCutReward || (c.fidelityPoints !== undefined && c.fidelityPoints >= 10)).length;
  }, [clients]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Fidelização de Clientes
            </span>
            {totalRewardsReady > 0 && (
              <span className="text-[10px] font-mono font-bold bg-[#f8c105] text-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Gift size={12} className="stroke-[2.5]" />
                <span>{totalRewardsReady} com Brinde Liberado</span>
              </span>
            )}
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider mt-1">
            Cartão Fidelidade Digital
          </h2>
          <p className="text-xs text-zinc-400">
            Regra ativa: a cada <strong>10 cortes realizados</strong>, o cliente ganha <strong>1 corte totalmente grátis</strong>, liberado automaticamente no cadastro do cliente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setBarberActiveTab('clientes')}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Ver Aba de Clientes</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input by Name */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Procurar cliente pelo nome ou telefone... (ex: Rafael, Gabriel, Mateus)"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 outline-none focus:border-[#f8c105] transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('todos')}
              className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer border ${
                filterType === 'todos'
                  ? 'bg-zinc-900 text-white border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              Todos ({clients.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterType('brinde')}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                filterType === 'brinde'
                  ? 'bg-[#f8c105]/20 text-[#f8c105] border-[#f8c105]/50'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-[#f8c105]'
              }`}
            >
              <Gift size={13} />
              <span>Brinde Liberado ({totalRewardsReady})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterType('andamento')}
              className={`px-3 py-2 rounded-xl font-bold transition-colors cursor-pointer border ${
                filterType === 'andamento'
                  ? 'bg-zinc-900 text-amber-400 border-amber-500/40'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              Em Andamento
            </button>
          </div>
        </div>

        {searchTerm && (
          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-900">
            <span>
              Filtrando por <strong>"{searchTerm}"</strong>: {filteredClients.length} cliente(s) encontrado(s)
            </span>
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="text-[#f8c105] hover:underline cursor-pointer"
            >
              Limpar filtro
            </button>
          </div>
        )}
      </div>

      {/* Grid of Fidelity Cards */}
      {filteredClients.length === 0 ? (
        <div className="p-10 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <h3 className="font-display font-bold text-sm text-white">Nenhum cliente encontrado</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Não encontramos nenhum cliente com o termo "{searchTerm}".
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Limpar Busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((cli) => {
            const stamps = cli.fidelityPoints || 0;
            const isComplete = Boolean(cli.hasFreeCutReward || stamps >= 10);
            const isAlmostComplete = stamps === 9;

            return (
              <div
                key={cli.id}
                className={`p-5 rounded-2xl bg-zinc-950 border transition-all duration-300 space-y-4 shadow-sm ${
                  isComplete
                    ? 'border-[#f8c105] shadow-[0_0_25px_rgba(248,193,5,0.22)] bg-gradient-to-b from-zinc-950 via-zinc-950 to-amber-950/20'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Client Header: Name + Presentinho de Brinde se 10 cortes + Pontos */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-display font-bold text-sm sm:text-base text-white">
                        {cli.name}
                      </h4>

                      {/* PRESENTINHO DE BRINDE NO NOME DO CLIENTE QUANDO FINALIZAR 10 CORTES */}
                      {isComplete && (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-[#f8c105] to-amber-300 text-black font-extrabold text-[10px] uppercase shadow-[0_0_12px_rgba(248,193,5,0.5)] animate-pulse"
                          title="Corte de Brinde Liberado!"
                        >
                          <Gift size={11} className="stroke-[2.5]" />
                          <span>Corte de Brinde</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">{cli.phone}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono font-extrabold text-sm sm:text-base block ${
                        isComplete ? 'text-[#f8c105] animate-pulse' : 'text-[#f8c105]'
                      }`}
                    >
                      {stamps}/10
                    </span>
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold">
                      cortes
                    </span>
                  </div>
                </div>

                {/* Stamp Grid (10 dots) */}
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const filled = idx < stamps;
                    const isLast = idx === 9;

                    return (
                      <div
                        key={idx}
                        className={`h-9 rounded-xl flex items-center justify-center border transition-all select-none ${
                          filled
                            ? isLast
                              ? 'bg-gradient-to-r from-amber-400 to-[#f8c105] text-black border-[#f8c105] shadow-[0_0_10px_rgba(248,193,5,0.4)] font-black'
                              : 'bg-[#f8c105] text-black border-[#f8c105] shadow-sm font-black'
                            : isLast
                            ? 'bg-amber-500/10 text-amber-400 border-dashed border-amber-500/40'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                        }`}
                      >
                        {filled ? (
                          isLast ? (
                            <Gift size={15} className="stroke-[2.5] animate-bounce" />
                          ) : (
                            <Check size={14} className="stroke-[3]" />
                          )
                        ) : isLast ? (
                          <Gift size={14} />
                        ) : (
                          <span className="text-[10px] font-mono">{idx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Status Message and Action Buttons */}
                <div className="pt-2 border-t border-zinc-900 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div className="text-[10px]">
                    {isComplete ? (
                      <span className="text-[#f8c105] font-bold flex items-center gap-1">
                        <Sparkles size={12} />
                        <span>Disponível no cadastro de clientes!</span>
                      </span>
                    ) : isAlmostComplete ? (
                      <span className="text-amber-400 font-semibold">
                        Falta apenas 1 corte para o brinde!
                      </span>
                    ) : (
                      <span className="text-zinc-400">
                        Faltam {10 - stamps} cortes para o prêmio
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {/* Main Action Button */}
                    {isComplete ? (
                      <button
                        type="button"
                        onClick={() => redeemFreeCut(cli.id)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-[#f8c105] hover:from-[#ffe27a] hover:to-[#f8c105] text-black text-xs font-display font-black uppercase tracking-wider flex items-center gap-1 shadow-lg active:scale-95 transition-all cursor-pointer"
                      >
                        <Gift size={13} className="stroke-[2.5]" />
                        <span>Resgatar Brinde</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addFidelityStamp(cli.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#f8c105]/20 hover:bg-[#f8c105]/30 text-[#f8c105] border border-[#f8c105]/40 text-xs font-bold transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <Plus size={13} />
                        <span>Carimbar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

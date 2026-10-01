import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Percent,
  Receipt,
  Calendar,
  X,
  Check,
  Trash2,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

const MONTH_NAMES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export default function BarberFinance() {
  const { currentTenant, financeEntries, addFinanceEntry, deleteFinanceEntry, showNotification } = useSaaS();

  // Navigation Month State (Defaults to October 2026 as per user screenshot)
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9); // 9 = October (0-indexed)

  // Sub-tabs matching user screenshot
  const [activeTab, setActiveTab] = useState<
    'lancamentos' | 'dre' | 'comissoes' | 'vales' | 'historico'
  >('lancamentos');

  // Modal State for New Entry
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryType, setEntryType] = useState<'receita' | 'despesa'>('receita');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Serviço');
  const [method, setMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
  const [entryDate, setEntryDate] = useState('2026-10-01');
  const [selectedProfessional, setSelectedProfessional] = useState('');

  // Vales & Adiantamentos state
  const [valesList, setValesList] = useState<
    { id: string; profName: string; amount: number; date: string; reason: string }[]
  >([]);
  const [isValeModalOpen, setIsValeModalOpen] = useState(false);
  const [valeProf, setValeProf] = useState('');
  const [valeAmount, setValeAmount] = useState('');
  const [valeReason, setValeReason] = useState('');

  // Format month title for header: e.g. "Outubro De 2026"
  const formattedMonthTitle = useMemo(() => {
    const mName = MONTH_NAMES[selectedMonth] || 'outubro';
    return `${mName.charAt(0).toUpperCase() + mName.slice(1)} De ${selectedYear}`;
  }, [selectedMonth, selectedYear]);

  // Format month for button: e.g. "outubro de 2026"
  const formattedMonthPill = useMemo(() => {
    return `${MONTH_NAMES[selectedMonth]} de ${selectedYear}`;
  }, [selectedMonth, selectedYear]);

  // Filter finance entries by tenant and selected month/year
  const monthFinanceEntries = useMemo(() => {
    return financeEntries.filter((item) => {
      if (item.tenantId !== currentTenant.id) return false;
      let itemMonth = -1;
      let itemYear = -1;

      if (item.date.includes('/')) {
        const parts = item.date.split('/');
        if (parts.length === 3) {
          itemMonth = parseInt(parts[1], 10) - 1;
          itemYear = parseInt(parts[2], 10);
        }
      } else if (item.date.includes('-')) {
        const parts = item.date.split('-');
        if (parts.length === 3) {
          itemYear = parseInt(parts[0], 10);
          itemMonth = parseInt(parts[1], 10) - 1;
        }
      }

      return itemMonth === selectedMonth && itemYear === selectedYear;
    });
  }, [financeEntries, currentTenant.id, selectedMonth, selectedYear]);

  // Calculated Metrics
  const totalReceitas = useMemo(() => {
    return monthFinanceEntries
      .filter((e) => e.type === 'receita')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [monthFinanceEntries]);

  const totalDespesas = useMemo(() => {
    return monthFinanceEntries
      .filter((e) => e.type === 'despesa')
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [monthFinanceEntries]);

  const saldoLucro = totalReceitas - totalDespesas;

  const margem = useMemo(() => {
    if (totalReceitas <= 0) return 0;
    return (saldoLucro / totalReceitas) * 100;
  }, [totalReceitas, saldoLucro]);

  const receitasCount = useMemo(() => {
    return monthFinanceEntries.filter((e) => e.type === 'receita').length;
  }, [monthFinanceEntries]);

  const ticketMedio = useMemo(() => {
    if (receitasCount <= 0) return 0;
    return totalReceitas / receitasCount;
  }, [totalReceitas, receitasCount]);

  const totalLancamentos = monthFinanceEntries.length;

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  const handleCurrentMonth = () => {
    setSelectedMonth(9);
    setSelectedYear(2026);
  };

  // Top Expenses by Category
  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    monthFinanceEntries
      .filter((e) => e.type === 'despesa')
      .forEach((e) => {
        const cat = e.category || 'Outros';
        map[cat] = (map[cat] || 0) + e.amount;
      });

    return Object.entries(map).map(([category, value]) => ({
      category,
      value,
      percentage: totalDespesas > 0 ? (value / totalDespesas) * 100 : 0,
    }));
  }, [monthFinanceEntries, totalDespesas]);

  // Daily cashflow data for 31 days
  const dailyCashFlow = useMemo(() => {
    const days = Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      receitas: 0,
      despesas: 0,
    }));

    monthFinanceEntries.forEach((entry) => {
      let d = 1;
      if (entry.date.includes('/')) {
        d = parseInt(entry.date.split('/')[0], 10) || 1;
      } else if (entry.date.includes('-')) {
        d = parseInt(entry.date.split('-')[2], 10) || 1;
      }
      if (d >= 1 && d <= 31) {
        if (entry.type === 'receita') {
          days[d - 1].receitas += entry.amount;
        } else {
          days[d - 1].despesas += entry.amount;
        }
      }
    });

    return days;
  }, [monthFinanceEntries]);

  // Handle Add Entry
  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount.replace(',', '.'));
    if (!description.trim() || isNaN(val) || val <= 0) {
      showNotification('Preencha a descrição e um valor válido.', 'error');
      return;
    }

    let formattedDate = entryDate;
    if (entryDate.includes('-')) {
      const parts = entryDate.split('-');
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    addFinanceEntry({
      tenantId: currentTenant.id,
      description: selectedProfessional
        ? `${description.trim()} (${selectedProfessional})`
        : description.trim(),
      amount: val,
      type: entryType,
      category,
      method,
      date: formattedDate,
    });

    setDescription('');
    setAmount('');
    setSelectedProfessional('');
    setIsModalOpen(false);
  };

  // Handle Add Vale
  const handleCreateVale = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(valeAmount.replace(',', '.'));
    if (!valeProf || isNaN(val) || val <= 0) {
      showNotification('Selecione o profissional e o valor do adiantamento.', 'error');
      return;
    }

    const newVale = {
      id: `vale-${Date.now()}`,
      profName: valeProf,
      amount: val,
      date: `${new Date().toLocaleDateString('pt-BR')}`,
      reason: valeReason.trim() || 'Adiantamento salarial',
    };

    setValesList((prev) => [newVale, ...prev]);

    addFinanceEntry({
      tenantId: currentTenant.id,
      description: `Vale / Adiantamento - ${valeProf} (${valeReason || 'Adiantamento'})`,
      amount: val,
      type: 'despesa',
      category: 'Adiantamento / Vale',
      method: 'Pix',
      date: new Date().toLocaleDateString('pt-BR'),
    });

    setValeAmount('');
    setValeReason('');
    setIsValeModalOpen(false);
    showNotification(`Vale de R$ ${val.toFixed(2)} registrado para ${valeProf}!`, 'success');
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto text-zinc-100">
      {/* HEADER SECTION (100% DARK) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financeiro
          </h1>
          <p className="text-xs text-zinc-400 font-medium capitalize mt-0.5">
            {formattedMonthTitle}
          </p>
        </div>

        {/* Month selector & New Entry Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Mês anterior"
              className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-xs font-semibold text-zinc-200 select-none">
              {formattedMonthPill}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              title="Próximo mês"
              className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleCurrentMonth}
            className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 shadow-sm transition-colors cursor-pointer"
          >
            Hoje
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>Novo lançamento</span>
          </button>
        </div>
      </div>

      {/* 6 TOP SUMMARY METRIC CARDS (100% DARK) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Receitas */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <ArrowUpRight size={14} className="text-emerald-400 stroke-[3]" />
              Receitas
            </span>
            <span className="text-[11px] font-semibold text-rose-400 flex items-center font-mono">
              <ArrowDownRight size={12} className="stroke-[3]" /> 100%
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
            R$ {totalReceitas.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* 2. Despesas */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <ArrowDownRight size={14} className="text-rose-400 stroke-[3]" />
              Despesas
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center font-mono">
              <ArrowDownRight size={12} className="stroke-[3]" /> 100%
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-400">
            R$ {totalDespesas.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* 3. Saldo/Lucro */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <TrendingUp size={14} className="text-emerald-400 stroke-[2.5]" />
              Saldo/Lucro
            </span>
            <span className="text-[11px] font-semibold text-rose-400 flex items-center font-mono">
              <ArrowDownRight size={12} className="stroke-[3]" /> 100%
            </span>
          </div>
          <div
            className={`text-lg sm:text-xl font-bold font-mono ${
              saldoLucro >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            R$ {saldoLucro.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* 4. % Margem */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <Percent size={13} className="text-blue-400 stroke-[2.5]" />
              Margem
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-blue-400">
            {margem.toFixed(1)}%
          </div>
        </div>

        {/* 5. Ticket médio */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <Receipt size={14} className="text-zinc-400 stroke-[2.5]" />
              Ticket médio
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white">
            R$ {ticketMedio.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* 6. Lançamentos */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <Calendar size={14} className="text-zinc-400 stroke-[2.5]" />
              Lançamentos
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-white">
            {totalLancamentos}
          </div>
        </div>
      </div>

      {/* SUB-TABS PILLS NAVIGATION (100% DARK) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none">
        <button
          type="button"
          onClick={() => setActiveTab('lancamentos')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'lancamentos'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900'
          }`}
        >
          Lançamentos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dre')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'dre'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900'
          }`}
        >
          DRE
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comissoes')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'comissoes'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900'
          }`}
        >
          Comissões
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vales')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'vales'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900'
          }`}
        >
          Vales & Pagamentos
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('historico')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'historico'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800 hover:bg-zinc-900'
          }`}
        >
          Histórico
        </button>
      </div>

      {/* TWO-COLUMN BODY LAYOUT (100% DARK) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT COLUMN: MAIN TAB VIEW (approx 2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* TAB 1: LANÇAMENTOS */}
          {activeTab === 'lancamentos' && (
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Lançamentos
                </h3>
                <span className="text-xs text-zinc-500 font-mono">
                  {monthFinanceEntries.length} {monthFinanceEntries.length === 1 ? 'registro' : 'registros'}
                </span>
              </div>

              {monthFinanceEntries.length === 0 ? (
                /* Empty state matching the user screenshot */
                <div className="py-16 text-center text-sm text-zinc-500 font-medium">
                  Nenhum lançamento neste mês.
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {monthFinanceEntries.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex items-center justify-between gap-3 hover:bg-zinc-900/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            item.type === 'receita'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                              : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {item.type === 'receita' ? '+' : '-'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-xs sm:text-sm text-white">
                            {item.description}
                          </h4>
                          <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                            {item.date} • {item.category} • {item.method}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`font-bold text-xs sm:text-sm font-mono ${
                            item.type === 'receita'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.type === 'receita' ? '+ ' : '- '} R${' '}
                          {item.amount.toFixed(2).replace('.', ',')}
                        </span>

                        <button
                          type="button"
                          onClick={() => deleteFinanceEntry(item.id)}
                          title="Excluir lançamento"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DRE */}
          {activeTab === 'dre' && (
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-md p-5 space-y-4">
              <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Demonstrativo do Resultado do Exercício (DRE)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Visão contábil e gerencial de receitas, custos e lucratividade líquida.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-950/50 text-blue-400 border border-blue-800/40">
                  {formattedMonthPill}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Receita Operacional Bruta */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900 font-semibold">
                  <span className="text-zinc-300">
                    (+) Receita Operacional Bruta (Serviços e Produtos)
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">
                    R$ {totalReceitas.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* 2. Deduções / Taxas */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900 text-zinc-400">
                  <span className="pl-3">(-) Taxas de Cartão e Meios de Pagamento (~2,5%)</span>
                  <span className="text-rose-400 font-mono">
                    - R$ {(totalReceitas * 0.025).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* 3. Receita Líquida */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900 font-bold bg-zinc-900/60 px-2 rounded-lg">
                  <span className="text-zinc-200">
                    (=) Receita Operacional Líquida
                  </span>
                  <span className="text-emerald-400 font-mono">
                    R$ {(totalReceitas * 0.975).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* 4. Custos e Comissões */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900 text-zinc-400">
                  <span className="pl-3">(-) Custos Operacionais / Comissões de Barbeiros</span>
                  <span className="text-rose-400 font-mono">
                    - R$ {(totalReceitas * 0.45).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* 5. Despesas Fixas e Variáveis */}
                <div className="flex items-center justify-between py-2 border-b border-zinc-900 text-zinc-400">
                  <span className="pl-3">(-) Despesas Administrativas & Estrutura</span>
                  <span className="text-rose-400 font-mono">
                    - R$ {totalDespesas.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* 6. Lucro Líquido Final */}
                <div className="flex items-center justify-between py-3 font-bold text-sm bg-blue-950/40 border border-blue-900/60 px-3 rounded-xl">
                  <span className="text-blue-200">
                    (=) Resultado / Lucro Líquido Final
                  </span>
                  <span
                    className={`font-mono text-base ${
                      saldoLucro >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    R$ {saldoLucro.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <div className="text-right text-[11px] text-zinc-400 pt-1">
                  Margem Líquida Operacional:{' '}
                  <strong className="text-blue-400 font-mono">{margem.toFixed(1)}%</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COMISSÕES */}
          {activeTab === 'comissoes' && (
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-md p-5 space-y-4">
              <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Comissões da Equipe
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Cálculo automático de repasse por barbeiro com base na porcentagem cadastrada.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {currentTenant.professionals.map((prof) => {
                  const comm = prof.commissionPercent || 40;
                  const estimatedGross =
                    totalReceitas > 0 ? totalReceitas / currentTenant.professionals.length : 0;
                  const commissionValue = (estimatedGross * comm) / 100;

                  return (
                    <div
                      key={prof.id}
                      className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow shrink-0"
                          style={{ backgroundColor: prof.color || '#e68a00' }}
                        >
                          {prof.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">
                            {prof.name}
                          </h4>
                          <p className="text-zinc-400 text-[11px]">
                            {prof.role} • Comissão: <strong>{comm}%</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right self-end sm:self-auto">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono block">
                            A repassar
                          </span>
                          <span className="font-mono font-bold text-sm text-emerald-400">
                            R$ {commissionValue.toFixed(2).replace('.', ',')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (commissionValue <= 0) {
                              showNotification(
                                'Nenhuma comissão pendente para este período.',
                                'info'
                              );
                              return;
                            }
                            addFinanceEntry({
                              tenantId: currentTenant.id,
                              description: `Repasse de Comissão - ${prof.name}`,
                              amount: commissionValue,
                              type: 'despesa',
                              category: 'Comissões',
                              method: 'Pix',
                              date: new Date().toLocaleDateString('pt-BR'),
                            });
                            showNotification(
                              `Comissão de ${prof.name} quitada com sucesso!`,
                              'success'
                            );
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer transition-all"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VALES & PAGAMENTOS */}
          {activeTab === 'vales' && (
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-md p-5 space-y-4">
              <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Vales & Adiantamentos
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Controle de adiantamentos salariais e saídas antecipadas de colaboradores.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsValeModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow"
                >
                  <Plus size={14} />
                  <span>Novo Vale</span>
                </button>
              </div>

              {valesList.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500">
                  Nenhum vale ou adiantamento registrado neste período.
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {valesList.map((vale) => (
                    <div
                      key={vale.id}
                      className="py-3 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-white">
                          {vale.profName}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          {vale.date} • {vale.reason}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-rose-400">
                        - R$ {vale.amount.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: HISTÓRICO */}
          {activeTab === 'historico' && (
            <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-md p-5 space-y-4">
              <div className="border-b border-zinc-900 pb-3">
                <h3 className="font-bold text-sm text-white">
                  Histórico de Movimentações
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Trilha de auditoria das transações financeiras registradas na barbearia.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                {monthFinanceEntries.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/60 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-white">
                        {item.description}
                      </span>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {item.date} • {item.category} • Forma: {item.method}
                      </p>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        item.type === 'receita'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {item.type === 'receita' ? '+' : '-'} R${' '}
                      {item.amount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CASH FLOW CHART & TOP EXPENSES (100% DARK) */}
        <div className="space-y-4">
          {/* Card 1: Fluxo de caixa diário */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-3">
            <h3 className="font-bold text-sm text-white">
              Fluxo de caixa diário
            </h3>

            {/* Daily Bars visualization */}
            <div className="h-44 w-full flex items-end justify-between gap-1 pt-6 pb-2 px-1 border-b border-zinc-900">
              {dailyCashFlow.slice(0, 30).map((d) => {
                const maxVal = Math.max(
                  ...dailyCashFlow.map((x) => Math.max(x.receitas, x.despesas, 100))
                );
                const recHeight = (d.receitas / maxVal) * 100;
                const despHeight = (d.despesas / maxVal) * 100;
                const hasActivity = d.receitas > 0 || d.despesas > 0;

                return (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col justify-end items-center h-full group relative"
                    title={`Dia ${d.day}: +R$ ${d.receitas.toFixed(0)} / -R$ ${d.despesas.toFixed(0)}`}
                  >
                    {hasActivity ? (
                      <div className="w-full flex gap-0.5 justify-center items-end h-full">
                        {d.receitas > 0 && (
                          <div
                            className="w-1.5 bg-emerald-500 rounded-t"
                            style={{ height: `${Math.max(recHeight, 15)}%` }}
                          />
                        )}
                        {d.despesas > 0 && (
                          <div
                            className="w-1.5 bg-rose-500 rounded-t"
                            style={{ height: `${Math.max(despHeight, 15)}%` }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-zinc-800 mb-1" />
                    )}

                    <span className="text-[8px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Entradas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Saídas
              </span>
            </div>
          </div>

          {/* Card 2: Top despesas por categoria */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-md space-y-3">
            <h3 className="font-bold text-sm text-white">
              Top despesas por categoria
            </h3>

            {expensesByCategory.length === 0 ? (
              <div className="py-6 text-xs text-zinc-500 font-medium">
                Sem despesas.
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {expensesByCategory.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-zinc-300">
                        {item.category}
                      </span>
                      <span className="font-mono text-white">
                        R$ {item.value.toFixed(2).replace('.', ',')} ({item.percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL / DRAWER: NOVO LANÇAMENTO (100% DARK) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Novo Lançamento Financeiro
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3.5 text-xs text-left">
              {/* Type toggle */}
              <div>
                <label className="font-semibold text-zinc-300 block mb-1.5">
                  Tipo de Lançamento:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEntryType('receita');
                      setCategory('Serviço');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      entryType === 'receita'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ArrowUpRight size={15} />
                    <span>Receita (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEntryType('despesa');
                      setCategory('Estoque / Produtos');
                    }}
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      entryType === 'despesa'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ArrowDownRight size={15} />
                    <span>Despesa (-)</span>
                  </button>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Descrição:
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    entryType === 'receita'
                      ? 'Ex: Corte Degrade + Barboterapia'
                      : 'Ex: Compra de navalhas e pomadas'
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xs"
                />
              </div>

              {/* Valor & Forma */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Valor (R$):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Forma de Pagamento:
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                  >
                    <option value="Pix">Pix</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>

              {/* Categoria & Data */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Categoria:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                  >
                    {entryType === 'receita' ? (
                      <>
                        <option value="Serviço">Serviço de Barba/Corte</option>
                        <option value="Venda de Produto">Venda de Produto</option>
                        <option value="Plano / Assinatura">Plano / Assinatura</option>
                        <option value="Outras Receitas">Outras Receitas</option>
                      </>
                    ) : (
                      <>
                        <option value="Estoque / Produtos">Estoque & Produtos</option>
                        <option value="Custos Fixos">Custos Fixos (Aluguel, Luz)</option>
                        <option value="Comissões">Comissão de Barbeiro</option>
                        <option value="Marketing">Marketing / Anúncios</option>
                        <option value="Manutenção">Manutenção de Equipamento</option>
                        <option value="Outras Despesas">Outras Despesas</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">
                    Data:
                  </label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Barbeiro Vinculado */}
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Profissional Vinculado (Opcional):
                </label>
                <select
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                >
                  <option value="">Nenhum (Geral da Barbearia)</option>
                  {currentTenant.professionals.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Botões */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check size={15} />
                  <span>Salvar lançamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO VALE / ADIANTAMENTO (100% DARK) */}
      {isValeModalOpen && (
        <div className="fixed inset-0 z-[350] flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
              <h3 className="font-bold text-sm text-white">
                Novo Vale / Adiantamento
              </h3>
              <button
                type="button"
                onClick={() => setIsValeModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateVale} className="space-y-3 text-xs text-left">
              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Profissional:
                </label>
                <select
                  required
                  value={valeProf}
                  onChange={(e) => setValeProf(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                >
                  <option value="">Selecione o profissional...</option>
                  {currentTenant.professionals.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Valor do Adiantamento (R$):
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0,00"
                  value={valeAmount}
                  onChange={(e) => setValeAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-300 block mb-1">
                  Motivo / Observação:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Adiantamento semanal"
                  value={valeReason}
                  onChange={(e) => setValeReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsValeModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Registrar Vale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

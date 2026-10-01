import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, CreditCard, Banknote, QrCode } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function BarberFinance() {
  const { currentTenant, financeEntries, addFinanceEntry } = useSaaS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('receita');
  const [category, setCategory] = useState('Serviço');
  const [method, setMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');

  const tenantFinance = financeEntries.filter((f) => f.tenantId === currentTenant.id);

  const totalReceitas = tenantFinance
    .filter((f) => f.type === 'receita')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalDespesas = tenantFinance
    .filter((f) => f.type === 'despesa')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    addFinanceEntry({
      tenantId: currentTenant.id,
      description,
      amount: parseFloat(amount) || 0,
      type,
      category,
      method,
      date: new Date().toLocaleDateString('pt-BR'),
    });
    setDescription('');
    setAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
            Financeiro da Barbearia
          </h2>
          <p className="text-xs text-zinc-400">
            Acompanhe receitas de cortes, despesas de produtos, saldo líquido e formas de pagamento.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-bold uppercase">Receitas Totais</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <span className="font-mono font-black text-2xl sm:text-3xl text-emerald-400 block">
            R$ {totalReceitas.toFixed(2).replace('.', ',')}
          </span>
          <p className="text-[11px] text-zinc-500 font-mono">Entradas brutas registradas</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-bold uppercase">Despesas / Custos</span>
            <TrendingDown size={16} className="text-red-400" />
          </div>
          <span className="font-mono font-black text-2xl sm:text-3xl text-red-400 block">
            R$ {totalDespesas.toFixed(2).replace('.', ',')}
          </span>
          <p className="text-[11px] text-zinc-500 font-mono">Insumos, produtos e contas</p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-bold uppercase">Saldo Líquido</span>
            <DollarSign size={16} className="text-[#f8c105]" />
          </div>
          <span className={`font-mono font-black text-2xl sm:text-3xl block ${saldoLiquido >= 0 ? 'text-white' : 'text-red-400'}`}>
            R$ {saldoLiquido.toFixed(2).replace('.', ',')}
          </span>
          <p className="text-[11px] text-emerald-400 font-mono">Lucro em caixa</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-display font-bold text-sm uppercase text-white tracking-wider border-b border-zinc-900 pb-2">
          Extrato de Lançamentos
        </h3>

        <div className="space-y-2">
          {tenantFinance.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                    item.type === 'receita'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {item.type === 'receita' ? '+' : '-'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">{item.description}</h4>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {item.date} • {item.category} • Pagamento via {item.method}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-mono font-bold text-sm block ${
                    item.type === 'receita' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {item.type === 'receita' ? '+ ' : '- '} R$ {item.amount.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-display font-black text-sm uppercase text-white">Novo Lançamento</h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('receita')}
                  className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                    type === 'receita'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Receita (+)
                </button>
                <button
                  type="button"
                  onClick={() => setType('despesa')}
                  className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                    type === 'despesa'
                      ? 'bg-red-500/20 text-red-400 border-red-500'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                  }`}
                >
                  Despesa (-)
                </button>
              </div>

              <div>
                <label className="font-bold text-zinc-300 block mb-1">Descrição:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Corte Masculino ou Compra de Navalhas"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Valor (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105] font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-300 block mb-1">Forma:</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as typeof method)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-[#f8c105]"
                  >
                    <option value="Pix">Pix</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
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
                  Lançar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

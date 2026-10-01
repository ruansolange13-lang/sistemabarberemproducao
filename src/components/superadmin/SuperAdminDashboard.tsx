import { useState } from 'react';
import {
  Shield,
  Users,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Search,
  ExternalLink,
  Sliders,
  DollarSign,
  Building2,
  Calendar,
  Lock,
  Unlock,
  Eye,
  History,
  Info,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { BarbeariaTenant } from '../../types';
import { navigate } from '../../utils/navigation';

export default function SuperAdminDashboard() {
  const {
    tenants,
    toggleMiniCentral,
    toggleAgenda,
    setTenantControls,
    confirmPaymentAndGrantAccess,
    auditLogs,
    switchTenant,
    setCurrentView,
    superAdminActiveTab,
    setSuperAdminActiveTab,
    showNotification,
  } = useSaaS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenantDetails, setSelectedTenantDetails] = useState<BarbeariaTenant | null>(null);

  // Metrics
  const totalTenants = tenants.length;
  const activeMiniCentrals = tenants.filter((t) => t.miniCentralAtiva).length;
  const activeAgendas = tenants.filter((t) => t.agendaAtiva).length;
  const bothActive = tenants.filter((t) => t.miniCentralAtiva && t.agendaAtiva).length;
  const bothBlocked = tenants.filter((t) => !t.miniCentralAtiva && !t.agendaAtiva).length;
  const totalMRR = tenants.reduce((acc, curr) => acc + curr.planPrice, 0);

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTestTenantMiniCentral = (tenantId: string) => {
    const target = tenants.find((t) => t.id === tenantId);
    if (target) {
      navigate(`/${target.slug}`);
      showNotification(`Abrindo Mini Central pública: /${target.slug}`, 'info');
    }
  };

  const handleTestTenantBarber = (tenantId: string) => {
    switchTenant(tenantId);
    setCurrentView('barber-system');
    showNotification(`Acessando painel do barbeiro: ${tenantId}`, 'info');
  };

  const handleSuspendBoth = (tenantId: string) => {
    setTenantControls(tenantId, false, false);
    showNotification(`Barbearia ${tenantId} totalmente suspensa (Mini Central e Agenda desativadas).`, 'error');
  };

  const handleActivateBoth = (tenantId: string) => {
    setTenantControls(tenantId, true, true);
    showNotification(`Barbearia ${tenantId} totalmente reativada com sucesso!`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Welcome & Navigation Tabs */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-purple-500/30 p-5 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/40">
              Master Admin Control
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
            Painel do Super Administrador
          </h2>
          <p className="text-xs text-zinc-400">
            Controle independente de Mini Centrais, bloqueio de agendas, gestão de planos e auditoria da plataforma.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleTestTenantMiniCentral('lupumba')}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
          >
            <Eye size={13} className="text-[#f8c105]" />
            <span>Testar Mini Central</span>
          </button>

          <button
            type="button"
            onClick={() => handleTestTenantBarber('lupumba')}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
          >
            <Sliders size={13} className="text-purple-400" />
            <span>Testar Sistema do Barbeiro</span>
          </button>
        </div>
      </div>

      {/* Super Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-zinc-800 text-xs">
        {[
          { id: 'visao-geral', label: 'Visão Geral da Plataforma' },
          { id: 'barbearias', label: `Barbearias & Bloqueios (${tenants.length})` },
          { id: 'planos', label: 'Planos & Assinaturas' },
          { id: 'inadimplencia', label: 'Inadimplência & Pagamentos' },
          { id: 'auditoria', label: `Auditoria & Logs (${auditLogs.length})` },
        ].map((tab) => {
          const isActive = superAdminActiveTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSuperAdminActiveTab(tab.id as typeof superAdminActiveTab)}
              className={`px-4 py-2.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VISÃO GERAL */}
      {superAdminActiveTab === 'visao-geral' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">Total Barbearias</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-white block">
                {totalTenants}
              </span>
              <p className="text-[11px] text-zinc-500 font-mono">100% no modelo SaaS</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">Mini Centrais Ativas</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400">
                  {activeMiniCentrals}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">/ {totalTenants}</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono">Aceitando agendamentos online</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">Agendas Liberadas</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-2xl sm:text-3xl text-blue-400">
                  {activeAgendas}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">/ {totalTenants}</span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono">Acesso ao sistema liberado</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-zinc-400 uppercase">MRR da Plataforma</span>
              <span className="font-mono font-black text-2xl sm:text-3xl text-[#f8c105] block">
                R$ {totalMRR.toFixed(2).replace('.', ',')}
              </span>
              <p className="text-[11px] text-emerald-400 font-mono">Receita mensal recorrente</p>
            </div>
          </div>

          {/* Quick Summary of independent status */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <h3 className="font-display font-bold text-sm uppercase text-white tracking-wider border-b border-zinc-900 pb-2">
              Regras e Status dos Controles Independentes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  Totalmente Ativas: {bothActive}
                </span>
                <p className="text-zinc-300 font-medium pt-1">
                  Mini Central recebe agendamentos + Barbeiro acessa o sistema interno normalmente.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                  Parcialmente Pausadas: {totalTenants - bothActive - bothBlocked}
                </span>
                <p className="text-zinc-300 font-medium pt-1">
                  Ex: Don Corleone (Mini Central em pausa, mas barbeiro acessa a agenda interna).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-500/30">
                  Totalmente Bloqueadas: {bothBlocked}
                </span>
                <p className="text-zinc-300 font-medium pt-1">
                  Ex: King&apos;s Cut (Mini Central bloqueada + Barbeiro impedido de logar no sistema).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTÃO DE BARBEARIAS & CONTROLES INDEPENDENTES */}
      {superAdminActiveTab === 'barbearias' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar barbearia por nome, responsável, cidade ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              Mostrando {filteredTenants.length} barbearias
            </span>
          </div>

          {/* Barbershops Cards / Table */}
          <div className="space-y-3.5">
            {filteredTenants.map((tenant) => {
              const isMiniAtiva = tenant.miniCentralAtiva;
              const isAgendaAtiva = tenant.agendaAtiva;

              return (
                <div
                  key={tenant.id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-300 flex items-center justify-center font-display font-black text-lg shrink-0">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-display font-black text-base text-white">
                            {tenant.name}
                          </h4>
                          <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                            /{tenant.slug}
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-[#f8c105]/15 text-[#f8c105] px-2 py-0.5 rounded border border-[#f8c105]/30">
                            {tenant.plan} (R$ {tenant.planPrice.toFixed(2)})
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Proprietário: <strong className="text-zinc-200">{tenant.ownerName}</strong> ({tenant.ownerEmail}) • {tenant.city}
                        </p>
                      </div>
                    </div>

                    {/* Quick Access Buttons */}
                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        type="button"
                        onClick={() => handleTestTenantMiniCentral(tenant.id)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
                        title="Abrir como cliente"
                      >
                        <Eye size={12} className="text-[#f8c105]" />
                        <span>Ver Mini Central</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedTenantDetails(tenant)}
                        className="px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Detalhes
                      </button>
                    </div>
                  </div>

                  {/* CONTROLES INDEPENDENTES DA BARBEARIA */}
                  <div className="pt-3 border-t border-zinc-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    {/* Switch 1: Mini Central */}
                    <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-zinc-300 block text-xs">Mini Central Pública</span>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase ${
                            isMiniAtiva ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {isMiniAtiva ? '● Ativa (Online)' : '○ Pausada (Bloqueada)'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleMiniCentral(tenant.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                          isMiniAtiva
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                        }`}
                      >
                        {isMiniAtiva ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>

                    {/* Switch 2: Agenda & Sistema Interno */}
                    <div className="p-3 rounded-xl bg-zinc-900/70 border border-zinc-800/80 flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-zinc-300 block text-xs">Acesso Agenda / Barbeiro</span>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase ${
                            isAgendaAtiva ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isAgendaAtiva ? '● Liberado' : '○ Suspenso / Bloqueado'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleAgenda(tenant.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                          isAgendaAtiva
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                        }`}
                      >
                        {isAgendaAtiva ? 'Bloquear' : 'Liberar'}
                      </button>
                    </div>

                    {/* Quick Combined Action */}
                    <div className="sm:col-span-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleSuspendBoth(tenant.id)}
                        disabled={!isMiniAtiva && !isAgendaAtiva}
                        className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-800 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Lock size={12} />
                        <span>Suspender Ambos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleActivateBoth(tenant.id)}
                        disabled={isMiniAtiva && isAgendaAtiva}
                        className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-emerald-950/40 text-zinc-400 hover:text-emerald-400 border border-zinc-800 disabled:opacity-30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Unlock size={12} />
                        <span>Liberar Ambos</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PLANOS & ASSINATURAS */}
      {superAdminActiveTab === 'planos' && (
        <div className="space-y-4">
          <h3 className="font-display font-bold text-sm uppercase text-white tracking-wider">
            Planos SaaS da Plataforma
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">
                Entrada
              </span>
              <h4 className="font-display font-black text-lg text-white">Plano Start</h4>
              <span className="font-mono font-black text-2xl text-emerald-400 block">
                R$ 89,90 <span className="text-xs text-zinc-400 font-sans">/ mês</span>
              </span>
              <p className="text-zinc-400 leading-relaxed">
                Mini Central básica, até 2 barbeiros e agendamento online padrão.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-[#f8c105]/50 space-y-3 shadow-lg">
              <span className="text-[10px] font-mono font-bold uppercase text-[#f8c105] bg-[#f8c105]/15 px-2 py-0.5 rounded border border-[#f8c105]/30">
                Mais Popular
              </span>
              <h4 className="font-display font-black text-lg text-white">Plano Pro</h4>
              <span className="font-mono font-black text-2xl text-[#f8c105] block">
                R$ 149,90 <span className="text-xs text-zinc-400 font-sans">/ mês</span>
              </span>
              <p className="text-zinc-300 leading-relaxed">
                Mini Central completa, vitrine de cortes personalizada, equipe ilimitada, Marketing IA e notificações WhatsApp.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-purple-500/40 space-y-3">
              <span className="text-[10px] font-mono font-bold uppercase text-purple-400 bg-purple-500/15 px-2 py-0.5 rounded border border-purple-500/30">
                Corporativo
              </span>
              <h4 className="font-display font-black text-lg text-white">Plano Enterprise</h4>
              <span className="font-mono font-black text-2xl text-purple-400 block">
                R$ 249,90 <span className="text-xs text-zinc-400 font-sans">/ mês</span>
              </span>
              <p className="text-zinc-400 leading-relaxed">
                Múltiplas unidades, domínio personalizado, consultor IA dedicado e suporte 24h.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INADIMPLÊNCIA & PAGAMENTOS */}
      {superAdminActiveTab === 'inadimplencia' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <h3 className="font-display font-bold text-sm uppercase text-white tracking-wider">
              Controle de Inadimplência e Bloqueio Preventivo
            </h3>
            <p className="text-xs text-zinc-400">
              Barbearias com pagamento em atraso podem ter o acesso ao sistema ou a Mini Central suspensos com 1 clique.
            </p>
          </div>

          <div className="space-y-3">
            {tenants.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <span className="text-[10px] font-mono text-zinc-400">({t.slug})</span>
                  </div>
                  <p className="text-zinc-400 font-mono text-[11px] mt-0.5">
                    Assinatura: <strong className="text-zinc-200">{t.subscriptionStatus.toUpperCase()}</strong> • Vencimento: {t.subscriptionExpiresAt} • R$ {t.planPrice.toFixed(2)}/mês
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-mono font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                      t.subscriptionStatus === 'ativa'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : t.subscriptionStatus === 'pendente'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-red-950 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {t.subscriptionStatus}
                  </span>

                  {/* 15. REGRA DOS 30 DIAS: Confirmar Pagamento & Liberar Acesso */}
                  <button
                    type="button"
                    onClick={() => confirmPaymentAndGrantAccess(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 font-bold border border-emerald-500/40 transition-colors cursor-pointer flex items-center gap-1 font-mono text-[11px]"
                  >
                    <CheckCircle size={12} />
                    <span>+30 Dias (Confirmar Pagamento)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSuspendBoth(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold border border-zinc-800 transition-colors cursor-pointer"
                  >
                    Suspender
                  </button>

                  <button
                    type="button"
                    onClick={() => handleActivateBoth(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 font-bold border border-purple-500/30 transition-colors cursor-pointer"
                  >
                    Liberar Ambos
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AUDITORIA & LOGS */}
      {superAdminActiveTab === 'auditoria' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm uppercase text-white tracking-wider">
                Trilha de Auditoria e Logs da Plataforma
              </h3>
              <p className="text-xs text-zinc-400">
                Histórico imutável de ativações, bloqueios de agenda e ações administrativas.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500">{auditLogs.length} eventos registrados</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.action}</span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-500/30">
                      {log.tenantName}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{log.details}</p>
                </div>

                <div className="text-left sm:text-right font-mono text-[10px] text-zinc-500 shrink-0">
                  <span className="text-zinc-400 block font-bold">{log.performedBy}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Details for a single Barbershop */}
      {selectedTenantDetails && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg bg-zinc-950 border border-purple-500/40 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="font-display font-black text-base uppercase text-white">
                  {selectedTenantDetails.name}
                </h3>
                <span className="text-xs font-mono text-zinc-400">ID: {selectedTenantDetails.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTenantDetails(null)}
                className="w-7 h-7 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 py-1 border-b border-zinc-900">
                <div>
                  <span className="text-zinc-500 block uppercase font-mono text-[10px]">Proprietário</span>
                  <span className="font-bold text-white">{selectedTenantDetails.ownerName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase font-mono text-[10px]">E-mail</span>
                  <span className="font-bold text-white">{selectedTenantDetails.ownerEmail}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1 border-b border-zinc-900">
                <div>
                  <span className="text-zinc-500 block uppercase font-mono text-[10px]">WhatsApp</span>
                  <span className="font-bold text-white">{selectedTenantDetails.whatsappFormatted}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase font-mono text-[10px]">Plano</span>
                  <span className="font-bold text-[#f8c105]">{selectedTenantDetails.plan}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 py-1 border-b border-zinc-900">
                <div>
                  <span className="text-zinc-500 block uppercase font-mono text-[10px]">Status Mini Central</span>
                  <span className={`font-bold font-mono ${selectedTenantDetails.miniCentralAtiva ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {selectedTenantDetails.miniCentralAtiva ? 'ONLINE' : 'PAUSADA'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block uppercase font-mono text-[10px]">Status Agenda</span>
                  <span className={`font-bold font-mono ${selectedTenantDetails.agendaAtiva ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedTenantDetails.agendaAtiva ? 'LIBERADA' : 'BLOQUEADA'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTenantDetails(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

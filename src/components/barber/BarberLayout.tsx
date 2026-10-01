import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  UserCheck,
  TrendingUp,
  DollarSign,
  Sparkles,
  Award,
  Lightbulb,
  CreditCard,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Share2,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { BarberTab } from '../../types';
import { navigate } from '../../utils/navigation';

// Tab components
import BarberDashboard from './BarberDashboard';
import BarberAgenda from './BarberAgenda';
import BarberClients from './BarberClients';
import BarberServices from './BarberServices';
import BarberStaff from './BarberStaff';
import BarberPerformance from './BarberPerformance';
import BarberFinance from './BarberFinance';
import BarberMiniCentralEditor from './BarberMiniCentralEditor';
import BarberMarketingIA from './BarberMarketingIA';
import BarberLoyalty from './BarberLoyalty';
import BarberAiConsultant from './BarberAiConsultant';
import BarberPlan from './BarberPlan';

export default function BarberLayout() {
  const {
    currentTenant,
    barberActiveTab,
    setBarberActiveTab,
    logoutBarber,
    setCurrentView,
    showNotification,
  } = useSaaS();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: BarberTab; label: string; icon: React.ElementType; section?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Operacional' },
    { id: 'agenda', label: 'Agenda & Horários', icon: Calendar },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'servicos', label: 'Serviços & Preços', icon: Scissors },
    { id: 'funcionarios', label: 'Equipe / Barbeiros', icon: UserCheck },
    { id: 'desempenho', label: 'Meu Desempenho', icon: TrendingUp },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },

    { id: 'minicentral-editor', label: 'Editar Mini Central', icon: Sliders, section: 'Presença Digital' },
    { id: 'fidelizacao', label: 'Fidelização', icon: Award },
    { id: 'consultor-ia', label: 'Consultor IA', icon: Lightbulb },
    { id: 'plano', label: 'Meu Plano SaaS', icon: CreditCard, section: 'Minha Assinatura' },
  ];

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col md:flex-row select-none">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-zinc-950 border-b border-zinc-800 p-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f8c105] text-black flex items-center justify-center font-black">
            <Scissors size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-[#f8c105]">
              SNAKE BARBER
            </div>
            <h1 className="font-display font-black text-xs text-white uppercase tracking-wider">
              {currentTenant.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/${currentTenant.slug}`)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
            title="Ver Mini Central"
          >
            <ExternalLink size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-950 border-r border-zinc-800/90 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Brand header */}
          <div className="hidden md:flex items-center gap-2.5 pb-4 border-b border-zinc-900">
            <div className="w-9 h-9 rounded-xl bg-[#f8c105] text-black flex items-center justify-center font-black shadow-md">
              <Scissors size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-[#f8c105] tracking-widest uppercase">
                SNAKE BARBER
              </div>
              <h2 className="font-display font-black text-sm text-white uppercase tracking-wider leading-tight">
                {currentTenant.name}
              </h2>
              <span className="text-[10px] font-mono text-zinc-400">Área do Barbeiro</span>
            </div>
          </div>

          {/* Quick status pill */}
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-[11px] font-mono space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Mini Central:</span>
              <span
                className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                  currentTenant.miniCentralAtiva
                    ? 'bg-emerald-950 text-emerald-400'
                    : 'bg-amber-950 text-amber-400'
                }`}
              >
                {currentTenant.miniCentralAtiva ? 'ONLINE' : 'PAUSADA'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Agenda Interna:</span>
              <span className="bg-emerald-950 text-emerald-400 font-bold px-1.5 py-0.2 rounded text-[10px]">
                LIBERADA
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = barberActiveTab === item.id;
              return (
                <div key={item.id}>
                  {item.section && (
                    <div className="pt-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold px-3">
                      {item.section}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setBarberActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-[#f8c105] text-black font-black shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-black' : 'text-zinc-500'} />
                    <span>{item.label}</span>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <button
            type="button"
            onClick={() => navigate(`/${currentTenant.slug}`)}
            className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-zinc-800"
          >
            <ExternalLink size={13} className="text-[#f8c105]" />
            <span>Ver Minha Mini Central</span>
          </button>

          <button
            type="button"
            onClick={logoutBarber}
            className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-red-900/40"
          >
            <LogOut size={13} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {barberActiveTab === 'dashboard' && <BarberDashboard />}
        {barberActiveTab === 'agenda' && <BarberAgenda />}
        {barberActiveTab === 'clientes' && <BarberClients />}
        {barberActiveTab === 'servicos' && <BarberServices />}
        {barberActiveTab === 'funcionarios' && <BarberStaff />}
        {barberActiveTab === 'desempenho' && <BarberPerformance />}
        {barberActiveTab === 'financeiro' && <BarberFinance />}
        {barberActiveTab === 'minicentral-editor' && <BarberMiniCentralEditor />}
        {barberActiveTab === 'marketing-ia' && <BarberMarketingIA />}
        {barberActiveTab === 'fidelizacao' && <BarberLoyalty />}
        {barberActiveTab === 'consultor-ia' && <BarberAiConsultant />}
        {barberActiveTab === 'plano' && <BarberPlan />}
      </main>
    </div>
  );
}

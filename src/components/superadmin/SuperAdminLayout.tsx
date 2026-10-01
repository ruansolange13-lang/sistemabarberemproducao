import { Shield, LogOut, ArrowLeft } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import { navigate } from '../../utils/navigation';

export default function SuperAdminLayout() {
  const { logoutSuperAdmin } = useSaaS();

  const handleLogout = () => {
    logoutSuperAdmin();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col select-none font-sans">
      {/* Top Admin Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Shield size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
              SNAKE BARBER
            </div>
            <h1 className="font-display font-black text-sm text-white uppercase tracking-wider">
              Painel do Super Administrador
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Voltar para a</span> Área do Barbeiro
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <SuperAdminDashboard />
      </main>
    </div>
  );
}

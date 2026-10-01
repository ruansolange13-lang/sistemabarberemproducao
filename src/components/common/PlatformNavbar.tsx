import { useState } from 'react';
import { Globe, Scissors, Shield, ChevronDown, Check, Building2, AlertTriangle, Lock } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';

export default function PlatformNavbar() {
  const {
    currentView,
    setCurrentView,
    currentTenant,
    tenants,
    switchTenant,
    isBarberLoggedIn,
    isSuperAdminLoggedIn,
  } = useSaaS();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-md px-3 py-2 select-none z-[120] sticky top-0">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Active Barbearia Multi-Tenant Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors cursor-pointer text-left"
          >
            <Building2 size={13} className="text-[#f8c105]" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white max-w-[140px] sm:max-w-[180px] truncate">
                {currentTenant.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                ({currentTenant.slug})
              </span>
            </div>

            {/* Quick status pill inside selector */}
            {!currentTenant.miniCentralAtiva && (
              <span className="text-[9px] font-mono font-bold bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30">
                Mini Pausada
              </span>
            )}
            {!currentTenant.agendaAtiva && (
              <span className="text-[9px] font-mono font-bold bg-red-950 text-red-400 px-1.5 py-0.2 rounded border border-red-500/30">
                Bloqueada
              </span>
            )}

            <ChevronDown size={12} className="text-zinc-500" />
          </button>

          {/* Tenant Selector Dropdown */}
          {tenantDropdownOpen && (
            <div className="absolute left-0 mt-1.5 w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-2 z-[150] space-y-1">
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold px-2 block py-1">
                Alternar Barbearia (Multi-Tenant Demo):
              </span>
              {tenants.map((t) => {
                const isSelected = t.id === currentTenant.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      switchTenant(t.id);
                      setTenantDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                    }`}
                  >
                    <div>
                      <p className="leading-tight text-white">{t.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono">
                        <span className={t.miniCentralAtiva ? 'text-emerald-400' : 'text-amber-400'}>
                          Mini: {t.miniCentralAtiva ? 'ON' : 'OFF'}
                        </span>
                        <span className={t.agendaAtiva ? 'text-emerald-400' : 'text-red-400'}>
                          Agenda: {t.agendaAtiva ? 'ON' : 'OFF'}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-[#f8c105]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Integrated 3-Area Navigation Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          {/* Area 1: Mini Central */}
          <button
            type="button"
            onClick={() => setCurrentView('mini-central')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'mini-central'
                ? 'bg-[#f8c105] text-black font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Globe size={13} />
            <span className="hidden sm:inline">1.</span>
            <span>Mini Central Pública</span>
          </button>

          {/* Area 2: Sistema do Barbeiro */}
          <button
            type="button"
            onClick={() => setCurrentView(isBarberLoggedIn ? 'barber-system' : 'barber-login')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'barber-system' || currentView === 'barber-login'
                ? 'bg-zinc-800 text-white font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Scissors size={13} className="text-[#f8c105]" />
            <span className="hidden sm:inline">2.</span>
            <span>Área do Barbeiro</span>
          </button>

          {/* Area 3: Super Admin */}
          <button
            type="button"
            onClick={() => setCurrentView(isSuperAdminLoggedIn ? 'super-admin' : 'super-admin-login')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'super-admin' || currentView === 'super-admin-login'
                ? 'bg-purple-600 text-white font-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Shield size={13} className="text-purple-300" />
            <span className="hidden sm:inline">3.</span>
            <span>Super Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

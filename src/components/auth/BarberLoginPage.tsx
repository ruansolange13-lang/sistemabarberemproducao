import { useState } from 'react';
import { motion } from 'motion/react';
import { Scissors, Lock, Mail, ArrowRight, AlertCircle, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { navigate } from '../../utils/navigation';

export default function BarberLoginPage() {
  const { tenants, loginBarber } = useSaaS();
  const [email, setEmail] = useState('barbeiro@lupumba.com');
  const [password, setPassword] = useState('123456');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = loginBarber(email, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleQuickLogin = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('123456');
    setErrorMessage(null);
    const res = loginBarber(testEmail, '123456');
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col justify-between p-4 sm:p-6 select-none relative overflow-hidden font-sans">
      {/* Background ambient accents */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#f8c105]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#f8c105]/5 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between py-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f8c105] text-black flex items-center justify-center font-black">
            <Scissors size={18} />
          </div>
          <span className="font-display font-black text-sm tracking-wider text-white">
            SNAKE BARBER
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/super-admin')}
          className="text-xs text-zinc-500 hover:text-purple-300 flex items-center gap-1 transition-colors cursor-pointer py-1 px-2.5 rounded bg-zinc-950 border border-zinc-900"
        >
          <span>Super Admin</span>
        </button>
      </header>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
        >
          {/* Brand & Badge */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#f8c105]/15 border border-[#f8c105]/40 flex items-center justify-center text-[#f8c105] shadow-[0_0_25px_rgba(248,193,5,0.25)]">
              <Scissors size={26} className="stroke-[2.2]" />
            </div>

            <div className="pt-2">
              <span className="text-[10px] bg-[#f8c105]/15 text-[#f8c105] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#f8c105]/30">
                Portal de Acesso do Barbeiro
              </span>
              <h1 className="font-display font-black text-2xl text-white tracking-wide uppercase mt-2">
                Área do Barbeiro
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Informe o e-mail cadastrado da sua barbearia para acessar o painel operacional e gerenciar sua agenda.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 text-left">
              <AlertCircle size={16} className="shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Aviso do Sistema</span>
                <span className="text-[11px] leading-relaxed block">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">E-mail Cadastrado:</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="barbeiro@lupumba.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300">Senha de Acesso:</label>
                <span className="text-[10px] text-zinc-500 hover:text-zinc-400 cursor-pointer">
                  Esqueceu a senha?
                </span>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              <span>Acessar Painel Operacional</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Access by Tenant */}
          <div className="pt-3 border-t border-zinc-800/80 space-y-2 text-left">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-wider">
              <span>Contas de Demonstração (Testes de Regras):</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('barbeiro@lupumba.com')}
                className="w-full text-left p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-zinc-300 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white text-xs">Lupumba Barbearia</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Assinatura Ativa • Agenda Liberada</p>
                </div>
                <span className="text-[10px] font-mono text-[#f8c105] bg-black/40 px-2 py-1 rounded">Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('carlos@navalhaouro.com')}
                className="w-full text-left p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-zinc-300 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white text-xs">Navalha de Ouro</p>
                  <p className="text-[10px] text-emerald-400 font-mono">Assinatura Ativa • Agenda Liberada</p>
                </div>
                <span className="text-[10px] font-mono text-[#f8c105] bg-black/40 px-2 py-1 rounded">Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('vito@doncorleone.com')}
                className="w-full text-left p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-zinc-300 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white text-xs">Don Corleone</p>
                  <p className="text-[10px] text-amber-400 font-mono">Mini Central Pausada • Agenda Ativa</p>
                </div>
                <span className="text-[10px] font-mono text-[#f8c105] bg-black/40 px-2 py-1 rounded">Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('felipe@kingscut.com')}
                className="w-full text-left p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-zinc-300 transition-colors cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white text-xs">King's Cut</p>
                  <p className="text-[10px] text-red-400 font-mono">Assinatura Suspensa • Agenda Bloqueada</p>
                </div>
                <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-1 rounded">Bloqueado</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer info */}
      <footer className="max-w-md mx-auto w-full text-center text-zinc-600 text-[11px] py-2 z-10 font-mono">
        Plataforma Snake Barber • Sistema Operacional para Barbearias
      </footer>
    </div>
  );
}


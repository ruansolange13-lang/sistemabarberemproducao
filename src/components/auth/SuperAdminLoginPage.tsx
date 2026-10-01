import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { navigate } from '../../utils/navigation';

export default function SuperAdminLoginPage() {
  const { loginSuperAdmin } = useSaaS();
  const [email, setEmail] = useState('admin@snakebarber.app');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = loginSuperAdmin(email, password);
    if (!res.success && res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@snakebarber.app');
    setPassword('admin123');
    setErrorMessage(null);
    loginSuperAdmin('admin@snakebarber.app', 'admin123');
  };

  return (
    <div className="min-h-screen w-full bg-black text-zinc-100 flex flex-col justify-between p-4 select-none relative overflow-hidden font-sans">
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#f8c105]/5 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between py-2 z-10">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-lg bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Área do Barbeiro</span>
        </button>

        <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest">
          SNAKE BARBER • MASTER ADMIN
        </span>
      </header>

      {/* Main Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(168,85,247,0.15)] space-y-6 relative"
        >
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.25)]">
              <Shield size={26} className="stroke-[2.2]" />
            </div>

            <div className="pt-2">
              <span className="text-[10px] bg-purple-500/15 text-purple-300 font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-purple-500/30">
                SNAKE BARBER PLATFORM
              </span>
              <h1 className="font-display font-black text-2xl text-white tracking-wide uppercase mt-2">
                Super Administrador
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                Controle global de barbearias, planos, auditoria e bloqueios independentes.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 text-left">
              <AlertCircle size={16} className="shrink-0 text-amber-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 block">E-mail Master Admin:</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@plataforma.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300">Senha Master:</label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-purple-500 text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(168,85,247,0.3)] active:scale-95 cursor-pointer mt-2"
            >
              Acessar Painel Master →
            </button>
          </form>

          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-zinc-800 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-purple-400" />
              <span>Entrar com 1 Clique (Super Admin Demo)</span>
            </button>
          </div>
        </motion.div>
      </div>

      <footer className="max-w-md mx-auto w-full text-center text-zinc-600 text-[11px] py-2">
        Plataforma Master • Acesso Restrito
      </footer>
    </div>
  );
}

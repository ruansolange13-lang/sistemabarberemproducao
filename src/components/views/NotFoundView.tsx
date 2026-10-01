import { Scissors, AlertCircle, ArrowLeft, Building2 } from 'lucide-react';
import { navigate } from '../../utils/navigation';

interface NotFoundViewProps {
  attemptedSlug?: string;
}

export default function NotFoundView({ attemptedSlug }: NotFoundViewProps) {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex flex-col justify-between p-6 select-none relative overflow-hidden font-sans">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-[#f8c105]/5 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between py-4 z-10">
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
          onClick={() => navigate('/')}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer py-1 px-2.5 rounded bg-zinc-900 border border-zinc-800"
        >
          <ArrowLeft size={13} />
          <span>Área do Barbeiro</span>
        </button>
      </header>

      {/* Center Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8 z-10 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#f8c105] shadow-xl">
          <Building2 size={32} />
        </div>

        <div className="space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#f8c105] font-bold">
            Erro 404 • Endereço Não Localizado
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
            Barbearia Não Encontrada
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            {attemptedSlug ? (
              <>
                O link <strong className="text-zinc-200 font-mono">/{attemptedSlug}</strong> não corresponde a nenhuma barbearia ativa cadastrada na plataforma Snake Barber.
              </>
            ) : (
              'O endereço informado não corresponde a nenhuma barbearia ativa cadastrada na plataforma Snake Barber.'
            )}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-left text-xs text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
            <AlertCircle size={14} className="text-[#f8c105]" />
            <span>O que fazer agora?</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            • Verifique se o nome ou link digitado está correto.
            <br />
            • Solicite o link oficial atualizado da barbearia pelo WhatsApp ou Instagram.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffd700] text-black font-display font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Acessar Snake Barber
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-zinc-600 font-mono py-4 z-10">
        Plataforma Snake Barber • Gestão e Mini Centrais para Barbearias
      </footer>
    </div>
  );
}

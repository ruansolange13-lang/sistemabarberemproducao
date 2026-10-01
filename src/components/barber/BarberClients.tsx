import { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Send,
  Plus,
  Calendar,
  X,
  Instagram,
  Check,
  Sparkles,
  MessageCircle,
  Gift,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { ClientItem } from '../../types';

export default function BarberClients() {
  const {
    currentTenant,
    clients,
    addClient,
    addAppointment,
    addFidelityStamp,
    redeemFreeCut,
    showNotification,
  } = useSaaS();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'ativos' | 'fidelidade' | 'premiados'>('todos');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookingClient, setBookingClient] = useState<ClientItem | null>(null);
  const [applyFreeCutInBooking, setApplyFreeCutInBooking] = useState(false);

  // Form state for new client
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [favoriteService, setFavoriteService] = useState('Degradê');

  // Form state for quick booking modal
  const [bookingServiceId, setBookingServiceId] = useState(currentTenant.services[0]?.id || 'degrade');
  const [bookingTime, setBookingTime] = useState('14:00');
  const [bookingDay, setBookingDay] = useState('Hoje');

  const tenantClients = clients.filter((c) => c.tenantId === currentTenant.id);

  // Count clients who have reached 10 cuts / have free cut reward
  const rewardedClientsCount = useMemo(() => {
    return tenantClients.filter(
      (c) => c.hasFreeCutReward || (c.fidelityPoints !== undefined && c.fidelityPoints >= 10)
    ).length;
  }, [tenantClients]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return tenantClients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        c.phone.includes(searchTerm.trim()) ||
        (c.instagram && c.instagram.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        c.favoriteService.toLowerCase().includes(searchTerm.toLowerCase().trim());

      if (!matchSearch) return false;

      if (filterType === 'ativos') {
        return c.status !== 'inativo';
      }
      if (filterType === 'fidelidade') {
        return (c.fidelityPoints || c.totalVisits || 0) > 0;
      }
      if (filterType === 'premiados') {
        return c.hasFreeCutReward || (c.fidelityPoints !== undefined && c.fidelityPoints >= 10);
      }
      return true;
    });
  }, [tenantClients, searchTerm, filterType]);

  // Compute initials like 'rg' for 'ruan gabriel'
  const getInitials = (clientName: string) => {
    const parts = clientName.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toLowerCase();
    }
    return (clientName.slice(0, 2) || 'rg').toLowerCase();
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const formattedIg = instagram.trim()
      ? instagram.startsWith('@')
        ? instagram.trim()
        : `@${instagram.trim()}`
      : undefined;

    addClient({
      tenantId: currentTenant.id,
      name: name.trim(),
      phone: phone.trim(),
      totalVisits: 0,
      totalSpent: 0,
      lastVisit: 'Recente',
      favoriteService,
      instagram: formattedIg,
      status: 'ativo',
      fidelityPoints: 0,
      hasFreeCutReward: false,
    });

    setName('');
    setPhone('');
    setInstagram('');
    setIsAddModalOpen(false);
  };

  const handleOpenBooking = (cli: ClientItem) => {
    setBookingClient(cli);
    const hasReward = Boolean(cli.hasFreeCutReward || (cli.fidelityPoints && cli.fidelityPoints >= 10));
    setApplyFreeCutInBooking(hasReward);
  };

  const handleQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingClient) return;

    const serviceObj = currentTenant.services.find((s) => s.id === bookingServiceId);
    const regularPrice = serviceObj ? serviceObj.price : 50;
    const isFreeCut = applyFreeCutInBooking;
    const finalPrice = isFreeCut ? 0 : regularPrice;
    const duration = serviceObj ? parseInt(serviceObj.duration, 10) || 45 : 45;

    const serviceNameText = isFreeCut
      ? `${serviceObj ? serviceObj.name : 'Corte Agendado'} (🎁 Corte de Brinde)`
      : serviceObj
      ? serviceObj.name
      : 'Corte Agendado';

    addAppointment({
      tenantId: currentTenant.id,
      clientName: bookingClient.name,
      clientPhone: bookingClient.phone,
      services: [bookingServiceId],
      serviceNames: serviceNameText,
      professionalId: 'prof-main',
      professionalName: currentTenant.barbeiro,
      dayLabel: bookingDay,
      timeSlot: bookingTime,
      durationMinutes: duration,
      totalPrice: finalPrice,
      paymentStatus: 'PAGO',
      paymentMethod: isFreeCut ? 'Dinheiro' : 'Pix',
      status: 'confirmado',
    });

    if (isFreeCut) {
      redeemFreeCut(bookingClient.id);
      showNotification(
        `🎉 Horário agendado com Corte de Brinde (R$ 0,00) para ${bookingClient.name}! Cartão fidelidade reiniciado.`,
        'success'
      );
    } else {
      showNotification(`Horário agendado para ${bookingClient.name} às ${bookingTime}!`, 'success');
    }

    setBookingClient(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
              Gestão de Clientes
            </h2>
            {rewardedClientsCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-[#f8c105] text-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                <Gift size={12} className="stroke-[2.5]" />
                <span>{rewardedClientsCount} com Brinde Liberado</span>
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Base completa de clientes, histórico de consumo, controle de fidelidade (10 cortes = 1 corte grátis) e agendamento rápido.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs sm:text-sm font-display font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-[#0b0f17] border border-[#1b2535] p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, celular ou @instagram..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0f141d] border border-[#1b2535] text-xs text-white placeholder-zinc-500 outline-none focus:border-[#2563eb] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 text-xs overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
              filterType === 'todos'
                ? 'bg-[#152238] text-blue-400 border-[#2563eb]/50'
                : 'bg-[#0f141d] text-zinc-400 border-[#1b2535] hover:text-white'
            }`}
          >
            Todos ({tenantClients.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('ativos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
              filterType === 'ativos'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                : 'bg-[#0f141d] text-zinc-400 border-[#1b2535] hover:text-emerald-400'
            }`}
          >
            Ativos
          </button>

          <button
            type="button"
            onClick={() => setFilterType('fidelidade')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border ${
              filterType === 'fidelidade'
                ? 'bg-amber-500/20 text-[#f8c105] border-[#f8c105]/50'
                : 'bg-[#0f141d] text-zinc-400 border-[#1b2535] hover:text-[#f8c105]'
            }`}
          >
            Fidelidade
          </button>

          <button
            type="button"
            onClick={() => setFilterType('premiados')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer border flex items-center gap-1 ${
              filterType === 'premiados'
                ? 'bg-[#f8c105] text-black border-[#f8c105] shadow-md'
                : 'bg-[#0f141d] text-[#f8c105] border-[#f8c105]/40 hover:bg-[#f8c105]/10'
            }`}
          >
            <Gift size={12} className="stroke-[2.5]" />
            <span>Brinde Liberado ({rewardedClientsCount})</span>
          </button>
        </div>
      </div>

      {/* CLIENTS GRID */}
      {filteredClients.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#0b0f17] border border-[#1b2535] text-center space-y-2 text-zinc-400 text-xs">
          <Users size={32} className="mx-auto text-zinc-600 mb-1" />
          <p className="font-bold text-white text-sm">Nenhum cliente encontrado</p>
          <p>Tente alterar os termos da busca ou selecione outro filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((cli) => {
            const initials = getInitials(cli.name);
            const rawPhone = cli.phone.replace(/\D/g, '');
            const points = cli.fidelityPoints ?? (cli.totalVisits % 10);
            const isRewarded = Boolean(cli.hasFreeCutReward || points >= 10);
            const igHandle = cli.instagram || `@${cli.name.toLowerCase().replace(/\s+/g, '')}`;

            return (
              <div
                key={cli.id}
                className={`p-5 rounded-2xl border transition-all duration-200 shadow-xl space-y-3.5 text-left relative overflow-hidden ${
                  isRewarded
                    ? 'bg-gradient-to-b from-[#131a26] via-[#0c1017] to-[#1a1608] border-[#f8c105]/80 shadow-[0_0_25px_rgba(248,193,5,0.18)]'
                    : 'bg-[#0c1017] border-[#1b2535] hover:border-[#2563eb]/50'
                }`}
              >
                {/* 🎁 PROMINENT REWARD BANNER IF CLIENT HAS 10 CUTS */}
                {isRewarded && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-[#f8c105]/25 to-emerald-500/20 border border-[#f8c105] text-[#f8c105] flex items-center justify-between gap-2 shadow-sm animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#f8c105] text-black flex items-center justify-center shrink-0 font-bold">
                        <Gift size={16} />
                      </div>
                      <div>
                        <span className="font-display font-black text-xs text-white uppercase tracking-wider block">
                          🎁 GANHOU CORTE DE BRINDE!
                        </span>
                        <span className="text-[11px] text-amber-200 font-medium">
                          10 cortes concluídos na barbearia.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => redeemFreeCut(cli.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#f8c105] hover:bg-[#ffe27a] text-black text-[10px] font-display font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer shadow-md active:scale-95"
                    >
                      Resgatar
                    </button>
                  </div>
                )}

                {/* TOP HEADER: Avatar + Name + ATIVO badge + Agendar button */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-3">
                    {/* Circle Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm select-none shadow-md shrink-0 ${
                        isRewarded
                          ? 'bg-[#f8c105] text-black font-black ring-2 ring-[#f8c105]/50'
                          : 'bg-[#18397a] text-white'
                      }`}
                    >
                      {initials}
                    </div>

                    {/* Name & ATIVO pill */}
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-sm sm:text-base text-white leading-tight">
                        {cli.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#062e20] text-[#10b981] border border-[#059669]/30 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase inline-block">
                          {cli.status === 'inativo' ? 'INATIVO' : 'ATIVO'}
                        </span>
                        {isRewarded && (
                          <span className="bg-[#f8c105]/20 text-[#f8c105] border border-[#f8c105]/40 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                            10 Cortes ★
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Agendar Button (Top Right) */}
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(cli)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 border ${
                      isRewarded
                        ? 'bg-[#f8c105] hover:bg-[#ffe27a] text-black border-[#f8c105] font-black'
                        : 'bg-[#142239] hover:bg-[#2563eb] text-[#3b82f6] hover:text-white border-[#2563eb]/50'
                    }`}
                  >
                    {isRewarded ? 'Agendar c/ Brinde' : 'Agendar'}
                  </button>
                </div>

                {/* MIDDLE SECTION: Telephone + WhatsApp link + Instagram handle */}
                <div className="pt-2 border-t border-[#162030] space-y-1.5 text-xs">
                  {/* Phone + WhatsApp */}
                  <div className="flex items-center gap-3 text-zinc-300 font-mono text-[11px] sm:text-xs">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Phone size={13} className="text-zinc-400 shrink-0" />
                      <span>{cli.phone}</span>
                    </span>

                    <a
                      href={`https://wa.me/55${rawPhone}?text=${encodeURIComponent(
                        isRewarded
                          ? `Olá ${cli.name}! Passando para avisar que você completou 10 cortes na barbearia e ganhou 1 CORTE TOTALMENTE DE BRINDE! Quando gostaria de agendar o seu corte gratuito?`
                          : `Olá ${cli.name}, tudo bem? Passando para te convidar para agendar seu próximo corte na barbearia!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10b981] hover:underline flex items-center gap-1 font-sans font-semibold transition-colors"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={13} className="text-[#10b981]" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {/* Instagram handle */}
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] sm:text-xs font-mono">
                    <Instagram size={13} className="text-zinc-500 shrink-0" />
                    <span className="hover:text-zinc-200 transition-colors">{igHandle}</span>
                  </div>
                </div>

                {/* 10-STAMP VISUAL PROGRESS BAR */}
                <div className="pt-2 border-t border-[#162030] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <Award size={13} className="text-[#f8c105]" />
                      <span>Cartão Fidelidade:</span>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        isRewarded ? 'text-[#f8c105]' : 'text-zinc-300'
                      }`}
                    >
                      {points}/10 cortes {isRewarded ? '(BRINDE LIBERADO! 🎁)' : ''}
                    </span>
                  </div>

                  {/* 10 Dots Visual Track */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isStamped = i < points;
                      const isTenth = i === 9;
                      return (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            isStamped
                              ? isTenth
                                ? 'bg-[#f8c105] shadow-[0_0_8px_rgba(248,193,5,0.8)]'
                                : 'bg-emerald-400'
                              : 'bg-zinc-800'
                          }`}
                          title={`Corte ${i + 1}${isTenth ? ' (Corte de Brinde)' : ''}`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {isRewarded
                        ? '10 cortes atingidos! Ganhou o corte grátis.'
                        : `Faltam ${10 - points} corte(s) para ganhar o corte grátis.`}
                    </span>

                    {/* Quick Add Stamp Button */}
                    {!isRewarded && (
                      <button
                        type="button"
                        onClick={() => addFidelityStamp(cli.id)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer font-bold"
                      >
                        + Carimbar
                      </button>
                    )}
                  </div>
                </div>

                {/* BOTTOM METRICS: Total Gasto | Visitas */}
                <div className="pt-2 border-t border-[#162030] grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-sans">Total Gasto</span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono">
                      R$ {cli.totalSpent.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-zinc-400 block font-sans">Total de Visitas</span>
                    <span className="text-xs sm:text-sm font-bold text-[#3b82f6] font-mono">
                      {cli.totalVisits} cortes
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CADASTRAR NOVO CLIENTE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0b0f17] border border-[#1b2535] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2535]">
              <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                Cadastrar Novo Cliente
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#0f141d] hover:bg-[#151c28] text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Nome do Cliente:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ruan Gabriel"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">WhatsApp / Celular com DDD:</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (47) 99999-9999"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Instagram (opcional):</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@ruan.corte"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Corte / Serviço Favorito:</label>
                <select
                  value={favoriteService}
                  onChange={(e) => setFavoriteService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                >
                  {currentTenant.services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f141d] hover:bg-[#161f30] text-zinc-400 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold cursor-pointer shadow-lg"
                >
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AGENDAMENTO RÁPIDO PARA O CLIENTE */}
      {bookingClient && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0b0f17] border border-[#1b2535] rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2535]">
              <div>
                <h3 className="font-display font-black text-sm uppercase text-white tracking-wider">
                  Agendar para {bookingClient.name}
                </h3>
                <span className="text-[11px] text-zinc-400 font-mono">{bookingClient.phone}</span>
              </div>
              <button
                type="button"
                onClick={() => setBookingClient(null)}
                className="w-7 h-7 rounded-lg bg-[#0f141d] hover:bg-[#151c28] text-zinc-400 flex items-center justify-center cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* 🎁 Callout if client has free cut reward available */}
            {(bookingClient.hasFreeCutReward || (bookingClient.fidelityPoints && bookingClient.fidelityPoints >= 10)) && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-[#f8c105] text-[#f8c105] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Gift size={15} />
                  <span>10 Cortes Concluídos — Brinde Liberado!</span>
                </div>
                <p className="text-[11px] text-amber-200 leading-snug">
                  Este cliente atingiu a meta de 10 cortes e possui direito a 1 corte de brinde totalmente gratuito.
                </p>
                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={applyFreeCutInBooking}
                    onChange={(e) => setApplyFreeCutInBooking(e.target.checked)}
                    className="w-4 h-4 rounded text-[#f8c105] accent-[#f8c105] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-white">
                    Aplicar Corte de Brinde (R$ 0,00)
                  </span>
                </label>
              </div>
            )}

            <form onSubmit={handleQuickBooking} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-zinc-300">Serviço:</label>
                <select
                  value={bookingServiceId}
                  onChange={(e) => setBookingServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                >
                  {currentTenant.services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {applyFreeCutInBooking ? 'GRÁTIS (R$ 0,00 - Brinde)' : `R$ ${s.price.toFixed(2).replace('.', ',')}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Dia:</label>
                  <select
                    value={bookingDay}
                    onChange={(e) => setBookingDay(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none"
                  >
                    <option value="Hoje">Hoje</option>
                    <option value="Amanhã">Amanhã</option>
                    <option value="Sexta-feira">Sexta-feira</option>
                    <option value="Sábado">Sábado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Horário:</label>
                  <input
                    type="text"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="14:00"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f141d] border border-[#1b2535] focus:border-[#2563eb] text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setBookingClient(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0f141d] hover:bg-[#161f30] text-zinc-400 font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-xl font-bold cursor-pointer shadow-lg transition-all ${
                    applyFreeCutInBooking
                      ? 'bg-[#f8c105] hover:bg-[#ffe27a] text-black font-black uppercase'
                      : 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white'
                  }`}
                >
                  {applyFreeCutInBooking ? 'Confirmar Corte Grátis' : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

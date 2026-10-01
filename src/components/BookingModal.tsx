import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  Clock,
  Scissors,
  Sparkles,
  User,
  X,
  AlertTriangle,
  Send,
  CheckCircle2,
  QrCode,
  CreditCard,
  ShieldCheck,
  Copy,
  AlertCircle,
  RefreshCw,
  Phone,
} from 'lucide-react';
import { useSaaS } from '../context/SaaSContext';
import { ServiceItem } from '../types';
import {
  checkSlotAvailability,
  calculateServicesDuration,
  calculateEndTime,
  formatDurationFriendly,
} from '../utils/bookingAvailability';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = 'service' | 'datetime' | 'client-data' | 'payment' | 'success';

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const { currentTenant, addAppointment, appointments, showNotification } = useSaaS();

  const [selectedServices, setSelectedServices] = useState<string[]>(['degrade']);
  const [selectedDay, setSelectedDay] = useState<string>('Hoje');
  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  const [selectedProfessional, setSelectedProfessional] = useState<string>(
    currentTenant.professionals[0]?.name || currentTenant.barbeiro
  );
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [step, setStep] = useState<BookingStep>('service');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Cartão' | 'Dinheiro'>('Pix');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [confirmedPaymentStatus, setConfirmedPaymentStatus] = useState<'PAGO' | 'PENDENTE'>('PAGO');
  const [createdAptId, setCreatedAptId] = useState<string | null>(null);
  const [createdAptEndTime, setCreatedAptEndTime] = useState<string>('15:45');
  const [isCopiedPix, setIsCopiedPix] = useState<boolean>(false);

  // Days list (Segunda a Sábado)
  const days = [
    { label: 'Hoje', sub: 'Mais Rápido' },
    { label: 'Amanhã', sub: 'Recomendado' },
    { label: 'Segunda-feira', sub: 'Seg' },
    { label: 'Terça-feira', sub: 'Ter' },
    { label: 'Quarta-feira', sub: 'Qua' },
    { label: 'Quinta-feira', sub: 'Qui' },
    { label: 'Sexta-feira', sub: 'Sex' },
    { label: 'Sábado', sub: 'Sáb' },
  ];

  // Available Standard Time Slots
  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
  ];

  const activeServices = currentTenant.services.filter((s) => s.isActive !== false);

  const toggleService = (id: string) => {
    if (id === 'combo-completo') {
      setSelectedServices(['combo-completo']);
      return;
    }

    if (selectedServices.includes('combo-completo')) {
      setSelectedServices([id]);
      return;
    }

    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const selectedItems: ServiceItem[] = activeServices.filter((s) =>
    selectedServices.includes(s.id)
  );

  const totalPrice = selectedItems.reduce((acc, curr) => acc + curr.price, 0);

  // Total duration in minutes derived from the selected services
  const currentDurationMinutes = useMemo(() => {
    return calculateServicesDuration(selectedServices, activeServices);
  }, [selectedServices, activeServices]);

  // Estimated end time for current selected slot
  const currentEndTimeSlot = useMemo(() => {
    return calculateEndTime(selectedTime, currentDurationMinutes);
  }, [selectedTime, currentDurationMinutes]);

  // Selected professional object
  const currentProfessionalObj = useMemo(() => {
    return (
      currentTenant.professionals.find((p) => p.name === selectedProfessional) ||
      currentTenant.professionals[0]
    );
  }, [currentTenant.professionals, selectedProfessional]);

  // Simulated dynamic Pix payload for payment
  const pixKey = currentTenant.whatsappNumber || '47996239122';
  const pixCopyCode = useMemo(() => {
    const cleanPhone = pixKey.replace(/\D/g, '');
    const amountStr = totalPrice.toFixed(2);
    return `00020126580014BR.GOV.BCB.PIX0114${cleanPhone}520400005303986540${amountStr.length}${amountStr}5802BR5913${currentTenant.name.slice(0, 13)}6009ITAJAI62070503***6304`;
  }, [pixKey, totalPrice, currentTenant.name]);

  const handleCopyPix = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pixCopyCode);
      setIsCopiedPix(true);
      showNotification('Código Pix Copia e Cola copiado com sucesso!', 'success');
      setTimeout(() => setIsCopiedPix(false), 3000);
    }
  };

  // Helper to commit the booking
  const commitBooking = (paymentStatus: 'PAGO' | 'PENDENTE', method: 'Pix' | 'Cartão' | 'Dinheiro') => {
    const servicesNames = selectedItems.map((s) => s.name).join(' + ');

    // Register into SaaS appointments
    const newApt = addAppointment({
      tenantId: currentTenant.id,
      clientName: clientName.trim() || 'Cliente Presencial',
      clientPhone: clientPhone.trim() || currentTenant.phone,
      services: selectedServices,
      serviceNames: servicesNames,
      professionalId: currentProfessionalObj?.id || 'prof-1',
      professionalName: selectedProfessional,
      dayLabel: selectedDay,
      timeSlot: selectedTime,
      endTimeSlot: currentEndTimeSlot,
      durationMinutes: currentDurationMinutes,
      totalPrice,
      paymentStatus,
      paymentMethod: method,
      status: paymentStatus === 'PAGO' ? 'confirmado' : 'pendente',
    });

    setCreatedAptId(newApt.id);
    setCreatedAptEndTime(currentEndTimeSlot);
    setConfirmedPaymentStatus(paymentStatus);
    setStep('success');
  };

  // ACTION: CONFIRMED PAYMENT (PAGO)
  const handleConfirmPaidBooking = (method: 'Pix' | 'Cartão') => {
    setIsProcessingPayment(true);
    setPaymentMethod(method);

    // Simulate instant secure transaction confirmation
    setTimeout(() => {
      setIsProcessingPayment(false);
      commitBooking('PAGO', method);
      showNotification(
        `Pagamento de R$ ${totalPrice.toFixed(2).replace('.', ',')} APROVADO! Horário garantido.`,
        'success'
      );
    }, 1200);
  };

  // ACTION: PENDING PAYMENT (No immediate online payment)
  const handleConfirmPendingBooking = () => {
    commitBooking('PENDENTE', 'Dinheiro');
    showNotification(
      'Agendamento registrado como PENDENTE. O horário será garantido após confirmação do pagamento.',
      'info'
    );
  };

  const handleOpenWhatsApp = () => {
    const servicesNames = selectedItems.map((s) => s.name).join(' + ');
    const isPaid = confirmedPaymentStatus === 'PAGO';
    const msg = `Olá! Realizei meu agendamento na *${currentTenant.name}*:

✂️ *Serviço:* ${servicesNames}
💰 *Valor:* R$ ${totalPrice.toFixed(2).replace('.', ',')}
💳 *Status Pagamento:* ${isPaid ? '✅ PAGO (Confirmado)' : '⏳ PENDENTE (Aguardando)'}
📅 *Dia:* ${selectedDay}
⏰ *Horário:* ${selectedTime} às ${createdAptEndTime} (${formatDurationFriendly(currentDurationMinutes)})
💈 *Profissional:* ${selectedProfessional}
👤 *Cliente:* ${clientName || 'Cliente'}
📱 *WhatsApp:* ${clientPhone || currentTenant.phone}

${isPaid ? 'Meu horário já está garantido na agenda!' : 'Gostaria de confirmar os detalhes do pagamento.'}`;

    const url = `https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    handleClose();
  };

  const handleClose = () => {
    setStep('service');
    setIsProcessingPayment(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 overflow-hidden select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 340 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-[#f8c105]/60 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="bg-[#f8c105] p-3.5 sm:p-4 flex items-center justify-between text-black border-b border-[#f8c105]">
            <div className="flex items-center gap-2">
              {step !== 'service' && step !== 'success' && currentTenant.miniCentralAtiva && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 'payment') setStep('client-data');
                    else if (step === 'client-data') setStep('datetime');
                    else if (step === 'datetime') setStep('service');
                  }}
                  className="w-7 h-7 rounded-lg bg-black/15 hover:bg-black/30 text-black flex items-center justify-center transition-all cursor-pointer mr-1"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <div className="w-6 h-6 rounded-full bg-black text-[#f8c105] flex items-center justify-center font-black text-xs shrink-0">
                <Scissors size={13} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-wide leading-tight">
                  AGENDAR HORÁRIO — {currentTenant.name}
                </h3>
                <p className="text-[10px] text-black/80 font-medium">
                  {currentTenant.neighborhood} — {currentTenant.city}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/30 flex items-center justify-center transition-all text-black cursor-pointer font-bold"
            >
              <X size={18} />
            </button>
          </div>

          {/* RULE: If miniCentralAtiva is FALSE, block booking and show notice */}
          {!currentTenant.miniCentralAtiva ? (
            <div className="p-6 sm:p-8 space-y-5 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                <AlertTriangle size={28} />
              </div>

              <div className="space-y-2">
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Agendamentos Online Suspensos
                </span>
                <h4 className="font-display font-extrabold text-white text-base sm:lg">
                  Mini Central Temporariamente em Pausa
                </h4>
                <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                  A agenda online da <strong className="text-white">{currentTenant.name}</strong> está temporariamente desativada pela administração. Para agendamentos presenciais ou encaixes, fale conosco pelo WhatsApp:
                </p>
              </div>

              <div className="w-full pt-2 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${currentTenant.whatsappNumber}?text=${encodeURIComponent(`Olá! Vi na Mini Central da ${currentTenant.name} que o agendamento online está pausado. Tem algum horário disponível para corte?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send size={15} />
                  <span>Consultar Horário no WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
                >
                  Voltar para a Página
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stepper Progress Bar (Reflecting the exact business flow) */}
              {step !== 'success' && (
                <div className="bg-zinc-900 border-b border-zinc-800 px-3 sm:px-4 py-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400 overflow-x-auto gap-1">
                  <span
                    className={`flex items-center gap-1 font-bold shrink-0 ${
                      step === 'service' ? 'text-[#f8c105]' : 'text-zinc-400'
                    }`}
                  >
                    1. Serviços
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span
                    className={`flex items-center gap-1 font-bold shrink-0 ${
                      step === 'datetime' ? 'text-[#f8c105]' : 'text-zinc-400'
                    }`}
                  >
                    2. Barbeiro & Horário
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span
                    className={`flex items-center gap-1 font-bold shrink-0 ${
                      step === 'client-data' ? 'text-[#f8c105]' : 'text-zinc-400'
                    }`}
                  >
                    3. Seus Dados
                  </span>
                  <span className="text-zinc-600">→</span>
                  <span
                    className={`flex items-center gap-1 font-bold shrink-0 ${
                      step === 'payment' ? 'text-[#f8c105]' : 'text-zinc-400'
                    }`}
                  >
                    4. Pagamento
                  </span>
                </div>
              )}

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-left">
                {/* STEP 1: SELECT SERVICES */}
                {step === 'service' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105]">
                        Escolha um ou mais serviços:
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        Total: R$ {totalPrice.toFixed(2).replace('.', ',')} ({formatDurationFriendly(currentDurationMinutes)})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {activeServices.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-[#f8c105]/15 border-[#f8c105] shadow-[0_0_15px_rgba(248,193,5,0.2)]'
                                : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                                  isSelected
                                    ? 'bg-[#f8c105] text-black border-[#f8c105]'
                                    : 'border-zinc-700 bg-zinc-800 text-transparent'
                                }`}
                              >
                                <Check size={12} className="stroke-[3]" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-display font-extrabold text-xs sm:text-sm text-white">
                                    {service.name}
                                  </h4>
                                  {service.isPopular && (
                                    <span className="bg-[#f8c105] text-black text-[9px] font-black uppercase px-1.5 py-0.2 rounded-sm inline-flex items-center gap-0.5">
                                      <Sparkles size={9} /> Destaque
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug line-clamp-1">
                                  {service.description}
                                </p>
                                <span className="text-[10px] text-zinc-500 font-mono mt-0.5 inline-block">
                                  ⏱ Duração: {service.duration}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-black text-sm sm:text-base text-[#f8c105]">
                                R$ {service.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: PROFESSIONAL, DATE & TIME (Derived from existing bookings with duration overlap) */}
                {step === 'datetime' && (
                  <div className="space-y-4">
                    {/* Professional Selection */}
                    <div>
                      <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block mb-2">
                        Escolha o Barbeiro / Profissional:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(currentTenant.professionals.filter((p) => p.isActive !== false && p.acceptsBooking !== false).length > 0
                          ? currentTenant.professionals.filter((p) => p.isActive !== false && p.acceptsBooking !== false)
                          : currentTenant.professionals
                        ).map((prof) => (
                          <button
                            key={prof.id}
                            type="button"
                            onClick={() => setSelectedProfessional(prof.name)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                              selectedProfessional === prof.name
                                ? 'bg-[#f8c105] text-black border-[#f8c105] font-black shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                                selectedProfessional === prof.name
                                  ? 'bg-black text-[#f8c105]'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              <User size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold leading-tight">{prof.name}</p>
                              <p
                                className={`text-[10px] ${
                                  selectedProfessional === prof.name
                                    ? 'text-black/80 font-medium'
                                    : 'text-zinc-500'
                                }`}
                              >
                                {prof.role}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Day Selection */}
                    <div>
                      <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block mb-2">
                        Escolha o Dia do Atendimento:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {days.map((d) => (
                          <button
                            key={d.label}
                            type="button"
                            onClick={() => setSelectedDay(d.label)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              selectedDay === d.label
                                ? 'bg-[#f8c105] text-black border-[#f8c105] font-black shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 font-medium'
                            }`}
                          >
                            <p className="text-xs">{d.label}</p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                selectedDay === d.label ? 'text-black/80' : 'text-zinc-500'
                              }`}
                            >
                              {d.sub}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Selection with Overlap & Payment Status Verification */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block">
                          Horários Disponíveis ({formatDurationFriendly(currentDurationMinutes)} de duração):
                        </label>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {selectedDay} • {selectedProfessional}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {timeSlots.map((time) => {
                          const availability = checkSlotAvailability({
                            tenantId: currentTenant.id,
                            professionalName: selectedProfessional,
                            professionalId: currentProfessionalObj?.id,
                            dayLabel: selectedDay,
                            timeSlot: time,
                            durationMinutes: currentDurationMinutes,
                            appointments,
                          });

                          const isOccupied = !availability.isAvailable;
                          const isCurrentSelected = selectedTime === time && !isOccupied;

                          return (
                            <button
                              key={time}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => setSelectedTime(time)}
                              title={
                                isOccupied
                                  ? availability.conflictReason || 'Horário já reservado (PAGO)'
                                  : `Disponível (${time} às ${calculateEndTime(time, currentDurationMinutes)})`
                              }
                              className={`py-2 px-1.5 rounded-lg border text-center font-mono text-xs transition-all flex flex-col items-center justify-center min-h-[46px] ${
                                isOccupied
                                  ? 'bg-zinc-950/70 border-zinc-900 text-zinc-600 line-through cursor-not-allowed opacity-50'
                                  : isCurrentSelected
                                  ? 'bg-[#f8c105] text-black border-[#f8c105] font-black shadow-md cursor-pointer ring-2 ring-[#f8c105]/50'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 cursor-pointer'
                              }`}
                            >
                              <span className="leading-tight font-bold">{time}</span>
                              <span className="text-[9px] mt-0.5 opacity-80">
                                {isOccupied ? 'Ocupado' : 'Livre'}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Info on selected slot */}
                      <div className="mt-2.5 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
                        <span>Horário Escolhido:</span>
                        <strong className="text-[#f8c105]">
                          {selectedTime} às {currentEndTimeSlot} ({formatDurationFriendly(currentDurationMinutes)})
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: CLIENT DATA (NO CPF REQUIRED!) */}
                {step === 'client-data' && (
                  <div className="space-y-4">
                    {/* Summary Card */}
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-[#f8c105]/30 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800">
                        <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                          Resumo da Sua Reserva
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {currentTenant.name}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-zinc-300">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Serviços:</span>
                          <span className="font-extrabold text-white text-right">
                            {selectedItems.map((s) => s.name).join(' + ')}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-zinc-400">Data & Horário:</span>
                          <span className="font-bold text-[#f8c105]">
                            {selectedDay} às {selectedTime} ({formatDurationFriendly(currentDurationMinutes)})
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-zinc-400">Barbeiro:</span>
                          <span className="font-bold text-white">{selectedProfessional}</span>
                        </div>

                        <div className="flex justify-between pt-1.5 border-t border-zinc-800 text-sm">
                          <span className="font-extrabold text-white uppercase">Valor do Atendimento:</span>
                          <span className="font-mono font-black text-[#f8c105] text-base">
                            R$ {totalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Client Input: NAME + PHONE ONLY (No CPF!) */}
                    <div className="space-y-3">
                      <label className="text-xs uppercase font-extrabold tracking-wider text-[#f8c105] block">
                        Informe seus dados para contato:
                      </label>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-300 block">Nome Completo:</label>
                        <div className="relative">
                          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="text"
                            required
                            placeholder="Seu nome completo"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-zinc-300 block">WhatsApp / Celular com DDD:</label>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            type="tel"
                            required
                            placeholder="Ex: 47 99999-9999"
                            value={clientPhone}
                            onChange={(e) => setClientPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white text-xs sm:text-sm outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-500 font-sans">
                        🔒 Sem burocracia ou exigência de CPF. Seus dados são usados apenas para seu agendamento na barbearia.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: PAYMENT (PAGAMENTO E CONFIRMAÇÃO DO HORÁRIO) */}
                {step === 'payment' && (
                  <div className="space-y-4">
                    {/* Amount & Status Badge */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-[#f8c105]/50 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 block w-fit mb-1">
                          Aguardando Pagamento
                        </span>
                        <h4 className="font-display font-black text-white text-sm sm:text-base uppercase">
                          Pagamento do Agendamento
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          {selectedItems.map((s) => s.name).join(' + ')} • {selectedTime} às {currentEndTimeSlot}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-black text-xl sm:text-2xl text-[#f8c105]">
                          R$ {totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[10px] text-zinc-400 block font-mono">Total a Pagar</span>
                      </div>
                    </div>

                    {/* Method Selector: Pix vs Cartão */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Pix')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          paymentMethod === 'Pix'
                            ? 'bg-[#f8c105]/15 border-[#f8c105] text-[#f8c105] font-bold shadow-md'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <QrCode size={20} />
                        <span className="text-xs uppercase font-extrabold tracking-wider">Pix Imediato</span>
                        <span className="text-[9px] text-emerald-400 font-mono">Liberação Imediata</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Cartão')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          paymentMethod === 'Cartão'
                            ? 'bg-[#f8c105]/15 border-[#f8c105] text-[#f8c105] font-bold shadow-md'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <CreditCard size={20} />
                        <span className="text-xs uppercase font-extrabold tracking-wider">Cartão Online</span>
                        <span className="text-[9px] text-zinc-400 font-mono">Crédito ou Débito</span>
                      </button>
                    </div>

                    {/* Pix Details */}
                    {paymentMethod === 'Pix' && (
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            Pagamento Seguro via Pix
                          </span>
                          <span className="text-[10px] font-mono text-[#f8c105]">
                            Chave: {currentTenant.phone}
                          </span>
                        </div>

                        {/* Pix Copia e Cola Box */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                            Código Pix Copia e Cola:
                          </label>
                          <div className="p-2.5 bg-black/60 border border-zinc-800 rounded-lg font-mono text-[11px] text-zinc-300 break-all select-all flex items-center justify-between gap-2">
                            <span className="truncate">{pixCopyCode}</span>
                            <button
                              type="button"
                              onClick={handleCopyPix}
                              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-[#f8c105] rounded text-[10px] font-bold uppercase shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Copy size={11} />
                              <span>{isCopiedPix ? 'Copiado!' : 'Copiar'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Action: Confirm Pix Payment */}
                        <button
                          type="button"
                          disabled={isProcessingPayment}
                          onClick={() => handleConfirmPaidBooking('Pix')}
                          className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          {isProcessingPayment ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              <span>Confirmando Pagamento Pix...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} className="stroke-[2.5]" />
                              <span>Confirmar Pagamento Pix (R$ {totalPrice.toFixed(2).replace('.', ',')})</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Card Details */}
                    {paymentMethod === 'Cartão' && (
                      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                        <div className="text-xs text-zinc-300 space-y-1">
                          <span className="font-bold text-white block">Pagamento com Cartão</span>
                          <p className="text-[11px] text-zinc-400">
                            Simule a aprovação imediata do pagamento via cartão para confirmação e bloqueio automático do horário.
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isProcessingPayment}
                          onClick={() => handleConfirmPaidBooking('Cartão')}
                          className="w-full py-3.5 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(248,193,5,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          {isProcessingPayment ? (
                            <>
                              <RefreshCw size={16} className="animate-spin" />
                              <span>Processando Cartão...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard size={16} />
                              <span>Pagar com Cartão (R$ {totalPrice.toFixed(2).replace('.', ',')})</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Alternative: Pagar no Local (Status: PENDENTE) */}
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                      <div className="flex items-start gap-2 text-zinc-400 text-[11px]">
                        <AlertCircle size={15} className="shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <span className="font-bold text-zinc-300 block">Prefere pagar presencialmente?</span>
                          <p className="text-[10px] text-zinc-500 leading-snug">
                            Agendamentos sem pagamento online imediato permanecem como <strong>PENDENTE</strong>. O horário só é garantido de forma definitiva após a confirmação pela barbearia.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmPendingBooking}
                        className="w-full py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-bold uppercase transition-colors cursor-pointer"
                      >
                        Concluir Agendamento como PENDENTE
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: SUCCESS / CONFIRMATION SCREEN */}
                {step === 'success' && (
                  <div className="space-y-4 py-2 text-center flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl ${
                        confirmedPaymentStatus === 'PAGO'
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                          : 'bg-amber-500/15 border border-amber-500/40 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                      }`}
                    >
                      {confirmedPaymentStatus === 'PAGO' ? (
                        <CheckCircle2 size={36} />
                      ) : (
                        <Clock size={36} />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          confirmedPaymentStatus === 'PAGO'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {confirmedPaymentStatus === 'PAGO'
                          ? 'Pagamento Confirmado — PAGO'
                          : 'Agendamento Registrado — PENDENTE'}
                      </span>

                      <h4 className="font-display font-extrabold text-white text-lg">
                        {confirmedPaymentStatus === 'PAGO'
                          ? 'Horário Reservado e Garantido!'
                          : 'Aguardando Confirmação do Pagamento'}
                      </h4>

                      <p className="text-xs text-zinc-300 max-w-sm">
                        {confirmedPaymentStatus === 'PAGO' ? (
                          <>
                            Obrigado, <strong className="text-white">{clientName || 'Cliente'}</strong>! Seu horário está 100% garantido e ocupado na agenda de <strong className="text-[#f8c105]">{selectedProfessional}</strong>.
                          </>
                        ) : (
                          <>
                            Olá, <strong className="text-white">{clientName || 'Cliente'}</strong>! Seu horário foi pré-registrado. Para garantir o horário em definitivo, efetue o pagamento com a barbearia.
                          </>
                        )}
                      </p>
                    </div>

                    {/* Detailed Card */}
                    <div className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-left">
                      <div className="flex justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Status do Pagamento:</span>
                        <span
                          className={`font-mono font-bold uppercase ${
                            confirmedPaymentStatus === 'PAGO' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          ● {confirmedPaymentStatus} ({paymentMethod})
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Dia & Horário:</span>
                        <span className="font-bold text-[#f8c105]">
                          {selectedDay} às {selectedTime} até {createdAptEndTime}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Barbeiro:</span>
                        <span className="font-bold text-white">{selectedProfessional}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Serviço:</span>
                        <span className="font-bold text-white">
                          {selectedItems.map((s) => s.name).join(' + ')} ({formatDurationFriendly(currentDurationMinutes)})
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-sm font-bold">
                        <span className="text-zinc-400 uppercase">Valor Total:</span>
                        <span className="font-mono text-[#f8c105]">
                          R$ {totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>

                    <div className="w-full pt-2 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={handleOpenWhatsApp}
                        className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Send size={15} />
                        <span>Enviar Comprovante pelo WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-zinc-800"
                      >
                        Concluir e Voltar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              {step !== 'success' && (
                <div className="p-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between gap-3">
                  {step === 'service' && (
                    <button
                      type="button"
                      onClick={() => setStep('datetime')}
                      disabled={selectedServices.length === 0}
                      className="w-full py-3 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffd700] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(248,193,5,0.3)] active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      Continuar para Barbeiro e Horário →
                    </button>
                  )}

                  {step === 'datetime' && (
                    <button
                      type="button"
                      onClick={() => setStep('client-data')}
                      className="w-full py-3 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffd700] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(248,193,5,0.3)] active:scale-95 cursor-pointer"
                    >
                      Continuar para Seus Dados →
                    </button>
                  )}

                  {step === 'client-data' && (
                    <button
                      type="button"
                      onClick={() => setStep('payment')}
                      disabled={!clientName.trim() || !clientPhone.trim()}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_4px_18px_rgba(248,193,5,0.3)] active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      <span>Ir para Pagamento (R$ {totalPrice.toFixed(2).replace('.', ',')}) →</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

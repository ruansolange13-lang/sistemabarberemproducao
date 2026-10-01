import { useState } from 'react';
import {
  Scissors,
  Plus,
  Check,
  X,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { ServiceItem } from '../../types';
import ServiceDrawer from './ServiceDrawer';

export default function BarberServices() {
  const { currentTenant, updateCurrentTenant, showNotification } = useSaaS();
  const [services, setServices] = useState<ServiceItem[]>([...currentTenant.services]);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);

  // Sync state if currentTenant.services changes
  const activeCount = services.filter((s) => s.isActive !== false).length;

  const handleOpenCreate = () => {
    setServiceToEdit(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (service: ServiceItem) => {
    setServiceToEdit(service);
    setIsDrawerOpen(true);
  };

  const handleSaveService = (savedService: ServiceItem) => {
    let updated: ServiceItem[];
    const exists = services.some((s) => s.id === savedService.id);

    if (exists) {
      updated = services.map((s) => (s.id === savedService.id ? savedService : s));
      showNotification(`Serviço "${savedService.name}" atualizado com sucesso!`, 'success');
    } else {
      updated = [...services, savedService];
      showNotification(`Novo serviço "${savedService.name}" adicionado com sucesso!`, 'success');
    }

    setServices(updated);
    updateCurrentTenant({ services: updated });
  };

  const toggleActive = (id: string) => {
    const updated = services.map((s) =>
      s.id === id ? { ...s, isActive: s.isActive === false ? true : false } : s
    );
    setServices(updated);
    updateCurrentTenant({ services: updated });
    const target = services.find((s) => s.id === id);
    const nextState = target?.isActive === false;
    showNotification(
      `Serviço "${target?.name}" agora está ${nextState ? 'ATIVO' : 'OCULTO'} na Mini Central!`,
      'info'
    );
  };

  const handleDelete = (id: string, srvName: string) => {
    if (services.length <= 1) {
      showNotification('Você deve manter ao menos um serviço cadastrado na barbearia.', 'error');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o serviço "${srvName}"?`)) {
      const updated = services.filter((s) => s.id !== id);
      setServices(updated);
      updateCurrentTenant({ services: updated });
      showNotification(`Serviço "${srvName}" removido com sucesso.`, 'info');
    }
  };

  // REORDERING LOGIC: MOVE UP
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const copy = [...services];
    const item = copy[index];
    copy[index] = copy[index - 1];
    copy[index - 1] = item;

    setServices(copy);
    updateCurrentTenant({ services: copy });
    showNotification(`"${item.name}" movido para a posição #${index}!`, 'success');
  };

  // REORDERING LOGIC: MOVE DOWN
  const handleMoveDown = (index: number) => {
    if (index === services.length - 1) return;
    const copy = [...services];
    const item = copy[index];
    copy[index] = copy[index + 1];
    copy[index + 1] = item;

    setServices(copy);
    updateCurrentTenant({ services: copy });
    showNotification(`"${item.name}" movido para a posição #${index + 2}!`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
              Serviços & Preços
            </h2>
            <span className="text-[10px] font-mono font-bold bg-[#f8c105]/15 text-[#f8c105] px-2.5 py-0.5 rounded-full border border-[#f8c105]/30">
              {activeCount} Ativos na Mini Central
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Cadastre, edite e altere a ordem dos serviços exibidos na sua Mini Central pública.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Services List with Reorder Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1 font-mono">
          <span>Ordem de exibição na Mini Central (use as setas para mover):</span>
          <span>{services.length} serviços no total</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {services.map((srv, index) => {
            const isActive = srv.isActive !== false;
            const isFirst = index === 0;
            const isLast = index === services.length - 1;
            const serviceColor = srv.color || '#2563eb';

            return (
              <div
                key={srv.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden ${
                  isActive
                    ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 shadow-md'
                    : 'bg-zinc-950/50 border-zinc-900 opacity-60'
                }`}
              >
                {/* Left vertical color accent stripe */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: serviceColor }}
                />

                {/* Left Info & Reorder handle */}
                <div className="flex items-start sm:items-center gap-3 pl-1">
                  {/* Position Badge & Up/Down Arrows */}
                  <div className="flex flex-col items-center justify-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMoveUp(index)}
                      title={isFirst ? 'Primeira posição' : 'Mover para cima'}
                      className={`w-7 h-6 rounded flex items-center justify-center transition-colors ${
                        isFirst
                          ? 'text-zinc-700 cursor-not-allowed'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer'
                      }`}
                    >
                      <ArrowUp size={14} className="stroke-[2.5]" />
                    </button>

                    <span className="text-[11px] font-mono font-black text-[#f8c105]">
                      #{index + 1}
                    </span>

                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMoveDown(index)}
                      title={isLast ? 'Última posição' : 'Mover para baixo'}
                      className={`w-7 h-6 rounded flex items-center justify-center transition-colors ${
                        isLast
                          ? 'text-zinc-700 cursor-not-allowed'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-800 cursor-pointer'
                      }`}
                    >
                      <ArrowDown size={14} className="stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Thumbnail / Icon */}
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden shrink-0">
                    {srv.imageUrl ? (
                      <img
                        src={srv.imageUrl}
                        alt={srv.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: serviceColor }}
                      >
                        <Scissors size={16} />
                      </div>
                    )}
                  </div>

                  {/* Service Text Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-black text-sm sm:text-base text-white">
                        {srv.name}
                      </h4>
                      {srv.isPopular && (
                        <span className="bg-[#f8c105] text-black text-[9px] font-black uppercase px-1.5 py-0.2 rounded-sm inline-flex items-center gap-0.5">
                          <Sparkles size={9} /> Destaque
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border ${
                          isActive
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        {isActive ? '● Ativo' : '○ Oculto'}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1">{srv.description}</p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                      <span>⏱ {srv.duration}</span>
                      {srv.allowedProfessionals && srv.allowedProfessionals.length > 0 && (
                        <span>
                          👥 {srv.allowedProfessionals.length} prof.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Price & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-900">
                  <div className="text-left md:text-right mr-2">
                    <span className="font-mono font-black text-lg sm:text-xl text-[#f8c105] block">
                      R$ {srv.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Toggle Visibility button */}
                    <button
                      type="button"
                      onClick={() => toggleActive(srv.id)}
                      title={isActive ? 'Ocultar da Mini Central' : 'Ativar na Mini Central'}
                      className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                          : 'bg-[#f8c105]/15 border-[#f8c105]/30 text-[#f8c105]'
                      }`}
                    >
                      {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      <span className="hidden sm:inline">
                        {isActive ? 'Ocultar' : 'Ativar'}
                      </span>
                    </button>

                    {/* Edit button -> opens drawer */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(srv)}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Edit2 size={13} />
                      <span>Alterar</span>
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(srv.id, srv.name)}
                      title="Excluir serviço"
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-over Drawer for Creating/Editing Service */}
      <ServiceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        serviceToEdit={serviceToEdit}
        onSave={handleSaveService}
        allServices={services}
        professionals={currentTenant.professionals}
      />
    </div>
  );
}

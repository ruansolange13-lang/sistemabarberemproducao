import { useState } from 'react';
import {
  Save,
  Image as ImageIcon,
  Share2,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Instagram,
  Clock,
  MapPin,
  Sparkles,
  Phone,
  Video,
  FileText,
  AlertCircle,
  Eye,
  GripVertical,
  Move,
  ChevronLeft,
  ChevronRight,
  Crop,
  HelpCircle,
} from 'lucide-react';
import { useSaaS } from '../../context/SaaSContext';
import { CutImage } from '../../types';
import CutCropPositionModal from './CutCropPositionModal';

export default function BarberMiniCentralEditor() {
  const { currentTenant, updateCurrentTenant, setCurrentView, showNotification } = useSaaS();

  const [formData, setFormData] = useState({
    name: currentTenant.name,
    tagline: currentTenant.tagline || '',
    description: currentTenant.description || '',
    barbeiro: currentTenant.barbeiro,
    responsavel: currentTenant.responsavel,
    phone: currentTenant.phone,
    whatsappFormatted: currentTenant.whatsappFormatted,
    whatsappNumber: currentTenant.whatsappNumber,
    instagram: currentTenant.instagram,
    instagramUrl: currentTenant.instagramUrl,
    address: currentTenant.address,
    neighborhood: currentTenant.neighborhood,
    city: currentTenant.city,
    hours: currentTenant.hours,
    logoUrl: currentTenant.logoUrl || '',
    bannerUrl: currentTenant.bannerUrl || '',
  });

  const [cuts, setCuts] = useState<CutImage[]>([...currentTenant.cuts]);
  const [activeSection, setActiveSection] = useState<'geral' | 'fotos' | 'videos' | 'contato' | 'horarios'>('geral');
  const [newCutUrl, setNewCutUrl] = useState('');
  const [newCutTitle, setNewCutTitle] = useState('');

  // Drag-and-drop state for reordering cuts
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Crop / focal position adjustment modal
  const [cutToCrop, setCutToCrop] = useState<CutImage | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentTenant({
      ...formData,
      cuts,
    });
    showNotification('Configurações da Mini Central salvas com sucesso!', 'success');
  };

  const handleAddCut = () => {
    if (!newCutUrl.trim()) return;
    const newCut: CutImage = {
      id: `cut-${Date.now()}`,
      title: newCutTitle.trim() || 'Corte Estilo Lupumba',
      subtitle: 'Foto adicionada pelo proprietário',
      category: 'Corte / Estilo',
      imageUrl: newCutUrl.trim(),
      alt: 'Foto de corte da barbearia',
      objectPosition: '50% 50%',
      scale: 1,
    };
    setCuts([...cuts, newCut]);
    setNewCutUrl('');
    setNewCutTitle('');
    showNotification('Foto adicionada à galeria!', 'success');
  };

  const handleRemoveCut = (id: string) => {
    setCuts(cuts.filter((c) => c.id !== id));
    showNotification('Foto removida da galeria.', 'info');
  };

  // Drag and drop reordering handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...cuts];
    const [removed] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, removed);
    setCuts(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    showNotification(`Corte reposicionado com sucesso para a Posição #${targetIndex + 1}!`, 'success');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveCut = (currentIndex: number, direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= cuts.length) return;
    const updated = [...cuts];
    const [removed] = updated.splice(currentIndex, 1);
    updated.splice(targetIndex, 0, removed);
    setCuts(updated);
    showNotification(`Corte movido para a Posição #${targetIndex + 1}!`, 'info');
  };

  const handleOpenCropModal = (cut: CutImage) => {
    setCutToCrop(cut);
    setIsCropModalOpen(true);
  };

  const handleSaveCrop = (cutId: string, objectPosition: string, scale?: number) => {
    setCuts((prev) =>
      prev.map((c) =>
        c.id === cutId ? { ...c, objectPosition, scale } : c
      )
    );
    showNotification('Posição e enquadramento do corte atualizados!', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header with Save & Preview Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-950 border border-zinc-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#f8c105]/20 text-[#f8c105] px-2 py-0.5 rounded border border-[#f8c105]/30">
              Personalização
            </span>
            <span className="text-xs text-zinc-500 font-mono">slug: /{currentTenant.slug}</span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider mt-1">
            Editar Minha Mini Central Pública
          </h2>
          <p className="text-xs text-zinc-400">
            Altere fotos, dados, endereço, WhatsApp e textos exibidos para seus clientes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentView('mini-central')}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-zinc-800"
          >
            <Eye size={14} className="text-[#f8c105]" />
            <span>Visualizar Mini Central</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer transition-all"
          >
            <Save size={15} />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {/* Editor Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-800 text-xs">
        {[
          { id: 'geral', label: '1. Dados Gerais & Marca', icon: FileText },
          { id: 'fotos', label: '2. Galeria de Fotos (Nossos Cortes)', icon: ImageIcon },
          { id: 'videos', label: '3. Vídeos Institucionais', icon: Video },
          { id: 'contato', label: '4. WhatsApp & Redes', icon: Phone },
          { id: 'horarios', label: '5. Horários & Localização', icon: MapPin },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-zinc-900 text-[#f8c105] border-[#f8c105]/50 shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-[#f8c105]' : 'text-zinc-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: GERAL */}
      {activeSection === 'geral' && (
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white border-b border-zinc-900 pb-2">
            Identidade da Barbearia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Nome Oficial da Barbearia:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Slogan / Frase de Destaque:</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="Ex: Estilo & Precisão em Cordeiros"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Barbeiro Principal / Assinatura:</label>
              <input
                type="text"
                value={formData.barbeiro}
                onChange={(e) => handleInputChange('barbeiro', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Responsável / Proprietário:</label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => handleInputChange('responsavel', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="font-bold text-zinc-300">Descrição Pública / Apresentação:</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Texto explicativo exibido na Mini Central..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FOTOS (NOSSOS CORTES) */}
      {activeSection === 'fotos' && (
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-900 pb-3">
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white">
                Fotos dos Cortes (Vitrine dos Cards)
              </h3>
              <p className="text-xs text-zinc-400">
                Gerencie as fotos exibidas na grade da Mini Central. Atualmente com {cuts.length} fotos.
              </p>
            </div>
          </div>

          {/* Informative Drag & Drop Guide Banner */}
          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-[#f8c105]/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#f8c105]">
              <Sparkles size={14} />
              <span>Opção de Arrastar & Ajustar Posições Ativada:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
              <div className="flex items-start gap-2 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800">
                <span className="text-base leading-none">🖐️</span>
                <div>
                  <strong className="text-white block font-sans">Arrastar para Reordenar:</strong>
                  <span>Clique e arraste qualquer card para reposicioná-lo na grade (ou use as setas ◀ ▶).</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-zinc-950/70 p-2.5 rounded-lg border border-zinc-800">
                <span className="text-base leading-none">🎯</span>
                <div>
                  <strong className="text-white block font-sans">Ajustar Enquadramento:</strong>
                  <span>Clique no botão de mira em cada foto para arrastar o foco da imagem (topo, centro ou barba).</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add new photo bar */}
          <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-3">
            <span className="text-xs font-bold text-[#f8c105] block">Adicionar Nova Foto de Corte:</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="URL da imagem (ex: /cortes/corte-01.jpg ou link direto https://...)"
                value={newCutUrl}
                onChange={(e) => setNewCutUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-[#f8c105]"
              />
              <input
                type="text"
                placeholder="Título do corte (opcional)"
                value={newCutTitle}
                onChange={(e) => setNewCutTitle(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white outline-none focus:border-[#f8c105]"
              />
              <button
                type="button"
                onClick={handleAddCut}
                className="px-4 py-2 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus size={14} /> Adicionar
              </button>
            </div>
          </div>

          {/* Current Cuts Grid with Drag & Drop Reordering */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {cuts.map((cut, index) => {
              const isBeingDragged = draggedIndex === index;
              const isOver = dragOverIndex === index && draggedIndex !== index;

              return (
                <div
                  key={cut.id}
                  draggable={true}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={handleDragEnd}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border transition-all duration-200 group shadow-md select-none ${
                    isBeingDragged
                      ? 'opacity-40 border-dashed border-[#f8c105] scale-95'
                      : isOver
                      ? 'border-2 border-[#f8c105] scale-102 shadow-[0_0_20px_rgba(248,193,5,0.4)]'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={cut.imageUrl}
                    alt={cut.alt || 'Foto do corte'}
                    draggable={false}
                    style={{
                      objectPosition: cut.objectPosition || 'center center',
                      transform: cut.scale ? `scale(${cut.scale})` : undefined,
                    }}
                    className="w-full h-full object-cover pointer-events-none"
                  />

                  {/* Position Badge & Drag Handle */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-zinc-200 font-bold border border-zinc-800 shadow">
                    <GripVertical size={11} className="text-[#f8c105] cursor-grab active:cursor-grabbing" />
                    <span>Posição #{index + 1}</span>
                  </div>

                  {/* Top Right Quick Actions: Crop / Remove */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleOpenCropModal(cut)}
                      className="w-7 h-7 rounded-lg bg-black/85 hover:bg-[#f8c105] hover:text-black text-white flex items-center justify-center transition-all cursor-pointer shadow border border-zinc-700/80"
                      title="Ajustar enquadramento e posição da foto"
                    >
                      <Move size={12} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveCut(cut.id)}
                      className="w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                      title="Remover foto"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Bottom Bar: Move ◀ ▶ and Crop info */}
                  <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveCut(index, 'prev')}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                          index === 0
                            ? 'text-zinc-600 bg-zinc-900/60 cursor-not-allowed'
                            : 'text-zinc-200 bg-zinc-800/90 hover:bg-[#f8c105] hover:text-black cursor-pointer'
                        }`}
                        title="Mover para posição anterior"
                      >
                        <ChevronLeft size={13} />
                      </button>

                      <button
                        type="button"
                        disabled={index === cuts.length - 1}
                        onClick={() => handleMoveCut(index, 'next')}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                          index === cuts.length - 1
                            ? 'text-zinc-600 bg-zinc-900/60 cursor-not-allowed'
                            : 'text-zinc-200 bg-zinc-800/90 hover:bg-[#f8c105] hover:text-black cursor-pointer'
                        }`}
                        title="Mover para próxima posição"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCropModal(cut)}
                      className="text-[10px] text-zinc-300 hover:text-[#f8c105] font-sans font-bold flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      <Crop size={10} className="text-[#f8c105]" />
                      <span>Enquadrar</span>
                    </button>
                  </div>

                  {/* Drop target indicator */}
                  {isOver && (
                    <div className="absolute inset-0 bg-[#f8c105]/20 backdrop-blur-[1px] flex items-center justify-center border-2 border-[#f8c105] rounded-xl pointer-events-none">
                      <span className="bg-black/90 text-[#f8c105] text-[11px] font-bold font-mono px-2 py-1 rounded shadow">
                        Soltar na Posição #{index + 1}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal for adjusting cut framing/position */}
          <CutCropPositionModal
            cut={cutToCrop}
            isOpen={isCropModalOpen}
            onClose={() => setIsCropModalOpen(false)}
            onSave={handleSaveCrop}
          />
        </div>
      )}

      {/* SECTION 3: VIDEOS */}
      {activeSection === 'videos' && (
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white border-b border-zinc-900 pb-2">
            Vídeos & Apresentação
          </h3>
          <p className="text-xs text-zinc-400">
            A Mini Central atualmente foca na vitrine fotográfica de alta conversão, mas você pode cadastrar links de vídeos institucionais ou reels:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Link de Vídeo YouTube / Reels:</label>
              <input
                type="text"
                placeholder="https://youtube.com/shorts/... ou instagram.com/reel/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Wistia / Provedor Externo:</label>
              <input
                type="text"
                placeholder="ID do vídeo no Wistia (opcional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: CONTATO */}
      {activeSection === 'contato' && (
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white border-b border-zinc-900 pb-2">
            Canais de Atendimento e Redes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">WhatsApp Oficial (Formatado):</label>
              <input
                type="text"
                value={formData.whatsappFormatted}
                onChange={(e) => handleInputChange('whatsappFormatted', e.target.value)}
                placeholder="(47) 99623-9122"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Número do WhatsApp para Links (DDI + DDD + Número):</label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="5547996239122"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Usuário do Instagram (@):</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="lupumbabarbearia"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">URL Completa do Instagram:</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                placeholder="https://www.instagram.com/lupumbabarbearia/"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: HORARIOS & LOCALIZAÇÃO */}
      {activeSection === 'horarios' && (
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-2xl space-y-4">
          <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white border-b border-zinc-900 pb-2">
            Localização e Horários de Funcionamento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Endereço e Número:</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua César Stamm, 352"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Bairro:</label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                placeholder="Cordeiros"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Cidade / UF:</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Itajaí - SC"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-300">Horários de Atendimento:</label>
              <input
                type="text"
                value={formData.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                placeholder="Segunda a sábado, das 09h às 20h"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-[#f8c105] text-white outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-3 rounded-xl bg-[#f8c105] hover:bg-[#ffe27a] text-black text-xs font-display font-black uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer transition-all"
        >
          <Save size={16} />
          <span>Salvar Alterações da Mini Central</span>
        </button>
      </div>
    </div>
  );
}

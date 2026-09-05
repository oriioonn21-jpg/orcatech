import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  X,
  Smartphone,
  Wrench,
  Shield,
  Clock,
  Check,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  BatteryCharging,
  Zap,
  Camera,
  Volume2,
  Droplets,
  DollarSign,
  User,
  Phone,
  Layers,
} from 'lucide-react';
import {
  BrandName,
  PhoneModel,
  ServiceItem,
  QualityOption,
  Quote,
  QualityTier,
  StaffMember,
  StoreLocation,
} from '../types';
import {
  BRANDS,
  PHONE_MODELS,
  SERVICES,
  QUALITY_OPTIONS,
  calculateServicePrice,
} from '../data/mockData';

interface NewQuoteViewProps {
  currentUser: StaffMember | null;
  currentStore: StoreLocation;
  initialBrand?: BrandName;
  onQuoteGenerated: (quote: Quote) => void;
  onCancel: () => void;
}

// Icon helper for services
const renderServiceIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'BatteryCharging':
      return <BatteryCharging className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Volume2':
      return <Volume2 className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    default:
      return <Wrench className={className} />;
  }
};

export const NewQuoteView: React.FC<NewQuoteViewProps> = ({
  currentUser,
  currentStore,
  initialBrand,
  onQuoteGenerated,
  onCancel,
}) => {
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandName | 'Todas'>(initialBrand || 'Todas');

  // Selections
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<QualityOption>(QUALITY_OPTIONS[1]); // Premium OLED default
  const [customDeliveryTime, setCustomDeliveryTime] = useState('Pronto em 40 minutos');
  const [customWarranty, setCustomWarranty] = useState(QUALITY_OPTIONS[1].warrantyDefault);
  const [customDiscount, setCustomDiscount] = useState<number>(0);

  // Client info (optional for instant flow, essential for WhatsApp personalization)
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Update warranty when quality changes
  const handleQualityChange = (opt: QualityOption) => {
    setSelectedQuality(opt);
    setCustomWarranty(opt.warrantyDefault);
  };

  // Preset example search clicks (requirement 4 examples)
  const quickSearchExamples = [
    { label: 'iPhone 13', query: 'iPhone 13' },
    { label: 'A54', query: 'A54' },
    { label: 'iPhone 13 tela', query: 'iPhone 13 tela' },
    { label: 'bateria iPhone 11', query: 'bateria iPhone 11' },
    { label: 'Moto G54 conector', query: 'Moto G54 conector' },
    { label: 'Redmi Note 12', query: 'Redmi Note 12' },
  ];

  // Smart Query Parser: detects service keywords in search string
  const parsedSearch = useMemo(() => {
    const raw = searchQuery.toLowerCase().trim();
    let detectedServiceId: string | null = null;
    let modelKeywords = raw;

    if (raw.includes('tela') || raw.includes('display') || raw.includes('frontal') || raw.includes('vidro')) {
      detectedServiceId = 'srv-tela';
      modelKeywords = raw.replace(/tela|display|frontal|vidro/g, '').trim();
    } else if (raw.includes('bateria') || raw.includes('batery') || raw.includes('carga')) {
      if (raw.includes('conector') || raw.includes('usb') || raw.includes('dock') || raw.includes('entrada')) {
        detectedServiceId = 'srv-conector';
        modelKeywords = raw.replace(/conector|usb|dock|entrada|carga/g, '').trim();
      } else {
        detectedServiceId = 'srv-bateria';
        modelKeywords = raw.replace(/bateria|batery/g, '').trim();
      }
    } else if (raw.includes('conector') || raw.includes('usb') || raw.includes('dock')) {
      detectedServiceId = 'srv-conector';
      modelKeywords = raw.replace(/conector|usb|dock/g, '').trim();
    } else if (raw.includes('camera') || raw.includes('câmera') || raw.includes('foto')) {
      detectedServiceId = 'srv-camera';
      modelKeywords = raw.replace(/camera|câmera|foto/g, '').trim();
    } else if (raw.includes('som') || raw.includes('alto-falante') || raw.includes('audio') || raw.includes('áudio') || raw.includes('auricular')) {
      detectedServiceId = 'srv-altofalante';
      modelKeywords = raw.replace(/alto-falante|auricular|som|audio|áudio/g, '').trim();
    } else if (raw.includes('tampa') || raw.includes('traseira') || raw.includes('traseiro')) {
      detectedServiceId = 'srv-tampa';
      modelKeywords = raw.replace(/tampa|traseira|traseiro/g, '').trim();
    } else if (raw.includes('desoxidacao') || raw.includes('desoxidação') || raw.includes('agua') || raw.includes('água') || raw.includes('banho')) {
      detectedServiceId = 'srv-desoxidacao';
      modelKeywords = raw.replace(/desoxidacao|desoxidação|agua|água|banho/g, '').trim();
    }

    return {
      raw,
      modelKeywords: modelKeywords.replace(/\s+/g, ' ').trim(),
      detectedServiceId,
    };
  }, [searchQuery]);

  // When query matches a service keyword and matches exactly 1 model or a selected model, auto-preselect that service!
  useEffect(() => {
    if (parsedSearch.detectedServiceId) {
      const srv = SERVICES.find((s) => s.id === parsedSearch.detectedServiceId);
      if (srv) {
        setSelectedService(srv);
      }
    }
  }, [parsedSearch.detectedServiceId]);

  // Filter models based on brand and search query
  const filteredModels = useMemo(() => {
    const term = parsedSearch.modelKeywords.toLowerCase();

    return PHONE_MODELS.filter((model) => {
      // Brand filter
      if (selectedBrand !== 'Todas' && model.brand !== selectedBrand) {
        return false;
      }
      if (!term) return true;

      const fullString = `${model.brand} ${model.name} ${model.id}`.toLowerCase();
      // Also match abbreviations like "a54" for "Galaxy A54 5G"
      const normalizedName = model.name.toLowerCase().replace(/galaxy\s*/g, '');

      return fullString.includes(term) || normalizedName.includes(term);
    });
  }, [selectedBrand, parsedSearch.modelKeywords]);

  // Auto-select model if single match or exact hit
  const handleSelectModel = (model: PhoneModel) => {
    setSelectedModel(model);
    // If a service was already detected from search, keep it, otherwise prompt user to select service
  };

  // Reset to change device
  const handleResetDevice = () => {
    setSelectedModel(null);
    setSelectedService(null);
  };

  // Calculated Pricing
  const priceData = useMemo(() => {
    if (!selectedModel || !selectedService) {
      return { cash: 0, installments: 0, installmentsCount: 3, installmentValue: 0 };
    }
    const base = calculateServicePrice(selectedModel, selectedService, selectedQuality);
    const finalCash = Math.max(10, base.cash - customDiscount);
    const finalInstallments = Math.max(10, base.installments - customDiscount);
    const installmentValue = Number((finalInstallments / base.installmentsCount).toFixed(2));

    return {
      cash: finalCash,
      installments: finalInstallments,
      installmentsCount: base.installmentsCount,
      installmentValue,
    };
  }, [selectedModel, selectedService, selectedQuality, customDiscount]);

  // Handle format phone Brazilian (XX) XXXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length <= 2) {
      setClientPhone(val ? `(${val}` : '');
    } else if (val.length <= 7) {
      setClientPhone(`(${val.slice(0, 2)}) ${val.slice(2)}`);
    } else {
      setClientPhone(`(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`);
    }
  };

  // Requirement 8: "Criar um botão grande: 'GERAR ORÇAMENTO'"
  const handleGenerateQuote = () => {
    if (!selectedModel || !selectedService) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const dateStr = 'Hoje, ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      quoteNumber: `ORC-${new Date().getFullYear()}-${randomNum}`,
      createdAt: dateStr,
      clientName: clientName.trim() || 'Cliente',
      clientPhone: clientPhone.trim() || '',
      deviceId: selectedModel.id,
      deviceName: selectedModel.name,
      deviceBrand: selectedModel.brand,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      qualityTier: selectedQuality.id,
      qualityLabel: selectedQuality.label,
      deliveryTime: customDeliveryTime,
      warranty: customWarranty,
      cashPrice: priceData.cash,
      installmentsPrice: priceData.installments,
      installmentsCount: priceData.installmentsCount,
      status: 'Pendente',
      technicianName: currentUser?.name || 'Técnico',
      storeName: currentStore.name,
    };

    onQuoteGenerated(newQuote);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-24 sm:pb-12">
      {/* Top Navigation Bar in New Quote */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Novo Orçamento</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Passo a Passo Rápido
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Pesquise o aparelho e selecione o serviço para cotar
            </p>
          </div>
        </div>

        {selectedModel && (
          <button
            onClick={handleResetDevice}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Trocar Aparelho</span>
          </button>
        )}
      </div>

      {/* Main 12-column layout matching Clean Minimalism */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column (7 cols): Search, Device, Service Selection, and Quality */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Pesquisar Aparelho ou Serviço */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                1. Pesquisar Aparelho ou Serviço
              </label>
              {selectedModel && (
                <button
                  onClick={handleResetDevice}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Trocar aparelho
                </button>
              )}
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="device-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: iPhone 13 tela, A54 bateria, Moto G54..."
                className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-xs text-sm font-medium text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Search Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Exemplos:</span>
              {quickSearchExamples.map((ex) => (
                <button
                  key={ex.label}
                  id={`quick-example-${ex.label.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => setSearchQuery(ex.query)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-blue-50 hover:text-blue-600 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            {/* Brand Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
              <button
                onClick={() => setSelectedBrand('Todas')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
                  selectedBrand === 'Todas'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todas as Marcas
              </button>
              {BRANDS.map((b) => (
                <button
                  key={b.name}
                  id={`brand-filter-${b.name.toLowerCase()}`}
                  onClick={() => setSelectedBrand(b.name)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedBrand === b.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span>{b.name}</span>
                </button>
              ))}
            </div>

            {/* Search Feedback: Detected Service */}
            {parsedSearch.detectedServiceId && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  Serviço identificado: <strong>{SERVICES.find((s) => s.id === parsedSearch.detectedServiceId)?.name}</strong>
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                  Auto-selecionado
                </span>
              </div>
            )}
          </div>

          {/* Device Selection State */}
          {selectedModel ? (
            /* Selected device card matching Clean Minimalism */
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Resultado encontrado</span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                  ESTOQUE OK
                </span>
              </div>
              <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                    <Smartphone className="w-7 h-7 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{selectedModel.name}</h3>
                    <p className="text-sm text-slate-500">
                      {selectedModel.brand} • {selectedModel.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleResetDevice}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Alterar
                </button>
              </div>
            </div>
          ) : (
            /* Found models list */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Modelos Compatíveis ({filteredModels.length})
                </span>
                <span className="text-[11px] text-slate-400">Clique para selecionar</span>
              </div>

              {filteredModels.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                  <Smartphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Nenhum aparelho encontrado</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tente pesquisar apenas "13", "A54" ou "G54"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {filteredModels.map((model) => (
                    <button
                      key={model.id}
                      id={`model-card-${model.id}`}
                      onClick={() => handleSelectModel(model)}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all group flex items-center justify-between cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 block">
                            {model.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {model.brand}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Escolher Serviço */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              2. Escolher Serviço {selectedModel && `para ${selectedModel.name}`}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((srv) => {
                const isSelected = selectedService?.id === srv.id;
                const estimatedPrice = calculateServicePrice(
                  selectedModel || PHONE_MODELS[0],
                  srv,
                  QUALITY_OPTIONS[1]
                );

                return (
                  <button
                    key={srv.id}
                    id={`service-card-${srv.id}`}
                    onClick={() => setSelectedService(srv)}
                    className={`p-3.5 text-left rounded-xl transition-all relative cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-blue-600 bg-blue-50 shadow-xs'
                        : 'border border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {renderServiceIcon(srv.iconName, 'w-4 h-4')}
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-900">
                            {srv.name}
                          </span>
                          <span className="block text-xs text-slate-500 mt-0.5">
                            A partir de R$ {estimatedPrice.cash}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Qualidade da Peça & Configurações */}
          {selectedService && (
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                3. Qualidade da Peça & Detalhes
              </label>

              {/* Quality options grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {QUALITY_OPTIONS.map((opt) => {
                  const isChosen = selectedQuality.id === opt.id;
                  const optPrice = calculateServicePrice(
                    selectedModel || PHONE_MODELS[0],
                    selectedService,
                    opt
                  );

                  return (
                    <button
                      key={opt.id}
                      id={`quality-opt-${opt.id}`}
                      type="button"
                      onClick={() => handleQualityChange(opt)}
                      className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isChosen
                          ? 'border-2 border-blue-600 bg-blue-50 shadow-xs'
                          : 'border border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              isChosen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{opt.description}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Shield className="w-3 h-3" /> {opt.warrantyDefault}
                        </span>
                        <span className="font-bold text-slate-900">R$ {optPrice.cash}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Prazo e Garantia */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Prazo de Execução
                  </label>
                  <select
                    id="quote-delivery-time-select"
                    value={customDeliveryTime}
                    onChange={(e) => setCustomDeliveryTime(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Pronto em 30 minutos">Pronto em 30 minutos (Express)</option>
                    <option value="Pronto em 40 minutos">Pronto em 40 minutos</option>
                    <option value="Pronto em 1 hora">Pronto em 1 hora</option>
                    <option value="Pronto em 2 horas">Pronto em 2 horas</option>
                    <option value="Mesmo dia (Até as 18h)">Mesmo dia (Até as 18h)</option>
                    <option value="De 24h a 48h (Sob encomenda)">De 24h a 48h (Sob encomenda)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-slate-400" />
                    Garantia
                  </label>
                  <select
                    id="quote-warranty-select"
                    value={customWarranty}
                    onChange={(e) => setCustomWarranty(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                  >
                    <option value="90 dias de garantia legal">90 dias de garantia legal</option>
                    <option value="6 meses de garantia estendida">6 meses de garantia estendida</option>
                    <option value="1 ano de garantia total">1 ano de garantia total</option>
                  </select>
                </div>
              </div>

              {/* Dados do Cliente (Opcional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    Nome do Cliente (opcional)
                  </label>
                  <input
                    id="client-name-input"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Mariana Silveira"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    WhatsApp do Cliente (opcional)
                  </label>
                  <input
                    id="client-phone-input"
                    type="tel"
                    value={clientPhone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Dark Summary Card & Message Preview (matching Design HTML) */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-4 h-fit">
          {/* Dark Summary Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Orçamento Instantâneo
                </p>
                <h2 className="text-xl font-bold text-white tracking-tight">Resumo Final</h2>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-md text-xs text-slate-300 font-medium">
                Preview
              </div>
            </div>

            <div className="space-y-3.5 flex-1">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-sm text-slate-400">Aparelho</span>
                <span className="text-sm font-medium text-white truncate max-w-[180px] text-right">
                  {selectedModel ? selectedModel.name : 'Selecione o modelo'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-sm text-slate-400">Serviço</span>
                <span className="text-sm font-medium text-white truncate max-w-[180px] text-right">
                  {selectedService ? selectedService.name : 'Selecione o serviço'}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-sm text-slate-400">Qualidade</span>
                <span className="text-sm font-medium text-white">{selectedQuality.label}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-sm text-slate-400">Prazo</span>
                <span className="text-sm font-medium text-white">{customDeliveryTime}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-sm text-slate-400">Garantia</span>
                <span className="text-sm font-medium text-white">{customWarranty}</span>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-center pt-3">
                <div>
                  <span className="text-sm text-slate-400 block">Total à vista</span>
                  <span className="text-[11px] text-slate-400">
                    Ou {priceData.installmentsCount}x de R$ {priceData.installmentValue.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <span className="text-3xl font-bold text-blue-400">
                  R$ {priceData.cash.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* GERAR ORÇAMENTO Button */}
            <button
              id="btn-generate-quote-submit"
              type="button"
              disabled={!selectedModel || !selectedService}
              onClick={handleGenerateQuote}
              className={`w-full font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-6 uppercase tracking-wider text-sm cursor-pointer ${
                selectedModel && selectedService
                  ? 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.99]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-5 h-5 stroke-[2.5]" />
              <span>Gerar Orçamento</span>
            </button>
          </div>

          {/* Preview da Mensagem (Design HTML matching) */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-2">
              Preview da Mensagem
            </p>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{`Olá! O orçamento para seu ${selectedModel?.name || 'aparelho'} (${selectedService?.name || 'serviço'} ${selectedQuality.label}) ficou em R$ ${priceData.cash.toFixed(2).replace('.', ',')}. ${customDeliveryTime} com ${customWarranty}. Podemos iniciar?`}"
            </p>
            <button
              id="btn-quick-send-whatsapp-preview"
              type="button"
              onClick={handleGenerateQuote}
              disabled={!selectedModel || !selectedService}
              className="w-full mt-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Enviar pelo WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

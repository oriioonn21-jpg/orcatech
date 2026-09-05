import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Check,
  Smartphone,
  Shield,
  Clock,
  MessageCircle,
  Phone,
  User,
  ArrowRight,
  RotateCcw,
  Sliders,
  ChevronRight,
  Info,
  Wrench,
  Battery,
  Zap,
  Camera,
  Volume2,
  Maximize2,
  X,
  Truck,
  MapPin,
  UserCheck,
  Tag,
  Building2,
} from 'lucide-react';
import {
  BrandName,
  PhoneModel,
  ServiceItem,
  Quote,
  StaffMember,
  StoreLocation,
  CompanyQuoteSettings,
  PartQualityConfig,
  WarrantyConfig,
  ServiceTypeConfig,
  TechnicianConfig,
} from '../types';
import { BRANDS, PHONE_MODELS, SERVICES } from '../data/mockData';

interface NewQuoteViewProps {
  currentUser: StaffMember | null;
  currentStore: StoreLocation;
  companySettings: CompanyQuoteSettings;
  initialBrand?: BrandName;
  onQuoteGenerated: (quote: Quote) => void;
  onCancel: () => void;
}

// Helper to render service icons dynamically
const renderServiceIcon = (iconName: string, className = 'w-5 h-5') => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Battery':
      return <Battery className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Volume2':
      return <Volume2 className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Wrench':
    default:
      return <Wrench className={className} />;
  }
};

export const NewQuoteView: React.FC<NewQuoteViewProps> = ({
  currentUser,
  currentStore,
  companySettings,
  initialBrand,
  onQuoteGenerated,
  onCancel,
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandName | 'Todas'>(initialBrand || 'Todas');

  // STEP 1: Model Selection
  const [selectedModel, setSelectedModel] = useState<PhoneModel | null>(null);

  // STEP 2: Service Selection
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Dynamic active options from company settings
  const activeQualities = useMemo(() => {
    const list = companySettings.qualities.filter((q) => q.active);
    return list.length > 0 ? list : companySettings.qualities;
  }, [companySettings.qualities]);

  const activeWarranties = useMemo(() => {
    const list = companySettings.warranties.filter((w) => w.active);
    return list.length > 0 ? list : companySettings.warranties;
  }, [companySettings.warranties]);

  const activeServiceTypes = useMemo(() => {
    const list = companySettings.serviceTypes.filter((s) => s.active);
    return list.length > 0 ? list : companySettings.serviceTypes;
  }, [companySettings.serviceTypes]);

  const activeTechnicians = useMemo(() => {
    const list = companySettings.technicians.filter((t) => t.active);
    return list.length > 0 ? list : companySettings.technicians;
  }, [companySettings.technicians]);

  // STEP 3: Quality Selection
  const [selectedQuality, setSelectedQuality] = useState<PartQualityConfig>(() => {
    return activeQualities[0];
  });

  // STEP 4: Warranty Selection (allows quick select pill + custom text input)
  const defaultWarrantyLabel = useMemo(() => {
    const def = activeWarranties.find((w) => w.isDefault);
    return def ? def.label : (activeWarranties[0]?.label || '90 dias');
  }, [activeWarranties]);

  const [selectedWarranty, setSelectedWarranty] = useState<string>(defaultWarrantyLabel);
  const [isCustomWarrantyMode, setIsCustomWarrantyMode] = useState(false);

  // STEP 5: Service Type (Tipo de atendimento)
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceTypeConfig>(() => {
    return activeServiceTypes[0];
  });

  // STEP 6: Technician (Técnico responsável)
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianConfig>(() => {
    const matchUser = activeTechnicians.find((t) => t.name === currentUser?.name);
    const matchStore = activeTechnicians.find((t) => t.storeId === currentStore.id);
    return matchUser || matchStore || activeTechnicians[0];
  });

  // Additional options
  const [customDeliveryTime, setCustomDeliveryTime] = useState('Pronto em 40 minutos');
  const [customDiscount, setCustomDiscount] = useState<number>(0);

  // Client info (optional for instant quote, used for WhatsApp personalization)
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Keep state synced if companySettings change
  useEffect(() => {
    if (!activeQualities.some((q) => q.id === selectedQuality.id) && activeQualities[0]) {
      setSelectedQuality(activeQualities[0]);
    }
    if (!activeServiceTypes.some((s) => s.id === selectedServiceType.id) && activeServiceTypes[0]) {
      setSelectedServiceType(activeServiceTypes[0]);
    }
    if (!activeTechnicians.some((t) => t.id === selectedTechnician.id) && activeTechnicians[0]) {
      setSelectedTechnician(activeTechnicians[0]);
    }
  }, [activeQualities, activeServiceTypes, activeTechnicians]);

  // Quick search examples (requirement 4)
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
    } else if (
      raw.includes('som') ||
      raw.includes('alto-falante') ||
      raw.includes('audio') ||
      raw.includes('áudio') ||
      raw.includes('auricular')
    ) {
      detectedServiceId = 'srv-altofalante';
      modelKeywords = raw.replace(/alto-falante|auricular|som|audio|áudio/g, '').trim();
    } else if (raw.includes('tampa') || raw.includes('traseira') || raw.includes('traseiro')) {
      detectedServiceId = 'srv-tampa';
      modelKeywords = raw.replace(/tampa|traseira|traseiro/g, '').trim();
    } else if (
      raw.includes('desoxidacao') ||
      raw.includes('desoxidação') ||
      raw.includes('agua') ||
      raw.includes('água') ||
      raw.includes('banho')
    ) {
      detectedServiceId = 'srv-desoxidacao';
      modelKeywords = raw.replace(/desoxidacao|desoxidação|agua|água|banho/g, '').trim();
    }

    return {
      raw,
      modelKeywords: modelKeywords.replace(/\s+/g, ' ').trim(),
      detectedServiceId,
    };
  }, [searchQuery]);

  // When query matches a service keyword, preselect that service
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
      if (selectedBrand !== 'Todas' && model.brand !== selectedBrand) {
        return false;
      }
      if (!term) return true;

      const fullString = `${model.brand} ${model.name} ${model.id}`.toLowerCase();
      const normalizedName = model.name.toLowerCase().replace(/galaxy\s*/g, '');

      return fullString.includes(term) || normalizedName.includes(term);
    });
  }, [selectedBrand, parsedSearch.modelKeywords]);

  const handleSelectModel = (model: PhoneModel) => {
    setSelectedModel(model);
  };

  const handleResetDevice = () => {
    setSelectedModel(null);
    setSelectedService(null);
  };

  // Pricing calculation adhering to: Base Service Price * Model Tier Factor * Quality Multiplier + Service Type Fee - Discount
  const priceData = useMemo(() => {
    if (!selectedModel || !selectedService) {
      return { cash: 0, installments: 0, installmentsCount: 3, installmentValue: 0, additionalFee: 0 };
    }

    // Model tier factor
    let modelFactor = 1.0;
    if (selectedModel.category === 'Premium') {
      modelFactor = selectedModel.brand === 'Apple' ? 1.65 : 1.45;
    } else if (selectedModel.category === 'Intermediário') {
      modelFactor = 1.0;
    } else {
      modelFactor = 0.85;
    }

    const qualityMultiplier = selectedQuality?.priceMultiplier || 1.0;
    const additionalFee = selectedServiceType?.extraFee || 0;

    const baseCost = selectedService.basePrice * modelFactor * qualityMultiplier;
    const finalCash = Math.max(10, Math.round(baseCost + additionalFee - customDiscount));
    // Card installments price has standard credit gateway margin (~9%)
    const finalInstallments = Math.max(10, Math.round(finalCash * 1.09));
    const installmentsCount = 3;
    const installmentValue = Number((finalInstallments / installmentsCount).toFixed(2));

    return {
      cash: finalCash,
      installments: finalInstallments,
      installmentsCount,
      installmentValue,
      additionalFee,
    };
  }, [selectedModel, selectedService, selectedQuality, selectedServiceType, customDiscount]);

  // Format phone Brazilian (XX) XXXXX-XXXX
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

  // Generate Quote Handler
  const handleGenerateQuote = () => {
    if (!selectedModel || !selectedService) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const dateStr =
      'Hoje, ' +
      new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

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
      qualityTier: selectedQuality?.id || 'default',
      qualityLabel: selectedQuality?.label || 'Padrão',
      deliveryTime: customDeliveryTime,
      warranty: selectedWarranty,
      serviceTypeName: selectedServiceType?.name || 'Atendimento na Loja',
      serviceTypeId: selectedServiceType?.id,
      technicianId: selectedTechnician?.id,
      technicianName: selectedTechnician?.name || currentUser?.name || 'Técnico',
      storeName: currentStore.name,
      cashPrice: priceData.cash,
      installmentsPrice: priceData.installments,
      installmentsCount: priceData.installmentsCount,
      status: 'Pendente',
      companyId: companySettings.companyId,
    };

    onQuoteGenerated(newQuote);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-24 sm:pb-12">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-tight">
              Novo Orçamento Rápido
            </h1>
            <p className="text-[11px] text-slate-500">
              Fluxo: Aparelho → Serviço → Qualidade → Garantia → Atendimento → Técnico → Preço
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedModel && (
            <button
              onClick={handleResetDevice}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Recomeçar</span>
            </button>
          )}
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* Main Grid: Left Flow (Steps) + Right Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): The Exact Requested Step Sequence */}
        <div className="lg:col-span-7 space-y-5">
          {/* STEP 1: PESQUISAR E SELECIONAR APARELHO */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  1
                </span>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Modelo do Aparelho
                </label>
              </div>
              {selectedModel && (
                <button
                  onClick={handleResetDevice}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  Trocar aparelho
                </button>
              )}
            </div>

            {/* If model not yet selected, show search bar, pills and results */}
            {!selectedModel ? (
              <div className="space-y-3">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    id="device-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquise por marca, modelo ou serviço (ex: iPhone 13 tela, A54...)"
                    className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Example pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-medium text-slate-400">Exemplos:</span>
                  {quickSearchExamples.map((ex) => (
                    <button
                      key={ex.label}
                      id={`quick-example-${ex.label.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => setSearchQuery(ex.query)}
                      className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200/60 transition-colors cursor-pointer"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>

                {/* Brand pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    onClick={() => setSelectedBrand('Todas')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer ${
                      selectedBrand === 'Todas'
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Todas
                  </button>
                  {BRANDS.map((b) => (
                    <button
                      key={b.name}
                      id={`brand-filter-${b.name.toLowerCase()}`}
                      onClick={() => setSelectedBrand(b.name)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer flex items-center gap-1 ${
                        selectedBrand === b.name
                          ? 'bg-blue-600 text-white shadow-2xs'
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
                  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      Serviço detectado: <strong>{SERVICES.find((s) => s.id === parsedSearch.detectedServiceId)?.name}</strong>
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                      Identificado
                    </span>
                  </div>
                )}

                {/* Models grid */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Aparelhos encontrados ({filteredModels.length})
                  </span>
                  {filteredModels.length === 0 ? (
                    <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <Smartphone className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-slate-600">Nenhum aparelho encontrado</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Tente buscar por "13", "A54" ou "G54"</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                      {filteredModels.map((model) => (
                        <button
                          key={model.id}
                          id={`model-card-${model.id}`}
                          onClick={() => handleSelectModel(model)}
                          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 text-left transition-all group flex items-center justify-between cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 block">
                                {model.name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {model.brand} • {model.category}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Selected Device Preview Card */
              <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{selectedModel.name}</h3>
                    <p className="text-xs text-slate-500">
                      {selectedModel.brand} • Categoria {selectedModel.category}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-200">
                  Selecionado
                </span>
              </div>
            )}
          </div>

          {/* STEP 2: ESCOLHER SERVIÇO */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                2
              </span>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Serviço Solicitado
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SERVICES.map((srv) => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <button
                    key={srv.id}
                    id={`service-card-${srv.id}`}
                    type="button"
                    onClick={() => setSelectedService(srv)}
                    className={`p-3 rounded-xl text-left transition-all relative cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {renderServiceIcon(srv.iconName, 'w-4 h-4')}
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm font-bold text-slate-900">
                          {srv.name}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          Base: R$ {srv.basePrice.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: QUALIDADE DA PEÇA (Loaded dynamically from Company Settings) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  3
                </span>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Qualidade da Peça
                </label>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Configurada pela empresa
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {activeQualities.map((qual) => {
                const isSelected = selectedQuality?.id === qual.id;
                return (
                  <button
                    key={qual.id}
                    id={`quality-opt-${qual.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedQuality(qual);
                      if (qual.warrantyDefault && !isCustomWarrantyMode) {
                        setSelectedWarranty(qual.warrantyDefault);
                      }
                    }}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-900">{qual.label}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {qual.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                        {qual.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 text-[10px]">Fator {qual.priceMultiplier}x</span>
                      {isSelected && (
                        <span className="text-blue-700 font-bold flex items-center gap-0.5 text-[10px]">
                          <Check className="w-3 h-3" /> Ativa
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: GARANTIA (Loaded dynamically from Company Settings + Custom typing) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  4
                </span>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Garantia do Serviço
                </label>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomWarrantyMode(!isCustomWarrantyMode)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                {isCustomWarrantyMode ? 'Voltar para opções padrão' : 'Digitar garantia personalizada'}
              </button>
            </div>

            {/* Quick-select warranty pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeWarranties.map((warr) => {
                const isSelected = selectedWarranty === warr.label && !isCustomWarrantyMode;
                return (
                  <button
                    key={warr.id}
                    id={`warranty-pill-${warr.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedWarranty(warr.label);
                      setIsCustomWarrantyMode(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{warr.label}</span>
                    {warr.isDefault && (
                      <span className="text-[9px] opacity-80">(Padrão)</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom warranty text input (explicitly requested) */}
            {isCustomWarrantyMode && (
              <div className="pt-1">
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Digite a garantia personalizada para este orçamento:
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="custom-warranty-input"
                    type="text"
                    value={selectedWarranty}
                    onChange={(e) => setSelectedWarranty(e.target.value)}
                    placeholder="Ex: 90 dias com cobertura especial de tela quebrada"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 5: TIPO DE ATENDIMENTO (Loaded dynamically from Company Settings) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  5
                </span>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tipo de Atendimento
                </label>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Modalidade</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeServiceTypes.map((stype) => {
                const isSelected = selectedServiceType?.id === stype.id;
                return (
                  <button
                    key={stype.id}
                    id={`service-type-${stype.id}`}
                    type="button"
                    onClick={() => setSelectedServiceType(stype)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{stype.name}</span>
                        <span className="text-[10px] text-slate-500">
                          {stype.extraFee && stype.extraFee > 0
                            ? `+ R$ ${stype.extraFee.toFixed(2).replace('.', ',')} taxa`
                            : 'Sem taxa adicional'}
                          {stype.estimatedExtraTime ? ` • ${stype.estimatedExtraTime}` : ''}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 6: TÉCNICO RESPONSÁVEL (Loaded dynamically from Company Settings) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  6
                </span>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Técnico Responsável
                </label>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Equipe Técnica</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeTechnicians.map((tech) => {
                const isSelected = selectedTechnician?.id === tech.id;
                return (
                  <button
                    key={tech.id}
                    id={`tech-select-${tech.id}`}
                    type="button"
                    onClick={() => setSelectedTechnician(tech)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between border ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tech.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{tech.name}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {tech.storeName || 'Loja Matriz'}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 7: DADOS DO CLIENTE & PRAZO (Opcional) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  7
                </span>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Dados do Cliente & Prazo (Opcional)
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  Nome do Cliente
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Mariana Silveira"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  WhatsApp
                </label>
                <input
                  id="client-phone-input"
                  type="tel"
                  value={clientPhone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Prazo de Execução
                </label>
                <select
                  id="quote-delivery-time-select"
                  value={customDeliveryTime}
                  onChange={(e) => setCustomDeliveryTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Pronto em 30 minutos">Pronto em 30 minutos (Express)</option>
                  <option value="Pronto em 40 minutos">Pronto em 40 minutos</option>
                  <option value="Pronto em 1 hora">Pronto em 1 hora</option>
                  <option value="Pronto em 2 horas">Pronto em 2 horas</option>
                  <option value="Mesmo dia (Até as 18h)">Mesmo dia (Até as 18h)</option>
                  <option value="De 24h a 48h (Sob encomenda)">De 24h a 48h (Sob encomenda)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Summary Card & Direct WhatsApp Button */}
        <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-4 h-fit">
          {/* Dark Summary Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col">
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  Orçamento Instantâneo
                </p>
                <h2 className="text-xl font-bold text-white tracking-tight">Resumo do Pedido</h2>
              </div>
              <div className="bg-white/10 px-2.5 py-0.5 rounded text-[11px] text-slate-300 font-medium">
                Passo a Passo
              </div>
            </div>

            <div className="space-y-3 flex-1 text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">1. Aparelho</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedModel ? selectedModel.name : 'Pendente seleção'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">2. Serviço</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedService ? selectedService.name : 'Pendente seleção'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">3. Qualidade</span>
                <span className="font-semibold text-white">
                  {selectedQuality ? selectedQuality.label : 'Padrão'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">4. Garantia</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedWarranty}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">5. Atendimento</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedServiceType?.name || 'Na Loja'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">6. Técnico</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedTechnician?.name || 'Equipe Técnica'}
                </span>
              </div>

              {/* Total Price breakdown */}
              <div className="pt-3">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Total à vista (Pix/Dinheiro)</span>
                    <span className="text-[11px] text-slate-400">
                      Ou {priceData.installmentsCount}x de R${' '}
                      {priceData.installmentValue.toFixed(2).replace('.', ',')} no cartão
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-blue-400">
                    R$ {priceData.cash.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            {/* GERAR ORÇAMENTO Button */}
            <button
              id="btn-generate-quote-submit"
              type="button"
              disabled={!selectedModel || !selectedService}
              onClick={handleGenerateQuote}
              className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-5 uppercase tracking-wider text-xs sm:text-sm cursor-pointer ${
                selectedModel && selectedService
                  ? 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.99] shadow-blue-900/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>GERAR ORÇAMENTO</span>
            </button>
          </div>

          {/* Preview WhatsApp Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Mensagem Formatada para WhatsApp
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                1 Clique
              </span>
            </div>

            <p className="text-xs text-slate-600 italic bg-white p-3 rounded-xl border border-emerald-100 leading-relaxed">
              "Olá{clientName ? ` *${clientName}*` : ''}! O orçamento para o seu{' '}
              <strong>{selectedModel?.name || 'aparelho'}</strong> (
              {selectedService?.name || 'serviço'} {selectedQuality?.label}) na modalidade{' '}
              <strong>{selectedServiceType?.name}</strong> ficou em{' '}
              <strong>R$ {priceData.cash.toFixed(2).replace('.', ',')}</strong> à vista com garantia de{' '}
              <strong>{selectedWarranty}</strong> com o técnico{' '}
              <strong>{selectedTechnician?.name}</strong>. Deseja aprovar agora?"
            </p>

            <button
              id="btn-quick-send-whatsapp-preview"
              type="button"
              onClick={handleGenerateQuote}
              disabled={!selectedModel || !selectedService}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>ENVIAR PELO WHATSAPP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

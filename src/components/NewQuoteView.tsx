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
  AlertCircle,
  DollarSign,
  Edit3,
  Mic,
  Cpu,
  Radio,
  Droplets,
  Volume1,
  Layers,
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
  FullDeviceModel,
  DeviceServiceConfig,
  ServiceQualityConfig,
} from '../types';
import { BRANDS, PHONE_MODELS, SERVICES } from '../data/mockData';
import { calculatePriceBounds } from '../data/settingsStorage';
import { getCompanyDevices } from '../data/deviceStorage';

interface NewQuoteViewProps {
  currentUser: StaffMember | null;
  currentStore: StoreLocation;
  companySettings: CompanyQuoteSettings;
  initialBrand?: BrandName;
  onQuoteGenerated: (quote: Quote) => void;
  onCancel: () => void;
}

// Unified model & service types for quote generator
export interface UnifiedModelSelection {
  id: string;
  brand: BrandName;
  name: string;
  series?: string;
  year?: number;
  category: string;
  popular?: boolean;
}

export interface UnifiedServiceSelection {
  id: string;
  name: string;
  category?: string;
  iconName?: string;
  hasQuality?: boolean;
  basePrice: number;
  minPrice?: number;
  suggestedPrice?: number;
  maxPrice?: number;
  warranty?: string;
  estimatedTime?: string;
  qualities?: ServiceQualityConfig[];
}

// Helper to render service icons dynamically
const renderServiceIcon = (iconName?: string, className = 'w-5 h-5') => {
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
    case 'Volume1':
      return <Volume1 className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Layers':
      return <Layers className={className} />;
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

  // Load registered company device catalog
  const companyDevices = useMemo(() => {
    return getCompanyDevices(companySettings.companyId);
  }, [companySettings.companyId]);

  // STEP 1: Model Selection
  const [selectedModel, setSelectedModel] = useState<UnifiedModelSelection | null>(null);

  // STEP 2: Service Selection
  const [selectedService, setSelectedService] = useState<UnifiedServiceSelection | null>(null);

  // Available services for the currently selected model
  const availableServices = useMemo<UnifiedServiceSelection[]>(() => {
    if (!selectedModel) {
      // Preview mode before model is chosen: show active services
      return SERVICES.map((s) => ({
        id: s.id,
        name: s.name,
        category: s.category,
        iconName: s.iconName,
        hasQuality: s.id === 'srv-tela' || s.id === 'srv-bateria',
        basePrice: s.basePrice,
      }));
    }

    const dev = companyDevices.find(
      (d) => d.id === selectedModel.id || d.name.toLowerCase() === selectedModel.name.toLowerCase()
    );

    if (dev && dev.services && dev.services.length > 0) {
      return dev.services
        .filter((s) => s.active)
        .map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          iconName: s.iconName,
          hasQuality: s.hasQuality,
          basePrice: s.suggestedPrice || 100,
          minPrice: s.minPrice,
          suggestedPrice: s.suggestedPrice,
          maxPrice: s.maxPrice,
          warranty: s.warranty,
          estimatedTime: s.estimatedTime,
          qualities: s.qualities,
        }));
    }

    return SERVICES.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      iconName: s.iconName,
      hasQuality: s.id === 'srv-tela' || s.id === 'srv-bateria',
      basePrice: s.basePrice,
    }));
  }, [selectedModel, companyDevices]);

  // Special Rule: ONLY "Troca de Tela" and "Troca de Bateria" require quality
  const serviceRequiresQuality = useMemo(() => {
    if (!selectedService) return false;
    const name = selectedService.name.toLowerCase();
    if (name.includes('tela') || name.includes('bateria')) return true;
    return Boolean(selectedService.hasQuality);
  }, [selectedService]);

  // Dynamic step numbers based on whether Quality is required
  const stepNumbers = useMemo(() => {
    let count = 2;
    const quality = serviceRequiresQuality ? ++count : null;
    const warranty = ++count;
    const serviceType = ++count;
    const technician = ++count;
    const price = ++count;
    return {
      model: 1,
      service: 2,
      quality,
      warranty,
      serviceType,
      technician,
      price,
    };
  }, [serviceRequiresQuality]);

  // Dynamic active options from company settings
  const fallbackActiveQualities = useMemo(() => {
    const list = companySettings.qualities.filter((q) => q.active);
    return list.length > 0 ? list : companySettings.qualities;
  }, [companySettings.qualities]);

  // Available qualities for the current service (either device-specific or company defaults)
  const availableQualities = useMemo(() => {
    if (!selectedService || !serviceRequiresQuality) return [];

    if (selectedService.qualities && selectedService.qualities.length > 0) {
      const active = selectedService.qualities.filter((q) => q.active);
      if (active.length > 0) {
        return active.map((q) => ({
          id: q.id,
          name: q.name,
          label: q.name,
          badge:
            q.name.includes('OLED') || q.name.includes('Gold') || q.name.includes('Original')
              ? 'Premium'
              : 'Padrão',
          description: `Garantia: ${q.warranty || '90 dias'} • Prazo: ${q.estimatedTime || '45 min'}`,
          priceMultiplier: 1.0,
          warrantyDefault: q.warranty,
          active: q.active,
          minPrice: q.minPrice,
          suggestedPrice: q.suggestedPrice,
          maxPrice: q.maxPrice,
          warranty: q.warranty,
          estimatedTime: q.estimatedTime,
        }));
      }
    }

    return fallbackActiveQualities;
  }, [selectedService, serviceRequiresQuality, fallbackActiveQualities]);

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
  const [selectedQuality, setSelectedQuality] = useState<any>(() => {
    return fallbackActiveQualities[0];
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
    if (serviceRequiresQuality && availableQualities.length > 0) {
      if (!availableQualities.some((q) => q.id === selectedQuality?.id)) {
        const first = availableQualities[0];
        setSelectedQuality(first);
        if (first.warranty && !isCustomWarrantyMode) setSelectedWarranty(first.warranty);
        if (first.estimatedTime) setCustomDeliveryTime(first.estimatedTime);
      }
    }
  }, [serviceRequiresQuality, availableQualities, selectedQuality?.id, isCustomWarrantyMode]);

  useEffect(() => {
    if (selectedService && !serviceRequiresQuality) {
      if (selectedService.warranty && !isCustomWarrantyMode) {
        setSelectedWarranty(selectedService.warranty);
      }
      if (selectedService.estimatedTime) {
        setCustomDeliveryTime(selectedService.estimatedTime);
      }
    }
  }, [selectedService, serviceRequiresQuality, isCustomWarrantyMode]);

  useEffect(() => {
    if (!activeServiceTypes.some((s) => s.id === selectedServiceType.id) && activeServiceTypes[0]) {
      setSelectedServiceType(activeServiceTypes[0]);
    }
    if (!activeTechnicians.some((t) => t.id === selectedTechnician.id) && activeTechnicians[0]) {
      setSelectedTechnician(activeTechnicians[0]);
    }
  }, [activeServiceTypes, activeTechnicians]);

  // Quick search examples
  const quickSearchExamples = [
    { label: 'iPhone 13', query: 'iPhone 13' },
    { label: 'A55', query: 'A55' },
    { label: 'iPhone 13 tela', query: 'iPhone 13 tela' },
    { label: 'bateria iPhone 11', query: 'bateria iPhone 11' },
    { label: 'Moto G54 conector', query: 'Moto G54 conector' },
    { label: 'Redmi Note 13', query: 'Redmi Note 13' },
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
      raw.includes('banho') ||
      raw.includes('limpeza')
    ) {
      detectedServiceId = 'srv-desoxidacao';
      modelKeywords = raw.replace(/desoxidacao|desoxidação|agua|água|banho|limpeza/g, '').trim();
    }

    return {
      raw,
      modelKeywords: modelKeywords.replace(/\s+/g, ' ').trim(),
      detectedServiceId,
    };
  }, [searchQuery]);

  // When query matches a service keyword, preselect that service
  useEffect(() => {
    if (parsedSearch.detectedServiceId && availableServices.length > 0) {
      const srv = availableServices.find(
        (s) =>
          s.id === parsedSearch.detectedServiceId ||
          s.name.toLowerCase().includes(parsedSearch.detectedServiceId.replace('srv-', ''))
      );
      if (srv) {
        setSelectedService(srv);
      }
    }
  }, [parsedSearch.detectedServiceId, availableServices]);

  // Filter models from company catalog
  const filteredModels = useMemo(() => {
    const term = parsedSearch.modelKeywords.toLowerCase();

    return companyDevices.filter((model) => {
      if (!model.active) return false;
      if (selectedBrand !== 'Todas' && model.brand !== selectedBrand) {
        return false;
      }
      if (!term) return true;

      const familyName = model.family || '';
      const fullString = `${model.brand} ${model.name} ${familyName} ${model.id}`.toLowerCase();
      const normalizedName = model.name.toLowerCase().replace(/galaxy\s*/g, '');

      return fullString.includes(term) || normalizedName.includes(term);
    });
  }, [companyDevices, selectedBrand, parsedSearch.modelKeywords]);

  const handleSelectModel = (model: UnifiedModelSelection | FullDeviceModel) => {
    const familyOrSeries = 'family' in model ? model.family : model.series;
    const yearNum =
      typeof model.year === 'number'
        ? model.year
        : model.year
        ? parseInt(String(model.year), 10) || undefined
        : undefined;

    setSelectedModel({
      id: model.id,
      brand: model.brand,
      name: model.name,
      series: familyOrSeries,
      year: yearNum,
      category: familyOrSeries || 'Intermediário',
    });
    // Auto-select first active service
    const dev = companyDevices.find((d) => d.id === model.id);
    if (dev && dev.services && dev.services.length > 0) {
      const firstActive = dev.services.find((s) => s.active);
      if (firstActive) {
        setSelectedService({
          id: firstActive.id,
          name: firstActive.name,
          category: firstActive.category,
          iconName: firstActive.iconName,
          hasQuality: firstActive.hasQuality,
          basePrice: firstActive.suggestedPrice || 100,
          minPrice: firstActive.minPrice,
          suggestedPrice: firstActive.suggestedPrice,
          maxPrice: firstActive.maxPrice,
          warranty: firstActive.warranty,
          estimatedTime: firstActive.estimatedTime,
          qualities: firstActive.qualities,
        });
      }
    }
  };

  const handleResetDevice = () => {
    setSelectedModel(null);
    setSelectedService(null);
  };

  // 1. Min, Suggested and Max Price bounds for the selected combination (model + service + quality + serviceType)
  const priceBounds = useMemo(() => {
    if (!selectedModel || !selectedService) {
      return { effectiveMin: 0, effectiveSuggested: 0, effectiveMax: 0 };
    }

    const extraFee = selectedServiceType?.extraFee || 0;

    if (serviceRequiresQuality && selectedQuality) {
      const qMin = selectedQuality.minPrice;
      const qSug = selectedQuality.suggestedPrice;
      const qMax = selectedQuality.maxPrice;
      if (typeof qMin === 'number' && typeof qSug === 'number' && typeof qMax === 'number') {
        return {
          effectiveMin: Math.max(10, Math.round(qMin + extraFee)),
          effectiveSuggested: Math.max(10, Math.round(qSug + extraFee)),
          effectiveMax: Math.max(10, Math.round(qMax + extraFee)),
        };
      }
    } else if (!serviceRequiresQuality) {
      const sMin = selectedService.minPrice;
      const sSug = selectedService.suggestedPrice;
      const sMax = selectedService.maxPrice;
      if (typeof sMin === 'number' && typeof sSug === 'number' && typeof sMax === 'number') {
        return {
          effectiveMin: Math.max(10, Math.round(sMin + extraFee)),
          effectiveSuggested: Math.max(10, Math.round(sSug + extraFee)),
          effectiveMax: Math.max(10, Math.round(sMax + extraFee)),
        };
      }
    }

    return calculatePriceBounds(
      companySettings,
      selectedModel as any,
      selectedService as any,
      selectedQuality,
      selectedServiceType
    );
  }, [
    selectedModel,
    selectedService,
    serviceRequiresQuality,
    selectedQuality,
    selectedServiceType,
    companySettings,
  ]);

  // 2. User-editable cash price state
  const [enteredPrice, setEnteredPrice] = useState<string>('');
  const [lastAutoKey, setLastAutoKey] = useState<string>('');

  // 3. Pre-fill with Preço Sugerido whenever the combination changes
  useEffect(() => {
    if (selectedModel && selectedService) {
      const key = `${selectedModel.id}_${selectedService.id}_${selectedQuality?.id}_${selectedServiceType?.id}`;
      if (key !== lastAutoKey) {
        setLastAutoKey(key);
        setEnteredPrice(priceBounds.effectiveSuggested.toString());
      }
    } else {
      setEnteredPrice('');
      setLastAutoKey('');
    }
  }, [
    selectedModel,
    selectedService,
    selectedQuality?.id,
    selectedServiceType?.id,
    priceBounds.effectiveSuggested,
    lastAutoKey,
  ]);

  // 4. Parse numeric price from entered string
  const numericCashPrice = useMemo(() => {
    if (!enteredPrice.trim()) return NaN;
    const sanitized = enteredPrice.replace(/\./g, '').replace(',', '.');
    return parseFloat(sanitized);
  }, [enteredPrice]);

  // 5. Validation logic: must be strictly between Preço Mínimo and Preço Máximo
  const priceValidationError = useMemo(() => {
    if (!selectedModel || !selectedService) return null;
    if (!enteredPrice.trim() || isNaN(numericCashPrice)) {
      return 'Informe um valor numérico válido para o orçamento.';
    }
    if (numericCashPrice < priceBounds.effectiveMin) {
      return `O valor mínimo permitido para este serviço é R$ ${priceBounds.effectiveMin}.`;
    }
    if (numericCashPrice > priceBounds.effectiveMax) {
      return `O valor máximo permitido para este serviço é R$ ${priceBounds.effectiveMax}.`;
    }
    return null;
  }, [
    selectedModel,
    selectedService,
    enteredPrice,
    numericCashPrice,
    priceBounds.effectiveMin,
    priceBounds.effectiveMax,
  ]);

  const isPriceValid = !priceValidationError && !isNaN(numericCashPrice) && numericCashPrice > 0;

  // 6. Pricing calculation adhering to: final chosen cash price + card installments
  const priceData = useMemo(() => {
    if (!selectedModel || !selectedService) {
      return { cash: 0, installments: 0, installmentsCount: 3, installmentValue: 0, additionalFee: 0 };
    }

    const finalCash = isPriceValid ? numericCashPrice : (priceBounds.effectiveSuggested || 0);
    // Card installments price has standard credit gateway margin (~9%)
    const finalInstallments = Math.max(10, Math.round(finalCash * 1.09));
    const installmentsCount = 3;
    const installmentValue = Number((finalInstallments / installmentsCount).toFixed(2));

    return {
      cash: finalCash,
      installments: finalInstallments,
      installmentsCount,
      installmentValue,
      additionalFee: selectedServiceType?.extraFee || 0,
    };
  }, [selectedModel, selectedService, isPriceValid, numericCashPrice, priceBounds.effectiveSuggested, selectedServiceType]);

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
    if (!selectedModel || !selectedService || !isPriceValid) return;

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
      qualityTier: serviceRequiresQuality ? (selectedQuality?.id || 'default') : 'na',
      qualityLabel: serviceRequiresQuality ? (selectedQuality?.label || 'Padrão') : 'Não se aplica',
      deliveryTime: customDeliveryTime,
      warranty: selectedWarranty,
      serviceTypeName: selectedServiceType?.name || 'Atendimento na Loja',
      serviceTypeId: selectedServiceType?.id,
      technicianId: selectedTechnician?.id,
      technicianName: selectedTechnician?.name || currentUser?.name || 'Técnico',
      storeName: currentStore.name,
      cashPrice: numericCashPrice, // O preço final efetivamente oferecido ao cliente
      installmentsPrice: priceData.installments,
      installmentsCount: priceData.installmentsCount,
      minAllowedPrice: priceBounds.effectiveMin,
      maxAllowedPrice: priceBounds.effectiveMax,
      suggestedPrice: priceBounds.effectiveSuggested,
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  2
                </span>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Serviço Solicitado
                </label>
              </div>
              {selectedModel && (
                <span className="text-[11px] text-slate-400 font-medium">
                  {availableServices.length} serviços cadastrados
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
              {availableServices.map((srv) => {
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
                          {typeof srv.suggestedPrice === 'number'
                            ? `Sugerido: R$ ${srv.suggestedPrice} (Min: ${srv.minPrice} • Max: ${srv.maxPrice})`
                            : `Base: R$ ${srv.basePrice.toFixed(2).replace('.', ',')}`}
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

          {/* STEP 3: QUALIDADE DA PEÇA - Apenas para Tela e Bateria conforme regra especial */}
          {serviceRequiresQuality && (
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                    {stepNumbers.quality}
                  </span>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Qualidade da Peça
                  </label>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Regra especial (Tela & Bateria)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {availableQualities.map((qual) => {
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
                        if (qual.estimatedTime) {
                          setCustomDeliveryTime(qual.estimatedTime);
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
                        {typeof qual.suggestedPrice === 'number' ? (
                          <span className="text-slate-700 font-bold text-[10px]">
                            R$ {qual.suggestedPrice}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Fator {qual.priceMultiplier}x</span>
                        )}
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
          )}

          {/* STEP 4 (ou 3): GARANTIA (Loaded dynamically from Company Settings + Custom typing) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  {stepNumbers.warranty}
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

            {/* Custom warranty text input */}
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

          {/* STEP 5 (ou 4): TIPO DE ATENDIMENTO (Loaded dynamically from Company Settings) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  {stepNumbers.serviceType}
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

          {/* STEP 6 (ou 5): TÉCNICO RESPONSÁVEL (Loaded dynamically from Company Settings) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  {stepNumbers.technician}
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

          {/* STEP 7 (ou 6): VALOR DO ORÇAMENTO (Editável dentro da faixa comercial) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  {stepNumbers.price}
                </span>
                <div>
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Preço do Serviço (Editável)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Preço sugerido preenchido automaticamente. Você pode ajustar livremente dentro da faixa comercial permitida.
                  </span>
                </div>
              </div>

              {selectedModel && selectedService && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto">
                  <span>Faixa permitida:</span>
                  <strong className="text-slate-900">
                    R$ {priceBounds.effectiveMin} – R$ {priceBounds.effectiveMax}
                  </strong>
                </div>
              )}
            </div>

            {selectedModel && selectedService ? (
              <div className="space-y-3 pt-1">
                {/* Quick preset chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Valores de Referência:
                  </span>
                  <button
                    type="button"
                    onClick={() => setEnteredPrice(priceBounds.effectiveMin.toString())}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                      numericCashPrice === priceBounds.effectiveMin
                        ? 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Mínimo: R$ {priceBounds.effectiveMin}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnteredPrice(priceBounds.effectiveSuggested.toString())}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-colors cursor-pointer ${
                      numericCashPrice === priceBounds.effectiveSuggested
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Sugerido: R$ {priceBounds.effectiveSuggested}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnteredPrice(priceBounds.effectiveMax.toString())}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                      numericCashPrice === priceBounds.effectiveMax
                        ? 'bg-blue-50 border-blue-300 text-blue-700 ring-1 ring-blue-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Máximo: R$ {priceBounds.effectiveMax}
                  </button>
                </div>

                {/* Main editable input field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      <span>Preço Final do Orçamento (R$)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                        R$
                      </div>
                      <input
                        id="quote-cash-price-input"
                        type="text"
                        value={enteredPrice}
                        onChange={(e) => setEnteredPrice(e.target.value)}
                        placeholder={priceBounds.effectiveSuggested.toString()}
                        className={`w-full pl-10 pr-24 py-2.5 bg-slate-50 border rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:bg-white transition-all ${
                          priceValidationError
                            ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-600 focus:ring-1 focus:ring-rose-500'
                            : 'border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-500'
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 font-medium pointer-events-none">
                        à vista
                      </div>
                    </div>
                  </div>

                  {/* Status / feedback message */}
                  <div className="pt-2 sm:pt-6">
                    {priceValidationError ? (
                      <div
                        id="price-validation-error-alert"
                        className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in duration-150"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{priceValidationError}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>Valor dentro da faixa permitida para o orçamento.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2.5">
                  <span>Faixa permitida: R$ {priceBounds.effectiveMin} – R$ {priceBounds.effectiveMax}</span>
                  <span>O cliente receberá apenas o preço final escolhido.</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                Selecione o aparelho e o serviço nos passos 1 e 2 para carregar a faixa de preço permitida.
              </div>
            )}
          </div>

          {/* STEP 8: DADOS DO CLIENTE & PRAZO (Opcional) */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">
                  8
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

              {serviceRequiresQuality && (
                <div className="flex justify-between border-b border-white/10 pb-2.5">
                  <span className="text-slate-400">{stepNumbers.quality}. Qualidade</span>
                  <span className="font-semibold text-white">
                    {selectedQuality ? selectedQuality.label : 'Padrão'}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">{stepNumbers.warranty}. Garantia</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedWarranty}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">{stepNumbers.serviceType}. Atendimento</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedServiceType?.name || 'Na Loja'}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-2.5">
                <span className="text-slate-400">{stepNumbers.technician}. Técnico</span>
                <span className="font-semibold text-white truncate max-w-[190px] text-right">
                  {selectedTechnician?.name || 'Equipe Técnica'}
                </span>
              </div>

              {/* Total Price breakdown */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs text-slate-300 block font-bold">Total à vista (Pix/Dinheiro)</span>
                    {selectedModel && selectedService && (
                      <span className="text-[11px] text-slate-400 block mt-0.5 font-medium">
                        Faixa permitida: R$ {priceBounds.effectiveMin} – R$ {priceBounds.effectiveMax}
                      </span>
                    )}
                    {isPriceValid && (
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Ou {priceData.installmentsCount}x de R${' '}
                        {priceData.installmentValue.toFixed(2).replace('.', ',')} no cartão
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl sm:text-3xl font-black ${isPriceValid ? 'text-blue-400' : 'text-rose-400'}`}>
                      {isPriceValid ? `R$ ${numericCashPrice.toFixed(2).replace('.', ',')}` : 'Valor Fora da Faixa'}
                    </span>
                  </div>
                </div>

                {/* Warning / Error banner when outside bounds */}
                {priceValidationError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span className="font-semibold">{priceValidationError}</span>
                  </div>
                )}
              </div>
            </div>

            {/* GERAR ORÇAMENTO Button */}
            <button
              id="btn-generate-quote-submit"
              type="button"
              disabled={!selectedModel || !selectedService || !isPriceValid}
              onClick={handleGenerateQuote}
              className={`w-full font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-5 uppercase tracking-wider text-xs sm:text-sm cursor-pointer ${
                selectedModel && selectedService && isPriceValid
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
              {selectedService?.name || 'serviço'}{serviceRequiresQuality && selectedQuality ? ` - ${selectedQuality.label}` : ''}) na modalidade{' '}
              <strong>{selectedServiceType?.name}</strong> ficou em{' '}
              <strong>R$ {isPriceValid ? numericCashPrice.toFixed(2).replace('.', ',') : (priceBounds.effectiveSuggested || 0).toFixed(2).replace('.', ',')}</strong> à vista com garantia de{' '}
              <strong>{selectedWarranty}</strong> com o técnico{' '}
              <strong>{selectedTechnician?.name}</strong>. Deseja aprovar agora?"
            </p>

            <button
              id="btn-quick-send-whatsapp-preview"
              type="button"
              onClick={handleGenerateQuote}
              disabled={!selectedModel || !selectedService || !isPriceValid}
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

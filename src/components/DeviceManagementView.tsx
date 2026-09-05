import React, { useState, useMemo, useEffect } from 'react';
import {
  Smartphone,
  Search,
  Plus,
  Copy,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Trash2,
  Edit2,
  AlertTriangle,
  Clock,
  Shield,
  Zap,
  Sparkles,
  Info,
  Maximize2,
  Battery,
  Camera,
  Volume2,
  Volume1,
  Cpu,
  Mic,
  Aperture,
  Eye,
  Activity,
  Radio,
  Vibrate,
  Terminal,
  Droplets,
  CheckCircle2,
  Sliders,
  Filter,
  ArrowRight,
  RefreshCw,
  Tag,
  ArrowLeft,
  Save,
} from 'lucide-react';
import { FullDeviceModel, DeviceServiceConfig, ServiceQualityConfig, BrandName, CompanyQuoteSettings } from '../types';
import {
  getCompanyDevices,
  saveSingleDevice,
  deleteSingleDevice,
  duplicateDeviceModel,
  applyServiceToMultipleModels,
  filterDevices,
  normalizeDevice,
  generateDefaultServicesForModel,
  INITIAL_SERVICE_DEFINITIONS,
  INITIAL_SCREEN_QUALITIES,
  INITIAL_BATTERY_QUALITIES,
} from '../data/deviceStorage';

interface DeviceManagementViewProps {
  companyId: string;
  companySettings: CompanyQuoteSettings;
  onNavigateNewQuote?: (brand?: BrandName) => void;
}

// Icon mapper for services
const getServiceIcon = (iconName?: string, className = 'w-4 h-4') => {
  switch (iconName) {
    case 'Smartphone':
      return <Smartphone className={className} />;
    case 'Maximize2':
      return <Maximize2 className={className} />;
    case 'Battery':
      return <Battery className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Volume2':
      return <Volume2 className={className} />;
    case 'Volume1':
      return <Volume1 className={className} />;
    case 'Aperture':
      return <Aperture className={className} />;
    case 'ScanFace':
      return <Eye className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Radio':
      return <Radio className={className} />;
    case 'Vibrate':
      return <Vibrate className={className} />;
    case 'Terminal':
      return <Terminal className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'CheckCircle2':
      return <CheckCircle2 className={className} />;
    default:
      return <Sliders className={className} />;
  }
};

const WARRANTY_OPTIONS = ['30 dias', '90 dias', '6 meses', '1 ano', 'Sem garantia'];

export const DeviceManagementView: React.FC<DeviceManagementViewProps> = ({
  companyId,
  companySettings,
  onNavigateNewQuote,
}) => {
  // Device catalog state
  const [devices, setDevices] = useState<FullDeviceModel[]>(() => getCompanyDevices(companyId));
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => {
    const list = getCompanyDevices(companyId);
    const ip13 = list.find((d) => d.name.includes('iPhone 13'));
    return ip13 ? ip13.id : list[0]?.id || '';
  });

  // Search & Brand Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandName | 'Todas'>('Todas');

  // Currently viewed device (for editing)
  const currentDevice = useMemo(() => {
    return devices.find((d) => d.id === selectedDeviceId) || devices[0] || null;
  }, [devices, selectedDeviceId]);

  // Accordion expanded states for services (by serviceId)
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>(() => {
    // Open 'Troca de Tela' and 'Troca de Bateria' by default for quick view
    return {
      'srv-tela': true,
      'srv-bateria': false,
    };
  });

  // Modal States
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [dupName, setDupName] = useState('');
  const [dupFamily, setDupFamily] = useState('');
  const [dupYear, setDupYear] = useState<string>('');

  const [isApplyMultipleModalOpen, setIsApplyMultipleModalOpen] = useState(false);
  const [applyServiceChoice, setApplyServiceChoice] = useState<string>('ALL');
  const [applyTargetIds, setApplyTargetIds] = useState<string[]>([]);
  const [applySearchTerm, setApplySearchTerm] = useState('');
  const [applyBrandFilter, setApplyBrandFilter] = useState<BrandName | 'Todas'>('Todas');

  const [isNewDeviceModalOpen, setIsNewDeviceModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState<BrandName>('Apple');
  const [newName, setNewName] = useState('');
  const [newFamily, setNewFamily] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newCategory, setNewCategory] = useState<'Premium' | 'Intermediário' | 'Entrada'>('Intermediário');

  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceHasQuality, setNewServiceHasQuality] = useState(false);

  const [isAddQualityModalOpen, setIsAddQualityModalOpen] = useState(false);
  const [qualityServiceTarget, setQualityServiceTarget] = useState<DeviceServiceConfig | null>(null);
  const [newQualityName, setNewQualityName] = useState('');
  const [newQualityMin, setNewQualityMin] = useState<number>(300);
  const [newQualitySug, setNewQualitySug] = useState<number>(350);
  const [newQualityMax, setNewQualityMax] = useState<number>(420);
  const [newQualityWarranty, setNewQualityWarranty] = useState('90 dias');
  const [newQualityTime, setNewQualityTime] = useState('45 minutos');
  const [newQualityNotes, setNewQualityNotes] = useState('');

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Sync devices if companyId changes
  useEffect(() => {
    const list = getCompanyDevices(companyId);
    setDevices(list);
    if (!list.some((d) => d.id === selectedDeviceId) && list[0]) {
      setSelectedDeviceId(list[0].id);
    }
  }, [companyId]);

  // Filtered devices list for master sidebar
  const filteredDevices = useMemo(() => {
    return filterDevices(devices, searchTerm, selectedBrand);
  }, [devices, searchTerm, selectedBrand]);

  // Toggle single accordion
  const toggleServiceAccordion = (serviceId: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  // Expand / collapse all
  const handleExpandAll = () => {
    if (!currentDevice) return;
    const allExpanded: Record<string, boolean> = {};
    currentDevice.services.forEach((s) => {
      allExpanded[s.serviceId] = true;
    });
    setExpandedServices(allExpanded);
  };

  const handleCollapseAll = () => {
    setExpandedServices({});
  };

  // Update current device fields
  const handleUpdateDeviceMeta = (updates: Partial<FullDeviceModel>) => {
    if (!currentDevice) return;
    const updated: FullDeviceModel = { ...currentDevice, ...updates };
    const newDevices = saveSingleDevice(companyId, updated);
    setDevices(newDevices);
    showToast('Informações do aparelho salvas com sucesso.');
  };

  // Toggle service active status for current device
  const handleToggleServiceActive = (serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentDevice) return;

    const updatedServices = currentDevice.services.map((s) =>
      s.serviceId === serviceId ? { ...s, active: !s.active } : s
    );

    const updated: FullDeviceModel = { ...currentDevice, services: updatedServices };
    const newDevices = saveSingleDevice(companyId, updated);
    setDevices(newDevices);
    showToast('Status do serviço atualizado.');
  };

  // Update a direct price service (when hasQuality === false)
  const handleUpdateDirectService = (
    serviceId: string,
    updates: {
      minPrice?: number;
      suggestedPrice?: number;
      maxPrice?: number;
      warranty?: string;
      estimatedTime?: string;
      internalNotes?: string;
      active?: boolean;
    }
  ) => {
    if (!currentDevice) return;

    const updatedServices = currentDevice.services.map((s) => {
      if (s.serviceId === serviceId) {
        return {
          ...s,
          ...updates,
        };
      }
      return s;
    });

    const updated: FullDeviceModel = { ...currentDevice, services: updatedServices };
    const newDevices = saveSingleDevice(companyId, updated);
    setDevices(newDevices);
  };

  // Update a quality item inside a quality-enabled service (Tela or Bateria)
  const handleUpdateQualityItem = (
    serviceId: string,
    qualityId: string,
    updates: Partial<ServiceQualityConfig>
  ) => {
    if (!currentDevice) return;

    const updatedServices = currentDevice.services.map((s) => {
      if (s.serviceId === serviceId && s.qualities) {
        const updatedQualities = s.qualities.map((q) => (q.id === qualityId ? { ...q, ...updates } : q));
        return { ...s, qualities: updatedQualities };
      }
      return s;
    });

    const updated: FullDeviceModel = { ...currentDevice, services: updatedServices };
    const newDevices = saveSingleDevice(companyId, updated);
    setDevices(newDevices);
  };

  // Delete a quality item
  const handleDeleteQualityItem = (serviceId: string, qualityId: string) => {
    if (!currentDevice) return;
    const srv = currentDevice.services.find((s) => s.serviceId === serviceId);
    if (srv && srv.qualities && srv.qualities.length <= 1) {
      alert('O serviço deve possuir ao menos uma opção de qualidade cadastrada.');
      return;
    }

    const updatedServices = currentDevice.services.map((s) => {
      if (s.serviceId === serviceId && s.qualities) {
        return { ...s, qualities: s.qualities.filter((q) => q.id !== qualityId) };
      }
      return s;
    });

    const updated: FullDeviceModel = { ...currentDevice, services: updatedServices };
    const newDevices = saveSingleDevice(companyId, updated);
    setDevices(newDevices);
    showToast('Qualidade removida.');
  };

  // Open Add Quality Modal
  const handleOpenAddQualityModal = (service: DeviceServiceConfig) => {
    setQualityServiceTarget(service);
    setNewQualityName('');
    setNewQualityMin(300);
    setNewQualitySug(360);
    setNewQualityMax(430);
    setNewQualityWarranty('90 dias');
    setNewQualityTime('45 minutos');
    setNewQualityNotes('');
    setIsAddQualityModalOpen(true);
  };

  // Confirm Add Quality
  const handleConfirmAddQuality = () => {
    if (!currentDevice || !qualityServiceTarget || !newQualityName.trim()) return;

    const newQuality: ServiceQualityConfig = {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: newQualityName.trim(),
      minPrice: Number(newQualityMin) || 100,
      suggestedPrice: Number(newQualitySug) || 150,
      maxPrice: Number(newQualityMax) || 200,
      warranty: newQualityWarranty,
      estimatedTime: newQualityTime || '45 minutos',
      internalNotes: newQualityNotes,
      active: true,
    };

    const updatedServices = currentDevice.services.map((s) => {
      if (s.serviceId === qualityServiceTarget.serviceId) {
        return {
          ...s,
          qualities: [...(s.qualities || []), newQuality],
        };
      }
      return s;
    });

    const updated: FullDeviceModel = { ...currentDevice, services: updatedServices };
    const newDevices = saveSingleDevice(companyId, updated);
    setDevices(newDevices);
    setIsAddQualityModalOpen(false);
    showToast(`Nova qualidade "${newQualityName}" adicionada com sucesso.`);
  };

  // Add a brand new custom service to the device
  const handleConfirmAddNewService = () => {
    if (!currentDevice || !newServiceName.trim()) return;

    const newServiceId = `srv-custom-${Date.now()}`;
    const newService: DeviceServiceConfig = {
      id: `cfg-${newServiceId}`,
      serviceId: newServiceId,
      serviceName: newServiceName.trim(),
      category: 'Geral',
      iconName: 'Wrench',
      hasQuality: newServiceHasQuality,
      active: true,
      ...(newServiceHasQuality
        ? {
            qualities: [
              {
                id: `q-${Date.now()}-1`,
                name: 'Padrão / Original',
                minPrice: 150,
                suggestedPrice: 190,
                maxPrice: 240,
                warranty: '90 dias',
                estimatedTime: '40 minutos',
                active: true,
              },
            ],
          }
        : {
            minPrice: 140,
            suggestedPrice: 180,
            maxPrice: 230,
            warranty: '90 dias',
            estimatedTime: '40 minutos',
          }),
    };

    const updatedServices = [...currentDevice.services, newService];
    const updated: FullDeviceModel = { ...currentDevice, services: updatedServices };
    const newDevices = saveSingleDevice(companyId, updated);
    setDevices(newDevices);

    // Expand new service immediately
    setExpandedServices((prev) => ({ ...prev, [newServiceId]: true }));
    setIsNewServiceModalOpen(false);
    setNewServiceName('');
    setNewServiceHasQuality(false);
    showToast(`Serviço "${newServiceName}" cadastrado no aparelho.`);
  };

  // Open Duplicate Modal
  const handleOpenDuplicateModal = () => {
    if (!currentDevice) return;
    setDupName(`${currentDevice.name} Pro`);
    setDupFamily(currentDevice.family ? `${currentDevice.family} Pro` : '');
    setDupYear(currentDevice.year ? String(currentDevice.year) : '');
    setIsDuplicateModalOpen(true);
  };

  // Confirm Duplicate
  const handleConfirmDuplicate = () => {
    if (!currentDevice || !dupName.trim()) return;

    try {
      const { updatedDevices, newDevice } = duplicateDeviceModel(
        companyId,
        currentDevice.id,
        dupName.trim(),
        dupFamily.trim() || undefined,
        dupYear ? Number(dupYear) : undefined
      );

      setDevices(updatedDevices);
      setSelectedDeviceId(newDevice.id);
      setIsDuplicateModalOpen(false);
      showToast(`Aparelho duplicado como "${dupName}". Pronto para personalização!`);
    } catch (err: any) {
      alert(err.message || 'Erro ao duplicar aparelho.');
    }
  };

  // Open Apply Multiple Modal
  const handleOpenApplyMultipleModal = () => {
    if (!currentDevice) return;
    setApplyServiceChoice('ALL');
    setApplyTargetIds([]);
    setApplySearchTerm('');
    setApplyBrandFilter('Todas');
    setIsApplyMultipleModalOpen(true);
  };

  // Confirm Apply Multiple
  const handleConfirmApplyMultiple = () => {
    if (!currentDevice || applyTargetIds.length === 0) {
      alert('Selecione ao menos um aparelho de destino.');
      return;
    }

    try {
      const updatedDevices = applyServiceToMultipleModels(
        companyId,
        currentDevice.id,
        applyServiceChoice,
        applyTargetIds
      );

      setDevices(updatedDevices);
      setIsApplyMultipleModalOpen(false);
      showToast(`Configuração aplicada com sucesso a ${applyTargetIds.length} aparelhos.`);
    } catch (err: any) {
      alert(err.message || 'Erro ao propagar serviço.');
    }
  };

  // Create Brand New Device
  const handleConfirmCreateNewDevice = () => {
    if (!newName.trim()) return;

    const brand = newBrand;
    const name = newName.trim();
    const family = newFamily.trim() || `Linha ${name}`;
    const year = newYear ? Number(newYear) : undefined;
    const newId = `dev-new-${Date.now()}`;

    const newDevice: FullDeviceModel = {
      id: newId,
      companyId: companyId,
      brand: brand,
      name: name,
      family: family,
      year: year,
      active: true,
      category: newCategory,
      services: INITIAL_SERVICE_DEFINITIONS.map((def) => {
        if (def.name === 'Troca de Tela') {
          return {
            id: `cfg-${def.id}-${newId}`,
            serviceId: def.id,
            serviceName: def.name,
            category: def.category,
            iconName: def.iconName,
            hasQuality: true,
            active: true,
            qualities: INITIAL_SCREEN_QUALITIES.map((q, idx) => ({
              id: `q-tela-${newId}-${idx}`,
              name: q.name,
              minPrice: q.minPrice,
              suggestedPrice: q.sugPrice,
              maxPrice: q.maxPrice,
              warranty: q.warranty,
              estimatedTime: q.time,
              active: true,
            })),
          };
        }
        if (def.name === 'Troca de Bateria') {
          return {
            id: `cfg-${def.id}-${newId}`,
            serviceId: def.id,
            serviceName: def.name,
            category: def.category,
            iconName: def.iconName,
            hasQuality: true,
            active: true,
            qualities: INITIAL_BATTERY_QUALITIES.map((q, idx) => ({
              id: `q-bat-${newId}-${idx}`,
              name: q.name,
              minPrice: q.minPrice,
              suggestedPrice: q.sugPrice,
              maxPrice: q.maxPrice,
              warranty: q.warranty,
              estimatedTime: q.time,
              active: true,
            })),
          };
        }
        return {
          id: `cfg-${def.id}-${newId}`,
          serviceId: def.id,
          serviceName: def.name,
          category: def.category,
          iconName: def.iconName,
          hasQuality: false,
          active: true,
          minPrice: 140,
          suggestedPrice: 180,
          maxPrice: 230,
          warranty: '90 dias',
          estimatedTime: '40 minutos',
        };
      }),
    };

    const newDevices = saveSingleDevice(companyId, newDevice);
    setDevices(newDevices);
    setSelectedDeviceId(newId);
    setIsNewDeviceModalOpen(false);
    setNewName('');
    setNewFamily('');
    setNewYear('');
    showToast(`Aparelho "${name}" cadastrado com sucesso.`);
  };

  // Delete current device
  const handleDeleteCurrentDevice = () => {
    if (!currentDevice) return;
    if (devices.length <= 1) {
      alert('Não é possível excluir o único aparelho cadastrado.');
      return;
    }

    if (confirm(`Tem certeza que deseja excluir o modelo "${currentDevice.name}" e todas as suas configurações?`)) {
      const updated = deleteSingleDevice(companyId, currentDevice.id);
      setDevices(updated);
      setSelectedDeviceId(updated[0]?.id || '');
      showToast('Aparelho excluído.');
    }
  };

  // Quick brand select pills
  const brandPills: (BrandName | 'Todas')[] = ['Todas', 'Apple', 'Samsung', 'Motorola', 'Xiaomi'];

  // Count active services in current device
  const activeServicesCount = useMemo(() => {
    if (!currentDevice) return 0;
    return currentDevice.services.filter((s) => s.active).length;
  }, [currentDevice]);

  return (
    <div className="space-y-6 pb-12">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            ✓
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner: Single-screen device catalog */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200/60 uppercase tracking-wider">
              Painel Unificado
            </span>
            <span className="text-xs text-slate-400 font-medium">Gestão Comercial de Modelos</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
            Cadastro Completo do Aparelho
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Gerencie todas as informações de um modelo em uma única tela: serviços, qualidades de tela e bateria, preços (Mínimo, Sugerido, Máximo), prazos e garantias.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-new-device-modal"
            onClick={() => setIsNewDeviceModalOpen(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Aparelho</span>
          </button>

          {currentDevice && (
            <>
              <button
                id="btn-duplicate-device"
                onClick={handleOpenDuplicateModal}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Duplicar configurações para um novo modelo"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Duplicar Aparelho</span>
              </button>

              <button
                id="btn-apply-multiple"
                onClick={handleOpenApplyMultipleModal}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Aplicar serviço deste modelo em vários outros"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Aplicar em Vários Modelos</span>
                <span className="sm:hidden">Propagar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Two-Column Layout (Quick Search & Switcher on Left / Full Detail Canvas on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Device Switcher & Quick Search (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Aparelhos Cadastrados ({filteredDevices.length})
              </span>
              <span className="text-[11px] text-slate-400">Clique para abrir</span>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="search-device-quick-input"
                type="text"
                placeholder="Pesquisar iPhone 13, A55, Moto G..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Brand Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {brandPills.map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBrand(b)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedBrand === b
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Device List Scrollable */}
            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {filteredDevices.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  Nenhum aparelho encontrado para "{searchTerm}".
                </div>
              ) : (
                filteredDevices.map((d) => {
                  const isSelected = d.id === selectedDeviceId;
                  return (
                    <button
                      key={d.id}
                      id={`select-device-${d.id}`}
                      onClick={() => setSelectedDeviceId(d.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              d.brand === 'Apple'
                                ? 'bg-slate-800 text-white'
                                : d.brand === 'Samsung'
                                ? 'bg-blue-700 text-white'
                                : d.brand === 'Motorola'
                                ? 'bg-cyan-700 text-white'
                                : 'bg-orange-600 text-white'
                            }`}
                          >
                            {d.brand}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">{d.name}</span>
                          {!d.active && (
                            <span className="text-[9px] bg-red-50 text-red-600 border border-red-200 px-1 rounded">
                              Inativo
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {d.family} {d.year ? `• ${d.year}` : ''} • {d.services.filter((s) => s.active).length} serviços
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`text-[10px] font-bold ${
                            isSelected ? 'text-blue-600' : 'text-slate-400'
                          }`}
                        >
                          {isSelected ? 'Editando' : 'Abrir →'}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Full Single-Screen Management of Selected Device (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentDevice ? (
            <div className="space-y-6">
              {/* 1. Device Info Header Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {currentDevice.brand === 'Apple'
                        ? '🍎'
                        : currentDevice.brand === 'Samsung'
                        ? '📱'
                        : currentDevice.brand === 'Motorola'
                        ? 'Ⓜ️'
                        : '⚡'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-slate-900">
                          {currentDevice.brand} {currentDevice.name}
                        </h2>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            currentDevice.active
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {currentDevice.active ? 'Aparelho Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {currentDevice.family} {currentDevice.year ? `• Lançamento ${currentDevice.year}` : ''} • ID: {currentDevice.id}
                      </div>
                    </div>
                  </div>

                  {/* Actions for current model */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDeleteCurrentDevice}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                      title="Excluir aparelho"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form Inputs for Brand, Model, Family, Year, Active */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Marca *
                    </label>
                    <select
                      value={currentDevice.brand}
                      onChange={(e) => handleUpdateDeviceMeta({ brand: e.target.value as BrandName })}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Motorola">Motorola</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Outras">Outras</option>
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Modelo do Aparelho *
                    </label>
                    <input
                      type="text"
                      value={currentDevice.name}
                      onChange={(e) => handleUpdateDeviceMeta({ name: e.target.value })}
                      placeholder="Ex: iPhone 13"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Linha / Família
                    </label>
                    <input
                      type="text"
                      value={currentDevice.family}
                      onChange={(e) => handleUpdateDeviceMeta({ family: e.target.value })}
                      placeholder="Ex: Linha iPhone 13"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Ano (Opcional)
                    </label>
                    <input
                      type="number"
                      value={currentDevice.year || ''}
                      onChange={(e) =>
                        handleUpdateDeviceMeta({
                          year: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="Ex: 2021"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Status Toggle Row */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={currentDevice.active}
                      onChange={(e) => handleUpdateDeviceMeta({ active: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Disponível para orçamentos na loja
                    </span>
                  </label>

                  <div className="text-[11px] text-slate-400">
                    Alterações salvas instantaneamente
                  </div>
                </div>
              </div>

              {/* 2. Services Section Header with Accordion Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Serviços & Preços do {currentDevice.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {currentDevice.services.length} serviços cadastrados ({activeServicesCount} ativos).
                    Tela e Bateria possuem qualidades; os demais possuem preços diretos.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExpandAll}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  >
                    Expandir Todos
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600"
                  >
                    Recolher Todos
                  </button>
                  <button
                    onClick={() => setIsNewServiceModalOpen(true)}
                    className="px-3 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Adicionar Serviço</span>
                  </button>
                </div>
              </div>

              {/* 3. Services Accordion List */}
              <div className="space-y-3">
                {currentDevice.services.map((service, sIndex) => {
                  const isExpanded = !!expandedServices[service.serviceId];
                  const hasQuality = service.hasQuality; // Only Tela and Bateria

                  return (
                    <div
                      key={service.serviceId || sIndex}
                      id={`service-card-${service.serviceId}`}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                        service.active
                          ? isExpanded
                            ? 'border-blue-300 shadow-xs'
                            : 'border-slate-200/90 hover:border-slate-300'
                          : 'border-slate-200 bg-slate-50/70 opacity-75'
                      }`}
                    >
                      {/* Accordion Header Row */}
                      <div
                        onClick={() => toggleServiceAccordion(service.serviceId)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-white hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Service Icon */}
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              service.active
                                ? hasQuality
                                  ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {getServiceIcon(service.iconName)}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                {service.serviceName}
                              </span>

                              {hasQuality ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200/80 whitespace-nowrap">
                                  {service.qualities?.length || 0} Qualidades
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full border border-slate-200 whitespace-nowrap">
                                  Preço Direto
                                </span>
                              )}
                            </div>

                            {/* Summary description */}
                            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {hasQuality ? (
                                <span>
                                  Qualidades: {service.qualities?.map((q) => q.name).join(', ') || 'Nenhuma'}
                                </span>
                              ) : (
                                <span>
                                  Mín: R$ {service.minPrice || 0} • Sugerido: R$ {service.suggestedPrice || 0} • Máx: R$ {service.maxPrice || 0} • {service.warranty || '90 dias'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Active / Inactive Toggle */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleServiceActive(service.serviceId, e)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                              service.active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {service.active ? 'Ativo' : 'Desativado'}
                          </button>

                          {/* Chevron */}
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {/* Accordion Content Body */}
                      {isExpanded && (
                        <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 bg-slate-50/40 space-y-4">
                          {/* CASE A: Service has Quality (TROCA DE TELA and TROCA DE BATERIA) */}
                          {hasQuality ? (
                            <div className="space-y-4 pt-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/60 p-3 rounded-xl border border-blue-200/50">
                                <div className="text-xs text-blue-900 font-medium">
                                  <strong>Regra Especial:</strong> Este serviço possui opções de qualidade independentes com preços, garantias e prazos específicos por peça.
                                </div>
                                <button
                                  onClick={() => handleOpenAddQualityModal(service)}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>+ Adicionar Qualidade</span>
                                </button>
                              </div>

                              {/* Qualities Grid */}
                              <div className="space-y-3">
                                {service.qualities?.map((quality) => (
                                  <div
                                    key={quality.id}
                                    id={`quality-card-${quality.id}`}
                                    className={`p-4 rounded-xl border transition-all ${
                                      quality.active
                                        ? 'bg-white border-slate-200 shadow-xs'
                                        : 'bg-slate-100/80 border-slate-200 opacity-60'
                                    }`}
                                  >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                        <input
                                          type="text"
                                          value={quality.name}
                                          onChange={(e) =>
                                            handleUpdateQualityItem(service.serviceId, quality.id, {
                                              name: e.target.value,
                                            })
                                          }
                                          className="text-xs sm:text-sm font-bold text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 focus:outline-none px-1"
                                        />
                                        <span className="text-[10px] text-slate-400 font-normal">
                                          (Clique no nome para editar)
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleUpdateQualityItem(service.serviceId, quality.id, {
                                              active: !quality.active,
                                            })
                                          }
                                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                            quality.active
                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                              : 'bg-slate-200 text-slate-600'
                                          }`}
                                        >
                                          {quality.active ? 'Qualidade Ativa' : 'Inativa'}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleDeleteQualityItem(service.serviceId, quality.id)}
                                          className="text-slate-400 hover:text-red-600 p-1"
                                          title="Excluir qualidade"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* 3 Price Fields (Min, Suggested, Max) + Warranty + Time */}
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3">
                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                          Preço Mínimo (R$)
                                        </label>
                                        <input
                                          type="number"
                                          min="10"
                                          step="1"
                                          value={quality.minPrice}
                                          onChange={(e) =>
                                            handleUpdateQualityItem(service.serviceId, quality.id, {
                                              minPrice: Number(e.target.value),
                                            })
                                          }
                                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">
                                          Preço Sugerido (R$) *
                                        </label>
                                        <input
                                          type="number"
                                          min="10"
                                          step="1"
                                          value={quality.suggestedPrice}
                                          onChange={(e) =>
                                            handleUpdateQualityItem(service.serviceId, quality.id, {
                                              suggestedPrice: Number(e.target.value),
                                            })
                                          }
                                          className="w-full px-2.5 py-1.5 bg-blue-50/50 border border-blue-300 rounded-lg text-xs font-bold text-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                          Preço Máximo (R$)
                                        </label>
                                        <input
                                          type="number"
                                          min="10"
                                          step="1"
                                          value={quality.maxPrice}
                                          onChange={(e) =>
                                            handleUpdateQualityItem(service.serviceId, quality.id, {
                                              maxPrice: Number(e.target.value),
                                            })
                                          }
                                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                          Garantia
                                        </label>
                                        <select
                                          value={quality.warranty}
                                          onChange={(e) =>
                                            handleUpdateQualityItem(service.serviceId, quality.id, {
                                              warranty: e.target.value,
                                            })
                                          }
                                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                        >
                                          {WARRANTY_OPTIONS.map((w) => (
                                            <option key={w} value={w}>
                                              {w}
                                            </option>
                                          ))}
                                        </select>
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                          Prazo Estimado
                                        </label>
                                        <input
                                          type="text"
                                          value={quality.estimatedTime}
                                          onChange={(e) =>
                                            handleUpdateQualityItem(service.serviceId, quality.id, {
                                              estimatedTime: e.target.value,
                                            })
                                          }
                                          placeholder="Ex: 45 minutos"
                                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                        />
                                      </div>
                                    </div>

                                    {/* Optional internal notes */}
                                    <div className="pt-2">
                                      <input
                                        type="text"
                                        value={quality.internalNotes || ''}
                                        onChange={(e) =>
                                          handleUpdateQualityItem(service.serviceId, quality.id, {
                                            internalNotes: e.target.value,
                                          })
                                        }
                                        placeholder="Observação interna (opcional: lote, fornecedor, recomendação técnica)"
                                        className="w-full px-2.5 py-1 bg-transparent border-b border-dashed border-slate-200 text-[11px] text-slate-600 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            /* CASE B: Service DOES NOT have quality (all other 21 services) */
                            <div className="pt-3 space-y-3">
                              <div className="text-[11px] text-slate-500">
                                Preços e prazos definidos diretamente para este serviço (sem seleção de qualidade):
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Preço Mínimo (R$)
                                  </label>
                                  <input
                                    type="number"
                                    min="10"
                                    step="1"
                                    value={service.minPrice ?? 140}
                                    onChange={(e) =>
                                      handleUpdateDirectService(service.serviceId, {
                                        minPrice: Number(e.target.value),
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">
                                    Preço Sugerido (R$) *
                                  </label>
                                  <input
                                    type="number"
                                    min="10"
                                    step="1"
                                    value={service.suggestedPrice ?? 180}
                                    onChange={(e) =>
                                      handleUpdateDirectService(service.serviceId, {
                                        suggestedPrice: Number(e.target.value),
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 bg-blue-50/50 border border-blue-300 rounded-lg text-xs font-bold text-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Preço Máximo (R$)
                                  </label>
                                  <input
                                    type="number"
                                    min="10"
                                    step="1"
                                    value={service.maxPrice ?? 230}
                                    onChange={(e) =>
                                      handleUpdateDirectService(service.serviceId, {
                                        maxPrice: Number(e.target.value),
                                      })
                                    }
                                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Garantia
                                  </label>
                                  <select
                                    value={service.warranty || '90 dias'}
                                    onChange={(e) =>
                                      handleUpdateDirectService(service.serviceId, {
                                        warranty: e.target.value,
                                      })
                                    }
                                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                  >
                                    {WARRANTY_OPTIONS.map((w) => (
                                      <option key={w} value={w}>
                                        {w}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                                    Prazo Estimado
                                  </label>
                                  <input
                                    type="text"
                                    value={service.estimatedTime || '40 minutos'}
                                    onChange={(e) =>
                                      handleUpdateDirectService(service.serviceId, {
                                        estimatedTime: e.target.value,
                                      })
                                    }
                                    placeholder="Ex: 40 minutos"
                                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>

                              <div>
                                <input
                                  type="text"
                                  value={service.internalNotes || ''}
                                  onChange={(e) =>
                                    handleUpdateDirectService(service.serviceId, {
                                      internalNotes: e.target.value,
                                    })
                                  }
                                  placeholder="Observação interna para este serviço (opcional)"
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
              Selecione um aparelho na lista ao lado para abrir o cadastro unificado.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: DUPLICAR APARELHO */}
      {isDuplicateModalOpen && currentDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Copy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Duplicar Aparelho</h3>
                  <p className="text-[11px] text-slate-500">Copia todos os 23 serviços, qualidades e faixas</p>
                </div>
              </div>
              <button
                onClick={() => setIsDuplicateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              Baseado no aparelho: <strong>{currentDevice.brand} {currentDevice.name}</strong>.
              Você poderá ajustar apenas os preços e detalhes específicos no novo modelo criado.
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Novo Modelo *
                </label>
                <input
                  type="text"
                  value={dupName}
                  onChange={(e) => setDupName(e.target.value)}
                  placeholder="Ex: iPhone 13 Pro"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Linha / Família
                </label>
                <input
                  type="text"
                  value={dupFamily}
                  onChange={(e) => setDupFamily(e.target.value)}
                  placeholder="Ex: Linha iPhone 13 Pro"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ano (Opcional)
                </label>
                <input
                  type="number"
                  value={dupYear}
                  onChange={(e) => setDupYear(e.target.value)}
                  placeholder="Ex: 2021"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDuplicateModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDuplicate}
                disabled={!dupName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Criar Cópia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: APLICAR EM VÁRIOS MODELOS */}
      {isApplyMultipleModalOpen && currentDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Aplicar em Vários Modelos</h3>
                  <p className="text-[11px] text-slate-500">Propagar configuração de serviços em lote</p>
                </div>
              </div>
              <button
                onClick={() => setIsApplyMultipleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 shrink-0">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Selecione o que deseja replicar de {currentDevice.brand} {currentDevice.name}:
                </label>
                <select
                  value={applyServiceChoice}
                  onChange={(e) => setApplyServiceChoice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Todos os serviços ({currentDevice.services.length} serviços completos)</option>
                  <option value="srv-tela">Apenas Troca de Tela (e todas as qualidades)</option>
                  <option value="srv-bateria">Apenas Troca de Bateria (e todas as qualidades)</option>
                  {currentDevice.services
                    .filter((s) => s.serviceId !== 'srv-tela' && s.serviceId !== 'srv-bateria')
                    .map((s) => (
                      <option key={s.serviceId} value={s.serviceId}>
                        Apenas {s.serviceName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  2. Selecione os Aparelhos de Destino ({applyTargetIds.length} selecionados):
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const otherIds = devices
                        .filter((d) => d.id !== currentDevice.id && (applyBrandFilter === 'Todas' || d.brand === applyBrandFilter))
                        .map((d) => d.id);
                      setApplyTargetIds(otherIds);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                  >
                    Marcar Todos
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setApplyTargetIds([])}
                    className="text-[11px] font-bold text-slate-500 hover:underline cursor-pointer"
                  >
                    Desmarcar
                  </button>
                </div>
              </div>

              {/* Filters for target selection */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filtrar por nome..."
                    value={applySearchTerm}
                    onChange={(e) => setApplySearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <select
                  value={applyBrandFilter}
                  onChange={(e) => setApplyBrandFilter(e.target.value as any)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <option value="Todas">Todas marcas</option>
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Motorola">Motorola</option>
                  <option value="Xiaomi">Xiaomi</option>
                </select>
              </div>
            </div>

            {/* Checklist of devices */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 max-h-56">
              {devices
                .filter((d) => d.id !== currentDevice.id)
                .filter((d) => (applyBrandFilter === 'Todas' ? true : d.brand === applyBrandFilter))
                .filter((d) => (applySearchTerm ? d.name.toLowerCase().includes(applySearchTerm.toLowerCase()) : true))
                .map((d) => {
                  const isChecked = applyTargetIds.includes(d.id);
                  return (
                    <label
                      key={d.id}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer select-none transition-colors ${
                        isChecked ? 'bg-blue-50 font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApplyTargetIds((prev) => [...prev, d.id]);
                            } else {
                              setApplyTargetIds((prev) => prev.filter((id) => id !== d.id));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{d.brand} {d.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{d.family}</span>
                    </label>
                  );
                })}
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => setIsApplyMultipleModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmApplyMultiple}
                disabled={applyTargetIds.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar em {applyTargetIds.length} Modelos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: NOVO APARELHO */}
      {isNewDeviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Novo Aparelho</h3>
                  <p className="text-[11px] text-slate-500">Cadastre um modelo e seus 23 serviços</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewDeviceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marca *
                </label>
                <select
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value as BrandName)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="Apple">Apple</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Motorola">Motorola</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Outras">Outras</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: iPhone 13, Galaxy A55 5G, Moto G54"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Linha / Família
                  </label>
                  <input
                    type="text"
                    value={newFamily}
                    onChange={(e) => setNewFamily(e.target.value)}
                    placeholder="Ex: Linha iPhone"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ano (Opcional)
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Ex: 2024"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewDeviceModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmCreateNewDevice}
                disabled={!newName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Aparelho</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADICIONAR QUALIDADE (Tela ou Bateria) */}
      {isAddQualityModalOpen && qualityServiceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Nova Qualidade ({qualityServiceTarget.serviceName})
                  </h3>
                  <p className="text-[11px] text-slate-500">Defina faixa de preços, garantia e prazo</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddQualityModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome da Qualidade *
                </label>
                <input
                  type="text"
                  value={newQualityName}
                  onChange={(e) => setNewQualityName(e.target.value)}
                  placeholder={
                    qualityServiceTarget.serviceName.includes('Tela')
                      ? 'Ex: Premium OLED, Incell, Original Importada'
                      : 'Ex: Bateria Gold, Original Nacional, Primeira Linha'
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Mínimo (R$) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={newQualityMin}
                    onChange={(e) => setNewQualityMin(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-blue-700 uppercase mb-1">
                    Sugerido (R$) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={newQualitySug}
                    onChange={(e) => setNewQualitySug(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-blue-300 rounded-lg text-xs font-bold text-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                    Máximo (R$) *
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={newQualityMax}
                    onChange={(e) => setNewQualityMax(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Garantia
                  </label>
                  <select
                    value={newQualityWarranty}
                    onChange={(e) => setNewQualityWarranty(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {WARRANTY_OPTIONS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prazo Estimado
                  </label>
                  <input
                    type="text"
                    value={newQualityTime}
                    onChange={(e) => setNewQualityTime(e.target.value)}
                    placeholder="Ex: 45 minutos"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observação Interna (Opcional)
                </label>
                <input
                  type="text"
                  value={newQualityNotes}
                  onChange={(e) => setNewQualityNotes(e.target.value)}
                  placeholder="Ex: Fornecedor homologado, taxa de retorno baixa"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddQualityModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAddQuality}
                disabled={!newQualityName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Qualidade</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADICIONAR NOVO SERVIÇO AO MODELO */}
      {isNewServiceModalOpen && currentDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Novo Serviço para {currentDevice.name}</h3>
                  <p className="text-[11px] text-slate-500">Crie um serviço personalizado</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Serviço *
                </label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Ex: Gravação a Laser, Troca de Aro, Recuperação Face ID"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="chk-has-quality"
                  checked={newServiceHasQuality}
                  onChange={(e) => setNewServiceHasQuality(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="chk-has-quality" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Este serviço requer seleção de qualidade de peça (múltiplas linhas)
                </label>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNewServiceModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmAddNewService}
                disabled={!newServiceName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Adicionar Serviço</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

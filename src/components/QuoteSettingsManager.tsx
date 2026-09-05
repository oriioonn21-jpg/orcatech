import React, { useState } from 'react';
import {
  ShieldCheck,
  Layers,
  Truck,
  Users,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Lock,
  AlertCircle,
  Building2,
  ToggleLeft,
  ToggleRight,
  Info,
  Clock,
  DollarSign,
  Store,
} from 'lucide-react';
import {
  CompanyQuoteSettings,
  WarrantyConfig,
  PartQualityConfig,
  ServiceTypeConfig,
  TechnicianConfig,
  PriceRuleConfig,
  StaffMember,
  StoreLocation,
  Company,
} from '../types';
import { PHONE_MODELS, SERVICES } from '../data/mockData';

interface QuoteSettingsManagerProps {
  settings: CompanyQuoteSettings;
  company: Company;
  currentUser: StaffMember | null;
  stores: StoreLocation[];
  onUpdateSettings: (newSettings: CompanyQuoteSettings) => void;
}

type SettingTab = 'garantias' | 'qualidades' | 'atendimentos' | 'tecnicos' | 'precos';

export const QuoteSettingsManager: React.FC<QuoteSettingsManagerProps> = ({
  settings,
  company,
  currentUser,
  stores,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<SettingTab>('garantias');

  // Modal / Form state for item creation or edition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form Fields
  // Warranty form
  const [warLabel, setWarLabel] = useState('');
  const [warDesc, setWarDesc] = useState('');
  const [warIsDefault, setWarIsDefault] = useState(false);

  // Quality form
  const [qualName, setQualName] = useState('');
  const [qualDesc, setQualDesc] = useState('');
  const [qualBadge, setQualBadge] = useState('');
  const [qualMultiplier, setQualMultiplier] = useState(1.0);
  const [qualWarrantyDefault, setQualWarrantyDefault] = useState('');

  // Service Type form
  const [stName, setStName] = useState('');
  const [stDesc, setStDesc] = useState('');
  const [stExtraFee, setStExtraFee] = useState<number>(0);
  const [stExtraTime, setStExtraTime] = useState('');

  // Technician form
  const [tecName, setTecName] = useState('');
  const [tecEmail, setTecEmail] = useState('');
  const [tecPhone, setTecPhone] = useState('');
  const [tecStoreId, setTecStoreId] = useState(stores[0]?.id || '');
  const [tecActive, setTecActive] = useState(true);

  // Price Rule form (Min, Suggested, Max)
  const [priceModelId, setPriceModelId] = useState(PHONE_MODELS[0]?.id || '');
  const [priceServiceId, setPriceServiceId] = useState(SERVICES[0]?.id || '');
  const [priceQualityId, setPriceQualityId] = useState(settings.qualities[0]?.id || '');
  const [priceMin, setPriceMin] = useState<number>(350);
  const [priceSuggested, setPriceSuggested] = useState<number>(420);
  const [priceMax, setPriceMax] = useState<number>(500);
  const [priceNotes, setPriceNotes] = useState('');
  const [priceSearchQuery, setPriceSearchQuery] = useState('');

  // Delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    tab: SettingTab;
    id: string;
    title: string;
  } | null>(null);

  // RBAC Permission Check
  const isAdmin = currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente';

  // Open modal for Create
  const handleOpenCreate = () => {
    if (!isAdmin) return;
    setEditingItem(null);

    // Reset fields based on tab
    if (activeTab === 'garantias') {
      setWarLabel('');
      setWarDesc('');
      setWarIsDefault(false);
    } else if (activeTab === 'qualidades') {
      setQualName('');
      setQualDesc('');
      setQualBadge('Recomendada');
      setQualMultiplier(1.0);
      setQualWarrantyDefault('90 dias');
    } else if (activeTab === 'atendimentos') {
      setStName('');
      setStDesc('');
      setStExtraFee(0);
      setStExtraTime('Mesmo dia');
    } else if (activeTab === 'tecnicos') {
      setTecName('');
      setTecEmail('');
      setTecPhone('');
      setTecStoreId(stores[0]?.id || '');
      setTecActive(true);
    } else if (activeTab === 'precos') {
      setPriceModelId(PHONE_MODELS[0]?.id || '');
      setPriceServiceId(SERVICES[0]?.id || '');
      setPriceQualityId(settings.qualities[0]?.id || '');
      setPriceMin(350);
      setPriceSuggested(420);
      setPriceMax(500);
      setPriceNotes('');
    }
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: any) => {
    if (!isAdmin) return;
    setEditingItem(item);

    if (activeTab === 'garantias') {
      const w = item as WarrantyConfig;
      setWarLabel(w.label);
      setWarDesc(w.description || '');
      setWarIsDefault(!!w.isDefault);
    } else if (activeTab === 'qualidades') {
      const q = item as PartQualityConfig;
      setQualName(q.name);
      setQualDesc(q.description);
      setQualBadge(q.badge);
      setQualMultiplier(q.priceMultiplier);
      setQualWarrantyDefault(q.warrantyDefault || '');
    } else if (activeTab === 'atendimentos') {
      const s = item as ServiceTypeConfig;
      setStName(s.name);
      setStDesc(s.description || '');
      setStExtraFee(s.extraFee || 0);
      setStExtraTime(s.estimatedExtraTime || '');
    } else if (activeTab === 'tecnicos') {
      const t = item as TechnicianConfig;
      setTecName(t.name);
      setTecEmail(t.email || '');
      setTecPhone(t.phone || '');
      setTecStoreId(t.storeId);
      setTecActive(t.active);
    } else if (activeTab === 'precos') {
      const p = item as PriceRuleConfig;
      setPriceModelId(p.modelId);
      setPriceServiceId(p.serviceId);
      setPriceQualityId(p.qualityId);
      setPriceMin(p.minPrice);
      setPriceSuggested(p.suggestedPrice);
      setPriceMax(p.maxPrice);
      setPriceNotes(p.notes || '');
    }
    setIsModalOpen(true);
  };

  // Toggle Active / Inactive
  const handleToggleActive = (tab: SettingTab, id: string) => {
    if (!isAdmin) return;

    if (tab === 'garantias') {
      const updated = settings.warranties.map((w) =>
        w.id === id ? { ...w, active: !w.active } : w
      );
      onUpdateSettings({ ...settings, warranties: updated });
    } else if (tab === 'qualidades') {
      const updated = settings.qualities.map((q) =>
        q.id === id ? { ...q, active: !q.active } : q
      );
      onUpdateSettings({ ...settings, qualities: updated });
    } else if (tab === 'atendimentos') {
      const updated = settings.serviceTypes.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      );
      onUpdateSettings({ ...settings, serviceTypes: updated });
    } else if (tab === 'tecnicos') {
      const updated = settings.technicians.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t
      );
      onUpdateSettings({ ...settings, technicians: updated });
    } else if (tab === 'precos') {
      const updated = (settings.priceRules || []).map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      );
      onUpdateSettings({ ...settings, priceRules: updated });
    }
  };

  // Save Item (Create or Edit)
  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (activeTab === 'garantias') {
      if (!warLabel.trim()) return;
      if (editingItem) {
        const updated = settings.warranties.map((w) =>
          w.id === editingItem.id
            ? {
                ...w,
                label: warLabel.trim(),
                description: warDesc.trim(),
                isDefault: warIsDefault,
              }
            : warIsDefault
            ? { ...w, isDefault: false }
            : w
        );
        onUpdateSettings({ ...settings, warranties: updated });
      } else {
        const newWar: WarrantyConfig = {
          id: `war-${Date.now()}`,
          companyId: company.id,
          label: warLabel.trim(),
          description: warDesc.trim(),
          active: true,
          isDefault: warIsDefault,
        };
        const updated = warIsDefault
          ? settings.warranties.map((w) => ({ ...w, isDefault: false })).concat(newWar)
          : [...settings.warranties, newWar];
        onUpdateSettings({ ...settings, warranties: updated });
      }
    } else if (activeTab === 'qualidades') {
      if (!qualName.trim()) return;
      if (editingItem) {
        const updated = settings.qualities.map((q) =>
          q.id === editingItem.id
            ? {
                ...q,
                name: qualName.trim(),
                label: qualName.trim(),
                description: qualDesc.trim(),
                badge: qualBadge.trim() || 'Linha Padrão',
                priceMultiplier: Number(qualMultiplier) || 1.0,
                warrantyDefault: qualWarrantyDefault.trim(),
              }
            : q
        );
        onUpdateSettings({ ...settings, qualities: updated });
      } else {
        const newQual: PartQualityConfig = {
          id: `qual-${Date.now()}`,
          companyId: company.id,
          name: qualName.trim(),
          label: qualName.trim(),
          description: qualDesc.trim() || 'Qualidade configurada pela empresa.',
          badge: qualBadge.trim() || 'Personalizada',
          priceMultiplier: Number(qualMultiplier) || 1.0,
          warrantyDefault: qualWarrantyDefault.trim() || '90 dias',
          active: true,
        };
        onUpdateSettings({ ...settings, qualities: [...settings.qualities, newQual] });
      }
    } else if (activeTab === 'atendimentos') {
      if (!stName.trim()) return;
      if (editingItem) {
        const updated = settings.serviceTypes.map((s) =>
          s.id === editingItem.id
            ? {
                ...s,
                name: stName.trim(),
                description: stDesc.trim(),
                extraFee: Number(stExtraFee) || 0,
                estimatedExtraTime: stExtraTime.trim(),
              }
            : s
        );
        onUpdateSettings({ ...settings, serviceTypes: updated });
      } else {
        const newSt: ServiceTypeConfig = {
          id: `st-${Date.now()}`,
          companyId: company.id,
          name: stName.trim(),
          description: stDesc.trim() || 'Modalidade de atendimento.',
          extraFee: Number(stExtraFee) || 0,
          estimatedExtraTime: stExtraTime.trim() || 'Imediato',
          active: true,
        };
        onUpdateSettings({ ...settings, serviceTypes: [...settings.serviceTypes, newSt] });
      }
    } else if (activeTab === 'tecnicos') {
      if (!tecName.trim()) return;
      const matchedStore = stores.find((s) => s.id === tecStoreId) || stores[0];
      if (editingItem) {
        const updated = settings.technicians.map((t) =>
          t.id === editingItem.id
            ? {
                ...t,
                name: tecName.trim(),
                email: tecEmail.trim(),
                phone: tecPhone.trim(),
                storeId: matchedStore?.id || '',
                storeName: matchedStore?.name || '',
                active: tecActive,
              }
            : t
        );
        onUpdateSettings({ ...settings, technicians: updated });
      } else {
        const newTec: TechnicianConfig = {
          id: `tec-${Date.now()}`,
          companyId: company.id,
          name: tecName.trim(),
          email: tecEmail.trim() || `${tecName.toLowerCase().replace(/\s+/g, '')}@orcatech.com`,
          phone: tecPhone.trim() || '(11) 99999-0000',
          storeId: matchedStore?.id || '',
          storeName: matchedStore?.name || '',
          active: tecActive,
        };
        onUpdateSettings({ ...settings, technicians: [...settings.technicians, newTec] });
      }
    } else if (activeTab === 'precos') {
      const minVal = Math.round(Number(priceMin));
      const sugVal = Math.round(Number(priceSuggested));
      const maxVal = Math.round(Number(priceMax));

      if (minVal <= 0) {
        alert('O Preço Mínimo deve ser maior que zero.');
        return;
      }
      if (sugVal < minVal) {
        alert('O Preço Sugerido não pode ser menor que o Preço Mínimo.');
        return;
      }
      if (maxVal < sugVal) {
        alert('O Preço Máximo não pode ser menor que o Preço Sugerido.');
        return;
      }

      const model = PHONE_MODELS.find((m) => m.id === priceModelId);
      const service = SERVICES.find((s) => s.id === priceServiceId);
      const quality = settings.qualities.find((q) => q.id === priceQualityId);

      if (!model || !service || !quality) {
        alert('Selecione um modelo, serviço e qualidade válidos.');
        return;
      }

      if (editingItem) {
        const updated = (settings.priceRules || []).map((p) =>
          p.id === editingItem.id
            ? {
                ...p,
                modelId: model.id,
                modelName: model.name,
                serviceId: service.id,
                serviceName: service.name,
                qualityId: quality.id,
                qualityLabel: quality.label,
                minPrice: minVal,
                suggestedPrice: sugVal,
                maxPrice: maxVal,
                notes: priceNotes.trim(),
              }
            : p
        );
        onUpdateSettings({ ...settings, priceRules: updated });
      } else {
        const newRule: PriceRuleConfig = {
          id: `pr-${Date.now()}`,
          companyId: company.id,
          modelId: model.id,
          modelName: model.name,
          serviceId: service.id,
          serviceName: service.name,
          qualityId: quality.id,
          qualityLabel: quality.label,
          minPrice: minVal,
          suggestedPrice: sugVal,
          maxPrice: maxVal,
          active: true,
          notes: priceNotes.trim(),
        };
        onUpdateSettings({
          ...settings,
          priceRules: [newRule, ...(settings.priceRules || [])],
        });
      }
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Delete Item
  const handleConfirmDelete = () => {
    if (!isAdmin || !deleteConfirm) return;
    const { tab, id } = deleteConfirm;

    if (tab === 'garantias') {
      const updated = settings.warranties.filter((w) => w.id !== id);
      onUpdateSettings({ ...settings, warranties: updated });
    } else if (tab === 'qualidades') {
      const updated = settings.qualities.filter((q) => q.id !== id);
      onUpdateSettings({ ...settings, qualities: updated });
    } else if (tab === 'atendimentos') {
      const updated = settings.serviceTypes.filter((s) => s.id !== id);
      onUpdateSettings({ ...settings, serviceTypes: updated });
    } else if (tab === 'tecnicos') {
      const updated = settings.technicians.filter((t) => t.id !== id);
      onUpdateSettings({ ...settings, technicians: updated });
    } else if (tab === 'precos') {
      const updated = (settings.priceRules || []).filter((p) => p.id !== id);
      onUpdateSettings({ ...settings, priceRules: updated });
    }

    setDeleteConfirm(null);
  };

  // Filtered price rules for search
  const filteredPriceRules = (settings.priceRules || []).filter((rule) => {
    if (!priceSearchQuery.trim()) return true;
    const q = priceSearchQuery.toLowerCase();
    return (
      rule.modelName.toLowerCase().includes(q) ||
      rule.serviceName.toLowerCase().includes(q) ||
      rule.qualityLabel.toLowerCase().includes(q)
    );
  });

  // Tab definitions
  const tabs = [
    {
      id: 'garantias' as SettingTab,
      label: 'Garantias',
      icon: ShieldCheck,
      count: settings.warranties.length,
      activeCount: settings.warranties.filter((w) => w.active).length,
      desc: 'Prazos de garantia oferecidos aos clientes nos orçamentos',
    },
    {
      id: 'qualidades' as SettingTab,
      label: 'Qualidades de Peça',
      icon: Layers,
      count: settings.qualities.length,
      activeCount: settings.qualities.filter((q) => q.active).length,
      desc: 'Linhas e categorias de peças disponíveis para substituição',
    },
    {
      id: 'atendimentos' as SettingTab,
      label: 'Tipos de Atendimento',
      icon: Truck,
      count: settings.serviceTypes.length,
      activeCount: settings.serviceTypes.filter((s) => s.active).length,
      desc: 'Modalidades de recebimento e entrega do aparelho',
    },
    {
      id: 'tecnicos' as SettingTab,
      label: 'Técnicos & Equipe',
      icon: Users,
      count: settings.technicians.length,
      activeCount: settings.technicians.filter((t) => t.active).length,
      desc: 'Profissionais cadastrados para execução dos reparos',
    },
    {
      id: 'precos' as SettingTab,
      label: 'Tabela de Preços (Mín/Sugerido/Máx)',
      icon: DollarSign,
      count: (settings.priceRules || []).length,
      activeCount: (settings.priceRules || []).filter((r) => r.active).length,
      desc: 'Faixas comerciais de preço mínimo, sugerido e máximo por modelo, serviço e qualidade',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info & Company Scope Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Configurações de Orçamento
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>Empresa:</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {company.name}
                </span>
                <span className="text-slate-400">• Isolamento por Empresa Ativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action button if Admin */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <button
              id="btn-add-quote-setting"
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                Novo{' '}
                {activeTab === 'garantias'
                  ? 'Prazo de Garantia'
                  : activeTab === 'qualidades'
                  ? 'Qualidade de Peça'
                  : activeTab === 'atendimentos'
                  ? 'Tipo de Atendimento'
                  : 'Técnico'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Permissão de Administrador necessária para editar</span>
            </div>
          )}
        </div>
      </div>

      {/* Permission alert if common employee */}
      {!isAdmin && (
        <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Modo Somente Leitura (Funcionário Comum):</strong> Você está conectado como{' '}
            <strong>{currentUser?.name}</strong> ({currentUser?.role}). Você pode consultar e
            utilizar todas as opções cadastradas ao criar novos orçamentos, mas apenas usuários com
            permissão de <strong>Administrador</strong> podem cadastrar, editar, ativar, desativar ou
            excluir configurações.
          </div>
        </div>
      )}

      {/* Sub-tabs for the 4 Config Pillars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-quote-setting-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500 text-blue-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.activeCount} ativos / {tab.count}
                </span>
              </div>
              <div>
                <span className="font-bold text-xs block text-slate-900">{tab.label}</span>
                <span className="text-[10px] text-slate-500 line-clamp-1">{tab.desc}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. GARANTIAS */}
      {activeTab === 'garantias' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Garantias Cadastradas</h3>
              <p className="text-xs text-slate-500">
                Opções exibidas na seleção de Novo Orçamento (ex: 30 dias, 90 dias, 6 meses, 1 ano, ou personalizada)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {settings.warranties.length} opções
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {settings.warranties.map((war) => (
              <div
                key={war.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      war.active
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{war.label}</span>
                      {war.isDefault && (
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                          Padrão
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          war.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {war.active ? 'Ativo no Orçamento' : 'Inativo'}
                      </span>
                    </div>
                    {war.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{war.description}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleToggleActive('garantias', war.id)}
                    title={war.active ? 'Desativar garantia' : 'Ativar garantia'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      !isAdmin
                        ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                        : war.active
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    {war.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() => handleOpenEdit(war)}
                    title="Editar"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() =>
                      setDeleteConfirm({
                        tab: 'garantias',
                        id: war.id,
                        title: `Garantia "${war.label}"`,
                      })
                    }
                    title="Excluir"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. QUALIDADES DE PEÇA */}
      {activeTab === 'qualidades' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Qualidades de Peça Cadastradas</h3>
              <p className="text-xs text-slate-500">
                Linhas de tela e componentes (ex: Compatível, Premium, OLED, Original Nacional, Original)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {settings.qualities.length} opções
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {settings.qualities.map((qual) => (
              <div
                key={qual.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      qual.active
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{qual.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                        {qual.badge}
                      </span>
                      <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        Multiplicador: {qual.priceMultiplier}x
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          qual.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {qual.active ? 'Ativo no Orçamento' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{qual.description}</p>
                    {qual.warrantyDefault && (
                      <span className="text-[11px] text-slate-400">
                        Garantia padrão sugerida: <strong className="text-slate-600">{qual.warrantyDefault}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleToggleActive('qualidades', qual.id)}
                    title={qual.active ? 'Desativar qualidade' : 'Ativar qualidade'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      !isAdmin
                        ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                        : qual.active
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    {qual.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() => handleOpenEdit(qual)}
                    title="Editar"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() =>
                      setDeleteConfirm({
                        tab: 'qualidades',
                        id: qual.id,
                        title: `Qualidade "${qual.name}"`,
                      })
                    }
                    title="Excluir"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. TIPOS DE ATENDIMENTO */}
      {activeTab === 'atendimentos' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tipos de Atendimento Cadastrados</h3>
              <p className="text-xs text-slate-500">
                Opções disponíveis para o cliente (ex: Atendimento na Loja, Retirada e Entrega, Delivery, Atendimento Expresso)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {settings.serviceTypes.length} opções
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {settings.serviceTypes.map((st) => (
              <div
                key={st.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      st.active
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{st.name}</span>
                      <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        Taxa: {st.extraFee && st.extraFee > 0 ? `+ R$ ${st.extraFee.toFixed(2).replace('.', ',')}` : 'Grátis'}
                      </span>
                      {st.estimatedExtraTime && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                          {st.estimatedExtraTime}
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          st.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {st.active ? 'Ativo no Orçamento' : 'Inativo'}
                      </span>
                    </div>
                    {st.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{st.description}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleToggleActive('atendimentos', st.id)}
                    title={st.active ? 'Desativar modalidade' : 'Ativar modalidade'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      !isAdmin
                        ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                        : st.active
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    {st.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() => handleOpenEdit(st)}
                    title="Editar"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() =>
                      setDeleteConfirm({
                        tab: 'atendimentos',
                        id: st.id,
                        title: `Tipo de Atendimento "${st.name}"`,
                      })
                    }
                    title="Excluir"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. TÉCNICOS */}
      {activeTab === 'tecnicos' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Técnicos & Equipe Técnica</h3>
              <p className="text-xs text-slate-500">
                Cadastro de técnicos responsáveis, vínculo de loja e status de atuação
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {settings.technicians.length} técnicos
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {settings.technicians.map((tec) => (
              <div
                key={tec.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      tec.active
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {tec.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{tec.name}</span>
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <Store className="w-3 h-3 text-slate-400" />
                        {tec.storeName || 'Loja Padrão'}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          tec.active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {tec.active ? 'Ativo na Bancada' : 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      {tec.email && <span>{tec.email}</span>}
                      {tec.phone && <span>• {tec.phone}</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    disabled={!isAdmin}
                    onClick={() => handleToggleActive('tecnicos', tec.id)}
                    title={tec.active ? 'Marcar como inativo' : 'Marcar como ativo'}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      !isAdmin
                        ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                        : tec.active
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                        : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 cursor-pointer'
                    }`}
                  >
                    {tec.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() => handleOpenEdit(tec)}
                    title="Editar"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    disabled={!isAdmin}
                    onClick={() =>
                      setDeleteConfirm({
                        tab: 'tecnicos',
                        id: tec.id,
                        title: `Técnico "${tec.name}"`,
                      })
                    }
                    title="Excluir"
                    className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                      !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. TABELA DE PREÇOS (MÍN / SUGERIDO / MÁX) */}
      {activeTab === 'precos' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Faixas de Preço por Modelo, Serviço e Qualidade
                </h3>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Mín / Sugerido / Máx
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Defina os limites comerciais. O Novo Orçamento preenche o Preço Sugerido e valida a edição entre o Mínimo e o Máximo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Buscar modelo ou serviço..."
                value={priceSearchQuery}
                onChange={(e) => setPriceSearchQuery(e.target.value)}
                className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg w-48 focus:outline-none focus:border-blue-600"
              />
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                {(settings.priceRules || []).length} regras
              </span>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPriceRules.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Nenhuma regra de preço configurada. Clique em "+ Novo Item" acima para cadastrar a primeira faixa comercial.
              </div>
            ) : (
              filteredPriceRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                        rule.active
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{rule.modelName}</span>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {rule.serviceName}
                        </span>
                        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {rule.qualityLabel}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            rule.active
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {rule.active ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>

                      {/* 3 Values Display */}
                      <div className="flex items-center gap-4 mt-2 text-xs flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-medium">Mínimo:</span>
                          <strong className="text-slate-700">R$ {rule.minPrice}</strong>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-50/90 px-2 py-0.5 rounded text-blue-900 font-bold border border-blue-200/60">
                          <span className="text-blue-600 font-semibold">Sugerido:</span>
                          <strong>R$ {rule.suggestedPrice}</strong>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-medium">Máximo:</span>
                          <strong className="text-slate-700">R$ {rule.maxPrice}</strong>
                        </div>
                        <span className="text-slate-400 text-[11px]">
                          (Margem permitida: R$ {rule.minPrice} a R$ {rule.maxPrice})
                        </span>
                      </div>

                      {rule.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          Obs: {rule.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      disabled={!isAdmin}
                      onClick={() => handleToggleActive('precos', rule.id)}
                      title={rule.active ? 'Desativar regra' : 'Ativar regra'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        !isAdmin
                          ? 'opacity-40 cursor-not-allowed border-slate-200 text-slate-400'
                          : rule.active
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 cursor-pointer'
                          : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 cursor-pointer'
                      }`}
                    >
                      {rule.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>

                    <button
                      disabled={!isAdmin}
                      onClick={() => handleOpenEdit(rule)}
                      title="Editar Valores"
                      className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
                        !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      disabled={!isAdmin}
                      onClick={() =>
                        setDeleteConfirm({
                          tab: 'precos',
                          id: rule.id,
                          title: `Regra de Preço "${rule.modelName} - ${rule.serviceName}"`,
                        })
                      }
                      title="Excluir"
                      className={`p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors ${
                        !isAdmin ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h4 className="text-sm font-bold text-slate-900">
                {editingItem ? 'Editar' : 'Cadastrar'}{' '}
                {activeTab === 'garantias'
                  ? 'Prazo de Garantia'
                  : activeTab === 'qualidades'
                  ? 'Qualidade de Peça'
                  : activeTab === 'atendimentos'
                  ? 'Tipo de Atendimento'
                  : activeTab === 'precos'
                  ? 'Faixa de Preço (Mín/Sugerido/Máx)'
                  : 'Técnico'}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4">
              {/* FORM FIELDS: GARANTIAS */}
              {activeTab === 'garantias' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Prazo / Nome da Garantia *
                    </label>
                    <input
                      type="text"
                      value={warLabel}
                      onChange={(e) => setWarLabel(e.target.value)}
                      placeholder="Ex: 30 dias, 90 dias, 6 meses, 1 ano ou personalizada"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Descrição ou Observação (Opcional)
                    </label>
                    <textarea
                      value={warDesc}
                      onChange={(e) => setWarDesc(e.target.value)}
                      placeholder="Ex: Cobre defeitos de fabricação e falhas de sensibilidade."
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="checkbox-war-default"
                      type="checkbox"
                      checked={warIsDefault}
                      onChange={(e) => setWarIsDefault(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="checkbox-war-default" className="text-xs text-slate-700 font-medium cursor-pointer">
                      Definir como garantia padrão pré-selecionada no Novo Orçamento
                    </label>
                  </div>
                </>
              )}

              {/* FORM FIELDS: QUALIDADES DE PEÇA */}
              {activeTab === 'qualidades' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome da Qualidade *
                    </label>
                    <input
                      type="text"
                      value={qualName}
                      onChange={(e) => setQualName(e.target.value)}
                      placeholder="Ex: Compatível, Premium, OLED, Original Nacional, Original"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Selo / Etiqueta
                      </label>
                      <input
                        type="text"
                        value={qualBadge}
                        onChange={(e) => setQualBadge(e.target.value)}
                        placeholder="Ex: Mais Vendida"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Multiplicador de Preço
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0.5"
                        max="3.0"
                        value={qualMultiplier}
                        onChange={(e) => setQualMultiplier(parseFloat(e.target.value))}
                        placeholder="1.0"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Garantia Sugerida
                    </label>
                    <input
                      type="text"
                      value={qualWarrantyDefault}
                      onChange={(e) => setQualWarrantyDefault(e.target.value)}
                      placeholder="Ex: 90 dias, 6 meses, 1 ano"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Descrição Técnica
                    </label>
                    <textarea
                      value={qualDesc}
                      onChange={(e) => setQualDesc(e.target.value)}
                      placeholder="Ex: Excelente fidelidade cromática, resposta rápida ao toque e vedação contra poeira."
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* FORM FIELDS: TIPOS DE ATENDIMENTO */}
              {activeTab === 'atendimentos' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome do Tipo de Atendimento *
                    </label>
                    <input
                      type="text"
                      value={stName}
                      onChange={(e) => setStName(e.target.value)}
                      placeholder="Ex: Atendimento na Loja, Retirada e Entrega, Delivery, Atendimento Expresso"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Taxa Adicional (R$)
                      </label>
                      <input
                        type="number"
                        step="5"
                        min="0"
                        value={stExtraFee}
                        onChange={(e) => setStExtraFee(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Prazo / Tempo Estimado
                      </label>
                      <input
                        type="text"
                        value={stExtraTime}
                        onChange={(e) => setStExtraTime(e.target.value)}
                        placeholder="Ex: + 1h translado, Mesmo dia"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Descrição do Atendimento
                    </label>
                    <textarea
                      value={stDesc}
                      onChange={(e) => setStDesc(e.target.value)}
                      placeholder="Ex: Técnico realiza o procedimento presencialmente no endereço com teste completo."
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* FORM FIELDS: TÉCNICOS */}
              {activeTab === 'tecnicos' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nome do Técnico *
                    </label>
                    <input
                      type="text"
                      value={tecName}
                      onChange={(e) => setTecName(e.target.value)}
                      placeholder="Ex: Pedro Santos, Carlos Silva"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Loja à qual pertence *
                    </label>
                    <select
                      value={tecStoreId}
                      onChange={(e) => setTecStoreId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.address})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        E-mail do Técnico
                      </label>
                      <input
                        type="email"
                        value={tecEmail}
                        onChange={(e) => setTecEmail(e.target.value)}
                        placeholder="tecnico@empresa.com"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={tecPhone}
                        onChange={(e) => setTecPhone(e.target.value)}
                        placeholder="(11) 98888-0000"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="checkbox-tec-active"
                      type="checkbox"
                      checked={tecActive}
                      onChange={(e) => setTecActive(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="checkbox-tec-active" className="text-xs text-slate-700 font-medium cursor-pointer">
                      Técnico Ativo (disponível para atribuição em novos orçamentos)
                    </label>
                  </div>
                </>
              )}

              {/* FORM FIELDS: PREÇOS (MÍN / SUGERIDO / MÁX) */}
              {activeTab === 'precos' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Modelo do Aparelho *
                    </label>
                    <select
                      value={priceModelId}
                      onChange={(e) => setPriceModelId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {PHONE_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.brand} {m.name} ({m.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Serviço *
                      </label>
                      <select
                        value={priceServiceId}
                        onChange={(e) => setPriceServiceId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Qualidade da Peça *
                      </label>
                      <select
                        value={priceQualityId}
                        onChange={(e) => setPriceQualityId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {settings.qualities.map((q) => (
                          <option key={q.id} value={q.id}>
                            {q.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3 Values: Min, Suggested, Max */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Definição da Faixa Comercial
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Mínimo (R$) *
                        </label>
                        <input
                          type="number"
                          min="10"
                          step="1"
                          value={priceMin}
                          onChange={(e) => setPriceMin(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-blue-700 mb-1">
                          Sugerido (R$) *
                        </label>
                        <input
                          type="number"
                          min="10"
                          step="1"
                          value={priceSuggested}
                          onChange={(e) => setPriceSuggested(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-blue-400 rounded-lg text-xs font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Máximo (R$) *
                        </label>
                        <input
                          type="number"
                          min="10"
                          step="1"
                          value={priceMax}
                          onChange={(e) => setPriceMax(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-tight">
                      <strong>Exemplo:</strong> Mínimo: R$ {priceMin || 350} | Sugerido: R$ {priceSuggested || 420} | Máximo: R$ {priceMax || 500}. O vendedor iniciará no Sugerido e poderá negociar livremente entre o Mínimo e o Máximo.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Observações Internas (Opcional)
                    </label>
                    <input
                      type="text"
                      value={priceNotes}
                      onChange={(e) => setPriceNotes(e.target.value)}
                      placeholder="Ex: Tabela promocional ou margem especial"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingItem ? 'Salvar Alterações' : 'Cadastrar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-slate-200 p-5 space-y-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-slate-900">Confirmar Exclusão</h4>
              <p className="text-xs text-slate-500">
                Tem certeza que deseja excluir <strong>{deleteConfirm.title}</strong>? Esta ação removerá a opção do Novo Orçamento.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

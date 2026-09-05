import React, { useState } from 'react';
import {
  Settings,
  Tag,
  Smartphone,
  Wrench,
  Layers,
  DollarSign,
  Users,
  Store,
  Plus,
  Search,
  Check,
  Edit2,
  Trash2,
  Shield,
  Clock,
  Sparkles,
  ChevronRight,
  Info,
  Sliders,
  Building2,
  Lock,
} from 'lucide-react';
import {
  BrandName,
  PhoneModel,
  ServiceItem,
  QualityOption,
  StaffMember,
  StoreLocation,
  Company,
  CompanyQuoteSettings,
} from '../types';
import {
  BRANDS,
  PHONE_MODELS,
  SERVICES,
  QUALITY_OPTIONS,
  STAFF_MEMBERS,
  STORES,
  COMPANIES,
} from '../data/mockData';
import { QuoteSettingsManager } from './QuoteSettingsManager';
import { DeviceManagementView } from './DeviceManagementView';

interface AdminViewProps {
  currentUser?: StaffMember | null;
  currentStore?: StoreLocation;
  currentCompany?: Company;
  companySettings?: CompanyQuoteSettings;
  stores?: StoreLocation[];
  onUpdateCompanySettings?: (newSettings: CompanyQuoteSettings) => void;
  onSwitchCompany?: (companyId: string) => void;
  companies?: Company[];
  onNavigateNewQuote?: (brand?: BrandName) => void;
}

type AdminSection = 'aparelhos' | 'orcamento' | 'catalogo';
type AdminTab = 'marcas' | 'modelos' | 'servicos' | 'pecas' | 'precos' | 'funcionarios' | 'lojas';

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser = STAFF_MEMBERS[3], // Carlos Eduardo (Administrador) by default
  currentStore = STORES[0],
  currentCompany = COMPANIES[0],
  companySettings,
  stores = STORES,
  onUpdateCompanySettings,
  onSwitchCompany,
  companies = COMPANIES,
  onNavigateNewQuote,
}) => {
  // Main section: 'aparelhos' (Cadastro Completo do Aparelho), 'orcamento', or 'catalogo'
  const [activeSection, setActiveSection] = useState<AdminSection>('aparelhos');
  const [currentTab, setCurrentTab] = useState<AdminTab>('marcas');
  const [searchTerm, setSearchTerm] = useState('');

  // Editable state representations for catalog demo
  const [brands, setBrands] = useState(BRANDS.map((b) => ({ ...b, active: true })));
  const [models, setModels] = useState<PhoneModel[]>(PHONE_MODELS);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES);
  const [qualities, setQualities] = useState<QualityOption[]>(QUALITY_OPTIONS);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>(stores);

  // Quick modal simulation state for catalog
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemExtra, setNewItemExtra] = useState('');

  const isAdmin = currentUser?.role === 'Administrador' || currentUser?.role === 'Gerente';

  const adminTabs = [
    { id: 'marcas' as AdminTab, label: 'Marcas', icon: Tag, count: brands.length },
    { id: 'modelos' as AdminTab, label: 'Modelos', icon: Smartphone, count: models.length },
    { id: 'servicos' as AdminTab, label: 'Serviços', icon: Wrench, count: services.length },
    { id: 'pecas' as AdminTab, label: 'Peças & Linhas', icon: Layers, count: qualities.length },
    { id: 'precos' as AdminTab, label: 'Regras de Preço', icon: DollarSign, count: 'Auto' },
    { id: 'funcionarios' as AdminTab, label: 'Funcionários', icon: Users, count: staff.length },
    { id: 'lojas' as AdminTab, label: 'Lojas / Filiais', icon: Store, count: storeLocations.length },
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !isAdmin) return;

    if (currentTab === 'marcas') {
      setBrands([...brands, { name: newItemName as BrandName, color: 'from-slate-600 to-slate-800', icon: '📱', active: true }]);
    } else if (currentTab === 'modelos') {
      setModels([...models, {
        id: `mod-${Date.now()}`,
        brand: (newItemExtra as BrandName) || 'Apple',
        name: newItemName,
        category: 'Intermediário',
        popular: false,
      }]);
    } else if (currentTab === 'servicos') {
      setServices([...services, {
        id: `srv-${Date.now()}`,
        name: newItemName,
        category: 'Geral',
        iconName: 'Wrench',
        estimatedMinutes: 40,
        basePrice: Number(newItemExtra) || 150,
        description: 'Serviço técnico especializado.',
      }]);
    } else if (currentTab === 'funcionarios') {
      setStaff([...staff, {
        id: `st-${Date.now()}`,
        name: newItemName,
        email: newItemExtra || `${newItemName.toLowerCase().replace(/\s+/g, '')}@orcatech.com`,
        role: 'Técnico',
        companyId: currentCompany.id,
      }]);
    } else if (currentTab === 'lojas') {
      setStoreLocations([...storeLocations, {
        id: `st-${Date.now()}`,
        name: newItemName,
        address: newItemExtra || 'Endereço da nova filial',
        phone: '(11) 3333-4444',
        active: true,
      }]);
    }

    setNewItemName('');
    setNewItemExtra('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24 sm:pb-12">
      {/* Admin Top Header with Company Switcher & Section Toggles */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Configurações & Gestão SaaS
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Personalize parâmetros de orçamentos, catálogo de produtos e dados da empresa
          </p>
        </div>

        {/* Company & Role Switcher for Testing Multi-Tenancy */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {companies.length > 1 && onSwitchCompany && (
            <div className="flex items-center gap-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400 hidden sm:inline">Empresa:</span>
              <select
                id="admin-company-switcher-select"
                value={currentCompany.id}
                onChange={(e) => onSwitchCompany(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User role indicator */}
          <div className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
            <span className="text-slate-400">Logado como:</span>
            <strong className="text-slate-800">{currentUser?.name}</strong>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                isAdmin
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {currentUser?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Main Section Navigation: Cadastro Completo de Aparelhos vs Configurações de Orçamento vs Filiais */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          id="tab-section-aparelhos"
          onClick={() => setActiveSection('aparelhos')}
          className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSection === 'aparelhos'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Cadastro de Aparelhos & Preços</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              activeSection === 'aparelhos'
                ? 'bg-blue-700 text-blue-100'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            Unificado
          </span>
        </button>

        <button
          id="tab-section-orcamento"
          onClick={() => setActiveSection('orcamento')}
          className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSection === 'orcamento'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Regras de Orçamento</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeSection === 'orcamento'
                ? 'bg-blue-700 text-blue-100'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            Equipe & Prazos
          </span>
        </button>

        <button
          id="tab-section-catalogo"
          onClick={() => setActiveSection('catalogo')}
          className={`px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeSection === 'catalogo'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Filiais & Usuários</span>
        </button>
      </div>

      {/* SECTION 1: CADASTRO COMPLETO DO APARELHO (Tela única para gerenciamento de modelos, serviços e preços) */}
      {activeSection === 'aparelhos' && companySettings && (
        <DeviceManagementView
          companyId={currentCompany.id}
          companySettings={companySettings}
          onNavigateNewQuote={onNavigateNewQuote}
        />
      )}

      {/* SECTION 2: CONFIGURAÇÕES DE ORÇAMENTO (Garantias, Qualidades, Atendimentos, Técnicos) */}
      {activeSection === 'orcamento' && companySettings && onUpdateCompanySettings && (
        <QuoteSettingsManager
          settings={companySettings}
          company={currentCompany}
          currentUser={currentUser}
          stores={storeLocations}
          onUpdateSettings={onUpdateCompanySettings}
        />
      )}

      {/* SECTION 2: CATÁLOGO GERAL & FILIAIS */}
      {activeSection === 'catalogo' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`admin-tab-${tab.id}`}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {isAdmin && (
              <button
                id="admin-add-new-btn"
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar</span>
              </button>
            )}
          </div>

          {/* Search bar inside tab */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Filtrar ${currentTab}...`}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Tab Content Cards */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* 1. MARCAS */}
            {currentTab === 'marcas' && (
              <div className="divide-y divide-slate-100">
                {brands.map((brand) => (
                  <div
                    key={brand.name}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{brand.icon}</span>
                      <div>
                        <span className="text-sm font-bold text-slate-900">{brand.name}</span>
                        <p className="text-xs text-slate-500">Fabricante homologado no sistema</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Ativa
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 2. MODELOS */}
            {currentTab === 'modelos' && (
              <div className="divide-y divide-slate-100">
                {models
                  .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 10)
                  .map((model) => (
                    <div
                      key={model.id}
                      className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-bold">
                          {model.brand.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-900">{model.name}</span>
                            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {model.brand}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">Categoria: {model.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">Disponível</span>
                    </div>
                  ))}
              </div>
            )}

            {/* 3. SERVIÇOS */}
            {currentTab === 'servicos' && (
              <div className="divide-y divide-slate-100">
                {services
                  .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((srv) => (
                    <div
                      key={srv.id}
                      className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                          <Wrench className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-900">{srv.name}</span>
                          <p className="text-xs text-slate-500">{srv.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          R$ {srv.basePrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Base padrão</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 4. FUNCIONÁRIOS */}
            {currentTab === 'funcionarios' && (
              <div className="divide-y divide-slate-100">
                {staff.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                        {st.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{st.name}</span>
                        <span className="text-xs text-slate-400 block">{st.email}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {st.role}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 5. LOJAS / FILIAIS */}
            {currentTab === 'lojas' && (
              <div className="divide-y divide-slate-100">
                {storeLocations.map((store) => (
                  <div
                    key={store.id}
                    className="p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{store.name}</span>
                        <span className="text-xs text-slate-400 block">{store.address} • {store.phone}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Unidade Ativa
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Add Modal for Catalog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h4 className="text-xs font-bold text-slate-900 uppercase">
                Adicionar {currentTab.slice(0, -1)}
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome / Descrição</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Ex: iPhone 16 ou Novo Serviço"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Informação Adicional / Marca / Preço
                </label>
                <input
                  type="text"
                  value={newItemExtra}
                  onChange={(e) => setNewItemExtra(e.target.value)}
                  placeholder="Ex: Apple ou R$ 200"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

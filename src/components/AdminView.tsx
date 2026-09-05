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
} from 'lucide-react';
import { BrandName, PhoneModel, ServiceItem, QualityOption, StaffMember, StoreLocation } from '../types';
import { BRANDS, PHONE_MODELS, SERVICES, QUALITY_OPTIONS, STAFF_MEMBERS, STORES } from '../data/mockData';

type AdminTab = 'marcas' | 'modelos' | 'servicos' | 'pecas' | 'precos' | 'funcionarios' | 'lojas';

export const AdminView: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('marcas');
  const [searchTerm, setSearchTerm] = useState('');

  // Editable state representations for demo
  const [brands, setBrands] = useState(BRANDS.map(b => ({ ...b, active: true })));
  const [models, setModels] = useState<PhoneModel[]>(PHONE_MODELS);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES);
  const [qualities, setQualities] = useState<QualityOption[]>(QUALITY_OPTIONS);
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [stores, setStores] = useState<StoreLocation[]>(STORES);

  // Quick modal simulation state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemExtra, setNewItemExtra] = useState('');

  const adminTabs = [
    { id: 'marcas' as AdminTab, label: 'Marcas', icon: Tag, count: brands.length },
    { id: 'modelos' as AdminTab, label: 'Modelos', icon: Smartphone, count: models.length },
    { id: 'servicos' as AdminTab, label: 'Serviços', icon: Wrench, count: services.length },
    { id: 'pecas' as AdminTab, label: 'Peças & Linhas', icon: Layers, count: qualities.length },
    { id: 'precos' as AdminTab, label: 'Regras de Preço', icon: DollarSign, count: 'Auto' },
    { id: 'funcionarios' as AdminTab, label: 'Funcionários', icon: Users, count: staff.length },
    { id: 'lojas' as AdminTab, label: 'Lojas / Filiais', icon: Store, count: stores.length },
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

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
      }]);
    } else if (currentTab === 'lojas') {
      setStores([...stores, {
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
    <div className="space-y-4 max-w-5xl mx-auto pb-24 sm:pb-12">
      {/* Admin Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Área Administrativa (Backoffice)
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Controle de catálogo, precificação, equipe técnica e filiais da rede
          </p>
        </div>

        <button
          id="admin-add-new-btn"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar {adminTabs.find(t => t.id === currentTab)?.label.slice(0, -1) || 'Item'}</span>
        </button>
      </div>

      {/* Notice on future backend readiness */}
      <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>Módulo SaaS Preparado para Banco de Dados:</strong> Esta interface visual permite a gestão completa dos 7 pilares do sistema (marcas, modelos, serviços, peças, preços, equipe e lojas) e está pronta para sincronização com Firestore / backend em tempo real.
        </div>
      </div>

      {/* Horizontal Subtabs */}
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`admin-subtab-${tab.id}`}
              onClick={() => {
                setCurrentTab(tab.id);
                setSearchTerm('');
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subtab Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
        {/* TAB 1: MARCAS */}
        {currentTab === 'marcas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Marcas Homologadas ({brands.length})</h3>
              <span className="text-xs text-slate-400">Ative ou desative marcas no catálogo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {brands.map((b, idx) => {
                const modelCount = models.filter((m) => m.brand === b.name).length;
                return (
                  <div
                    key={b.name}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{b.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                          <span className="text-[11px] text-slate-500">{modelCount} modelos</span>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Ativa" />
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Catálogo Ativo
                      </span>
                      <button
                        onClick={() => {
                          const updated = brands.filter((_, i) => i !== idx);
                          setBrands(updated);
                        }}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MODELOS */}
        {currentTab === 'modelos' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">Modelos Cadastrados ({models.length})</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar modelos..."
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 w-full sm:w-60"
              />
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {models
                .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.brand.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((m) => (
                  <div key={m.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{m.name}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded font-semibold">
                            {m.brand}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{m.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        Tabela Pronta
                      </span>
                      <button
                        onClick={() => setModels(models.filter((item) => item.id !== m.id))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 3: SERVIÇOS */}
        {currentTab === 'servicos' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Catálogo de Serviços ({services.length})</h3>
              <span className="text-xs text-slate-400">Tempo médio e preço base</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{s.name}</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 rounded font-semibold">
                        {s.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{s.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> ~{s.estimatedMinutes} min
                      </span>
                      <span className="font-bold text-slate-900">
                        Custo Base: R$ {s.basePrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setServices(services.filter((item) => item.id !== s.id))}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PEÇAS E QUALIDADES */}
        {currentTab === 'pecas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Qualidades e Linhas de Peças ({qualities.length})</h3>
              <span className="text-xs text-slate-400">Multiplicadores e garantias padrão</span>
            </div>

            <div className="space-y-2.5">
              {qualities.map((q) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{q.label}</span>
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                        {q.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{q.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 block">
                        🛡️ {q.warrantyDefault}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Fator de Cálculo: {q.priceMultiplier}x
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REGRAS DE PREÇO */}
        {currentTab === 'precos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Motor de Precificação Dinâmica</h3>
              <span className="text-xs text-slate-400">Fórmula automática de orçamento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 block uppercase">Margem de Lucro Alvo</span>
                <span className="text-2xl font-black text-slate-900">55%</span>
                <p className="text-[11px] text-slate-500">Calculada automaticamente sobre o custo da peça</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 block uppercase">Taxa de Parcelamento</span>
                <span className="text-2xl font-black text-slate-900">6% a 8%</span>
                <p className="text-[11px] text-slate-500">Distribuído em até 6x sem juros no orçamento</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 block uppercase">Desconto Máximo Atendente</span>
                <span className="text-2xl font-black text-slate-900">R$ 40,00</span>
                <p className="text-[11px] text-slate-500">Limite de flexibilidade para fechamento no balcão</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FUNCIONÁRIOS */}
        {currentTab === 'funcionarios' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Equipe Técnica e Atendentes ({staff.length})</h3>
              <span className="text-xs text-slate-400">Responsáveis cadastrados</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {staff.map((st) => (
                <div key={st.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                      {st.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{st.name}</span>
                      <span className="text-[11px] text-slate-500">{st.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {st.role}
                    </span>
                    <button
                      onClick={() => setStaff(staff.filter((item) => item.id !== st.id))}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: LOJAS */}
        {currentTab === 'lojas' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Lojas e Filiais Cadastradas ({stores.length})</h3>
              <span className="text-xs text-slate-400">Unidades de atendimento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stores.map((store) => (
                <div key={store.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-cyan-600" />
                      <h4 className="text-sm font-bold text-slate-900">{store.name}</h4>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Ativa
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{store.address}</p>
                  <p className="text-[11px] text-slate-500">📞 {store.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Adicionar Novo(a) {adminTabs.find(t => t.id === currentTab)?.label.slice(0, -1) || 'Item'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Preencha os dados básicos para inclusão rápida
            </p>

            <form onSubmit={handleAddItem} className="space-y-3">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Informação Adicional / Marca / Preço</label>
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

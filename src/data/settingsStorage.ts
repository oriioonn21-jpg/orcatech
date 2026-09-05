import {
  Company,
  CompanyQuoteSettings,
  WarrantyConfig,
  PartQualityConfig,
  ServiceTypeConfig,
  TechnicianConfig,
  StoreLocation,
} from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'TechFix Assistência Matriz',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 3456-7890',
  },
  {
    id: 'comp-2',
    name: 'iCell Prime Especializada',
    cnpj: '98.765.432/0001-11',
    phone: '(11) 4004-9988',
  },
];

// Initial default settings for TechFix Matriz (comp-1)
export const DEFAULT_SETTINGS_COMP1: CompanyQuoteSettings = {
  companyId: 'comp-1',
  warranties: [
    {
      id: 'war-30d',
      companyId: 'comp-1',
      label: '30 dias',
      description: 'Garantia legal para serviços simples ou limpeza.',
      active: true,
      isDefault: false,
    },
    {
      id: 'war-90d',
      companyId: 'comp-1',
      label: '90 dias',
      description: 'Garantia padrão de 3 meses para baterias e periféricos.',
      active: true,
      isDefault: true,
    },
    {
      id: 'war-6m',
      companyId: 'comp-1',
      label: '6 meses',
      description: 'Garantia estendida para telas de linha premium.',
      active: true,
      isDefault: false,
    },
    {
      id: 'war-1a',
      companyId: 'comp-1',
      label: '1 ano',
      description: 'Garantia total de 12 meses para peças 100% originais.',
      active: true,
      isDefault: false,
    },
  ],
  qualities: [
    {
      id: 'qual-compativel',
      companyId: 'comp-1',
      name: 'Compatível',
      label: 'Compatível / Primeira Linha',
      description: 'Peça compatível com custo reduzido e bom funcionamento touch.',
      badge: 'Econômica',
      warrantyDefault: '90 dias',
      priceMultiplier: 0.75,
      active: true,
    },
    {
      id: 'qual-premium',
      companyId: 'comp-1',
      name: 'Premium',
      label: 'Premium / Linha Ouro',
      description: 'Alta durabilidade, cores vibrantes e sensibilidade refinada.',
      badge: 'Mais Vendida',
      warrantyDefault: '6 meses',
      priceMultiplier: 0.95,
      active: true,
    },
    {
      id: 'qual-oled',
      companyId: 'comp-1',
      name: 'OLED',
      label: 'OLED / Soft OLED',
      description: 'Tecnologia OLED com pretos perfeitos, baixo consumo e taxa de atualização rápida.',
      badge: 'Alta Resolução',
      warrantyDefault: '6 meses',
      priceMultiplier: 1.05,
      active: true,
    },
    {
      id: 'qual-original-nac',
      companyId: 'comp-1',
      name: 'Original Nacional',
      label: 'Original Nacional / Homologada',
      description: 'Componente homologado Anatel com padrões idênticos aos de fábrica.',
      badge: 'Original de Fábrica',
      warrantyDefault: '1 ano',
      priceMultiplier: 1.35,
      active: true,
    },
    {
      id: 'qual-original',
      companyId: 'comp-1',
      name: 'Original',
      label: 'Original / Retirada',
      description: 'Peça 100% genuína retirada de aparelho novo ou lote oficial de reposição.',
      badge: 'Máxima Qualidade',
      warrantyDefault: '1 ano',
      priceMultiplier: 1.45,
      active: true,
    },
  ],
  serviceTypes: [
    {
      id: 'st-loja',
      companyId: 'comp-1',
      name: 'Atendimento na Loja',
      description: 'Cliente traz o celular no balcão e retira após a bancada.',
      extraFee: 0,
      active: true,
      estimatedExtraTime: 'Sem acréscimo',
    },
    {
      id: 'st-retirada',
      companyId: 'comp-1',
      name: 'Retirada e Entrega',
      description: 'Motoboy credenciado busca o aparelho e entrega consertado.',
      extraFee: 25,
      active: true,
      estimatedExtraTime: '+ 1h no translado',
    },
    {
      id: 'st-delivery',
      companyId: 'comp-1',
      name: 'Delivery',
      description: 'Técnico vai até a residência ou trabalho do cliente com kit móvel.',
      extraFee: 35,
      active: true,
      estimatedExtraTime: 'Agendado no dia',
    },
    {
      id: 'st-expresso',
      companyId: 'comp-1',
      name: 'Atendimento Expresso',
      description: 'Prioridade absoluta na bancada com técnico dedicado na hora.',
      extraFee: 40,
      active: true,
      estimatedExtraTime: 'Pronto em até 30 min',
    },
  ],
  technicians: [
    {
      id: 'tec-1',
      companyId: 'comp-1',
      name: 'Pedro Santos',
      email: 'pedro@orcatech.com',
      phone: '(11) 98888-1001',
      storeId: 'store-1',
      storeName: 'Loja Centro - Matriz',
      active: true,
    },
    {
      id: 'tec-2',
      companyId: 'comp-1',
      name: 'Renato Silva',
      email: 'renato@orcatech.com',
      phone: '(11) 98888-1002',
      storeId: 'store-2',
      storeName: 'Loja Shopping Plaza',
      active: true,
    },
    {
      id: 'tec-3',
      companyId: 'comp-1',
      name: 'Lucas Albuquerque',
      email: 'lucas@orcatech.com',
      phone: '(11) 98888-1003',
      storeId: 'store-1',
      storeName: 'Loja Centro - Matriz',
      active: true,
    },
    {
      id: 'tec-4',
      companyId: 'comp-1',
      name: 'Marcos Vinicius',
      email: 'marcos@orcatech.com',
      phone: '(11) 98888-1004',
      storeId: 'store-2',
      storeName: 'Loja Shopping Plaza',
      active: false,
    },
  ],
};

// Initial default settings for iCell Prime (comp-2)
export const DEFAULT_SETTINGS_COMP2: CompanyQuoteSettings = {
  companyId: 'comp-2',
  warranties: [
    {
      id: 'war-icell-90d',
      companyId: 'comp-2',
      label: '90 dias',
      description: 'Garantia trimestral padrão iCell.',
      active: true,
      isDefault: true,
    },
    {
      id: 'war-icell-1a',
      companyId: 'comp-2',
      label: '1 ano',
      description: 'Garantia Prime 12 meses com troca imediata.',
      active: true,
      isDefault: false,
    },
    {
      id: 'war-icell-vitalicia',
      companyId: 'comp-2',
      label: 'Garantia Vitalícia iCell',
      description: 'Exclusivo para telas e blindagens da linha Black.',
      active: true,
      isDefault: false,
    },
  ],
  qualities: [
    {
      id: 'qual-icell-gold',
      companyId: 'comp-2',
      name: 'Linha Gold iCell',
      label: 'Linha Gold iCell Certificada',
      description: 'Display de alta taxa de atualização com 98% de fidelidade cromática.',
      badge: 'Recomendada iCell',
      warrantyDefault: '1 ano',
      priceMultiplier: 1.0,
      active: true,
    },
    {
      id: 'qual-icell-retirada',
      companyId: 'comp-2',
      name: 'Original Apple Retirada',
      label: 'Original Apple Retirada 100%',
      description: 'Retirada de iPhone de vitrine com calibração TrueTone garantida.',
      badge: 'Genuína Apple',
      warrantyDefault: 'Garantia Vitalícia iCell',
      priceMultiplier: 1.5,
      active: true,
    },
  ],
  serviceTypes: [
    {
      id: 'st-icell-balcao',
      companyId: 'comp-2',
      name: 'Balcão Express',
      description: 'Atendimento presencial em nossa sala VIP.',
      extraFee: 0,
      active: true,
      estimatedExtraTime: '25 a 45 min',
    },
    {
      id: 'st-icell-leva-traz',
      companyId: 'comp-2',
      name: 'iCell Leva & Traz',
      description: 'Seguro transporte incluso com coleta sob agendamento.',
      extraFee: 30,
      active: true,
      estimatedExtraTime: 'Mesmo dia',
    },
  ],
  technicians: [
    {
      id: 'tec-icell-1',
      companyId: 'comp-2',
      name: 'Felipe Costa (Especialista Apple)',
      email: 'felipe@icellprime.com',
      phone: '(11) 97777-2001',
      storeId: 'store-icell-1',
      storeName: 'Unidade Jardins',
      active: true,
    },
    {
      id: 'tec-icell-2',
      companyId: 'comp-2',
      name: 'Juliana Mendes',
      email: 'juliana@icellprime.com',
      phone: '(11) 97777-2002',
      storeId: 'store-icell-1',
      storeName: 'Unidade Jardins',
      active: true,
    },
  ],
};

const STORAGE_KEY_PREFIX = 'orcatech_company_settings_';

// Helper to get company settings with fallback
export function getCompanySettings(companyId: string): CompanyQuoteSettings {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${companyId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load settings from localStorage', e);
  }

  // Fallback defaults
  if (companyId === 'comp-2') {
    return DEFAULT_SETTINGS_COMP2;
  }
  return DEFAULT_SETTINGS_COMP1;
}

// Helper to save company settings
export function saveCompanySettings(settings: CompanyQuoteSettings): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${settings.companyId}`,
      JSON.stringify(settings)
    );
  } catch (e) {
    console.warn('Failed to save settings to localStorage', e);
  }
}

import {
  Company,
  CompanyQuoteSettings,
  WarrantyConfig,
  PartQualityConfig,
  ServiceTypeConfig,
  TechnicianConfig,
  StoreLocation,
  PriceRuleConfig,
  PhoneModel,
  ServiceItem,
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

// Initial default price rules for TechFix Matriz (comp-1)
export const DEFAULT_PRICE_RULES_COMP1: PriceRuleConfig[] = [
  {
    id: 'pr-ip13-tela-compativel',
    companyId: 'comp-1',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-compativel',
    qualityLabel: 'Compatível / Primeira Linha',
    minPrice: 350,
    suggestedPrice: 420,
    maxPrice: 500,
    notes: 'Exemplo padrão homologado',
  },
  {
    id: 'pr-ip13-tela-premium',
    companyId: 'comp-1',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-premium',
    qualityLabel: 'Premium / Linha Ouro',
    minPrice: 480,
    suggestedPrice: 580,
    maxPrice: 700,
    notes: 'Mais recomendada para iPhone 13',
  },
  {
    id: 'pr-ip13-tela-oled',
    companyId: 'comp-1',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-oled',
    qualityLabel: 'OLED / Soft OLED',
    minPrice: 550,
    suggestedPrice: 650,
    maxPrice: 780,
  },
  {
    id: 'pr-ip13-tela-original-nac',
    companyId: 'comp-1',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-original-nac',
    qualityLabel: 'Original Nacional / Homologada',
    minPrice: 720,
    suggestedPrice: 850,
    maxPrice: 1050,
  },
  {
    id: 'pr-ip13-tela-original',
    companyId: 'comp-1',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-original',
    qualityLabel: 'Original / Retirada',
    minPrice: 780,
    suggestedPrice: 920,
    maxPrice: 1150,
  },
  {
    id: 'pr-ip13-bateria-premium',
    companyId: 'comp-1',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-bateria',
    serviceName: 'Troca de Bateria Premium',
    qualityId: 'qual-premium',
    qualityLabel: 'Premium / Linha Ouro',
    minPrice: 230,
    suggestedPrice: 280,
    maxPrice: 350,
  },
  {
    id: 'pr-ip11-bateria-premium',
    companyId: 'comp-1',
    modelId: 'ip11',
    modelName: 'iPhone 11',
    serviceId: 'srv-bateria',
    serviceName: 'Troca de Bateria Premium',
    qualityId: 'qual-premium',
    qualityLabel: 'Premium / Linha Ouro',
    minPrice: 180,
    suggestedPrice: 220,
    maxPrice: 280,
  },
  {
    id: 'pr-a54-tela-premium',
    companyId: 'comp-1',
    modelId: 'gal-a54',
    modelName: 'Galaxy A54 5G',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-premium',
    qualityLabel: 'Premium / Linha Ouro',
    minPrice: 280,
    suggestedPrice: 340,
    maxPrice: 420,
  },
  {
    id: 'pr-motg54-conector',
    companyId: 'comp-1',
    modelId: 'mot-g54',
    modelName: 'Moto G54 5G',
    serviceId: 'srv-conector',
    serviceName: 'Conector de Carga / Subplaca',
    qualityId: 'qual-compativel',
    qualityLabel: 'Compatível / Primeira Linha',
    minPrice: 110,
    suggestedPrice: 140,
    maxPrice: 190,
  },
];

export const DEFAULT_PRICE_RULES_COMP2: PriceRuleConfig[] = [
  {
    id: 'pr-icell-ip13-tela-gold',
    companyId: 'comp-2',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-icell-gold',
    qualityLabel: 'Linha Gold iCell Certificada',
    minPrice: 490,
    suggestedPrice: 590,
    maxPrice: 720,
  },
  {
    id: 'pr-icell-ip13-tela-retirada',
    companyId: 'comp-2',
    modelId: 'ip13',
    modelName: 'iPhone 13',
    serviceId: 'srv-tela',
    serviceName: 'Troca de Tela Frontal',
    qualityId: 'qual-icell-retirada',
    qualityLabel: 'Original Apple Retirada 100%',
    minPrice: 790,
    suggestedPrice: 950,
    maxPrice: 1180,
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
  priceRules: DEFAULT_PRICE_RULES_COMP1,
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
  priceRules: DEFAULT_PRICE_RULES_COMP2,
};

const STORAGE_KEY_PREFIX = 'orcatech_company_settings_';

// Helper to get company settings with fallback
export function getCompanySettings(companyId: string): CompanyQuoteSettings {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${companyId}`);
    if (raw) {
      const parsed: CompanyQuoteSettings = JSON.parse(raw);
      // Ensure backward-compatibility for priceRules
      if (!parsed.priceRules || parsed.priceRules.length === 0) {
        parsed.priceRules =
          companyId === 'comp-2'
            ? [...DEFAULT_PRICE_RULES_COMP2]
            : [...DEFAULT_PRICE_RULES_COMP1];
      }
      return parsed;
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

export interface PriceBoundsResult {
  minPrice: number;
  suggestedPrice: number;
  maxPrice: number;
  effectiveMin: number;
  effectiveSuggested: number;
  effectiveMax: number;
  isCustomRule: boolean;
  ruleNotes?: string;
}

/**
 * Calculates Min, Suggested, and Max prices for a combination of:
 * Model + Service + Quality (+ optional ServiceType extra fee)
 */
export function calculatePriceBounds(
  settings: CompanyQuoteSettings | undefined,
  model: PhoneModel | null,
  service: ServiceItem | null,
  quality: PartQualityConfig | null,
  serviceType?: ServiceTypeConfig | null
): PriceBoundsResult {
  if (!model || !service) {
    return {
      minPrice: 0,
      suggestedPrice: 0,
      maxPrice: 0,
      effectiveMin: 0,
      effectiveSuggested: 0,
      effectiveMax: 0,
      isCustomRule: false,
    };
  }

  const extraFee = serviceType?.extraFee || 0;

  // 1. Check if an explicit price rule exists in company settings
  const rules = settings?.priceRules || DEFAULT_PRICE_RULES_COMP1;
  const matchedRule = rules.find((r) => {
    const matchModel = r.modelId === 'all' || r.modelId === model.id;
    const matchService = r.serviceId === service.id;
    const matchQuality =
      !quality ||
      r.qualityId === quality.id ||
      r.qualityId === quality.name ||
      (quality.label && r.qualityLabel && quality.label.toLowerCase().includes(r.qualityLabel.toLowerCase()));

    return matchModel && matchService && matchQuality;
  });

  if (matchedRule) {
    return {
      minPrice: matchedRule.minPrice,
      suggestedPrice: matchedRule.suggestedPrice,
      maxPrice: matchedRule.maxPrice,
      effectiveMin: matchedRule.minPrice + extraFee,
      effectiveSuggested: matchedRule.suggestedPrice + extraFee,
      effectiveMax: matchedRule.maxPrice + extraFee,
      isCustomRule: true,
      ruleNotes: matchedRule.notes,
    };
  }

  // 2. If no explicit rule, derive sensible commercial bounds (Min ~83%, Max ~120% rounded to tens)
  let modelFactor = 1.0;
  if (model.category === 'Premium') {
    modelFactor = model.brand === 'Apple' ? 1.65 : 1.45;
  } else if (model.category === 'Intermediário') {
    modelFactor = 1.0;
  } else {
    modelFactor = 0.85;
  }

  const qualityMultiplier = quality?.priceMultiplier || 1.0;
  const baseCost = service.basePrice * modelFactor * qualityMultiplier;

  // Suggested price rounded to 10
  const suggestedPrice = Math.max(30, Math.round(baseCost / 10) * 10);
  // Min price ~83% of suggested, minimum difference of 20
  const minPrice = Math.max(20, Math.round((suggestedPrice * 0.83) / 10) * 10);
  // Max price ~120% of suggested
  const maxPrice = Math.round((suggestedPrice * 1.20) / 10) * 10;

  return {
    minPrice,
    suggestedPrice,
    maxPrice,
    effectiveMin: minPrice + extraFee,
    effectiveSuggested: suggestedPrice + extraFee,
    effectiveMax: maxPrice + extraFee,
    isCustomRule: false,
  };
}

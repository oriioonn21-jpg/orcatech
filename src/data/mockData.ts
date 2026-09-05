import { BrandName, PhoneModel, ServiceItem, QualityOption, Quote, StaffMember, StoreLocation } from '../types';

export const BRANDS: { name: BrandName; color: string; icon: string }[] = [
  { name: 'Apple', color: 'from-slate-700 to-slate-900', icon: '🍎' },
  { name: 'Samsung', color: 'from-blue-600 to-indigo-800', icon: '📱' },
  { name: 'Motorola', color: 'from-cyan-600 to-blue-700', icon: 'Ⓜ️' },
  { name: 'Xiaomi', color: 'from-orange-500 to-amber-600', icon: '⚡' },
];

export const PHONE_MODELS: PhoneModel[] = [
  // Apple
  { id: 'app-ip15p', brand: 'Apple', name: 'iPhone 15 Pro', category: 'Premium', popular: true },
  { id: 'app-ip15', brand: 'Apple', name: 'iPhone 15', category: 'Premium', popular: true },
  { id: 'app-ip14p', brand: 'Apple', name: 'iPhone 14 Pro', category: 'Premium', popular: true },
  { id: 'app-ip14', brand: 'Apple', name: 'iPhone 14', category: 'Premium', popular: true },
  { id: 'app-ip13p', brand: 'Apple', name: 'iPhone 13 Pro', category: 'Premium', popular: true },
  { id: 'app-ip13', brand: 'Apple', name: 'iPhone 13', category: 'Premium', popular: true },
  { id: 'app-ip12', brand: 'Apple', name: 'iPhone 12', category: 'Premium', popular: true },
  { id: 'app-ip11', brand: 'Apple', name: 'iPhone 11', category: 'Intermediário', popular: true },
  { id: 'app-ipxr', brand: 'Apple', name: 'iPhone XR', category: 'Intermediário', popular: false },
  { id: 'app-ipse', brand: 'Apple', name: 'iPhone SE (3ª Geração)', category: 'Intermediário', popular: false },

  // Samsung
  { id: 'sam-s24u', brand: 'Samsung', name: 'Galaxy S24 Ultra', category: 'Premium', popular: true },
  { id: 'sam-s23', brand: 'Samsung', name: 'Galaxy S23', category: 'Premium', popular: true },
  { id: 'sam-a54', brand: 'Samsung', name: 'Galaxy A54 5G', category: 'Intermediário', popular: true },
  { id: 'sam-a34', brand: 'Samsung', name: 'Galaxy A34 5G', category: 'Intermediário', popular: true },
  { id: 'sam-a14', brand: 'Samsung', name: 'Galaxy A14', category: 'Entrada', popular: true },
  { id: 'sam-s21fe', brand: 'Samsung', name: 'Galaxy S21 FE', category: 'Intermediário', popular: false },
  { id: 'sam-m54', brand: 'Samsung', name: 'Galaxy M54 5G', category: 'Intermediário', popular: false },
  { id: 'sam-a53', brand: 'Samsung', name: 'Galaxy A53 5G', category: 'Intermediário', popular: false },

  // Motorola
  { id: 'mot-g54', brand: 'Motorola', name: 'Moto G54 5G', category: 'Intermediário', popular: true },
  { id: 'mot-g84', brand: 'Motorola', name: 'Moto G84 5G', category: 'Intermediário', popular: true },
  { id: 'mot-edge40', brand: 'Motorola', name: 'Motorola Edge 40', category: 'Premium', popular: false },
  { id: 'mot-g23', brand: 'Motorola', name: 'Moto G23', category: 'Entrada', popular: false },
  { id: 'mot-g53', brand: 'Motorola', name: 'Moto G53 5G', category: 'Intermediário', popular: false },

  // Xiaomi
  { id: 'xia-rn12', brand: 'Xiaomi', name: 'Redmi Note 12', category: 'Intermediário', popular: true },
  { id: 'xia-rn13p', brand: 'Xiaomi', name: 'Redmi Note 13 Pro', category: 'Intermediário', popular: true },
  { id: 'xia-px5', brand: 'Xiaomi', name: 'Poco X5 Pro 5G', category: 'Intermediário', popular: true },
  { id: 'xia-13t', brand: 'Xiaomi', name: 'Xiaomi 13T', category: 'Premium', popular: false },
  { id: 'xia-r12c', brand: 'Xiaomi', name: 'Redmi 12C', category: 'Entrada', popular: false },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-tela',
    name: 'Tela (Frontal Completa)',
    category: 'Display',
    iconName: 'Smartphone',
    estimatedMinutes: 45,
    basePrice: 380,
    description: 'Substituição completa do módulo de vidro e display touch screen.',
  },
  {
    id: 'srv-bateria',
    name: 'Bateria',
    category: 'Energia',
    iconName: 'BatteryCharging',
    estimatedMinutes: 30,
    basePrice: 190,
    description: 'Troca da célula de bateria com restauração da capacidade 100% e vedação.',
  },
  {
    id: 'srv-conector',
    name: 'Conector de Carga',
    category: 'Energia',
    iconName: 'Zap',
    estimatedMinutes: 40,
    basePrice: 150,
    description: 'Troca do conector USB-C / Lightning com microfone integrado e teste de carga rápida.',
  },
  {
    id: 'srv-camera',
    name: 'Câmera Traseira',
    category: 'Óptica',
    iconName: 'Camera',
    estimatedMinutes: 40,
    basePrice: 260,
    description: 'Substituição do módulo de lente e sensor de foco original.',
  },
  {
    id: 'srv-altofalante',
    name: 'Alto-falante / Auricular',
    category: 'Áudio',
    iconName: 'Volume2',
    estimatedMinutes: 30,
    basePrice: 140,
    description: 'Reparo ou substituição do alto-falante estéreo / campainha de chamadas.',
  },
  {
    id: 'srv-tampa',
    name: 'Tampa Traseira (Vidro)',
    category: 'Carcaça',
    iconName: 'Shield',
    estimatedMinutes: 60,
    basePrice: 220,
    description: 'Substituição da tampa traseira trincada ou danificada a laser.',
  },
  {
    id: 'srv-desoxidacao',
    name: 'Desoxidação / Limpeza Química',
    category: 'Placa',
    iconName: 'Droplets',
    estimatedMinutes: 120,
    basePrice: 180,
    description: 'Banho ultrassônico para recuperação de aparelho após contato com líquido.',
  },
];

export const QUALITY_OPTIONS: QualityOption[] = [
  {
    id: 'original',
    companyId: 'comp-1',
    name: 'Original Nacional / Retirada',
    label: 'Original Nacional / Retirada',
    description: 'Mesma tela e tecnologia de fábrica. Cores 100%, taxa de atualização e durabilidade máxima.',
    badge: 'Máxima Qualidade',
    warrantyDefault: '1 ano de garantia',
    priceMultiplier: 1.35,
    active: true,
  },
  {
    id: 'premium_oled',
    companyId: 'comp-1',
    name: 'Premium OLED / Soft OLED',
    label: 'Premium OLED / Soft OLED',
    description: 'Excelente fidelidade de cores, baixo consumo de bateria e resposta ao toque idêntica.',
    badge: 'Mais Recomendada',
    warrantyDefault: '6 meses de garantia',
    priceMultiplier: 1.0,
    active: true,
  },
  {
    id: 'incell_primeira_linha',
    companyId: 'comp-1',
    name: 'Primeira Linha / Incell',
    label: 'Primeira Linha / Incell',
    description: 'Opção econômica com ótimo funcionamento touch e visual de alto padrão.',
    badge: 'Econômica',
    warrantyDefault: '90 dias de garantia',
    priceMultiplier: 0.72,
    active: true,
  },
];

// Helper to calculate price based on device tier and service
export function calculateServicePrice(model: PhoneModel, service: ServiceItem, quality: QualityOption): {
  cash: number;
  installments: number;
  installmentsCount: number;
  installmentValue: number;
} {
  let modelMultiplier = 1.0;
  if (model.brand === 'Apple') {
    if (model.name.includes('15') || model.name.includes('14 Pro') || model.name.includes('13 Pro')) {
      modelMultiplier = 1.7;
    } else if (model.name.includes('13') || model.name.includes('12')) {
      modelMultiplier = 1.35;
    } else {
      modelMultiplier = 1.15;
    }
  } else if (model.brand === 'Samsung') {
    if (model.name.includes('Ultra') || model.name.includes('S24') || model.name.includes('S23')) {
      modelMultiplier = 1.55;
    } else if (model.name.includes('A54') || model.name.includes('A53')) {
      modelMultiplier = 1.1;
    } else {
      modelMultiplier = 0.95;
    }
  } else if (model.brand === 'Motorola') {
    modelMultiplier = model.category === 'Premium' ? 1.25 : 0.9;
  } else if (model.brand === 'Xiaomi') {
    modelMultiplier = model.category === 'Premium' ? 1.2 : 0.95;
  }

  // Base raw calculated price
  const rawPrice = Math.round(service.basePrice * modelMultiplier * quality.priceMultiplier);
  // Round to friendly pricing, e.g., ending in 0 or 5
  const cash = Math.ceil(rawPrice / 10) * 10;
  // Card has ~8% parceling fee absorbed or split
  const installmentsCount = cash >= 400 ? 6 : cash >= 250 ? 3 : 2;
  const installmentsTotal = Math.round(cash * 1.06);
  const installmentValue = Number((installmentsTotal / installmentsCount).toFixed(2));

  return {
    cash,
    installments: installmentsTotal,
    installmentsCount,
    installmentValue,
  };
}

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'q-101',
    quoteNumber: 'ORC-2026-089',
    createdAt: 'Hoje, 10:24',
    clientName: 'Mariana Silveira',
    clientPhone: '(11) 98744-1234',
    deviceId: 'app-ip13',
    deviceName: 'iPhone 13',
    deviceBrand: 'Apple',
    serviceId: 'srv-tela',
    serviceName: 'Tela (Frontal Completa)',
    qualityTier: 'premium_oled',
    qualityLabel: 'Premium OLED / Soft OLED',
    deliveryTime: 'Pronto em 45 minutos',
    warranty: '6 meses de garantia',
    cashPrice: 490,
    installmentsPrice: 520,
    installmentsCount: 3,
    status: 'Aprovado',
    technicianName: 'Pedro Santos',
    storeName: 'Loja Centro',
  },
  {
    id: 'q-102',
    quoteNumber: 'ORC-2026-088',
    createdAt: 'Hoje, 09:45',
    clientName: 'Lucas Ferreira',
    clientPhone: '(11) 97655-9876',
    deviceId: 'sam-a54',
    deviceName: 'Galaxy A54 5G',
    deviceBrand: 'Samsung',
    serviceId: 'srv-bateria',
    serviceName: 'Bateria',
    qualityTier: 'original',
    qualityLabel: 'Original Nacional / Retirada',
    deliveryTime: 'Pronto em 30 minutos',
    warranty: '1 ano de garantia',
    cashPrice: 280,
    installmentsPrice: 297,
    installmentsCount: 3,
    status: 'Enviado',
    technicianName: 'Pedro Santos',
    storeName: 'Loja Centro',
  },
  {
    id: 'q-103',
    quoteNumber: 'ORC-2026-087',
    createdAt: 'Ontem, 17:15',
    clientName: 'Carla Mendes',
    clientPhone: '(11) 99123-5544',
    deviceId: 'app-ip11',
    deviceName: 'iPhone 11',
    deviceBrand: 'Apple',
    serviceId: 'srv-bateria',
    serviceName: 'Bateria',
    qualityTier: 'original',
    qualityLabel: 'Original Nacional / Retirada',
    deliveryTime: 'Pronto em 40 minutos',
    warranty: '1 ano de garantia',
    cashPrice: 240,
    installmentsPrice: 255,
    installmentsCount: 2,
    status: 'Aprovado',
    technicianName: 'Renato Silva',
    storeName: 'Loja Shopping',
  },
  {
    id: 'q-104',
    quoteNumber: 'ORC-2026-086',
    createdAt: 'Ontem, 15:30',
    clientName: 'Guilherme Rocha',
    clientPhone: '(11) 98877-3322',
    deviceId: 'mot-g54',
    deviceName: 'Moto G54 5G',
    deviceBrand: 'Motorola',
    serviceId: 'srv-conector',
    serviceName: 'Conector de Carga',
    qualityTier: 'original',
    qualityLabel: 'Original Nacional',
    deliveryTime: 'Pronto em 40 minutos',
    warranty: '90 dias de garantia',
    cashPrice: 150,
    installmentsPrice: 160,
    installmentsCount: 2,
    status: 'Recusado',
    technicianName: 'Pedro Santos',
    storeName: 'Loja Centro',
  },
  {
    id: 'q-105',
    quoteNumber: 'ORC-2026-085',
    createdAt: 'Ontem, 11:20',
    clientName: 'Fernanda Souza',
    clientPhone: '(11) 97412-9988',
    deviceId: 'xia-rn12',
    deviceName: 'Redmi Note 12',
    deviceBrand: 'Xiaomi',
    serviceId: 'srv-tela',
    serviceName: 'Tela (Frontal Completa)',
    qualityTier: 'incell_primeira_linha',
    qualityLabel: 'Primeira Linha / Incell',
    deliveryTime: 'Pronto em 50 minutos',
    warranty: '90 dias de garantia',
    cashPrice: 270,
    installmentsPrice: 288,
    installmentsCount: 3,
    status: 'Enviado',
    technicianName: 'Renato Silva',
    storeName: 'Loja Shopping',
  },
];

export const COMPANIES: { id: string; name: string; cnpj: string; phone: string }[] = [
  { id: 'comp-1', name: 'TechFix Assistência Matriz', cnpj: '12.345.678/0001-90', phone: '(11) 3456-7890' },
  { id: 'comp-2', name: 'iCell Prime Especializada', cnpj: '98.765.432/0001-11', phone: '(11) 4004-9988' },
];

export const STAFF_MEMBERS: StaffMember[] = [
  { id: 'st-1', name: 'Pedro Santos', email: 'pedro@orcatech.com', role: 'Técnico', companyId: 'comp-1', storeId: 'store-1' },
  { id: 'st-2', name: 'Renato Silva', email: 'renato@orcatech.com', role: 'Técnico', companyId: 'comp-1', storeId: 'store-2' },
  { id: 'st-3', name: 'Aline Oliveira', email: 'aline@orcatech.com', role: 'Atendente', companyId: 'comp-1', storeId: 'store-1' },
  { id: 'st-4', name: 'Carlos Eduardo', email: 'carlos@orcatech.com', role: 'Administrador', companyId: 'comp-1', storeId: 'store-1' },
  { id: 'st-5', name: 'Felipe Costa', email: 'felipe@icellprime.com', role: 'Administrador', companyId: 'comp-2', storeId: 'store-icell-1' },
  { id: 'st-6', name: 'Juliana Mendes', email: 'juliana@icellprime.com', role: 'Técnico', companyId: 'comp-2', storeId: 'store-icell-1' },
];

export const STORES: StoreLocation[] = [
  { id: 'store-1', companyId: 'comp-1', name: 'Loja Centro - Matriz', address: 'Rua das Flores, 420 - Centro', phone: '(11) 3456-7890', active: true },
  { id: 'store-2', companyId: 'comp-1', name: 'Loja Shopping Plaza', address: 'Av. Paulista, 1500 - Piso 2', phone: '(11) 3999-1122', active: true },
  { id: 'store-icell-1', companyId: 'comp-2', name: 'Unidade Jardins', address: 'Rua Oscar Freire, 1020', phone: '(11) 4004-9988', active: true },
];

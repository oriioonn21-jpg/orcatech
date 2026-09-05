import { FullDeviceModel, DeviceServiceConfig, ServiceQualityConfig, BrandName } from '../types';
import { PHONE_MODELS } from './mockData';

// 23 Initial Services as specified by the user
export const INITIAL_SERVICE_DEFINITIONS = [
  { id: 'srv-tela', name: 'Troca de Tela', hasQuality: true, category: 'Display', iconName: 'Smartphone' },
  { id: 'srv-vidro', name: 'Troca de Vidro', hasQuality: false, category: 'Display', iconName: 'Maximize2' },
  { id: 'srv-bateria', name: 'Troca de Bateria', hasQuality: true, category: 'Energia', iconName: 'Battery' },
  { id: 'srv-cam-front', name: 'Câmera Frontal', hasQuality: false, category: 'Óptica', iconName: 'Camera' },
  { id: 'srv-cam-tras', name: 'Câmera Traseira', hasQuality: false, category: 'Óptica', iconName: 'Camera' },
  { id: 'srv-placa', name: 'Reparo de Placa', hasQuality: false, category: 'Placa', iconName: 'Cpu' },
  { id: 'srv-conector', name: 'Conector de Carga', hasQuality: false, category: 'Energia', iconName: 'Zap' },
  { id: 'srv-tampa', name: 'Tampa Traseira', hasQuality: false, category: 'Carcaça', iconName: 'Shield' },
  { id: 'srv-microfone', name: 'Microfone', hasQuality: false, category: 'Áudio', iconName: 'Mic' },
  { id: 'srv-altofalante', name: 'Alto-falante', hasQuality: false, category: 'Áudio', iconName: 'Volume2' },
  { id: 'srv-auricular', name: 'Auricular', hasQuality: false, category: 'Áudio', iconName: 'Volume1' },
  { id: 'srv-botao-int', name: 'Botão Interno', hasQuality: false, category: 'Botões', iconName: 'ToggleRight' },
  { id: 'srv-botao-ext', name: 'Botão Externo', hasQuality: false, category: 'Botões', iconName: 'CircleDot' },
  { id: 'srv-lente-cam', name: 'Lente da Câmera', hasQuality: false, category: 'Óptica', iconName: 'Aperture' },
  { id: 'srv-faceid', name: 'Face ID / Biometria', hasQuality: false, category: 'Sensores', iconName: 'ScanFace' },
  { id: 'srv-sensor-prox', name: 'Sensor de Proximidade', hasQuality: false, category: 'Sensores', iconName: 'Eye' },
  { id: 'srv-flex-carga', name: 'Flex de Carga', hasQuality: false, category: 'Energia', iconName: 'Activity' },
  { id: 'srv-flex-botoes', name: 'Flex de Botões', hasQuality: false, category: 'Botões', iconName: 'Layers' },
  { id: 'srv-antena', name: 'Antena', hasQuality: false, category: 'Rede', iconName: 'Radio' },
  { id: 'srv-vibracall', name: 'Vibra Call', hasQuality: false, category: 'Motores', iconName: 'Vibrate' },
  { id: 'srv-software', name: 'Software', hasQuality: false, category: 'Sistema', iconName: 'Terminal' },
  { id: 'srv-desoxidacao', name: 'Limpeza / Oxidação', hasQuality: false, category: 'Placa', iconName: 'Droplets' },
  { id: 'srv-diagnostico', name: 'Diagnóstico', hasQuality: false, category: 'Avaliação', iconName: 'CheckCircle2' },
];

// Initial screen qualities
export const INITIAL_SCREEN_QUALITIES: { name: string; minPrice: number; sugPrice: number; maxPrice: number; warranty: string; time: string }[] = [
  { name: 'Premium LCD', minPrice: 300, sugPrice: 350, maxPrice: 400, warranty: '90 dias', time: '45 minutos' },
  { name: 'OLED', minPrice: 400, sugPrice: 450, maxPrice: 500, warranty: '90 dias', time: '45 minutos' },
  { name: 'Premium OLED', minPrice: 500, sugPrice: 550, maxPrice: 620, warranty: '6 meses', time: '45 minutos' },
  { name: 'Nacional', minPrice: 650, sugPrice: 700, maxPrice: 800, warranty: '1 ano', time: '45 minutos' },
];

// Initial battery qualities
export const INITIAL_BATTERY_QUALITIES: { name: string; minPrice: number; sugPrice: number; maxPrice: number; warranty: string; time: string }[] = [
  { name: 'Primeira Linha', minPrice: 160, sugPrice: 190, maxPrice: 230, warranty: '90 dias', time: '35 minutos' },
  { name: 'Premium Gold', minPrice: 220, sugPrice: 260, maxPrice: 310, warranty: '6 meses', time: '35 minutos' },
  { name: 'Original Nacional', minPrice: 290, sugPrice: 340, maxPrice: 410, warranty: '1 ano', time: '35 minutos' },
];

// Base pricing multipliers and defaults for single services
const BASE_PRICES_OTHER_SERVICES: Record<string, { min: number; sug: number; max: number; warranty: string; time: string }> = {
  'srv-vidro': { min: 220, sug: 260, max: 320, warranty: '90 dias', time: '2 horas' },
  'srv-cam-front': { min: 160, sug: 200, max: 250, warranty: '90 dias', time: '40 minutos' },
  'srv-cam-tras': { min: 260, sug: 320, max: 390, warranty: '90 dias', time: '40 minutos' },
  'srv-placa': { min: 280, sug: 380, max: 490, warranty: '90 dias', time: '1 dia útil' },
  'srv-conector': { min: 150, sug: 180, max: 230, warranty: '90 dias', time: '40 minutos' },
  'srv-tampa': { min: 180, sug: 230, max: 290, warranty: '90 dias', time: '1h 30 min' },
  'srv-microfone': { min: 130, sug: 160, max: 210, warranty: '90 dias', time: '35 minutos' },
  'srv-altofalante': { min: 130, sug: 160, max: 200, warranty: '90 dias', time: '30 minutos' },
  'srv-auricular': { min: 120, sug: 150, max: 190, warranty: '90 dias', time: '30 minutos' },
  'srv-botao-int': { min: 110, sug: 140, max: 180, warranty: '90 dias', time: '30 minutos' },
  'srv-botao-ext': { min: 90, sug: 120, max: 160, warranty: '90 dias', time: '25 minutos' },
  'srv-lente-cam': { min: 80, sug: 110, max: 150, warranty: '90 dias', time: '25 minutos' },
  'srv-faceid': { min: 240, sug: 320, max: 420, warranty: '90 dias', time: '1 hora' },
  'srv-sensor-prox': { min: 120, sug: 160, max: 210, warranty: '90 dias', time: '35 minutos' },
  'srv-flex-carga': { min: 140, sug: 170, max: 220, warranty: '90 dias', time: '35 minutos' },
  'srv-flex-botoes': { min: 110, sug: 140, max: 190, warranty: '90 dias', time: '35 minutos' },
  'srv-antena': { min: 100, sug: 130, max: 180, warranty: '90 dias', time: '30 minutos' },
  'srv-vibracall': { min: 100, sug: 130, max: 170, warranty: '90 dias', time: '25 minutos' },
  'srv-software': { min: 90, sug: 130, max: 180, warranty: '30 dias', time: '45 minutos' },
  'srv-desoxidacao': { min: 140, sug: 180, max: 240, warranty: '30 dias', time: '2 horas' },
  'srv-diagnostico': { min: 0, sug: 0, max: 50, warranty: 'Sem garantia', time: '20 minutos' },
};

// Helper to build 23 services for a device with realistic prices scaled by tier
export function generateDefaultServicesForModel(
  category: 'Premium' | 'Intermediário' | 'Entrada' = 'Intermediário',
  brand: BrandName = 'Apple'
): DeviceServiceConfig[] {
  let multiplier = 1.0;
  if (category === 'Premium') multiplier = 1.25;
  if (category === 'Entrada') multiplier = 0.75;
  if (brand === 'Apple') multiplier *= 1.1;

  const round10 = (val: number) => Math.max(10, Math.round((val * multiplier) / 10) * 10);

  return INITIAL_SERVICE_DEFINITIONS.map((def) => {
    if (def.name === 'Troca de Tela') {
      const screenQualities: ServiceQualityConfig[] = INITIAL_SCREEN_QUALITIES.map((q, idx) => ({
        id: `q-tela-${idx + 1}`,
        name: q.name,
        minPrice: round10(q.minPrice),
        suggestedPrice: round10(q.sugPrice),
        maxPrice: round10(q.maxPrice),
        warranty: q.warranty,
        estimatedTime: q.time,
        internalNotes: idx === 2 ? 'Recomendada para alta fidelidade' : '',
        active: true,
      }));

      return {
        id: `cfg-${def.id}`,
        serviceId: def.id,
        serviceName: def.name,
        category: def.category,
        iconName: def.iconName,
        hasQuality: true,
        active: true,
        qualities: screenQualities,
      };
    }

    if (def.name === 'Troca de Bateria') {
      const batteryQualities: ServiceQualityConfig[] = INITIAL_BATTERY_QUALITIES.map((q, idx) => ({
        id: `q-bat-${idx + 1}`,
        name: q.name,
        minPrice: round10(q.minPrice),
        suggestedPrice: round10(q.sugPrice),
        maxPrice: round10(q.maxPrice),
        warranty: q.warranty,
        estimatedTime: q.time,
        internalNotes: idx === 1 ? 'Célula de alta densidade 100%' : '',
        active: true,
      }));

      return {
        id: `cfg-${def.id}`,
        serviceId: def.id,
        serviceName: def.name,
        category: def.category,
        iconName: def.iconName,
        hasQuality: true,
        active: true,
        qualities: batteryQualities,
      };
    }

    // Direct pricing for all other 21 services
    const base = BASE_PRICES_OTHER_SERVICES[def.id] || { min: 120, sug: 150, max: 200, warranty: '90 dias', time: '35 minutos' };
    return {
      id: `cfg-${def.id}`,
      serviceId: def.id,
      serviceName: def.name,
      category: def.category,
      iconName: def.iconName,
      hasQuality: false,
      active: true,
      minPrice: round10(base.min),
      suggestedPrice: round10(base.sug),
      maxPrice: round10(base.max),
      warranty: base.warranty,
      estimatedTime: base.time,
      internalNotes: '',
    };
  });
}

// Derive Family from Model Name
function deriveFamily(brand: BrandName, name: string): string {
  if (brand === 'Apple') {
    if (name.includes('15')) return 'Linha iPhone 15';
    if (name.includes('14')) return 'Linha iPhone 14';
    if (name.includes('13')) return 'Linha iPhone 13';
    if (name.includes('12')) return 'Linha iPhone 12';
    if (name.includes('11')) return 'Linha iPhone 11';
    if (name.includes('SE')) return 'Linha iPhone SE';
    return 'Linha iPhone';
  }
  if (brand === 'Samsung') {
    if (name.includes('S24') || name.includes('S23') || name.includes('S21')) return 'Linha Galaxy S';
    if (name.includes('A55') || name.includes('A54') || name.includes('A34') || name.includes('A14') || name.includes('A53')) return 'Linha Galaxy A';
    if (name.includes('M54')) return 'Linha Galaxy M';
    return 'Linha Galaxy';
  }
  if (brand === 'Motorola') {
    if (name.includes('Edge')) return 'Linha Edge';
    if (name.includes('G54') || name.includes('G84') || name.includes('G23') || name.includes('G53')) return 'Linha Moto G';
    return 'Linha Motorola';
  }
  if (brand === 'Xiaomi') {
    if (name.includes('Redmi Note')) return 'Linha Redmi Note';
    if (name.includes('Poco')) return 'Linha Poco';
    if (name.includes('Redmi')) return 'Linha Redmi';
    return 'Linha Xiaomi';
  }
  return 'Geral';
}

// Derive estimated year
function deriveYear(name: string): number | undefined {
  if (name.includes('15') || name.includes('S24') || name.includes('A55')) return 2024;
  if (name.includes('14') || name.includes('S23') || name.includes('G54') || name.includes('G84') || name.includes('RN13') || name.includes('13T')) return 2023;
  if (name.includes('13') || name.includes('A54') || name.includes('A34') || name.includes('RN12') || name.includes('Edge 40')) return 2022;
  if (name.includes('12') || name.includes('S21') || name.includes('A53') || name.includes('11')) return 2021;
  return undefined;
}

// Build initial devices from PHONE_MODELS
export function getInitialDevices(): FullDeviceModel[] {
  // Ensure we include the explicit requested examples:
  // Apple → iPhone 13, Samsung → Galaxy A55 5G, Motorola → Moto G54, Xiaomi → Redmi Note 13
  const modelsWithExamples = [...PHONE_MODELS];

  if (!modelsWithExamples.some((m) => m.name.includes('Galaxy A55'))) {
    modelsWithExamples.push({
      id: 'sam-a55',
      brand: 'Samsung',
      name: 'Galaxy A55 5G',
      category: 'Intermediário',
      popular: true,
    });
  }

  if (!modelsWithExamples.some((m) => m.name.includes('Redmi Note 13') && !m.name.includes('Pro'))) {
    modelsWithExamples.push({
      id: 'xia-rn13',
      brand: 'Xiaomi',
      name: 'Redmi Note 13',
      category: 'Intermediário',
      popular: true,
    });
  }

  return modelsWithExamples.map((pm) => {
    const family = deriveFamily(pm.brand, pm.name);
    const year = deriveYear(pm.name);
    const services = generateDefaultServicesForModel(pm.category, pm.brand);

    // Exact user example values for iPhone 13 if it matches
    if (pm.name === 'iPhone 13' && pm.brand === 'Apple') {
      const tela = services.find((s) => s.serviceName === 'Troca de Tela');
      if (tela && tela.qualities) {
        tela.qualities = [
          { id: 'q-tela-1', name: 'Premium LCD', minPrice: 300, suggestedPrice: 350, maxPrice: 400, warranty: '90 dias', estimatedTime: '45 minutos', active: true },
          { id: 'q-tela-2', name: 'OLED', minPrice: 400, suggestedPrice: 450, maxPrice: 500, warranty: '90 dias', estimatedTime: '45 minutos', active: true },
          { id: 'q-tela-3', name: 'Premium OLED', minPrice: 500, suggestedPrice: 550, maxPrice: 620, warranty: '6 meses', estimatedTime: '45 minutos', active: true },
          { id: 'q-tela-4', name: 'Nacional', minPrice: 650, suggestedPrice: 700, maxPrice: 800, warranty: '1 ano', estimatedTime: '45 minutos', active: true },
        ];
      }
      const conector = services.find((s) => s.serviceName === 'Conector de Carga');
      if (conector) {
        conector.minPrice = 350;
        conector.suggestedPrice = 420;
        conector.maxPrice = 500;
      }
    }

    return {
      id: pm.id,
      brand: pm.brand,
      name: pm.name,
      family: family,
      year: year,
      active: true,
      category: pm.category,
      image: pm.image,
      popular: pm.popular,
      services: services,
    };
  });
}

const STORAGE_PREFIX = 'orcatech_device_catalog_';

// Retrieve all devices for a company with local persistence
export function getCompanyDevices(companyId: string): FullDeviceModel[] {
  if (typeof window === 'undefined') {
    return getInitialDevices();
  }

  const key = `${STORAGE_PREFIX}${companyId}`;
  const stored = localStorage.getItem(key);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Error reading stored devices', e);
    }
  }

  // First time: initialize and persist
  const initial = getInitialDevices();
  saveCompanyDevices(companyId, initial);
  return initial;
}

// Persist devices array
export function saveCompanyDevices(companyId: string, devices: FullDeviceModel[]): void {
  if (typeof window === 'undefined') return;
  const key = `${STORAGE_PREFIX}${companyId}`;
  localStorage.setItem(key, JSON.stringify(devices));
}

// Save single device (update existing or add new)
export function saveSingleDevice(companyId: string, device: FullDeviceModel): FullDeviceModel[] {
  const current = getCompanyDevices(companyId);
  const exists = current.findIndex((d) => d.id === device.id);
  let updated: FullDeviceModel[];

  if (exists >= 0) {
    updated = current.map((d) => (d.id === device.id ? device : d));
  } else {
    updated = [device, ...current];
  }

  saveCompanyDevices(companyId, updated);
  return updated;
}

// Delete device
export function deleteSingleDevice(companyId: string, deviceId: string): FullDeviceModel[] {
  const current = getCompanyDevices(companyId);
  const updated = current.filter((d) => d.id !== deviceId);
  saveCompanyDevices(companyId, updated);
  return updated;
}

// Duplicate device (deep copy of services, qualities, warranties, times, prices)
export function duplicateDeviceModel(
  companyId: string,
  sourceDeviceId: string,
  newName: string,
  newFamily?: string,
  newYear?: number | string
): { updatedDevices: FullDeviceModel[]; newDevice: FullDeviceModel } {
  const current = getCompanyDevices(companyId);
  const source = current.find((d) => d.id === sourceDeviceId);

  if (!source) {
    throw new Error('Aparelho de origem não encontrado.');
  }

  const newId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Deep clone services and their qualities
  const clonedServices: DeviceServiceConfig[] = source.services.map((srv) => ({
    ...srv,
    id: `cfg-${srv.serviceId}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    qualities: srv.qualities
      ? srv.qualities.map((q) => ({
          ...q,
          id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        }))
      : undefined,
  }));

  const newDevice: FullDeviceModel = {
    ...source,
    id: newId,
    name: newName,
    family: newFamily || source.family,
    year: newYear !== undefined && newYear !== '' ? newYear : source.year,
    active: true,
    services: clonedServices,
  };

  const updatedDevices = [newDevice, ...current];
  saveCompanyDevices(companyId, updatedDevices);
  return { updatedDevices, newDevice };
}

// Apply service configuration from a source device to multiple target models
export function applyServiceToMultipleModels(
  companyId: string,
  sourceDeviceId: string,
  serviceIdToApply: string | 'ALL',
  targetDeviceIds: string[]
): FullDeviceModel[] {
  const current = getCompanyDevices(companyId);
  const source = current.find((d) => d.id === sourceDeviceId);

  if (!source) {
    throw new Error('Aparelho de origem não encontrado.');
  }

  const targetSet = new Set(targetDeviceIds);

  const updatedDevices = current.map((target) => {
    if (!targetSet.has(target.id) || target.id === source.id) {
      return target;
    }

    let updatedServices: DeviceServiceConfig[];

    if (serviceIdToApply === 'ALL') {
      // Apply all services from source
      updatedServices = source.services.map((s) => ({
        ...s,
        id: `cfg-${s.serviceId}-${target.id}`,
        qualities: s.qualities
          ? s.qualities.map((q) => ({
              ...q,
              id: `q-${target.id}-${Math.random().toString(36).substring(2, 6)}`,
            }))
          : undefined,
      }));
    } else {
      // Apply only one specific service
      const sourceService = source.services.find(
        (s) => s.serviceId === serviceIdToApply || s.id === serviceIdToApply || s.serviceName === serviceIdToApply
      );

      if (!sourceService) return target;

      const cloned = {
        ...sourceService,
        id: `cfg-${sourceService.serviceId}-${target.id}`,
        qualities: sourceService.qualities
          ? sourceService.qualities.map((q) => ({
              ...q,
              id: `q-${target.id}-${Math.random().toString(36).substring(2, 6)}`,
            }))
          : undefined,
      };

      const existingIndex = target.services.findIndex(
        (s) => s.serviceId === sourceService.serviceId || s.serviceName === sourceService.serviceName
      );

      if (existingIndex >= 0) {
        updatedServices = target.services.map((s, idx) => (idx === existingIndex ? cloned : s));
      } else {
        updatedServices = [...target.services, cloned];
      }
    }

    return {
      ...target,
      services: updatedServices,
    };
  });

  saveCompanyDevices(companyId, updatedDevices);
  return updatedDevices;
}

// Search helper
export function filterDevices(
  devices: FullDeviceModel[],
  searchTerm: string,
  selectedBrand?: BrandName | 'Todas'
): FullDeviceModel[] {
  let list = devices;

  if (selectedBrand && selectedBrand !== 'Todas') {
    list = list.filter((d) => d.brand === selectedBrand);
  }

  if (!searchTerm.trim()) {
    return list;
  }

  const query = searchTerm.toLowerCase().trim();
  return list.filter(
    (d) =>
      d.name.toLowerCase().includes(query) ||
      d.brand.toLowerCase().includes(query) ||
      d.family.toLowerCase().includes(query) ||
      (d.year && String(d.year).includes(query))
  );
}

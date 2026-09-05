export type BrandName = 'Apple' | 'Samsung' | 'Motorola' | 'Xiaomi' | 'Outras';

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
}

export interface ServiceQualityConfig {
  id: string;
  name: string; // e.g. "Premium LCD", "OLED", "Premium OLED", "Nacional" or "Primeira Linha", "Original", etc.
  minPrice: number;
  suggestedPrice: number;
  maxPrice: number;
  warranty: string; // e.g. "90 dias", "6 meses", "1 ano"
  estimatedTime: string; // e.g. "45 min", "1 hora"
  internalNotes?: string;
  active: boolean;
}

export interface DeviceServiceConfig {
  id: string;
  serviceId: string;
  serviceName: string; // e.g. "Troca de Tela", "Troca de Bateria", "Conector de Carga", etc.
  name?: string; // Backwards compatibility alias for components accessing s.name
  category?: string;
  iconName?: string;
  hasQuality: boolean; // TRUE strictly for Troca de Tela and Troca de Bateria; FALSE for all others
  active: boolean;
  // If hasQuality is true:
  qualities?: ServiceQualityConfig[];
  // If hasQuality is false (direct pricing on the service itself):
  minPrice?: number;
  suggestedPrice?: number;
  maxPrice?: number;
  warranty?: string;
  estimatedTime?: string;
  internalNotes?: string;
}

export interface FullDeviceModel {
  id: string;
  companyId?: string;
  brand: BrandName;
  name: string; // Modelo: iPhone 13, Galaxy A55 5G
  family: string; // Linha/família: Linha iPhone 13, Galaxy A, Moto G
  year?: number | string; // Ano (opcional)
  active: boolean; // Status ativo/inativo
  category?: 'Premium' | 'Intermediário' | 'Entrada';
  image?: string;
  popular?: boolean;
  services: DeviceServiceConfig[];
}

export interface PhoneModel {
  id: string;
  brand: BrandName;
  name: string;
  category: 'Premium' | 'Intermediário' | 'Entrada';
  family?: string;
  year?: number | string;
  active?: boolean;
  image?: string;
  popular?: boolean;
  services?: DeviceServiceConfig[];
}

export type QualityTier = string;

export interface PartQualityConfig {
  id: string;
  companyId: string;
  name: string;
  label: string;
  description: string;
  badge: string;
  warrantyDefault?: string;
  priceMultiplier: number;
  active: boolean;
}

export type QualityOption = PartQualityConfig;

export interface WarrantyConfig {
  id: string;
  companyId: string;
  label: string; // e.g. "30 dias", "90 dias", "6 meses", "1 ano"
  description?: string;
  active: boolean;
  isDefault?: boolean;
}

export interface ServiceTypeConfig {
  id: string;
  companyId: string;
  name: string; // e.g. "Atendimento na Loja", "Retirada e Entrega", "Delivery", "Atendimento Expresso"
  description?: string;
  extraFee?: number;
  active: boolean;
  estimatedExtraTime?: string;
}

export interface TechnicianConfig {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  storeId: string;
  storeName?: string;
  active: boolean;
}

export interface PriceRuleConfig {
  id: string;
  companyId: string;
  modelId: string; // Specific PhoneModel ID or 'all'
  modelName?: string;
  serviceId: string; // ServiceItem ID
  serviceName?: string;
  qualityId: string; // PartQualityConfig ID or QualityTier
  qualityLabel?: string;
  minPrice: number; // Preço mínimo
  suggestedPrice: number; // Preço sugerido
  maxPrice: number; // Preço máximo
  active?: boolean;
  notes?: string;
}

export interface CompanyQuoteSettings {
  companyId: string;
  warranties: WarrantyConfig[];
  qualities: PartQualityConfig[];
  serviceTypes: ServiceTypeConfig[];
  technicians: TechnicianConfig[];
  priceRules?: PriceRuleConfig[];
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
  estimatedMinutes: number;
  basePrice: number; // Base cost for standard tier
  description: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  deviceId: string;
  deviceName: string;
  deviceBrand: BrandName;
  serviceId: string;
  serviceName: string;
  qualityTier: QualityTier;
  qualityLabel: string;
  deliveryTime: string;
  warranty: string;
  serviceTypeName?: string;
  serviceTypeId?: string;
  technicianId?: string;
  cashPrice: number; // Preço final efetivamente oferecido ao cliente
  installmentsPrice: number;
  installmentsCount: number;
  minAllowedPrice?: number;
  maxAllowedPrice?: number;
  suggestedPrice?: number;
  status: 'Pendente' | 'Enviado' | 'Aprovado' | 'Recusado';
  notes?: string;
  technicianName: string;
  storeName: string;
  companyId?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Gerente' | 'Técnico' | 'Atendente';
  companyId: string;
  storeId?: string;
  avatarUrl?: string;
}

export interface StoreLocation {
  id: string;
  companyId?: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
}


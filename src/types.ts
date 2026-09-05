export type BrandName = 'Apple' | 'Samsung' | 'Motorola' | 'Xiaomi' | 'Outras';

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
}

export interface PhoneModel {
  id: string;
  brand: BrandName;
  name: string;
  category: 'Premium' | 'Intermediário' | 'Entrada';
  image?: string;
  popular?: boolean;
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

export interface CompanyQuoteSettings {
  companyId: string;
  warranties: WarrantyConfig[];
  qualities: PartQualityConfig[];
  serviceTypes: ServiceTypeConfig[];
  technicians: TechnicianConfig[];
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
  cashPrice: number;
  installmentsPrice: number;
  installmentsCount: number;
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


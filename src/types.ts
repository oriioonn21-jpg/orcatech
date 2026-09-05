export type BrandName = 'Apple' | 'Samsung' | 'Motorola' | 'Xiaomi' | 'Outras';

export interface PhoneModel {
  id: string;
  brand: BrandName;
  name: string;
  category: 'Premium' | 'Intermediário' | 'Entrada';
  image?: string;
  popular?: boolean;
}

export type QualityTier = 'original' | 'premium_oled' | 'incell_primeira_linha';

export interface QualityOption {
  id: QualityTier;
  label: string;
  description: string;
  badge: string;
  warrantyDefault: string;
  priceMultiplier: number;
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
  cashPrice: number;
  installmentsPrice: number;
  installmentsCount: number;
  status: 'Pendente' | 'Enviado' | 'Aprovado' | 'Recusado';
  notes?: string;
  technicianName: string;
  storeName: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Técnico' | 'Atendente' | 'Gerente';
  avatarUrl?: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  active: boolean;
}

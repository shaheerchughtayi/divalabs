export type IconPresetType = 'shield' | 'code' | 'eye' | 'cpu' | 'custom';
export type ProductCategory = string;

export interface Product {
  id: string;
  title: string;
  category?: string;
  shortDescription: string;
  fullDescription: string;
  priceRs: number;
  imageUrl?: string;
  iconPreset?: IconPresetType;
  badge?: string;
  createdAt: number;
}

export interface CheckoutSettings {
  accountTitle: string;
  accountNumber: string;
  step1: string;
  step2: string;
  step3: string;
  showQrCode: boolean;
  qrCodeUrl?: string;
  instagramHandle: string;
}

export interface AdminAuth {
  email: string;
  password: string;
}

export interface StoreData {
  products: Product[];
  categories: string[];
  checkoutSettings: CheckoutSettings;
  adminAuth: AdminAuth;
}

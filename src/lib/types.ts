export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF';
export type Category = 'all' | 'horlogerie' | 'leather' | 'writing';
export type Destination = 'CH' | 'EU' | 'GB' | 'WORLD';
export type CollectorRole = 'Collector' | 'Press' | 'Trade';
export type PolicyPage = 'privacy' | 'delivery' | 'care' | 'ethics' | 'terms';

export interface Product {
  id: string;
  title: string;
  categoryLabel: string;
  categories: Exclude<Category, 'all'>[];
  image: string;
  alt: string;
  material: string;
  priceUSD: number;
  badge: string;
  reference: string;
  description: string;
  specs: { label: string; value: string }[];
  finishes: string[];
  leadTime: string;
  maxQuantity: number;
}

export interface CartItem {
  key: string;
  productId: string;
  finish: string;
  quantity: number;
}

export interface CommissionBuild {
  model: 'chrono' | 'tourbillon';
  alloy: 'titanium' | 'rose' | 'dlc';
  dial: 'slate' | 'bone' | 'forest';
  strap: 'cognac' | 'noir' | 'nubuck';
  monogram: string;
}

export interface ExchangeRates {
  date: string;
  rates: Record<Currency, number>;
  source: 'live' | 'cached';
}

export type Overlay =
  | { kind: 'bag' }
  | { kind: 'product'; productId: string }
  | { kind: 'consultation'; build?: CommissionBuild }
  | { kind: 'checkout' }
  | { kind: 'archive' }
  | { kind: 'provenance' }
  | { kind: 'policy'; page: PolicyPage }
  | { kind: 'rates' }
  | { kind: 'menu' };

export interface ToastMessage {
  id: number;
  title: string;
  detail?: string;
}

export interface DossierInput {
  kind: 'consultation' | 'allocation' | 'register';
  email: string;
  name?: string;
  role?: CollectorRole;
  salon?: string;
  date?: string;
  note?: string;
  destination?: Destination;
  build?: CommissionBuild;
  items?: CartItem[];
  currency: Currency;
  estimateUSD?: number;
}

export interface DossierReceipt {
  reference: string;
  createdAt: string;
  delivery: 'local' | 'sent' | 'session';
  input: DossierInput;
}

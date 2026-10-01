import { getProduct } from './catalogue';
import { isRecord } from './storage';
import type { CartItem } from './types';

export type CartAction =
  | { type: 'add'; productId: string; finish: string; quantity: number }
  | { type: 'quantity'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

export function cartKey(productId: string, finish: string): string { return `${productId}::${finish}`; }

export function hydrateCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.productId !== 'string' || typeof item.finish !== 'string' || typeof item.quantity !== 'number') continue;
    const product = getProduct(item.productId);
    if (!product || !product.finishes.includes(item.finish) || !Number.isInteger(item.quantity) || item.quantity < 1) continue;
    const key = cartKey(product.id, item.finish);
    const existing = result.find(row => row.key === key);
    const quantity = Math.min(item.quantity, product.maxQuantity);
    if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.maxQuantity);
    else result.push({ key, productId: product.id, finish: item.finish, quantity });
  }
  return result;
}

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  if (action.type === 'clear') return [];
  if (action.type === 'remove') return state.filter(item => item.key !== action.key);
  if (action.type === 'quantity') {
    if (!Number.isFinite(action.quantity)) return state;
    if (action.quantity < 1) return state.filter(item => item.key !== action.key);
    return state.map(item => item.key === action.key ? { ...item, quantity: Math.min(Math.floor(action.quantity), getProduct(item.productId)?.maxQuantity ?? 1) } : item);
  }
  const product = getProduct(action.productId);
  if (!product || !product.finishes.includes(action.finish) || !Number.isFinite(action.quantity) || action.quantity < 1) return state;
  const key = cartKey(product.id, action.finish);
  const existing = state.find(item => item.key === key);
  if (existing) return state.map(item => item.key === key ? { ...item, quantity: Math.min(item.quantity + Math.floor(action.quantity), product.maxQuantity) } : item);
  return [...state, { key, productId: product.id, finish: action.finish, quantity: Math.min(Math.floor(action.quantity), product.maxQuantity) }];
}

export function cartSubtotalUSD(items: CartItem[]): number {
  return items.reduce((total, item) => total + (getProduct(item.productId)?.priceUSD ?? 0) * item.quantity, 0);
}

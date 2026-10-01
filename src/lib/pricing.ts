import { ALLOYS, CURRENCIES, MODELS } from './catalogue';
import { isRecord } from './storage';
import type { CommissionBuild, Currency, Destination, ExchangeRates } from './types';

export const FALLBACK_RATES: ExchangeRates = {
  date: '2026-09-30', source: 'cached',
  rates: { USD: 1, EUR: 0.88067, GBP: 0.75265, CHF: 0.8347 },
};

export function isCurrency(value: unknown): value is Currency {
  return CURRENCIES.some(currency => currency.code === value);
}

export function parseExchangeRates(data: unknown): ExchangeRates | null {
  if (!isRecord(data) || data.base !== 'USD' || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date) || !isRecord(data.rates)) return null;
  const rates: Record<Currency, number> = { USD: 1, EUR: 0, GBP: 0, CHF: 0 };
  for (const code of ['EUR', 'GBP', 'CHF'] as const) {
    const value = data.rates[code];
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 10) return null;
    rates[code] = value;
  }
  return { date: data.date, source: 'live', rates };
}

export function formatMoney(usd: number, currency: Currency, rates: ExchangeRates['rates']): string {
  const amount = Math.round(usd * rates[currency]);
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount);
  const symbol = CURRENCIES.find(option => option.code === currency)!.symbol;
  return `${symbol}${currency === 'CHF' ? ' ' : ''}${number}`;
}

export function commissionPriceUSD(build: CommissionBuild): number {
  const model = MODELS.find(option => option.id === build.model) ?? MODELS[0];
  const alloy = ALLOYS.find(option => option.id === build.alloy) ?? ALLOYS[0];
  return model.price + alloy.price;
}

export function shippingPriceUSD(destination: Destination, subtotal: number): number {
  if (subtotal === 0 || subtotal >= 15000 || destination === 'CH') return 0;
  return { EU: 95, GB: 125, WORLD: 185 }[destination];
}

export function rateDate(date: string): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

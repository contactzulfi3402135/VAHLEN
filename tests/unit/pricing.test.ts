import { describe, expect, it } from 'vitest';
import { DEFAULT_BUILD } from '../../src/lib/catalogue';
import { commissionPriceUSD, FALLBACK_RATES, formatMoney, parseExchangeRates, shippingPriceUSD } from '../../src/lib/pricing';

const rates = FALLBACK_RATES.rates;
describe('Allocation pricing', () => {
  it('formats all four display currencies without inconsistent decimals', () => {
    expect(formatMoney(18500, 'USD', rates)).toBe('$18,500');
    expect(formatMoney(18500, 'EUR', rates)).toBe('€16,292');
    expect(formatMoney(18500, 'GBP', rates)).toBe('£13,924');
    expect(formatMoney(18500, 'CHF', rates)).toBe('Fr. 15,442');
  });
  it('calculates each base model and surcharge', () => {
    expect(commissionPriceUSD(DEFAULT_BUILD)).toBe(18500);
    expect(commissionPriceUSD({ ...DEFAULT_BUILD, alloy: 'rose' })).toBe(24700);
    expect(commissionPriceUSD({ ...DEFAULT_BUILD, model: 'tourbillon', alloy: 'rose' })).toBe(34200);
    expect(commissionPriceUSD({ ...DEFAULT_BUILD, model: 'tourbillon', alloy: 'dlc' })).toBe(29800);
  });
  it('includes dial, leather and complimentary engraving in the estimate', () => {
    expect(commissionPriceUSD({ ...DEFAULT_BUILD, dial: 'forest', strap: 'noir', monogram: 'A.V' })).toBe(18500);
  });
  it('calculates destination-sensitive shipping and the complimentary threshold', () => {
    expect(shippingPriceUSD('WORLD', 4800)).toBe(185);
    expect(shippingPriceUSD('EU', 1250)).toBe(95);
    expect(shippingPriceUSD('GB', 4800)).toBe(125);
    expect(shippingPriceUSD('CH', 4800)).toBe(0);
    expect(shippingPriceUSD('WORLD', 15000)).toBe(0);
    expect(shippingPriceUSD('WORLD', 0)).toBe(0);
  });
  it('validates the public rate feed and never accepts incomplete or invalid rates', () => {
    expect(parseExchangeRates({ base: 'USD', date: '2026-09-30', rates })).toEqual({ date: '2026-09-30', source: 'live', rates });
    expect(parseExchangeRates({ base: 'EUR', date: '2026-09-30', rates })).toBeNull();
    expect(parseExchangeRates({ base: 'USD', date: 'bad-date', rates })).toBeNull();
    expect(parseExchangeRates({ base: 'USD', date: '2026-09-30', rates: { ...rates, CHF: -1 } })).toBeNull();
    expect(parseExchangeRates({ base: 'USD', date: '2026-09-30', rates: { EUR: 1 } })).toBeNull();
    expect(parseExchangeRates(null)).toBeNull();
  });
});

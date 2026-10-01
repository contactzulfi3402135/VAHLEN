import { describe, expect, it } from 'vitest';
import { cartKey, cartReducer, cartSubtotalUSD, hydrateCart } from '../../src/lib/cart';
import { PRODUCTS } from '../../src/lib/catalogue';

const finish = PRODUCTS[0].finishes[0];
const key = cartKey('chrono', finish);
const item = { key, productId: 'chrono', finish, quantity: 1 };

describe('Persistent selection', () => {
  it('adds a genuine catalogue object', () => {
    expect(cartReducer([], { type: 'add', productId: 'chrono', finish, quantity: 1 })).toEqual([item]);
  });
  it('merges the same finish while preserving distinct finishes as separate objects', () => {
    const merged = cartReducer([item], { type: 'add', productId: 'chrono', finish, quantity: 2 });
    expect(merged[0].quantity).toBe(3);
    expect(cartReducer(merged, { type: 'add', productId: 'chrono', finish: PRODUCTS[0].finishes[1], quantity: 1 })).toHaveLength(2);
  });
  it('clamps edition quantities and ignores invalid actions', () => {
    expect(cartReducer([item], { type: 'quantity', key, quantity: 99 })[0].quantity).toBe(12);
    expect(cartReducer([item], { type: 'add', productId: 'unknown', finish, quantity: 1 })).toEqual([item]);
    expect(cartReducer([item], { type: 'quantity', key, quantity: NaN })).toEqual([item]);
  });
  it('decrements to removal, supports explicit deletion and can clear the selection', () => {
    expect(cartReducer([item], { type: 'quantity', key, quantity: 0 })).toEqual([]);
    expect(cartReducer([item], { type: 'remove', key })).toEqual([]);
    expect(cartReducer([item], { type: 'clear' })).toEqual([]);
  });
  it('recovers safely from malformed local storage', () => {
    expect(hydrateCart('bad')).toEqual([]);
    expect(hydrateCart([null, { productId: 'bad', quantity: 1 }, { ...item, quantity: -1 }, { ...item, finish: 'fake' }])).toEqual([]);
    expect(hydrateCart([{ ...item, quantity: 100 }])[0].quantity).toBe(12);
    expect(hydrateCart([item, item])[0].quantity).toBe(2);
  });
  it('calculates a subtotal from catalogue prices, not untrusted storage', () => {
    expect(cartSubtotalUSD([{ ...item, quantity: 2 }])).toBe(37000);
    expect(cartSubtotalUSD([])).toBe(0);
  });
});

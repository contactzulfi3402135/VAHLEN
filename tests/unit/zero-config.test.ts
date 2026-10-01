import { afterEach, expect, it, vi } from 'vitest';
import { DOSSIER_STORAGE_KEY, IS_DEMO, submitDossier } from '../../src/lib/concierge';

const memory = new Map<string, string>();
afterEach(() => { memory.clear(); vi.unstubAllGlobals(); });

it('uses local demonstration mode without an endpoint or environment setup', () => {
  expect(IS_DEMO).toBe(true);
});

it('registers a valid local dossier without calling a server', async () => {
  const fetchSpy = vi.fn();
  vi.stubGlobal('fetch', fetchSpy);
  vi.stubGlobal('crypto', { randomUUID: () => 'a1b2c300-0000-4000-8000-000000000000' });
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
  });
  const receipt = await submitDossier({ kind: 'register', email: 'collector@example.test', role: 'Collector', currency: 'USD' });
  expect(receipt.delivery).toBe('local');
  expect(receipt.reference).toMatch(/^GEN-\d{2}-A1B2C3$/);
  expect(JSON.parse(memory.get(DOSSIER_STORAGE_KEY)!)[0].input.email).toBe('collector@example.test');
  expect(fetchSpy).not.toHaveBeenCalled();
});

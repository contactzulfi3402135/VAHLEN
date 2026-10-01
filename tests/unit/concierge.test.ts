import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DOSSIER_STORAGE_KEY, pruneStoredDossiers, submitDossier } from '../../src/lib/concierge';

let memory: Map<string, string>;
const recent = { reference: 'GEN-26-000001', createdAt: '2026-09-30T12:00:00.000Z', delivery: 'local', input: { kind: 'register', email: 'collector@example.test', currency: 'USD' } };

beforeEach(() => {
  memory = new Map();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-01T12:00:00.000Z'));
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
    removeItem: (key: string) => memory.delete(key),
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('Private dossier handling', () => {
  it('purges expired, invalid and future-dated records on a return visit', () => {
    memory.set(DOSSIER_STORAGE_KEY, JSON.stringify([
      { ...recent, createdAt: '2026-01-01T12:00:00.000Z' }, recent,
      { ...recent, createdAt: 'not-a-date' },
      { ...recent, createdAt: '2027-01-01T12:00:00.000Z' }, null,
    ]));
    pruneStoredDossiers();
    expect(JSON.parse(memory.get(DOSSIER_STORAGE_KEY)!)).toEqual([recent]);
  });
  it('retains at most twenty current dossiers', () => {
    memory.set(DOSSIER_STORAGE_KEY, JSON.stringify(Array.from({ length: 25 }, (_, index) => ({ ...recent, reference: `GEN-26-${index}` }))));
    pruneStoredDossiers();
    const stored = JSON.parse(memory.get(DOSSIER_STORAGE_KEY)!);
    expect(stored).toHaveLength(20);
    expect(stored[0].reference).toBe('GEN-26-5');
  });
  it('rejects an invalid email before storage or transmission', async () => {
    await expect(submitDossier({ kind: 'register', email: 'invalid', currency: 'USD' })).rejects.toThrow('Please enter a valid email address.');
    expect(memory.size).toBe(0);
  });
  it('rejects a whitespace-only custodian name', async () => {
    await expect(submitDossier({ kind: 'consultation', name: '   ', email: 'collector@example.test', currency: 'USD' })).rejects.toThrow('Please enter your full name.');
    expect(memory.size).toBe(0);
  });
});

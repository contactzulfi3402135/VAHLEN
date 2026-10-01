import { isRecord, readStored, writeStored } from './storage';
import type { DossierInput, DossierReceipt } from './types';

export const DOSSIER_STORAGE_KEY = 'vahlen.dossiers.v1';
export const IS_DEMO = true; // Zero-configuration Vercel package: browser-local dossiers only.

function retainedLocalDossiers(raw: unknown): DossierReceipt[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((row): row is DossierReceipt => {
    if (!isRecord(row) || typeof row.createdAt !== 'string' || typeof row.reference !== 'string' || !isRecord(row.input)) return false;
    const age = Date.now() - new Date(row.createdAt).getTime();
    return Number.isFinite(age) && age >= 0 && age < 90 * 86400000;
  }).slice(-20);
}

export function pruneStoredDossiers(): void {
  const raw = readStored(DOSSIER_STORAGE_KEY);
  if (!Array.isArray(raw)) return;
  const retained = retainedLocalDossiers(raw);
  if (retained.length !== raw.length) writeStored(DOSSIER_STORAGE_KEY, retained);
}

export async function submitDossier(input: DossierInput): Promise<DossierReceipt> {
  const normalized = { ...input, email: input.email.trim().toLowerCase(), name: input.name?.trim(), note: input.note?.trim().slice(0, 1500) };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) throw new Error('Please enter a valid email address.');
  if (input.kind !== 'register' && (!normalized.name || normalized.name.length < 2)) throw new Error('Please enter your full name.');
  const createdAt = new Date().toISOString();
  const dossiers = retainedLocalDossiers(readStored(DOSSIER_STORAGE_KEY));
  const reference = `GEN-${new Date().getFullYear().toString().slice(-2)}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const receipt: DossierReceipt = { reference, createdAt, delivery: 'local', input: normalized };
  const saved = writeStored(DOSSIER_STORAGE_KEY, [...dossiers.slice(-19), receipt]);
  if (!saved) receipt.delivery = 'session';
  return receipt;
}

export function receiptDetail(receipt: DossierReceipt): string {
  if (receipt.delivery === 'sent') return 'The salon will reply personally within two working days.';
  if (receipt.delivery === 'session') return 'Preview only: held in this session. No request has been transmitted.';
  return 'Preview only: saved in this browser. No request has been transmitted.';
}

export function downloadDossier(receipt: DossierReceipt): void {
  const blob = new Blob([JSON.stringify(receipt, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = `vahlen-dossier-${receipt.reference.toLowerCase()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

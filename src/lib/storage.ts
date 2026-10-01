export function readStored(key: string): unknown {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : undefined; }
  catch { return undefined; }
}

export function writeStored(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

export function removeStored(key: string): void {
  try { localStorage.removeItem(key); } catch { /* Private-browsing sessions can disable storage. */ }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

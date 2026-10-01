import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function Dialog({ title, eyebrow, children, onClose, variant = 'modal', className = '' }: { title: string; eyebrow?: string; children: ReactNode; onClose: () => void; variant?: 'modal' | 'drawer'; className?: string }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const originalFocus = document.activeElement as HTMLElement | null;
    const shell = document.getElementById('app-shell');
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    if (shell) shell.inert = true;
    panel.current?.querySelector<HTMLElement>('[data-dialog-title]')?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const focusable = [...(panel.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]') ?? [])].filter(element => element.getClientRects().length > 0 && element.getAttribute('aria-hidden') !== 'true');
      if (!focusable.length) { event.preventDefault(); return; }
      const index = focusable.indexOf(document.activeElement as HTMLElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); focusable[focusable.length - 1].focus(); }
      else if (!event.shiftKey && (index === focusable.length - 1 || index === -1)) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (shell) shell.inert = false;
      requestAnimationFrame(() => { if (originalFocus?.isConnected && !document.querySelector('[aria-modal="true"]')) originalFocus.focus({ preventScroll: true }); });
    };
  }, [onClose]);

  return createPortal(<div className={`dialog-backdrop ${variant === 'drawer' ? 'drawer-backdrop' : ''}`} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div ref={panel} role="dialog" aria-modal="true" aria-labelledby="dialog-title" className={`dialog-panel ${variant === 'drawer' ? 'drawer-panel' : ''} ${className}`}><div className="dialog-header"><div>{eyebrow && <p>{eyebrow}</p>}<h2 id="dialog-title" tabIndex={-1} data-dialog-title>{title}</h2></div><button type="button" className="dialog-close" onClick={onClose} aria-label="Close dialog"><X size={20} strokeWidth={1.2} /></button></div>{children}</div></div>, document.body);
}

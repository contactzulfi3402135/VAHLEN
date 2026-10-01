import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Menu, ShoppingBag } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { CURRENCIES } from '../lib/catalogue';

export function CurrencySelector({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useCommerce();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [open]);
  return <div className={`currency-select ${compact ? 'is-compact' : ''}`} ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <button ref={trigger} type="button" className="currency-trigger" aria-label={`Currency: ${currency}`} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)} onKeyDown={event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')?.focus()); }
      if (event.key === 'Escape') setOpen(false);
    }}>
      <span>{currency}<span className="currency-symbol"> ({CURRENCIES.find(option => option.code === currency)?.symbol})</span></span><ChevronDown size={11} strokeWidth={1.5} className={open ? 'rotate-180' : ''} />
    </button>
    {open && <div className="currency-menu" role="menu" aria-label="Display currency" onKeyDown={event => {
      const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button')];
      const index = options.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options[next]?.focus();
      }
    }}>
      <p>DISPLAY CURRENCY</p>
      {CURRENCIES.map(option => <button key={option.code} type="button" role="menuitemradio" aria-checked={currency === option.code} onClick={() => { setCurrency(option.code); setOpen(false); trigger.current?.focus(); }}>
        <span>{option.code} <span className="text-umber">({option.symbol})</span></span><span>{option.label}</span>{currency === option.code && <Check size={12} />}
      </button>)}
      <small>Indicative conversion. All allocations<br />are confirmed by the salon.</small>
    </div>}
  </div>;
}

export function Header() {
  const { itemCount, setOverlay } = useCommerce();
  return <header className="site-header">
    <div className="announcement"><span className="announcement-star">✧</span><p>Private consultations in Geneva & Mayfair by appointment <span className="announcement-divider">•</span> <span className="courier-message">Insured global secure courier</span></p><span className="announcement-star">✧</span></div>
    <div className="header-inner">
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#collection">Collections</a>
        <button type="button" onClick={() => setOverlay({ kind: 'archive' })}>Atelier archive</button>
        <a href="#commission">Bespoke commissions</a>
        <a href="#maison">Maison</a>
      </nav>
      <button className="mobile-menu-trigger" type="button" onClick={() => setOverlay({ kind: 'menu' })} aria-label="Open navigation menu"><Menu size={21} strokeWidth={1.3} /><span>Menu</span></button>
      <a className="wordmark" href="#top" aria-label="VAHLEN & CO. Home"><span>VAHLEN & CO.</span><small>GENÈVE <i>—</i> 1894</small></a>
      <div className="header-actions"><CurrencySelector /><span className="header-rule" /><button type="button" className="bag-trigger" onClick={() => setOverlay({ kind: 'bag' })} aria-label={`Open bag, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}><ShoppingBag size={17} strokeWidth={1.25} /><span><span className="bag-word">Bag </span>({itemCount})</span></button></div>
    </div>
  </header>;
}

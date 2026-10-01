import { Check, Minus, Plus, X } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export function MaisonMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 12h10m12 0h10M13 12l12 29L36 12M18 26h15" stroke="currentColor" strokeWidth="1.2" /><path d="M21 6h6m-3-3v6M12 39h24" stroke="currentColor" strokeWidth=".8" /></svg>;
}

export function SectionLabel({ children, number }: { children: React.ReactNode; number?: string }) {
  return <p className="section-label">{number && <span className="section-number">{number} /</span>}{children}</p>;
}

export function QuantityControl({ quantity, max, label, onChange }: { quantity: number; max: number; label: string; onChange: (quantity: number) => void }) {
  return <div className="quantity-control">
    <button type="button" aria-label={`Decrease quantity of ${label}`} onClick={() => onChange(quantity - 1)}><Minus size={12} strokeWidth={1.5} /></button>
    <span aria-label={`Quantity: ${quantity}`}>{quantity}</span>
    <button type="button" aria-label={`Increase quantity of ${label}`} disabled={quantity >= max} onClick={() => onChange(quantity + 1)}><Plus size={12} strokeWidth={1.5} /></button>
  </div>;
}

export function Toasts() {
  const { toasts, dismissToast } = useCommerce();
  return <div className="toast-stack" aria-live="polite" aria-atomic="false">
    {toasts.map(toast => <div className="toast" key={toast.id} role="status">
      <Check className="toast-check" size={18} strokeWidth={1.5} />
      <div><p>{toast.title}</p>{toast.detail && <span>{toast.detail}</span>}</div>
      <button type="button" aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)}><X size={15} strokeWidth={1.5} /></button>
    </div>)}
  </div>;
}

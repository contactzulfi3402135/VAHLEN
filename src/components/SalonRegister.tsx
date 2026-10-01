import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, Check, LoaderCircle } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { IS_DEMO, receiptDetail, submitDossier } from '../lib/concierge';
import type { CollectorRole, DossierReceipt } from '../lib/types';
import { MaisonMark, SectionLabel } from './Primitives';

export function SalonRegister() {
  const { currency, notify, setOverlay } = useCommerce();
  const [role, setRole] = useState<CollectorRole>('Collector');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<DossierReceipt | null>(null);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || !consent) return;
    setError(''); setPending(true);
    try {
      const result = await submitDossier({ kind: 'register', email, role, currency });
      setReceipt(result);
      notify('Your dossier has been registered with the Geneva salon concierge.', receiptDetail(result));
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The register is temporarily unavailable. Please try again.'); }
    finally { setPending(false); }
  };
  return <section className="salon-section" id="salon" aria-labelledby="salon-title"><div className="salon-inner"><div className="salon-copy"><SectionLabel>The private salon register</SectionLabel><h2 id="salon-title">Some things are<br /><em>best kept between us.</em></h2><p>Priority allocations, intimate atelier visits, and occasional correspondence from Geneva. Never more than the occasion deserves.</p><MaisonMark className="salon-mark" /></div><div className="salon-form-panel">{receipt ? <div className="register-success" role="status"><Check size={27} strokeWidth={1.1} /><p className="section-label">DOSSIER {receipt.reference}</p><h3>A conversation, begun.</h3><p>{receiptDetail(receipt)}</p><button type="button" className="text-link" onClick={() => { setReceipt(null); setEmail(''); setConsent(false); }}>Register another dossier<ArrowRight size={13} /></button></div> : <form onSubmit={submit} className="salon-form"><fieldset><legend>YOUR INTEREST</legend><div className="role-toggle">{(['Collector', 'Press', 'Trade'] as const).map(option => <label key={option} className={role === option ? 'is-selected' : ''}><input type="radio" name="salon-role" checked={role === option} onChange={() => setRole(option)} />{option}</label>)}</div></fieldset><label htmlFor="register-email" className="field-label">YOUR EMAIL ADDRESS</label><div className="register-email-row"><input id="register-email" type="email" autoComplete="email" placeholder="Your private email address" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} /><button type="submit" className="button button-dark" disabled={pending}>{pending ? <LoaderCircle size={16} className="spin" /> : <>Join the register<ArrowRight size={16} strokeWidth={1.25} /></>}</button></div><label className="consent-label"><input type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} /><span>I consent to private correspondence from the maison.</span></label><p className="salon-privacy">Your details are treated with discretion. <button type="button" onClick={() => setOverlay({ kind: 'policy', page: 'privacy' })}>Read our privacy notice.</button></p>{IS_DEMO && <p className="form-demo-note">LOCAL PREVIEW · NO EMAILS WILL BE SENT.</p>}{error && <p className="form-error" role="alert">{error}</p>}</form>}</div></div></section>;
}

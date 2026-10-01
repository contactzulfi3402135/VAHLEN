import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, Search, ShieldCheck } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { CURRENCIES, getProduct } from '../lib/catalogue';
import { DOSSIER_STORAGE_KEY } from '../lib/concierge';
import { rateDate } from '../lib/pricing';
import { readStored, removeStored } from '../lib/storage';
import type { PolicyPage } from '../lib/types';

const POLICY_COPY: Record<PolicyPage, { title: string; text: string }[]> = {
  privacy: [
    { title: 'A browser-local salon', text: 'Your submitted dossier stays in this browser only. This Vercel-ready version runs without environment variables or a connected salon service. No email is sent, no payment is collected, and no personal information is transmitted by the forms. Local dossiers are retained for up to 90 days and limited to the 20 most recent submissions.' },
    { title: 'What is remembered', text: 'Your selection, display currency, commission study, and latest exchange-rate snapshot are saved in local storage so that a return visit begins where you left off. Enquiry dossiers contain only the details you knowingly submit. If your browser disables storage, a dossier is held only for the current session.' },
    { title: 'External services', text: 'Photography, fonts and interface assets are served from this website. A read-only request to Frankfurter retrieves public ECB reference exchange rates. That service sees the network information normally sent with a web request; it does not receive your contact details or bag. No analytics or marketing trackers are installed.' },
    { title: 'No hidden recipient', text: 'This version does not forward requests to an external salon or CRM and never collects card details. Registration creates a local demonstration receipt. A real commercial operator would need a separate, verified service and its own legal and privacy policies.' },
  ],
  delivery: [
    { title: 'Delivered with care', text: 'Every proposed delivery is by insured secure courier. The estimated charge depends on your selected destination: Switzerland is complimentary; European Union delivery is USD 95; United Kingdom delivery is USD 125; other destinations are USD 185. Allocations of USD 15,000 or more include complimentary courier.' },
    { title: 'No unexpected acceptance', text: 'The bag is an estimate, not a completed order. The salon confirms availability, exact lead time, delivery address, import duties and applicable taxes before you accept an allocation. Converted prices are indicative; the settlement currency and rate are agreed personally.' },
    { title: 'Bespoke and made to order', text: 'Personalised commissions require written approval of the final specification. Applicable cancellation and return rights must be stated in that agreement, including any statutory exceptions for goods made to your specifications. No statutory rights are excluded by this preview.' },
    { title: 'This concept storefront', text: 'No sale, deposit, shipment or reservation occurs in this demonstration. The Geneva and Mayfair addresses are part of the fictional maison concept, not instructions to visit a real business.' },
  ],
  care: [
    { title: 'Mechanical objects', text: 'Wind a manual calibre gently and stop at resistance. Avoid magnetic fields, impacts and immersion unless the final technical dossier confirms the relevant water-resistance rating. A precision timepiece should be assessed by a qualified watchmaker, not opened at home.' },
    { title: 'Leather, allowed to live', text: 'Keep leather away from prolonged sunlight, direct heat and excess water. Blot moisture with a soft cloth and allow the object to dry naturally. A clean, dry cloth is sufficient for daily care. Test any specialist conditioner on an inconspicuous area first.' },
    { title: 'Repair before replacement', text: 'Saddle-stitched construction allows local repairs without undoing an entire seam. Brass furniture can be serviced, straps replaced, and edges re-burnished. Begin with a consultation dossier describing the object and the work you believe it needs.' },
    { title: 'A personal service', text: 'The salon consultation form supports restoration enquiries. Include the object reference and a description of its condition. This demonstration keeps the enquiry in your browser; it does not send it to a live atelier.' },
  ],
  ethics: [
    { title: 'The proposed material standard', text: 'The maison concept is built around traceable precious metals, responsibly sourced leather and repairable construction. Medical-grade titanium and Fairmined-certified gold are the proposed standards; final supplier and batch documentation must accompany any real production object.' },
    { title: 'Fairmined gold', text: 'Fairmined is a certification initiative for gold from responsible artisanal and small-scale mining organisations. This fictional brand does not claim a real Fairmined licence or verified supply chain. Certification numbers and current licence status must be independently checked before a live commercial launch.' },
    { title: 'Leather and exotic materials', text: 'Vegetable-tanned hides are proposed for bridle goods. Any actual alligator strap must include documented legal sourcing and applicable CITES export and import permissions. Availability may vary by destination; a non-exotic alternative can be specified in the commission studio.' },
    { title: 'Documentation rather than decoration', text: 'Our interactive provenance register contains explicitly labelled sample entries. In production, each entry must be backed by the real workshop ledger, maker sign-off, material records and the collector’s privacy preferences.' },
  ],
  terms: [
    { title: 'An invitation to allocate', text: 'Adding an object to the bag or submitting a dossier expresses interest only. It does not constitute a purchase, a binding commission, a reservation or an obligation to pay. No payment credentials are requested or collected by this application.' },
    { title: 'An estimate, made transparent', text: 'All base values are denominated in USD. The display selector converts them instantly using the latest available ECB reference rates retrieved through Frankfurter. Those are daily reference rates, not executable intraday spot quotes. Offline or unavailable feeds use a clearly labelled cached snapshot.' },
    { title: 'Specification and timing', text: 'Edition sizes, dimensions, lead times, materials and chronometry figures are illustrative concept specifications. A real allocation would be governed by a written agreement confirming the exact object, approved personalisation, production timetable, price and applicable consumer rights.' },
    { title: 'An independent creative concept', text: 'VAHLEN & CO. is a demonstration maison. Its heritage, salon addresses and editorial acclaim are fictional or illustrative. The generated photography is creative imagery, not documentary evidence of manufactured objects or a real atelier.' },
  ],
};

export function PolicyModal({ page }: { page: PolicyPage }) {
  const { notify, setOverlay } = useCommerce();
  const [cleared, setCleared] = useState(false);
  const raw = readStored(DOSSIER_STORAGE_KEY);
  const count = Array.isArray(raw) ? raw.length : 0;
  return <div className="policy-content"><p className="policy-lead">{page === 'privacy' ? 'Discretion begins with clarity.' : page === 'ethics' ? 'An object is only as considered as its origins.' : 'The details deserve the same attention as the object.'}</p>{POLICY_COPY[page].map(section => <section key={section.title}><h3>{section.title}</h3><p>{section.text}</p></section>)}{page === 'privacy' && <div className="privacy-controls"><span>{cleared ? 'SAVED DOSSIERS REMOVED' : `${count} SAVED BROWSER ${count === 1 ? 'DOSSIER' : 'DOSSIERS'}`}</span><button type="button" className="button button-outline" onClick={() => { removeStored(DOSSIER_STORAGE_KEY); setCleared(true); notify('Your saved enquiry dossiers have been removed.', 'Your bag and display settings are unchanged.'); }}>Delete saved enquiry dossiers</button></div>}{page === 'ethics' && <a className="text-link" href="https://fairmined.org/" target="_blank" rel="noopener noreferrer">Visit the Fairmined initiative<ArrowUpRight size={13} /></a>}{page === 'care' && <button type="button" className="button button-dark" onClick={() => setOverlay({ kind: 'consultation' })}>Request a care consultation<ArrowRight size={14} /></button>}<p className="policy-version">MAISON PROTOCOL / VERSION 01 OCTOBER 2026</p></div>;
}

const RECORDS = [
  { serial: 'VC-2026-004', productId: 'chrono', maker: 'Meyrin horology bench 04', date: '18 September 2026', metal: 'Grade 5 titanium · Batch TI-26-018', dial: 'Slate guilloché · Rose-engine cut', edition: '04 / 12', ledger: 'Volume XXVI · Folio 004' },
  { serial: 'VC-2026-008', productId: 'tourbillon', maker: 'Meyrin complications bench 02', date: '22 September 2026', metal: '18k honey gold · Illustrative certified batch', dial: 'Open-worked · Hand-chamfered bridges', edition: '08 / 12', ledger: 'Volume XXVI · Folio 008' },
  { serial: 'AV-2026-012', productId: 'valise', maker: 'Paris leather bench 03', date: '25 September 2026', metal: 'Solid brass · Batch BR-26-003', dial: 'Tuscan cognac bridle · Vegetable-tanned', edition: 'Private commission', ledger: 'Volume XXVI · Folio 112' },
];

export function ProvenanceModal() {
  const [serial, setSerial] = useState('');
  const [query, setQuery] = useState<string | null>(null);
  const { setOverlay } = useCommerce();
  const record = RECORDS.find(item => item.serial === query);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setQuery(serial.trim().toUpperCase()); };
  return <div className="provenance-content"><p className="policy-lead">Every object has a beginning.<br /><em>The ledger remembers it.</em></p><p>Enter the archive reference inscribed in the object’s accompanying dossier.</p><form className="provenance-form" onSubmit={submit}><label htmlFor="provenance-serial" className="field-label">OBJECT ARCHIVE REFERENCE</label><div><input id="provenance-serial" required maxLength={11} pattern="(VC|AV)-[0-9]{4}-[0-9]{3}" placeholder="VC-2026-004" value={serial} onChange={event => { setSerial(event.target.value.toUpperCase()); setQuery(null); }} title="Use the format VC-2026-004 or AV-2026-012" /><button type="submit" className="button button-dark"><Search size={14} strokeWidth={1.4} />Look up object</button></div></form><div className="sample-records"><span>TRY A SAMPLE ENTRY</span>{RECORDS.map(item => <button type="button" key={item.serial} onClick={() => { setSerial(item.serial); setQuery(item.serial); }}>{item.serial}</button>)}</div>{query && (record ? <div className="provenance-result" role="status"><div className="provenance-found"><ShieldCheck size={16} strokeWidth={1.25} /><span>SAMPLE ARCHIVE ENTRY FOUND</span></div><div className="provenance-record"><img src={getProduct(record.productId)!.image} alt={getProduct(record.productId)!.alt} width="1000" height="1000" /><div><h3>{getProduct(record.productId)!.title}</h3><dl><div><dt>Archive reference</dt><dd>{record.serial}</dd></div><div><dt>Edition</dt><dd>{record.edition}</dd></div><div><dt>Workshop</dt><dd>{record.maker}</dd></div><div><dt>Completed</dt><dd>{record.date}</dd></div><div><dt>Material record</dt><dd>{record.metal}</dd></div><div><dt>Craft record</dt><dd>{record.dial}</dd></div><div><dt>Ledger</dt><dd>{record.ledger}</dd></div></dl></div></div></div> : <div className="provenance-not-found" role="status"><h3>No entry found for {query}.</h3><p>This public demonstration contains three sample records only. A missing record here is not an assessment of any real object’s authenticity.</p><button type="button" className="text-link" onClick={() => setOverlay({ kind: 'consultation' })}>Speak with the salon<ArrowRight size={13} /></button></div>)}<p className="form-demo-note">DEMONSTRATION REGISTER · NOT A CERTIFICATE OF AUTHENTICITY.</p></div>;
}

export function RatesModal() {
  const { exchange, currency, money } = useCommerce();
  return <div className="rates-content"><p className="policy-lead">A clear view of value.</p><p>Every price is based in USD and converted immediately when you select a display currency. The same snapshot is applied to the collection, private studio, bag, shipping and checkout.</p><div className="rates-status"><span className={exchange.source === 'live' ? 'fx-dot live' : 'fx-dot'} /><strong>{exchange.source === 'live' ? 'Latest available reference rates' : 'Cached reference rates · feed unavailable or loading'}</strong><span>{rateDate(exchange.date)}</span></div><table><caption>USD 1.00 expressed in each currency</caption><thead><tr><th scope="col">Currency</th><th scope="col">Rate per USD</th><th scope="col">USD 18,500 example</th></tr></thead><tbody>{CURRENCIES.map(option => <tr key={option.code} className={currency === option.code ? 'is-selected' : ''}><th scope="row">{option.code} ({option.symbol})</th><td>{exchange.rates[option.code].toFixed(5)}</td><td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: option.code, maximumFractionDigits: 0 }).format(18500 * exchange.rates[option.code])}</td></tr>)}</tbody></table><p className="rates-example">Your current display: <strong>{money(18500)} {currency}</strong></p><p className="form-small-note">Source: Frankfurter / European Central Bank. Reference rates are published daily on working days, not live executable spot quotes. The feed refreshes on entry and hourly while the page is visible. Final settlement currency, tax and exchange rate are confirmed by the salon.</p><a href="https://www.frankfurter.dev/" target="_blank" rel="noopener noreferrer" className="text-link">About the exchange-rate source<ArrowUpRight size={13} /></a></div>;
}

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const { setOverlay } = useCommerce();
  const navigate = (id: string) => { onClose(); requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })); };
  return <div className="mobile-menu-content"><nav aria-label="Mobile navigation"><button type="button" onClick={() => navigate('collection')}>Collections<span>01</span></button><button type="button" onClick={() => setOverlay({ kind: 'archive' })}>Atelier archive<ArrowUpRight size={17} /></button><button type="button" onClick={() => navigate('commission')}>Bespoke commissions<span>02</span></button><button type="button" onClick={() => navigate('maison')}>Maison<span>03</span></button><button type="button" onClick={() => navigate('salon')}>The private register<span>04</span></button></nav><button type="button" className="button button-dark" onClick={() => setOverlay({ kind: 'consultation' })}>Request a private appointment<ArrowRight size={14} /></button><p>GENÈVE — PARIS<br /><span>AN INDEPENDENT POINT OF VIEW.</span></p></div>;
}

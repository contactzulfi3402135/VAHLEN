import { useEffect, useState } from 'react';
import { ArrowRight, Check, RotateCcw } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { ALLOYS, buildDescription, DEFAULT_BUILD, DIALS, MODELS, STRAPS } from '../lib/catalogue';
import { commissionPriceUSD } from '../lib/pricing';
import { isRecord, readStored, writeStored } from '../lib/storage';
import type { CommissionBuild } from '../lib/types';
import { SectionLabel } from './Primitives';

function loadBuild(): CommissionBuild {
  const value = readStored('vahlen.commission.v1');
  if (isRecord(value) && MODELS.some(option => option.id === value.model) && ALLOYS.some(option => option.id === value.alloy) && DIALS.some(option => option.id === value.dial) && STRAPS.some(option => option.id === value.strap) && typeof value.monogram === 'string' && /^[A-Z0-9.]{0,3}$/.test(value.monogram)) return value as unknown as CommissionBuild;
  return DEFAULT_BUILD;
}

export function CommissionStudio() {
  const [build, setBuild] = useState<CommissionBuild>(loadBuild);
  const { currency, money, setOverlay } = useCommerce();
  const selected = buildDescription(build);
  const price = commissionPriceUSD(build);
  useEffect(() => { writeStored('vahlen.commission.v1', build); }, [build]);
  const update = (patch: Partial<CommissionBuild>) => setBuild(previous => ({ ...previous, ...patch }));

  return <section className="commission-section" id="commission" aria-labelledby="commission-title"><div className="section-wrap">
    <div className="section-meta"><SectionLabel number="02">The private commission</SectionLabel><span>ONE OF ONE. ENTIRELY YOURS.</span></div>
    <div className="section-title-row"><h2 id="commission-title">An expression <em>entirely your own.</em></h2><p>Your sensibility, interpreted by our artisans.<br />Compose the beginning of a conversation.</p></div>
    <div className="commission-studio">
      <div className="commission-preview"><div className="study-heading"><span>{selected.model.reference}</span><span>ATELIER MATERIAL STUDY</span></div>
        <div className="study-photograph"><img key={selected.model.id} src={selected.model.image} alt={`${selected.model.label} reference photograph; selected finishes are shown in the material swatches below`} width="1000" height="1000" loading="lazy" /><span className="study-corner top-left" /><span className="study-corner bottom-right" /></div>
        <div className="study-caption"><div><p>YOUR PRIVATE ÉDITION</p><h3>{selected.model.label}</h3></div><span className="study-number">01 / 01</span></div>
        <div className="material-study"><div><span style={{ backgroundColor: selected.alloy.color }} /><p>CASE ALLOY<small>{selected.alloy.short}</small></p></div><div><span style={{ backgroundColor: selected.dial.color }} /><p>DIAL<small>{selected.dial.label}</small></p></div><div><span style={{ backgroundColor: selected.strap.color }} /><p>STRAP<small>{selected.strap.short}</small></p></div></div>
        <div className="engraving-preview" aria-live="polite">HAND-ENGRAVED CASEBACK: <strong>[ {build.monogram || '— — —'} ]</strong></div>
        <p className="study-disclaimer">Reference photography. Final finishes are confirmed with the atelier.</p>
      </div>
      <div className="commission-options">
        <div className="studio-header"><span>COMPOSE YOUR TIMEPIECE</span><button type="button" onClick={() => setBuild(DEFAULT_BUILD)} aria-label="Reset commission"><RotateCcw size={11} strokeWidth={1.5} />Reset study</button></div>
        <fieldset className="model-field"><legend><span>01</span>Timepiece</legend><div className="model-options">{MODELS.map(option => <label key={option.id} className={`model-option ${build.model === option.id ? 'is-selected' : ''}`}><input type="radio" name="model" value={option.id} checked={build.model === option.id} onChange={() => update({ model: option.id })} /><span className="radio-indicator">{build.model === option.id && <Check size={10} strokeWidth={1.5} />}</span><span className="option-title">{option.label}<small>{money(option.price)} <span>{currency} BASE</span></small></span></label>)}</div></fieldset>
        <fieldset><legend><span>02</span>Metal alloy</legend><div className="alloy-options">{ALLOYS.map(option => <label key={option.id} className={`alloy-option ${build.alloy === option.id ? 'is-selected' : ''}`}><input type="radio" name="alloy" value={option.id} checked={build.alloy === option.id} onChange={() => update({ alloy: option.id })} /><span className="alloy-chip" style={{ backgroundColor: option.color }} /><span>{option.label}<small>{option.price ? `+ ${money(option.price)}` : 'INCLUDED'}</small></span>{build.alloy === option.id && <Check className="alloy-check" size={11} />}</label>)}</div></fieldset>
        <fieldset><legend><span>03</span>Dial treatment</legend><div className="swatch-options">{DIALS.map(option => <label key={option.id} className={`swatch-option ${build.dial === option.id ? 'is-selected' : ''}`}><input type="radio" name="dial" value={option.id} checked={build.dial === option.id} onChange={() => update({ dial: option.id })} /><span className={`swatch dial-swatch ${option.id}`} style={{ backgroundColor: option.color }}>{build.dial === option.id && <Check size={12} strokeWidth={1.5} />}</span><span>{option.label}</span></label>)}</div></fieldset>
        <fieldset><legend><span>04</span>Strap leather</legend><div className="swatch-options">{STRAPS.map(option => <label key={option.id} className={`swatch-option ${build.strap === option.id ? 'is-selected' : ''}`}><input type="radio" name="strap" value={option.id} checked={build.strap === option.id} onChange={() => update({ strap: option.id })} /><span className={`swatch leather-swatch ${option.id}`} style={{ backgroundColor: option.color }}>{build.strap === option.id && <Check size={12} strokeWidth={1.5} />}</span><span>{option.label}</span></label>)}</div></fieldset>
        <div className="monogram-row"><div><label htmlFor="monogram"><span>05</span>Monogram hand-engraving</label><p>A private signature. Complimentary.</p></div><div className="monogram-input"><input id="monogram" aria-label="Monogram, maximum 3 characters" type="text" autoComplete="off" placeholder="A.V" maxLength={3} value={build.monogram} onChange={event => update({ monogram: event.target.value.toUpperCase().replace(/[^A-Z0-9.]/g, '').slice(0, 3) })} /><small>{build.monogram.length}/3</small></div></div>
        <div className="commission-total"><div><p>YOUR COMMISSION · ESTIMATE</p><strong data-testid="commission-price" aria-live="polite">{money(price)} <span>{currency}</span></strong></div><button type="button" className="button button-dark" onClick={() => setOverlay({ kind: 'consultation', build: { ...build } })}>Request allocation<ArrowRight size={15} strokeWidth={1.3} /></button></div>
        <p className="commission-footnote">12–18 weeks from allocation · No obligation at this stage.</p>
      </div>
    </div>
  </div></section>;
}

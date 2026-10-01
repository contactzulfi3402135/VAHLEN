import { ArrowDown, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { MaisonMark } from './Primitives';

export function Hero() {
  const { setOverlay } = useCommerce();
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-edition"><span />ÉDITION MILLÉSIME 2026 <i>/</i> 36 PIECES ANNUALLY</div>
        <h1 id="hero-title">Mechanical<br /><em>permanence</em> in<br />an ephemeral era.</h1>
        <p className="hero-narrative">Each Vahlen calibre requires over four hundred hours of manual anglage, guilloché engraving, and hand-stitched bridle leather assembly in our Meyrin workshops.</p>
        <div className="hero-actions"><a className="button button-dark" href="#collection">Explore the collection<ArrowRight size={16} strokeWidth={1.3} /></a><button type="button" className="button button-outline" onClick={() => setOverlay({ kind: 'consultation' })}>Request private salon appointment<ArrowUpRight size={14} strokeWidth={1.3} /></button></div>
        <dl className="hero-metrics"><div><dt>420 <span>hrs</span></dt><dd>Hand-anglage</dd></div><div><dt>±1.2 <span>sec/day</span></dt><dd>Observatory chronometry</dd></div><div><dt>100% <span>traceable</span></dt><dd>Fairmined ores</dd></div></dl>
      </div>
      <div className="hero-photograph"><img src="/assets/images/hero-chronometre.jpg" alt="Hand-bevelled titanium skeleton watch with blued screws, resting on sunlit travertine" width="1920" height="1080" fetchPriority="high" /><div className="hero-image-top"><span>THE ART OF TAKING TIME</span><Plus size={15} strokeWidth={1} /></div><div className="hero-image-caption"><span className="caption-dot" /><p>CALIBRE V-08 <span>/</span> GRADE 5 TITANIUM <span>/</span> HAND-BEVELLED BRIDGES</p><span className="caption-edition">N° 04/36</span></div><div className="photo-corner" /></div>
    </section>
    <div className="maison-rail"><div><MaisonMark /><span>An independent maison. An enduring point of view.</span></div><span className="rail-location">GENÈVE <i>·</i> PARIS</span><a href="#collection">Objects of permanence<ArrowDown size={12} strokeWidth={1.25} /></a></div>
  </>;
}

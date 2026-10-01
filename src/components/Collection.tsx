import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { PRODUCTS } from '../lib/catalogue';
import type { Category, Product } from '../lib/types';
import { SectionLabel } from './Primitives';

const FILTERS: { id: Category; label: string }[] = [
  { id: 'all', label: 'All pieces' }, { id: 'horlogerie', label: 'Haute horlogerie' },
  { id: 'leather', label: 'Leathergoods & valises' }, { id: 'writing', label: 'Writing instruments' },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { money, currency, addToBag, setOverlay } = useCommerce();
  return <article className="product-card" style={{ animationDelay: `${index * 45}ms` }} data-testid={`product-${product.id}`}>
    <div className="product-image"><img src={product.image} alt={product.alt} width="1000" height="1000" loading="lazy" /><span className="allocation-tag">{product.badge}</span><button type="button" className="image-quick-view" onClick={() => setOverlay({ kind: 'product', productId: product.id })} aria-label={`Quick view ${product.title}`}>Discover the object<ArrowUpRight size={14} strokeWidth={1.25} /></button></div>
    <div className="product-info"><p className="product-category">{product.categoryLabel}</p><button type="button" className="product-title-button" onClick={() => setOverlay({ kind: 'product', productId: product.id })}><h3>{product.title}</h3></button><p className="product-material">{product.material}</p><p className="product-price" data-testid={`price-${product.id}`}>{money(product.priceUSD)} <span>{currency}</span></p></div>
    <div className="product-actions"><button type="button" onClick={() => setOverlay({ kind: 'product', productId: product.id })}>Quick view<ArrowUpRight size={11} strokeWidth={1.25} /></button><button type="button" onClick={() => addToBag(product.id)} aria-label={`Add ${product.title} to bag`}><Plus size={12} strokeWidth={1.5} />Add to bag</button></div>
  </article>;
}

export function Collection() {
  const [filter, setFilter] = useState<Category>('all');
  const { setOverlay } = useCommerce();
  const products = PRODUCTS.filter(product => filter === 'all' || product.categories.includes(filter));
  return <section id="collection" className="collection section-wrap" aria-labelledby="collection-title">
    <div className="section-meta"><SectionLabel number="01">The current collection</SectionLabel><span>A STUDY IN RESTRAINT</span></div>
    <div className="section-title-row"><h2 id="collection-title">Considered. <em>Never ordinary.</em></h2><p>Numbered timepieces. Hand-stitched companions.<br />Made slowly, to remain with you.</p></div>
    <div className="collection-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter collection" onKeyDown={event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = FILTERS.findIndex(tab => tab.id === filter);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? FILTERS.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + FILTERS.length) % FILTERS.length;
      setFilter(FILTERS[next].id);
      document.getElementById(`filter-${FILTERS[next].id}`)?.focus();
    }}>
      {FILTERS.map(tab => <button key={tab.id} type="button" role="tab" id={`filter-${tab.id}`} aria-selected={filter === tab.id} aria-controls="collection-grid" tabIndex={filter === tab.id ? 0 : -1} onClick={() => setFilter(tab.id)}>{tab.label}{tab.id === 'all' && <sup>04</sup>}</button>)}
    </div><span className="collection-count" aria-live="polite">{String(products.length).padStart(2, '0')} OBJECTS</span></div>
    <div id="collection-grid" className="product-grid" role="tabpanel" aria-labelledby={`filter-${filter}`} tabIndex={0}>{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
    <div className="collection-note"><p><span />Not simply acquired. Personally allocated.</p><button type="button" onClick={() => setOverlay({ kind: 'consultation' })}>Speak with the salon<ArrowRight size={13} strokeWidth={1.25} /></button></div>
  </section>;
}

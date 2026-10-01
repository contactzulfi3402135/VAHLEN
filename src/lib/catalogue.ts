import type { CommissionBuild, Currency, Product } from './types';

export const CURRENCIES: { code: Currency; symbol: string; label: string }[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CHF', symbol: 'Fr.', label: 'Swiss Franc' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'chrono', title: 'Chronomètre V-04', categoryLabel: 'Haute horlogerie', categories: ['horlogerie'],
    image: '/assets/images/product-chrono-slate.jpg',
    alt: 'Slate guilloché dress watch with rose-gold accents and a charcoal alligator strap on bone paper',
    material: 'Slate guilloché · Rose-gold accents', priceUSD: 18500, badge: 'Limited to 12 pieces', reference: 'V.04 — ÉDITION 2026',
    description: 'Quietly exacting. A hand-wound calibre, a dial cut on a century-old rose engine, and a case finished entirely at the bench. The V-04 distils our philosophy into a single, enduring object.',
    specs: [{ label: 'Calibre', value: 'V-04 · Manual winding' }, { label: 'Case diameter', value: '39.5 mm' }, { label: 'Power reserve', value: '72 hours' }, { label: 'Dial', value: 'Hand-cut slate guilloché' }, { label: 'Strap', value: 'Noir matte alligator · Hand-stitched' }, { label: 'Chronometry', value: '±1.2 seconds per day' }],
    finishes: ['Slate guilloché / Noir alligator', 'Bone enamel / Cognac bridle'], leadTime: '12–16 weeks following allocation', maxQuantity: 12,
  },
  {
    id: 'tourbillon', title: 'Tourbillon Sovereign', categoryLabel: 'Haute horlogerie', categories: ['horlogerie'],
    image: '/assets/images/product-tourbillon.jpg',
    alt: 'Open-worked honey-gold flying tourbillon on sandstone with a brown leather strap',
    material: '18k honey gold · Flying tourbillon', priceUSD: 28000, badge: 'Limited to 12 pieces', reference: 'V.08 — SOUVERAIN',
    description: 'An architecture of light. The flying tourbillon is suspended within an open-worked calibre, revealing the slow rhythm of a movement whose every edge has been polished by hand.',
    specs: [{ label: 'Calibre', value: 'V-08 · Flying tourbillon' }, { label: 'Case', value: '18k honey gold · 40 mm' }, { label: 'Power reserve', value: '80 hours' }, { label: 'Bridges', value: 'Hand-bevelled · Côtes de Genève' }, { label: 'Strap', value: 'Cognac leather · Saddle-stitched' }, { label: 'Edition', value: '12 numbered objects' }],
    finishes: ['Honey gold / Cognac leather', 'Honey gold / Noir alligator'], leadTime: '16–20 weeks following allocation', maxQuantity: 12,
  },
  {
    id: 'valise', title: 'Valise No. 12', categoryLabel: 'Bespoke leathercraft', categories: ['leather'],
    image: '/assets/images/product-valise.jpg',
    alt: 'Structured cognac leather document case with a brass lock on a limestone block',
    material: 'Tuscan bridle leather · Solid brass', priceUSD: 4800, badge: 'Made to order', reference: 'A.12 — MAROQUINERIE',
    description: 'A companion, not an accessory. Cut from a single, traceable hide and joined with two needles and waxed linen thread. Its brass furniture is turned in small batches and designed to age alongside the leather.',
    specs: [{ label: 'Dimensions', value: '38 × 28 × 9 cm' }, { label: 'Leather', value: 'Vegetable-tanned Tuscan bridle' }, { label: 'Lining', value: 'Natural calfskin' }, { label: 'Hardware', value: 'Hand-turned solid brass' }, { label: 'Construction', value: 'Traditional saddle stitch' }, { label: 'Personalisation', value: 'Case-by-case at the salon' }],
    finishes: ['Cognac bridle / Brass', 'Noir bridle / Brass'], leadTime: '8–10 weeks from commission', maxQuantity: 6,
  },
  {
    id: 'folio', title: 'The Writer’s Folio', categoryLabel: 'Objects for the written word', categories: ['leather', 'writing'],
    image: '/assets/images/product-folio.jpg',
    alt: 'Espresso boxcalf portfolio with a brass drafting pen and deckled cotton paper on linen',
    material: 'Espresso boxcalf · Brass drafting pen', priceUSD: 1250, badge: 'Made to order', reference: 'A.03 — ÉCRITURE',
    description: 'A small ritual for an unhurried mind. A supple boxcalf folio, a balanced brass drafting instrument, and a sheaf of deckled cotton paper. Made for the ideas worth keeping.',
    specs: [{ label: 'Dimensions', value: '32 × 24 × 2 cm' }, { label: 'Leather', value: 'Espresso French boxcalf' }, { label: 'Closure', value: 'Solid brass zip' }, { label: 'Instrument', value: 'Machined brass · Refillable' }, { label: 'Paper', value: '20 sheets · 100% cotton' }, { label: 'Construction', value: 'Hand-stitched and burnished' }],
    finishes: ['Espresso boxcalf / Brass', 'Cognac boxcalf / Brass'], leadTime: '4–6 weeks from commission', maxQuantity: 6,
  },
];

export const MODELS = [
  { id: 'chrono', label: 'Chronomètre V-04', price: 18500, reference: 'V.04 / 39.5 MM', image: PRODUCTS[0].image },
  { id: 'tourbillon', label: 'Tourbillon Sovereign', price: 28000, reference: 'V.08 / 40 MM', image: PRODUCTS[1].image },
] as const;

export const ALLOYS = [
  { id: 'titanium', label: 'Grade 5 Titanium', short: 'Titanium', price: 0, color: '#a2a19b' },
  { id: 'rose', label: '18k Rose Gold', short: 'Rose gold', price: 6200, color: '#c49573' },
  { id: 'dlc', label: 'DLC Obsidian', short: 'Obsidian', price: 1800, color: '#343230' },
] as const;

export const DIALS = [
  { id: 'slate', label: 'Slate Guilloché', color: '#62666a' },
  { id: 'bone', label: 'Warm Bone Enamel', color: '#e6dcc9' },
  { id: 'forest', label: 'Forest Sunburst', color: '#374c3d' },
] as const;

export const STRAPS = [
  { id: 'cognac', label: 'Tuscan Cognac Bridle', short: 'Cognac bridle', color: '#97552f' },
  { id: 'noir', label: 'Noir Matte Alligator', short: 'Noir alligator', color: '#282725' },
  { id: 'nubuck', label: 'Desert Raw Nubuck', short: 'Desert nubuck', color: '#c0a582' },
] as const;

export const DEFAULT_BUILD: CommissionBuild = { model: 'chrono', alloy: 'titanium', dial: 'slate', strap: 'cognac', monogram: '' };

export const DESTINATIONS = [
  { code: 'CH', label: 'Switzerland' },
  { code: 'EU', label: 'European Union' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'WORLD', label: 'Rest of the world' },
] as const;

export function getProduct(id: string): Product | undefined { return PRODUCTS.find(product => product.id === id); }

export function buildDescription(build: CommissionBuild) {
  return {
    model: MODELS.find(option => option.id === build.model)!,
    alloy: ALLOYS.find(option => option.id === build.alloy)!,
    dial: DIALS.find(option => option.id === build.dial)!,
    strap: STRAPS.find(option => option.id === build.strap)!,
  };
}

import { useCallback } from 'react';
import { useCommerce } from '../context/CommerceContext';
import { getProduct } from '../lib/catalogue';
import { ArchiveModal } from './ArchiveModal';
import { BagDrawer } from './BagDrawer';
import { ConciergeModal } from './ConciergeModal';
import { Dialog } from './Dialog';
import { ProductQuickView } from './ProductQuickView';
import { MobileMenu, PolicyModal, ProvenanceModal, RatesModal } from './ServiceModals';
import { POLICY_TITLES } from '../lib/policies';

export function OverlayHost() {
  const { overlay, setOverlay } = useCommerce();
  const close = useCallback(() => setOverlay(null), [setOverlay]);
  if (!overlay) return null;
  switch (overlay.kind) {
    case 'bag': return <Dialog key="bag" title="Your bag." eyebrow="THE PRIVATE SELECTION" variant="drawer" onClose={close} className="bag-dialog"><BagDrawer onClose={close} /></Dialog>;
    case 'product': {
      const product = getProduct(overlay.productId);
      if (!product) return null;
      return <Dialog key={`product-${product.id}`} title={product.title} eyebrow={product.reference} className="product-dialog" onClose={close}><ProductQuickView key={product.id} product={product} /></Dialog>;
    }
    case 'consultation': return <Dialog key="consultation" title={overlay.build ? 'Your private commission.' : 'An appointment, unhurried.'} eyebrow="THE GENEVA SALON / PRIVATE CONSULTATIONS" className="concierge-dialog" onClose={close}><ConciergeModal build={overlay.build} onClose={close} /></Dialog>;
    case 'checkout': return <Dialog key="checkout" title="Allocation checkout." eyebrow="THE PRIVATE SALON / NO PAYMENT REQUIRED" className="concierge-dialog" onClose={close}><ConciergeModal checkout onClose={close} /></Dialog>;
    case 'archive': return <Dialog key="archive" title="The atelier archive." eyebrow="LETTERS FROM THE BENCH" className="archive-dialog" onClose={close}><ArchiveModal /></Dialog>;
    case 'provenance': return <Dialog key="provenance" title="The provenance register." eyebrow="THE HAND-BOUND LEDGER" className="service-dialog" onClose={close}><ProvenanceModal /></Dialog>;
    case 'policy': return <Dialog key={`policy-${overlay.page}`} title={POLICY_TITLES[overlay.page]} eyebrow="THE MAISON PROTOCOL" className="service-dialog" onClose={close}><PolicyModal page={overlay.page} /></Dialog>;
    case 'rates': return <Dialog key="rates" title="Currency & reference rates." eyebrow="TRANSPARENT ALLOCATION ESTIMATES" className="service-dialog" onClose={close}><RatesModal /></Dialog>;
    case 'menu': return <Dialog key="menu" title="VAHLEN & CO." eyebrow="GENÈVE — PARIS" variant="drawer" className="menu-dialog" onClose={close}><MobileMenu onClose={close} /></Dialog>;
  }
}

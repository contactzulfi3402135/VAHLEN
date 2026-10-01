import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import { cartReducer, cartSubtotalUSD, hydrateCart } from '../lib/cart';
import { getProduct } from '../lib/catalogue';
import { pruneStoredDossiers } from '../lib/concierge';
import { FALLBACK_RATES, formatMoney, isCurrency, parseExchangeRates, shippingPriceUSD } from '../lib/pricing';
import { isRecord, readStored, writeStored } from '../lib/storage';
import type { CartItem, Currency, Destination, ExchangeRates, Overlay, ToastMessage } from '../lib/types';

interface CommerceContextValue {
  cart: CartItem[];
  itemCount: number;
  subtotalUSD: number;
  shippingUSD: number;
  destination: Destination;
  setDestination: (destination: Destination) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchange: ExchangeRates;
  money: (usd: number) => string;
  overlay: Overlay | null;
  setOverlay: (overlay: Overlay | null) => void;
  addToBag: (productId: string, finish?: string, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearBag: () => void;
  toasts: ToastMessage[];
  notify: (title: string, detail?: string) => void;
  dismissToast: (id: number) => void;
}

const CommerceContext = createContext<CommerceContextValue | null>(null);

function initialExchange(): ExchangeRates {
  const cache = readStored('vahlen.fx.v1');
  if (isRecord(cache) && isRecord(cache.rates)) {
    const parsed = parseExchangeRates({ base: 'USD', date: cache.date, rates: cache.rates });
    if (parsed) return { ...parsed, source: 'cached' };
  }
  return FALLBACK_RATES;
}

export function CommerceProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, readStored('vahlen.bag.v1'), hydrateCart);
  const [currency, setCurrency] = useState<Currency>(() => { const stored = readStored('vahlen.currency.v1'); return isCurrency(stored) ? stored : 'USD'; });
  const [destination, setDestination] = useState<Destination>('WORLD');
  const [exchange, setExchange] = useState<ExchangeRates>(initialExchange);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => { pruneStoredDossiers(); }, []);
  useEffect(() => { writeStored('vahlen.bag.v1', cart); }, [cart]);
  useEffect(() => { writeStored('vahlen.currency.v1', currency); }, [currency]);
  useEffect(() => {
    const controller = new AbortController();
    const loadRates = async () => {
      try {
        const response = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP,CHF', { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8000)]) });
        if (!response.ok) return;
        const parsed = parseExchangeRates(await response.json());
        if (parsed && !controller.signal.aborted) { setExchange(parsed); writeStored('vahlen.fx.v1', parsed); }
      } catch { /* Latest cached reference rates remain usable offline. */ }
    };
    void loadRates();
    const interval = window.setInterval(() => { if (document.visibilityState === 'visible') void loadRates(); }, 3600000);
    return () => { controller.abort(); window.clearInterval(interval); };
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const oldest = toasts[0].id;
    const timer = window.setTimeout(() => setToasts(previous => previous.filter(toast => toast.id !== oldest)), 6000);
    return () => window.clearTimeout(timer);
  }, [toasts]);

  const notify = useCallback((title: string, detail?: string) => {
    setToasts(previous => [...previous.slice(-2), { id: Date.now() + Math.random(), title, detail }]);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts(previous => previous.filter(toast => toast.id !== id)), []);
  const addToBag = useCallback((productId: string, finish?: string, quantity = 1) => {
    const product = getProduct(productId);
    if (!product) return;
    dispatch({ type: 'add', productId, finish: finish ?? product.finishes[0], quantity });
    setOverlay({ kind: 'bag' });
  }, []);
  const setQuantity = useCallback((key: string, quantity: number) => dispatch({ type: 'quantity', key, quantity }), []);
  const removeItem = useCallback((key: string) => dispatch({ type: 'remove', key }), []);
  const clearBag = useCallback(() => dispatch({ type: 'clear' }), []);
  const money = useCallback((usd: number) => formatMoney(usd, currency, exchange.rates), [currency, exchange.rates]);
  const subtotalUSD = cartSubtotalUSD(cart);
  const shippingUSD = shippingPriceUSD(destination, subtotalUSD);
  const value = useMemo(() => ({ cart, itemCount: cart.reduce((sum, item) => sum + item.quantity, 0), subtotalUSD, shippingUSD, destination, setDestination, currency, setCurrency, exchange, money, overlay, setOverlay, addToBag, setQuantity, removeItem, clearBag, toasts, notify, dismissToast }), [cart, subtotalUSD, shippingUSD, destination, currency, exchange, money, overlay, addToBag, setQuantity, removeItem, clearBag, toasts, notify, dismissToast]);

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

// The provider and hook share one module intentionally.
// eslint-disable-next-line react-refresh/only-export-components
export function useCommerce(): CommerceContextValue {
  const context = useContext(CommerceContext);
  if (!context) throw new Error('Commerce components must be inside CommerceProvider.');
  return context;
}

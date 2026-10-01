import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { CommerceProvider } from './context/CommerceContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Collection } from './components/Collection';
import { CommissionStudio } from './components/CommissionStudio';
import { Acclaim, Craftsmanship, Footer, MaisonJournal } from './components/Editorial';
import { SalonRegister } from './components/SalonRegister';
import { OverlayHost } from './components/Overlays';
import { Toasts } from './components/Primitives';

class MaisonErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Maison application error', error, info.componentStack); }
  render() {
    if (this.state.hasError) return <main className="error-page"><p className="section-label">VAHLEN & CO.</p><h1>A moment of pause.</h1><p>The salon could not open this page. Your saved bag remains in this browser.</p><button type="button" className="button button-dark" onClick={() => window.location.reload()}>Return to the maison</button></main>;
    return this.props.children;
  }
}

export default function App() {
  return <MaisonErrorBoundary><CommerceProvider><div id="app-shell"><a className="skip-link" href="#main-content">Skip to content</a><div id="top" /><Header /><main id="main-content"><Hero /><Collection /><CommissionStudio /><Craftsmanship /><MaisonJournal /><Acclaim /><SalonRegister /></main><Footer /></div><OverlayHost /><Toasts /></CommerceProvider></MaisonErrorBoundary>;
}

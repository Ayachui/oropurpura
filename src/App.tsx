import { useCallback, useEffect, useState } from 'react';
import { B2BChallengeView } from './components/B2BChallengeView';
import { BrandLogo } from './components/BrandLogo';
import { ModalDrawer } from './components/ModalDrawer';
import { OroAdminModal } from './components/OroAdminModal';
import { TraceabilityPassport } from './components/TraceabilityPassport';
import { WhatsAppAction } from './components/WhatsAppAction';
import { CONTENT, type Lang, type PackWeight } from './data/content';
import type { OroPublicState, OroSetId, OroSkuId } from './types/liveInventory';
import { buildWhatsAppUrl } from './utils/whatsapp';

type ViewMode = 'storefront' | 'b2b';
type ScienceTab = 'cascade' | 'circuits' | 'table';

function detectInitialView(): ViewMode {
  if (typeof window === 'undefined') return 'storefront';
  const path = window.location.pathname.toLowerCase();
  const viewParam = new URLSearchParams(window.location.search).get('view')?.toLowerCase();
  if (path.startsWith('/b2b') || path.startsWith('/5-bean-challenge') || viewParam === 'b2b') {
    return 'b2b';
  }
  return 'storefront';
}

function extractPublicState(
  json: ({ ok?: boolean; state?: OroPublicState } & Partial<OroPublicState>) | null,
): OroPublicState | null {
  if (!json?.ok) return null;
  if (json.state) return json.state;
  if (json.skus && json.sets && json.ticker) {
    return {
      generatedAt: json.generatedAt ?? Date.now(),
      skus: json.skus,
      sets: json.sets,
      ticker: json.ticker,
    };
  }
  return null;
}

export function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [viewMode, setViewMode] = useState<ViewMode>(detectInitialView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisual, setHeroVisual] = useState<'cut' | 'brew'>('cut');
  const [selectedGoalId, setSelectedGoalId] = useState<'focus' | 'energy' | 'ritual'>('focus');
  const [calibratorBiochemOpen, setCalibratorBiochemOpen] = useState(false);
  const [packWeight, setPackWeight] = useState<PackWeight>('250g');

  const [specModalSkuId, setSpecModalSkuId] = useState<OroSkuId | null>(null);
  const [traceModalSkuId, setTraceModalSkuId] = useState<OroSkuId | null>(null);
  const [scienceModalTab, setScienceModalTab] = useState<ScienceTab | null>(null);

  const [liveInventory, setLiveInventory] = useState<OroPublicState | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.startsWith('/admin') ||
      new URLSearchParams(window.location.search).get('admin') === '1' ||
      window.location.hash.includes('eco_token=')
    );
  });
  const [urlBatchCode] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('batch')?.trim();
    if (fromQuery) return fromQuery.toUpperCase();
    const traceMatch = window.location.pathname.match(/\/trace\/([^/]+)/i);
    return traceMatch?.[1] ? decodeURIComponent(traceMatch[1]).toUpperCase() : null;
  });

  const t = CONTENT[lang];

  const applyInventoryState = useCallback(
    (state: OroPublicState, checkBatchDeepLink: boolean) => {
      setLiveInventory(state);
      if (!checkBatchDeepLink || !urlBatchCode) return;
      const skuIds: OroSkuId[] = ['inca', 'andean', 'guayusa'];
      for (const id of skuIds) {
        const sku = state.skus[id];
        const matched =
          sku?.activeBatches?.some((b) => b.batchCode === urlBatchCode) ||
          sku?.primaryBatch?.batchCode === urlBatchCode;
        if (matched) {
          setViewMode('storefront');
          setTraceModalSkuId(id);
          break;
        }
      }
    },
    [urlBatchCode],
  );

  const fetchInventory = useCallback(
    async (checkBatchDeepLink = false) => {
      try {
        const res = await fetch('/api/oropurpura/public', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as {
          ok?: boolean;
          state?: OroPublicState;
        } & Partial<OroPublicState>;
        const state = extractPublicState(json);
        if (state) {
          applyInventoryState(state, checkBatchDeepLink);
        }
      } catch {
        // Graceful fallback to static catalog when API is unreachable
      }
    },
    [applyInventoryState],
  );

  useEffect(() => {
    let cancelled = false;
    fetch('/api/oropurpura/public', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: ({ ok?: boolean; state?: OroPublicState } & Partial<OroPublicState>) | null) => {
        const state = extractPublicState(json);
        if (!cancelled && state) {
          applyInventoryState(state, true);
        }
      })
      .catch(() => {
        // Graceful fallback to static catalog when API is unreachable
      });
    return () => {
      cancelled = true;
    };
  }, [applyInventoryState]);

  useEffect(() => {
    const onPopState = () => {
      setViewMode(detectInitialView());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const navigateView = (next: ViewMode, anchorId?: string) => {
    setViewMode(next);
    setMobileMenuOpen(false);
    const targetPath = next === 'b2b' ? '/5-bean-challenge' : '/';
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    if (anchorId && next === 'storefront') {
      window.setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeGoal =
    t.calibrator.goals.find((g) => g.id === selectedGoalId) ?? t.calibrator.goals[0];

  const generalWhatsAppMsg =
    lang === 'es'
      ? 'Hola ORO PÚRPURA, quiero información para hacer un pedido con envío gratis en Ecuador. Mi ciudad es: '
      : 'Hi ORO PÚRPURA, I would like information to place an order with free shipping in Ecuador. My city is: ';

  const tickerText = liveInventory?.ticker?.activeBatchCodes?.length
    ? `${lang === 'es' ? 'LOTES ACTIVOS' : 'LIVE BATCHES'}: ${liveInventory.ticker.activeBatchCodes.join(' · ')} (${liveInventory.ticker.primaryOrigin.toUpperCase()}) • ${t.ticker.text}`
    : t.ticker.text;

  const tickerAvailability = liveInventory
    ? `${liveInventory.ticker.totalSetsRemaining} / ${liveInventory.ticker.totalSetsQuota} SETS`
    : t.ticker.availabilityValue;

  const specModalSku = specModalSkuId ? t.shop.skus.find((s) => s.id === specModalSkuId) ?? null : null;
  const traceModalSku = traceModalSkuId ? t.shop.skus.find((s) => s.id === traceModalSkuId) ?? null : null;

  return (
    <div id="top">
      {/* SECTION 0: Batch Drop Ticker */}
      <div className="batch-ticker" role="region" aria-label="Batch Status">
        <div className="batch-ticker-inner">
          <span className="ticker-stream">{tickerText}</span>
          <span className="ticker-stock">
            <span className="ticker-pulse" aria-hidden="true" />
            <span>{t.ticker.availabilityLabel}</span>
            <strong>{tickerAvailability}</strong>
          </span>
        </div>
      </div>

      {/* SECTION 0B: Clean Sticky Header */}
      <header className="site-header">
        <div className="container header-inner">
          <BrandLogo
            showParentLink
            parentPrefix={t.common.parentPrefix}
            onNavigateHome={viewMode === 'b2b' ? () => navigateView('storefront') : undefined}
          />

          <nav className="header-nav" aria-label="Primary">
            <a
              href="#shop"
              onClick={(e) => {
                if (viewMode === 'b2b') {
                  e.preventDefault();
                  navigateView('storefront', 'shop');
                }
              }}
            >
              {t.nav.shop}
            </a>
            <a
              href="#calibrator"
              onClick={(e) => {
                if (viewMode === 'b2b') {
                  e.preventDefault();
                  navigateView('storefront', 'calibrator');
                }
              }}
            >
              {t.nav.calibrator}
            </a>
            <a
              href="#why"
              onClick={(e) => {
                if (viewMode === 'b2b') {
                  e.preventDefault();
                  navigateView('storefront', 'why');
                }
              }}
            >
              {t.nav.why}
            </a>
            <a
              href="#origin"
              onClick={(e) => {
                if (viewMode === 'b2b') {
                  e.preventDefault();
                  navigateView('storefront', 'origin');
                }
              }}
            >
              {t.nav.origin}
            </a>
            <button
              type="button"
              className={`nav-b2b-pill ${viewMode === 'b2b' ? 'active' : ''}`}
              onClick={() => navigateView(viewMode === 'b2b' ? 'storefront' : 'b2b')}
            >
              {t.nav.b2b}
            </button>
          </nav>

          <div className="header-controls">
            <div className="lang-switch" role="group" aria-label="Language">
              <button
                type="button"
                className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
                onClick={() => setLang('es')}
              >
                ES
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
            </div>

            <a
              href={buildWhatsAppUrl(generalWhatsAppMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="header-wa-cta"
            >
              <span className="wa-dot" aria-hidden="true" />
              <span>{t.nav.cta}</span>
            </a>

            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? '✕' : 'MENU'}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                navigateView('storefront', 'shop');
              }}
            >
              {t.nav.shop}
            </a>
            <a
              href="#calibrator"
              onClick={(e) => {
                e.preventDefault();
                navigateView('storefront', 'calibrator');
              }}
            >
              {t.nav.calibrator}
            </a>
            <a
              href="#why"
              onClick={(e) => {
                e.preventDefault();
                navigateView('storefront', 'why');
              }}
            >
              {t.nav.why}
            </a>
            <a
              href="#origin"
              onClick={(e) => {
                e.preventDefault();
                navigateView('storefront', 'origin');
              }}
            >
              {t.nav.origin}
            </a>
            <button
              type="button"
              className="mobile-b2b-btn"
              onClick={() => navigateView('b2b')}
            >
              {t.nav.b2b} →
            </button>
            <div style={{ paddingTop: '8px' }}>
              <WhatsAppAction
                label={t.common.orderViaWa}
                message={generalWhatsAppMsg}
                copyLabel={t.common.copyText}
                copiedLabel={t.common.copied}
                fullWidth
              />
            </div>
          </div>
        )}
      </header>

      <main>
        {viewMode === 'b2b' ? (
          <B2BChallengeView t={t} onBack={() => navigateView('storefront')} />
        ) : (
          <>
            {/* SECTION 1: Clean Storefront Hero */}
            <section className="hero-section">
              <div className="container hero-grid">
                <div>
                  <p className="eyebrow">
                    {t.hero.originBadge} • {t.hero.eyebrow}
                  </p>

                  <h1>{t.hero.h1Main}</h1>
                  <p className="hero-subtitle">{t.hero.subtitle}</p>

                  <div className="hero-cta-row">
                    <a href="#shop" className="btn btn-primary">
                      {t.hero.ctaPrimary}
                    </a>
                    <a href="#calibrator" className="btn btn-secondary">
                      {t.hero.ctaSecondary}
                    </a>
                  </div>

                  <div className="proof-strip">
                    {t.hero.proofs.map((item) => (
                      <div className="proof-cell" key={item.value}>
                        <div className="proof-value">{item.value}</div>
                        <div className="proof-label">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Single clean interactive frame instead of stacked double lab boxes */}
                <div className="hero-visual-panel">
                  <div className="hero-visual-tabs" role="tablist" aria-label="Product showcase views">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={heroVisual === 'cut'}
                      className={`hero-tab-btn ${heroVisual === 'cut' ? 'active' : ''}`}
                      onClick={() => setHeroVisual('cut')}
                    >
                      {t.hero.visualTab1}
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={heroVisual === 'brew'}
                      className={`hero-tab-btn ${heroVisual === 'brew' ? 'active' : ''}`}
                      onClick={() => setHeroVisual('brew')}
                    >
                      {t.hero.visualTab2}
                    </button>
                  </div>

                  <figure className="lab-frame" style={{ margin: 0 }}>
                    <div className="lab-frame-header">
                      <span>{heroVisual === 'cut' ? t.hero.diptychLeftTag : t.hero.diptychRightTag}</span>
                      <span>{heroVisual === 'cut' ? 'FMAD // 18 µm' : 'NO OIL FILM'}</span>
                    </div>
                    <img
                      src={heroVisual === 'cut' ? '/images/glassy-fracture.jpg' : '/images/ruby-lavender-elixir.jpg'}
                      alt={heroVisual === 'cut' ? t.hero.diptychLeftCaption : t.hero.diptychRightCaption}
                      className="lab-frame-img"
                    />
                    <figcaption className="lab-frame-caption">
                      {heroVisual === 'cut' ? t.hero.diptychLeftCaption : t.hero.diptychRightCaption}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </section>

            {/* SECTION 2: 3 Simple Reasons (Replaces dense 6x3 table on main scroll) */}
            <section id="why" className="section section-compact">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.why.eyebrow}</p>
                  <h2>{t.why.title}</h2>
                  <p className="section-subtitle">{t.why.subtitle}</p>
                </div>

                <div className="why-grid">
                  {t.why.cards.map((card) => (
                    <article key={card.num} className="why-card">
                      <div className="why-card-top">
                        <span className="why-num mono">{card.num}</span>
                        <span className="why-badge mono">{card.badge}</span>
                      </div>
                      <h3>{card.title}</h3>
                      <p className="why-detail">{card.detail}</p>
                    </article>
                  ))}
                </div>

                <div className="layer2-trigger-row">
                  <button
                    type="button"
                    className="btn-layer2"
                    onClick={() => setScienceModalTab('table')}
                  >
                    {t.why.openLabTableLabel}
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 3: Main Storefront (Sets + Individual Blocks) */}
            <section id="shop" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.shop.eyebrow}</p>
                  <h2>{t.shop.title}</h2>
                  <p className="section-subtitle">{t.shop.subtitle}</p>
                </div>

                <div className="subsection-bar">
                  <h3 className="mono sub-heading">{t.shop.setsTabTitle}</h3>
                  <span className="delta-tag">{t.common.freeShippingBadge}</span>
                </div>

                <div className="sets-grid">
                  {t.shop.sets.map((bundle) => {
                    const setInv = liveInventory?.sets?.[bundle.id as OroSetId];
                    const hasLiveSets = Boolean(liveInventory && setInv);
                    const isSetPreorder = Boolean(hasLiveSets && setInv && setInv.remainingCount <= 0);
                    const setCtaLabel = isSetPreorder
                      ? lang === 'es'
                        ? `Reservar Preventa ${bundle.code} (${bundle.price})`
                        : `Pre-order ${bundle.code} (${bundle.price})`
                      : bundle.ctaLabel;
                    const setWaMessage = isSetPreorder
                      ? lang === 'es'
                        ? `Hola ORO PÚRPURA, quiero reservar en PREVENTA el ${bundle.code} ${bundle.name} (${bundle.price} con envío gratis Servientrega). Mi ciudad es: `
                        : `Hi ORO PÚRPURA, I want to PRE-ORDER ${bundle.code} ${bundle.name} (${bundle.price} with free shipping in Ecuador). My city is: `
                      : bundle.whatsappMessage;

                    return (
                      <article
                        key={bundle.id}
                        className={`set-card ${bundle.featured ? 'featured' : ''}`}
                      >
                        <div>
                          <div className="set-visual">
                            <img
                              src={bundle.image}
                              alt={`${bundle.code} ${bundle.name}`}
                              className="set-visual-img"
                            />
                          </div>

                          <div className="set-badges-row">
                            <span className="set-badge">{bundle.badge}</span>
                            {hasLiveSets && setInv ? (
                              <span className={`stock-pill ${isSetPreorder ? 'stock-preorder' : 'stock-in'}`}>
                                {isSetPreorder
                                  ? lang === 'es'
                                    ? 'PREVENTA • PRÓXIMO LOTE'
                                    : 'PRE-ORDER • NEXT BATCH'
                                  : lang === 'es'
                                    ? `Stock: ${setInv.remainingCount}/${setInv.quotaTotal}`
                                    : `In Stock: ${setInv.remainingCount}/${setInv.quotaTotal}`}
                              </span>
                            ) : null}
                          </div>

                          <div className="set-header-row">
                            <div>
                              <div className="mono set-code">{bundle.code}</div>
                              <h3>{bundle.name}</h3>
                            </div>
                            <div className="set-price-stack">
                              <div className="set-price">{bundle.price}</div>
                              <div className="mono set-cup-price">{bundle.cupPriceHighlight}</div>
                            </div>
                          </div>

                          <div className="set-savings">{bundle.savings}</div>

                          <ul className="set-items">
                            {bundle.items.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>

                          <div className="set-gift">{bundle.gift}</div>
                        </div>

                        <div className="set-footer-actions">
                          <div className="set-meta-row">
                            <span>{bundle.netWeight}</span>
                            <span>{bundle.yieldSummary}</span>
                          </div>
                          <WhatsAppAction
                            label={setCtaLabel}
                            message={setWaMessage}
                            copyLabel={t.common.copyText}
                            copiedLabel={t.common.copied}
                            fullWidth
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Individual Blocks Configurator (Clean by default, Layer 2 via Modals) */}
                <div className="blocks-divider" id="blocks">
                  <div className="subsection-bar">
                    <div>
                      <h3>{t.shop.blocksTitle}</h3>
                      <p className="section-subtitle" style={{ marginTop: '6px', fontSize: '0.96rem' }}>
                        {t.shop.blocksSubtitle}
                      </p>
                    </div>

                    <div className="weight-switcher" role="group" aria-label="Weight Selector">
                      {(['250g', '500g', '1000g'] as PackWeight[]).map((weight) => (
                        <button
                          key={weight}
                          type="button"
                          className={`weight-btn ${packWeight === weight ? 'active' : ''}`}
                          onClick={() => setPackWeight(weight)}
                        >
                          {weight === '1000g' ? '1000 g (1 kg)' : weight.replace('g', ' g')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="weight-geometry-bar">
                    <span>{t.shop.weightLabels[packWeight].cells}</span>
                    <span>{t.shop.weightLabels[packWeight].weightNote}</span>
                  </div>

                  <div className="sku-grid">
                    {t.shop.skus.map((sku) => {
                      const currentPrice = sku.prices[packWeight];
                      const skuAvail = liveInventory?.skus?.[sku.id as OroSkuId];
                      const hasLiveSku = Boolean(liveInventory && skuAvail);
                      const isPackInStock = skuAvail ? skuAvail.packsAvailable[packWeight] : true;
                      const isSkuPreorder = hasLiveSku && !isPackInStock;
                      const batchCode = skuAvail?.primaryBatch?.batchCode;

                      const blockCtaLabel = isSkuPreorder
                        ? lang === 'es'
                          ? `Preventa ${packWeight}`
                          : `Pre-order ${packWeight}`
                        : `${t.shop.orderBlockCta} ${packWeight}`;
                      const blockMessage = isSkuPreorder
                        ? lang === 'es'
                          ? `Hola ORO PÚRPURA, quiero reservar en PREVENTA ${sku.name} en formato ${packWeight} (${currentPrice} USD). Mi ciudad es: `
                          : `Hi ORO PÚRPURA, I want to PRE-ORDER ${sku.name} in ${packWeight} format (${currentPrice} USD). My city is: `
                        : lang === 'es'
                          ? `Hola ORO PÚRPURA, quiero pedir ${sku.name} en formato ${packWeight} (${currentPrice} USD). Mi ciudad es: `
                          : `Hi ORO PÚRPURA, I want to order ${sku.name} in ${packWeight} format (${currentPrice} USD). My city is: `;

                      return (
                        <article id={`sku-${sku.id}`} key={sku.id} className={`sku-card accent-${sku.accentToken}`}>
                          <div className="sku-visual-wrap">
                            <img
                              src={sku.image}
                              alt={sku.name}
                              className="sku-card-img"
                            />
                            <span className="sku-cacao-badge mono">{sku.cacaoPercent}</span>
                          </div>

                          <div className="sku-card-body">
                            <div className="sku-card-head">
                              <div>
                                <div className="mono sku-code">{sku.code}</div>
                                <h4 className="sku-name">{sku.name}</h4>
                              </div>
                              <div className="sku-price-block">
                                <div className="sku-price">{currentPrice}</div>
                                <div className="sku-unit">{sku.unitCost[packWeight]}</div>
                              </div>
                            </div>

                            {hasLiveSku && skuAvail ? (
                              <div>
                                <span
                                  className={`stock-pill ${isSkuPreorder ? 'stock-preorder' : 'stock-in'}`}
                                >
                                  {isSkuPreorder
                                    ? skuAvail.totalRemainingKg <= 0
                                      ? lang === 'es'
                                        ? 'Sin stock • Preventa próximo lote'
                                        : 'Out of stock • Pre-order next batch'
                                      : lang === 'es'
                                        ? `PREVENTA ${packWeight} (${skuAvail.totalRemainingKg} kg disp.)`
                                        : `PRE-ORDER ${packWeight} (${skuAvail.totalRemainingKg} kg left)`
                                    : lang === 'es'
                                      ? `Disponible • ${skuAvail.totalRemainingKg} kg`
                                      : `In Stock • ${skuAvail.totalRemainingKg} kg`}
                                </span>
                              </div>
                            ) : null}

                            <p className="sku-benefit">{sku.shortBenefit}</p>
                            <p className="sku-taste">{sku.tasteNote}</p>
                            <div className="sku-prep-hint">
                              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--purple-raw)' }}>
                                {lang === 'es' ? 'MODO DE USO: ' : 'HOW TO ENJOY: '}
                              </span>
                              {sku.prepHint}
                            </div>

                            <div className="sku-card-footer">
                              <WhatsAppAction
                                label={blockCtaLabel}
                                message={blockMessage}
                                copyLabel={t.common.copyText}
                                copiedLabel={t.common.copied}
                                fullWidth
                              />

                              <div className="sku-layer2-row">
                                <button
                                  type="button"
                                  className="btn-spec-pill"
                                  onClick={() => setSpecModalSkuId(sku.id)}
                                >
                                  {t.shop.openSpecLabel}
                                </button>
                                <button
                                  type="button"
                                  className="btn-spec-pill"
                                  onClick={() => setTraceModalSkuId(sku.id)}
                                >
                                  {batchCode ? `${t.shop.openPassportLabel} (${batchCode})` : t.shop.openPassportLabel}
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: Simple Goal Matcher (Calibrator) */}
            <section id="calibrator" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.calibrator.eyebrow}</p>
                  <h2>{t.calibrator.title}</h2>
                  <p className="section-subtitle">{t.calibrator.subtitle}</p>
                </div>

                <div className="calibrator-layout">
                  <div>
                    <div className="calibrator-steps-label">{t.calibrator.step1Label}</div>
                    <div className="goal-cards" role="radiogroup" aria-label={t.calibrator.step1Label}>
                      {t.calibrator.goals.map((goal) => {
                        const isActive = goal.id === activeGoal.id;
                        return (
                          <button
                            key={goal.id}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            className={`goal-card ${isActive ? 'active' : ''}`}
                            style={isActive ? { borderLeftColor: goal.accentColor } : undefined}
                            onClick={() => {
                              setSelectedGoalId(goal.id);
                              setCalibratorBiochemOpen(false);
                            }}
                          >
                            <span className="goal-tag">{goal.tag}</span>
                            <div className="goal-title">{goal.title}</div>
                            <div className="goal-sub">{goal.subtitle}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="calibrator-steps-label">{t.calibrator.step2Label}</div>
                    <div className="calibrator-output">
                      <div className="calibrator-output-head">
                        <div>
                          <h3 className="calibrator-formula-title">{activeGoal.formulaName}</h3>
                        </div>
                        <span
                          className={`sku-pill ${activeGoal.id === 'ritual' ? 'sku-pill-ochre' : ''}`}
                          style={
                            activeGoal.id === 'ritual'
                              ? undefined
                              : { backgroundColor: activeGoal.accentColor }
                          }
                        >
                          {activeGoal.skuBadge}
                        </span>
                      </div>

                      <div className="calibrator-visual">
                        <img
                          src={
                            activeGoal.id === 'focus'
                              ? '/images/sku-inca-silk.jpg'
                              : activeGoal.id === 'energy'
                                ? '/images/ruby-lavender-elixir.jpg'
                                : '/images/sku-andean-gold.jpg'
                          }
                          alt={activeGoal.formulaName}
                          className="calibrator-visual-img"
                        />
                      </div>

                      <div className="protocol-grid">
                        <div className="protocol-box">
                          <div className="protocol-box-label">{activeGoal.prepPrimaryLabel}</div>
                          <div>{activeGoal.prepPrimary}</div>
                        </div>
                        <div className="protocol-box">
                          <div className="protocol-box-label">{activeGoal.prepSecondaryLabel}</div>
                          <div>{activeGoal.prepSecondary}</div>
                        </div>
                      </div>

                      <ul className="plain-benefit-list">
                        {activeGoal.plainBenefits.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>

                      <div className="calibrator-biochem-drawer">
                        <button
                          type="button"
                          className="btn-inline-toggle"
                          aria-expanded={calibratorBiochemOpen}
                          onClick={() => setCalibratorBiochemOpen((prev) => !prev)}
                        >
                          {calibratorBiochemOpen
                            ? t.calibrator.biochemToggleClose
                            : t.calibrator.biochemToggleOpen}
                        </button>

                        {calibratorBiochemOpen && (
                          <ul className="biochem-list">
                            {activeGoal.biochemistry.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="calibrator-economics">
                        <div>
                          <div className="econ-note">{t.calibrator.costLabel}</div>
                          <div className="econ-value">{activeGoal.cupCost}</div>
                          <div className="econ-note">{activeGoal.cafeComparison}</div>
                        </div>
                        <div>
                          <div className="econ-note">{t.calibrator.recommendedLabel}</div>
                          <div className="econ-value">
                            {activeGoal.recommendedSet} ({activeGoal.recommendedPrice})
                          </div>
                          <div className="econ-note">{t.calibrator.vsCafeLabel}</div>
                        </div>
                      </div>

                      <WhatsAppAction
                        label={t.calibrator.ctaLabel}
                        message={activeGoal.whatsappMessage}
                        copyLabel={t.common.copyText}
                        copiedLabel={t.common.copied}
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: Science Made Clear (4-Step Timeline + Full Lab Modal) */}
            <section id="science" className="section section-compact">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.science.eyebrow}</p>
                  <h2>{t.science.title}</h2>
                  <p className="section-subtitle">{t.science.subtitle}</p>
                </div>

                <div className="timeline-grid">
                  {t.science.timeline.map((step) => (
                    <div key={step.time} className="timeline-card">
                      <div className="timeline-time mono">{step.time}</div>
                      <h3>{step.title}</h3>
                      <p className="timeline-summary">{step.summary}</p>
                    </div>
                  ))}
                </div>

                <div className="layer2-trigger-row">
                  <button
                    type="button"
                    className="btn-layer2"
                    onClick={() => setScienceModalTab('cascade')}
                  >
                    {t.science.openDossierLabel}
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 6: Origin, Proyecto TZNK & Founder */}
            <section id="origin" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.origin.eyebrow}</p>
                  <h2>{t.origin.title}</h2>
                </div>

                <div className="origin-grid">
                  <div>
                    <div className="origin-card">
                      <h3>{t.origin.terroirTitle}</h3>
                      <div className="terroir-list">
                        {t.origin.terroirPoints.map((pt) => (
                          <div key={pt.label} className="terroir-item">
                            <div className="terroir-label">{pt.label}</div>
                            <div style={{ marginTop: '4px' }}>{pt.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="tznk-box">
                        <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--guayusa-emerald)' }}>
                          {t.origin.tznkBadge}
                        </div>
                        <p style={{ margin: '8px 0 0', fontSize: '0.92rem' }}>{t.origin.tznkDesc}</p>
                        <a
                          href={
                            liveInventory?.skus?.inca?.primaryBatch?.consumedLots?.[0]?.traceUrl ||
                            'https://incatrailfoods.com/products'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tznk-link"
                        >
                          {t.origin.tznkLinkLabel}
                        </a>
                      </div>
                    </div>

                    <div className="founder-card">
                      <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--purple-raw)' }}>
                        {t.origin.founderRole}
                      </div>
                      <h3 style={{ marginTop: '4px' }}>{t.origin.founderName}</h3>
                      <p style={{ margin: '10px 0 14px', fontSize: '0.94rem', color: 'var(--ink-muted)' }}>
                        {t.origin.founderBio}
                      </p>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{t.origin.verifiedLabel}</div>
                      <div className="founder-links">
                        <a
                          href="https://facebook.com/eugenio.ec"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-chip"
                        >
                          Facebook Verified ↗
                        </a>
                        <a
                          href="https://tiktok.com/@ayachui.ec"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-chip"
                        >
                          TikTok @ayachui.ec ↗
                        </a>
                        <a
                          href="https://incatrailfoods.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-chip"
                        >
                          incatrailfoods.com ↗
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="origin-media-stack">
                    <figure className="lab-frame" style={{ margin: 0 }}>
                      <div className="lab-frame-header">
                        <span>{t.origin.packagingTag}</span>
                        <span>
                          {liveInventory?.ticker?.activeBatchCodes?.length
                            ? `QR • ${liveInventory.ticker.activeBatchCodes[0]}`
                            : 'QR • LOTE №01'}
                        </span>
                      </div>
                      <img
                        src="/images/apothecary-packaging.jpg"
                        alt={t.origin.packagingTag}
                        className="lab-frame-img"
                      />
                    </figure>

                    <figure className="lab-frame" style={{ margin: 0 }}>
                      <div className="lab-frame-header">
                        <span>{t.origin.terroirTag}</span>
                        <span>900–1,362 m</span>
                      </div>
                      <img
                        src="/images/zamora-origin.jpg"
                        alt={t.origin.terroirTag}
                        className="lab-frame-img"
                        style={{ aspectRatio: '16 / 9' }}
                      />
                    </figure>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 7: Trust, Payments & Compact B2B Teaser */}
            <section className="section section-compact">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.trust.eyebrow}</p>
                  <h2>{t.trust.title}</h2>
                </div>

                <div className="trust-grid">
                  <div className="trust-card">
                    <h3>{t.trust.shippingTitle}</h3>
                    <p style={{ margin: '10px 0 0', color: 'var(--ink-muted)' }}>
                      {t.trust.shippingDesc}
                    </p>
                  </div>

                  <div className="trust-card">
                    <h3>{t.trust.paymentsTitle}</h3>
                    <div className="payment-rows">
                      {t.trust.paymentsList.map((p) => (
                        <div key={p.method} className="payment-row">
                          <div className="mono" style={{ fontSize: '0.88rem', color: 'var(--purple-raw)' }}>
                            {p.method}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--ink-muted)' }}>{p.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Compact B2B / 5 Bean Challenge Pointer (Separated cleanly from retail) */}
                <div className="b2b-teaser-banner">
                  <div>
                    <div className="mono b2b-teaser-eyebrow">{t.b2bTeaser.eyebrow}</div>
                    <h3 className="b2b-teaser-title">{t.b2bTeaser.title}</h3>
                    <p className="b2b-teaser-desc">{t.b2bTeaser.desc}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={() => navigateView('b2b')}
                  >
                    {t.b2bTeaser.cta}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <BrandLogo
              inverted
              showParentLink
              parentPrefix={t.common.parentPrefix}
              onNavigateHome={viewMode === 'b2b' ? () => navigateView('storefront') : undefined}
            />
            <p style={{ margin: '14px 0 0', fontSize: '0.88rem', color: 'var(--chrome-silver)' }}>
              {t.footer.address}
            </p>
          </div>

          <div className="footer-meta">
            <div>{t.footer.ecosystem}</div>
            <div className="footer-links">
              <a
                href={buildWhatsAppUrl(generalWhatsAppMsg)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Business
              </a>
              <button
                type="button"
                className="footer-admin-btn"
                onClick={() => navigateView('b2b')}
              >
                {t.footer.b2bLink}
              </button>
              <a href="https://facebook.com/eugenio.ec" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="https://tiktok.com/@ayachui.ec" target="_blank" rel="noopener noreferrer">
                TikTok
              </a>
              <a href="https://incatrailfoods.com" target="_blank" rel="noopener noreferrer">
                The Inca Trail Foods
              </a>
              <a href="https://incatrailfoods.com/products" target="_blank" rel="noopener noreferrer">
                Cacao Reserve B2B
              </a>
              <button
                type="button"
                className="footer-admin-btn"
                onClick={() => setAdminModalOpen(true)}
              >
                Admin (Base L2)
              </button>
            </div>
            <div className="mono" style={{ fontSize: '0.75rem', marginTop: '6px' }}>
              {t.footer.rights}
            </div>
          </div>
        </div>
      </footer>

      {/* LAYER 2 MODAL 1: SKU Spec & Nutrition Sheet */}
      <ModalDrawer
        open={Boolean(specModalSku)}
        onClose={() => setSpecModalSkuId(null)}
        eyebrow={specModalSku?.code}
        title={specModalSku?.name || ''}
        closeLabel={t.common.closeModal}
        wide
      >
        {specModalSku ? (
          <div className="spec-modal-content">
            <p className="spec-modal-intro">
              <strong>{specModalSku.cacaoPercent}</strong> — {specModalSku.shortBenefit}
            </p>

            <div className="sku-drawer-grid">
              <div>
                <h4 className="mono spec-table-heading">{t.shop.ingredientsTitle}</h4>
                <table className="spec-table">
                  <tbody>
                    {specModalSku.ingredients.map((ing) => (
                      <tr key={ing.name}>
                        <td style={{ fontWeight: 600, width: '38%' }}>{ing.name}</td>
                        <td className="mono" style={{ width: '16%', color: 'var(--purple-raw)' }}>
                          {ing.share}
                        </td>
                        <td style={{ color: 'var(--ink-muted)' }}>{ing.functionDesc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 className="mono spec-table-heading">
                  {t.shop.nutritionTitle} ({specModalSku.servingLabel})
                </h4>
                <table className="spec-table">
                  <thead>
                    <tr>
                      <th>{lang === 'es' ? 'Nutriente' : 'Nutrient'}</th>
                      <th>{t.shop.col100g}</th>
                      <th>{t.shop.colServing}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specModalSku.nutrition.map((row) => (
                      <tr key={row.label}>
                        <td>{row.label}</td>
                        <td className="mono">{row.per100g}</td>
                        <td className="mono" style={{ color: 'var(--purple-raw)' }}>
                          {row.perServing}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="spec-modal-cta">
              <WhatsAppAction
                label={`${t.shop.orderBlockCta} (${packWeight} — ${specModalSku.prices[packWeight]})`}
                message={
                  lang === 'es'
                    ? `Hola ORO PÚRPURA, quiero pedir ${specModalSku.name} en formato ${packWeight} (${specModalSku.prices[packWeight]} USD). Mi ciudad es: `
                    : `Hi ORO PÚRPURA, I want to order ${specModalSku.name} in ${packWeight} format (${specModalSku.prices[packWeight]} USD). My city is: `
                }
                copyLabel={t.common.copyText}
                copiedLabel={t.common.copied}
                fullWidth
              />
            </div>
          </div>
        ) : null}
      </ModalDrawer>

      {/* LAYER 2 MODAL 2: Batch Traceability Passport */}
      <ModalDrawer
        open={Boolean(traceModalSku)}
        onClose={() => setTraceModalSkuId(null)}
        eyebrow={lang === 'es' ? 'PASAPORTE DIGITAL DE LOTE' : 'DIGITAL BATCH PASSPORT'}
        title={traceModalSku ? `${traceModalSku.name} — ${t.shop.openPassportLabel}` : ''}
        closeLabel={t.common.closeModal}
        wide
      >
        {traceModalSku ? (
          <TraceabilityPassport
            lang={lang}
            availability={liveInventory?.skus?.[traceModalSku.id as OroSkuId]}
            initialBatchCode={urlBatchCode}
          />
        ) : null}
      </ModalDrawer>

      {/* LAYER 2 MODAL 3: Full Science & Lab Comparison Dossier */}
      <ModalDrawer
        open={Boolean(scienceModalTab)}
        onClose={() => setScienceModalTab(null)}
        eyebrow={t.conflict.eyebrow}
        title={t.science.modalTitle}
        closeLabel={t.common.closeModal}
        wide
      >
        {scienceModalTab ? (
          <div>
            <div className="modal-tabs-row" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={scienceModalTab === 'cascade'}
                className={`modal-tab-btn ${scienceModalTab === 'cascade' ? 'active' : ''}`}
                onClick={() => setScienceModalTab('cascade')}
              >
                {t.science.tabCascade}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={scienceModalTab === 'circuits'}
                className={`modal-tab-btn ${scienceModalTab === 'circuits' ? 'active' : ''}`}
                onClick={() => setScienceModalTab('circuits')}
              >
                {t.science.tabCircuits}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={scienceModalTab === 'table'}
                className={`modal-tab-btn ${scienceModalTab === 'table' ? 'active' : ''}`}
                onClick={() => setScienceModalTab('table')}
              >
                {t.science.tabTable}
              </button>
            </div>

            {scienceModalTab === 'cascade' ? (
              <div>
                <h4 className="mono modal-subhead">{t.science.cascadeTitle}</h4>
                <div className="cascade-grid" style={{ marginBottom: 0 }}>
                  {t.science.cascadeCards.map((card) => (
                    <div key={card.dp} className="cascade-card">
                      <div className="cascade-dp">{card.dp}</div>
                      <h3>{card.name}</h3>
                      <div className="cascade-window">{card.window}</div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                        {card.mechanism}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {scienceModalTab === 'circuits' ? (
              <div>
                <h4 className="mono modal-subhead">{t.science.synergyTitle}</h4>
                <p style={{ margin: '0 0 16px', color: 'var(--ink-muted)', fontSize: '0.94rem' }}>
                  {t.science.synergySubtitle}
                </p>
                <div className="contours-grid">
                  {t.science.contours.map((contour) => (
                    <div key={contour.code} className="contour-card">
                      <div className="mono" style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
                        {contour.code}
                      </div>
                      <h3 style={{ marginTop: '4px' }}>{contour.title}</h3>
                      <div className="contour-actives">{contour.actives}</div>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>{contour.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {scienceModalTab === 'table' ? (
              <div>
                <div className="conflict-thesis">{t.conflict.thesis}</div>
                <div className="comparison-table-wrap">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>{t.conflict.colParam}</th>
                        <th>{t.conflict.colConventional}</th>
                        <th className="col-oro">{t.conflict.colOro}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.conflict.rows.map((row) => (
                        <tr key={row.param}>
                          <td className="col-param">{row.param}</td>
                          <td className="col-conv" data-label={t.conflict.colConventional}>
                            {row.conventional}
                          </td>
                          <td className="col-oro" data-label={t.conflict.colOro}>
                            <div>{row.oro}</div>
                            <span className="delta-tag">{row.deltaTag}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </ModalDrawer>

      <OroAdminModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onChanged={() => void fetchInventory()}
      />
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { BrandLogo } from './components/BrandLogo';
import { LiveLotShowcase } from './components/LiveLotShowcase';
import { WhatsAppAction } from './components/WhatsAppAction';
import { CONTENT } from './data/content';
import rawInventory from './data/inventory.json';
import type { InventoryData, Lang } from './types/inventory';
import { fetchInventoryOverride } from './utils/inventorySync';
import {
  buildB2BWhatsAppMessage,
  buildGeneralWhatsAppMessage,
  buildWhatsAppUrl,
} from './utils/whatsapp';

const INITIAL_INVENTORY = rawInventory as InventoryData;

type PageView = 'home' | 'storefront';

function detectInitialPage(): PageView {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/bloques') || path.startsWith('/tienda') || path.startsWith('/shop')) {
    return 'storefront';
  }
  return 'home';
}

export function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [page, setPage] = useState<PageView>(detectInitialPage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryData>(INITIAL_INVENTORY);

  const t = CONTENT[lang];

  useEffect(() => {
    const controller = new AbortController();
    void fetchInventoryOverride(INITIAL_INVENTORY, controller.signal).then(({ data }) => {
      setInventory(data);
    });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setPage(detectInitialPage());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      page === 'storefront' ? `${t.showcase.title} — ORO PÚRPURA` : t.meta.title;
  }, [lang, page, t.meta.title, t.showcase.title]);

  const navigateTo = (nextPage: PageView, anchorId?: string) => {
    setPage(nextPage);
    setMobileMenuOpen(false);
    const targetPath = nextPage === 'storefront' ? '/bloques' : '/';
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    if (anchorId && nextPage === 'home') {
      window.setTimeout(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeLots = inventory.lots.filter((lot) => lot.active);
  const totalAvailableBlocks = activeLots.reduce(
    (sum, lot) => sum + lot.blocks.filter((block) => block.status === 'disponible').length,
    0,
  );

  const generalWaMessage = buildGeneralWhatsAppMessage(lang);
  const b2bWaMessage = buildB2BWhatsAppMessage(
    lang,
    inventory.config.b2bPricePerKgUsd,
    inventory.config.b2bMinKgPerMonth,
  );

  const tickerCountLabel =
    totalAvailableBlocks > 0
      ? `${totalAvailableBlocks} ${
          totalAvailableBlocks === 1 ? t.ticker.blockSingular : t.ticker.blockPlural
        }`
      : t.ticker.soldOutLabel;

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    anchorId: string,
  ) => {
    if (page === 'storefront') {
      e.preventDefault();
      navigateTo('home', anchorId);
    } else {
      setMobileMenuOpen(false);
    }
  };

  const openStorefront = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigateTo('storefront');
  };

  return (
    <div id="top" className={page === 'home' ? 'has-floating-cta' : ''}>
      {/* SECTION 0: Top Micro-Lot Ticker */}
      <div className="batch-ticker" role="region" aria-label="Lot Status">
        <div className="batch-ticker-inner">
          <span className="ticker-stream">{t.ticker.text}</span>
          <a href="/bloques" className="ticker-stock" onClick={openStorefront}>
            <span className="ticker-pulse" aria-hidden="true" />
            <span>{t.ticker.availablePrefix}</span>
            <strong>{tickerCountLabel}</strong>
          </a>
        </div>
      </div>

      {/* SECTION 0B: Sticky Header */}
      <header className="site-header">
        <div className="container header-inner">
          <BrandLogo
            showParentLink
            parentPrefix={t.common.parentPrefix}
            onNavigateHome={page === 'storefront' ? () => navigateTo('home') : undefined}
          />

          <nav className="header-nav" aria-label="Primary">
            <a
              href="/bloques"
              className={`nav-shop-link ${page === 'storefront' ? 'active' : ''}`}
              onClick={openStorefront}
            >
              {t.nav.blocks}
            </a>
            <a href="#como-usar" onClick={(e) => handleAnchorClick(e, 'como-usar')}>
              {t.nav.howToUse}
            </a>
            <a href="#ciencia" onClick={(e) => handleAnchorClick(e, 'ciencia')}>
              {t.nav.science}
            </a>
            <a href="#origen" onClick={(e) => handleAnchorClick(e, 'origen')}>
              {t.nav.origin}
            </a>
            <a
              href="#b2b"
              className="nav-b2b-pill"
              onClick={(e) => handleAnchorClick(e, 'b2b')}
            >
              {t.nav.b2b}
            </a>
          </nav>

          <div className="header-controls">
            <div className="lang-switch" role="group" aria-label="Language">
              <button
                type="button"
                className={`lang-btn ${lang === 'es' ? 'active' : ''}`}
                onClick={() => setLang('es')}
                aria-pressed={lang === 'es'}
              >
                ES
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
            </div>

            <a
              href={buildWhatsAppUrl(inventory.config.whatsappPhone, generalWaMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="header-wa-cta"
            >
              <span className="wa-dot" aria-hidden="true" />
              <span>{t.nav.whatsappDirect}</span>
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
            <a href="/bloques" className="mobile-shop-link" onClick={openStorefront}>
              {t.nav.blocks} ({totalAvailableBlocks}) →
            </a>
            <a href="#como-usar" onClick={(e) => handleAnchorClick(e, 'como-usar')}>
              {t.nav.howToUse}
            </a>
            <a href="#ciencia" onClick={(e) => handleAnchorClick(e, 'ciencia')}>
              {t.nav.science}
            </a>
            <a href="#origen" onClick={(e) => handleAnchorClick(e, 'origen')}>
              {t.nav.origin}
            </a>
            <a
              href="#b2b"
              className="mobile-b2b-link"
              onClick={(e) => handleAnchorClick(e, 'b2b')}
            >
              {t.nav.b2b} →
            </a>
            <div className="mobile-drawer-cta">
              <WhatsAppAction
                phone={inventory.config.whatsappPhone}
                label={t.nav.whatsappDirect}
                message={generalWaMessage}
                copyLabel={t.common.copyText}
                copiedLabel={t.common.copied}
                fullWidth
              />
            </div>
          </div>
        )}
      </header>

      <main>
        {page === 'storefront' ? (
          <LiveLotShowcase
            lang={lang}
            t={t}
            config={inventory.config}
            lots={inventory.lots}
            onBackToHome={() => navigateTo('home')}
          />
        ) : (
          <>
            {/* SECTION 1: Hero — Living Monoliths Monoproduct */}
            <section className="hero-section">
              <div className="container hero-grid">
                <div>
                  <p className="eyebrow">{t.hero.eyebrow}</p>
                  <h1>{t.hero.h1}</h1>
                  <p className="hero-subtitle">{t.hero.subtitle}</p>

                  <div className="hero-cta-row">
                    <a
                      href="/bloques"
                      className="btn btn-primary"
                      onClick={openStorefront}
                    >
                      {t.hero.ctaPrimary}
                    </a>
                    <a href="#como-usar" className="btn btn-secondary">
                      {t.hero.ctaSecondary}
                    </a>
                  </div>

                  <div className="telemetry-box">
                    <div className="telemetry-header mono">{t.hero.telemetryTitle}</div>
                    <div className="telemetry-strip">
                      {t.hero.telemetry.map((item) => (
                        <div className="telemetry-cell" key={item.value}>
                          <div className="telemetry-value mono">{item.value}</div>
                          <div className="telemetry-label">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Visual: Laboratory Diptych */}
                <div className="hero-diptych">
                  <figure className="lab-frame">
                    <div className="lab-frame-header">
                      <span>{t.hero.diptychLeftTag}</span>
                      <span>{t.hero.diptychLeftMeta}</span>
                    </div>
                    <img
                      src="/images/glassy-fracture.jpg"
                      alt={t.hero.diptychLeftCaption}
                      className="lab-frame-img"
                    />
                    <figcaption className="lab-frame-caption">
                      {t.hero.diptychLeftCaption}
                    </figcaption>
                  </figure>

                  <figure className="lab-frame">
                    <div className="lab-frame-header">
                      <span>{t.hero.diptychRightTag}</span>
                      <span>{t.hero.diptychRightMeta}</span>
                    </div>
                    <img
                      src="/images/knife-shavings-scale.jpg"
                      alt={t.hero.diptychRightCaption}
                      className="lab-frame-img"
                    />
                    <figcaption className="lab-frame-caption">
                      {t.hero.diptychRightCaption}
                    </figcaption>
                  </figure>
                </div>
              </div>
            </section>

            {/* SECTION 2: How to Use — Knife Shaving Ritual (Virutas) */}
            <section id="como-usar" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.howToUse.eyebrow}</p>
                  <h2>{t.howToUse.title}</h2>
                  <p className="section-subtitle">{t.howToUse.subtitle}</p>
                </div>

                <div className="doses-grid">
                  {t.howToUse.doses.map((dose, idx) => (
                    <article key={dose.amount} className="dose-card">
                      <div className="dose-card-top">
                        <span className="dose-step mono">0{idx + 1}</span>
                        <span className="dose-temp mono">{dose.tempBadge}</span>
                      </div>
                      <div className="dose-amount-row">
                        <span className="dose-amount">{dose.amount}</span>
                        <span className="dose-measure mono">{dose.measure}</span>
                      </div>
                      <h3 className="dose-title">{dose.title}</h3>
                      <p className="dose-desc">{dose.description}</p>
                    </article>
                  ))}
                </div>

                <div className="ritual-visual-grid">
                  <figure className="lab-frame">
                    <div className="lab-frame-header">
                      <span>{t.howToUse.visualLeftTag}</span>
                      <span>{t.howToUse.visualLeftMeta}</span>
                    </div>
                    <img
                      src="/images/knife-shavings-scale.jpg"
                      alt={t.howToUse.visualLeftCaption}
                      className="lab-frame-img"
                      loading="lazy"
                    />
                    <figcaption className="lab-frame-caption">
                      {t.howToUse.visualLeftCaption}
                    </figcaption>
                  </figure>

                  <figure className="lab-frame">
                    <div className="lab-frame-header">
                      <span>{t.howToUse.visualRightTag}</span>
                      <span>{t.howToUse.visualRightMeta}</span>
                    </div>
                    <img
                      src="/images/ruby-lavender-elixir.jpg"
                      alt={t.howToUse.visualRightCaption}
                      className="lab-frame-img"
                      loading="lazy"
                    />
                    <figcaption className="lab-frame-caption">
                      {t.howToUse.visualRightCaption}
                    </figcaption>
                  </figure>
                </div>

                {/* Inline Storefront CTA #1 (After Ritual) */}
                <div className="inline-buy-banner">
                  <div className="inline-buy-copy">
                    <div className="inline-buy-eyebrow mono">{t.homeCtas.afterRitualEyebrow}</div>
                    <h3 className="inline-buy-title">{t.homeCtas.afterRitualTitle}</h3>
                    <p className="inline-buy-sub">{t.homeCtas.afterRitualSub}</p>
                  </div>
                  <a
                    href="/bloques"
                    className="btn btn-primary inline-buy-btn"
                    onClick={openStorefront}
                  >
                    {t.homeCtas.afterRitualBtn}
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 3: Science — Living Matrix vs. Thermal Death & DP1–DP7 */}
            <section id="ciencia" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.science.eyebrow}</p>
                  <h2>{t.science.title}</h2>
                  <p className="section-subtitle">{t.science.subtitle}</p>
                </div>

                {/* 2-Column Analytical Comparison Table */}
                <div className="comparison-table-wrap">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>{t.science.tableColMetric}</th>
                        <th>{t.science.tableColConventional}</th>
                        <th className="col-oro">{t.science.tableColOro}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.science.tableRows.map((row) => (
                        <tr key={row.metric}>
                          <td className="col-metric">{row.metric}</td>
                          <td className="col-conv" data-label={t.science.tableColConventional}>
                            {row.conventional}
                          </td>
                          <td className="col-oro" data-label={t.science.tableColOro}>
                            <div className="col-oro-value">{row.oro}</div>
                            {row.highlight && <span className="delta-tag mono">{row.highlight}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* DP1–DP7 Phenolic Cascade (Las 3 Lajas) */}
                <div className="cascade-block">
                  <div className="cascade-head">
                    <p className="eyebrow">{t.science.cascadeEyebrow}</p>
                    <h3 className="cascade-heading">{t.science.cascadeTitle}</h3>
                  </div>

                  <div className="vectors-grid">
                    {t.science.vectors.map((vector) => (
                      <article key={vector.laja} className="vector-card">
                        <div className="vector-top">
                          <span className="vector-laja mono">{vector.laja}</span>
                          <span className="vector-dp mono">{vector.dpRange}</span>
                        </div>
                        <h4 className="vector-title">{vector.title}</h4>
                        <p className="vector-desc">{vector.mechanism}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: Origin Zamora-Chinchipe, Proyecto TZNK & Founder */}
            <section id="origen" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.origin.eyebrow}</p>
                  <h2>{t.origin.title}</h2>
                </div>

                <div className="origin-grid">
                  <div className="origin-cards-col">
                    <div className="origin-card">
                      <h3>{t.origin.directTradeTitle}</h3>
                      <p className="origin-body">{t.origin.directTradeBody}</p>

                      <div className="terroir-list">
                        {t.origin.terroirPoints.map((pt) => (
                          <div key={pt.label} className="terroir-item">
                            <div className="terroir-label mono">{pt.label}</div>
                            <div className="terroir-value">{pt.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="tznk-box">
                        <div className="tznk-box-badge mono">{t.origin.tznkBadge}</div>
                        <p className="tznk-box-desc">{t.origin.tznkDesc}</p>
                        <a
                          href="https://tzunki.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="tznk-link mono"
                        >
                          {t.origin.tznkLinkLabel}
                        </a>
                      </div>
                    </div>

                    <div className="founder-card">
                      <div className="founder-role mono">{t.origin.founderRole}</div>
                      <h3 className="founder-name">{t.origin.founderName}</h3>
                      <p className="founder-bio">{t.origin.founderBio}</p>
                      <div className="founder-channels-label">{t.origin.verifiedChannelsLabel}</div>

                      <div className="founder-links">
                        <a
                          href="https://facebook.com/eugenio.ec"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-chip"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.1 14.5l-3.7-3.7 1.4-1.4 2.3 2.3 5.1-5.1 1.4 1.4-6.5 6.5z"
                              fill="#1877F2"
                            />
                          </svg>
                          <span>Facebook @eugenio.ec ↗</span>
                        </a>

                        <a
                          href="https://tiktok.com/@ayachui.ec"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-chip"
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.87a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.3z" />
                          </svg>
                          <span>TikTok @ayachui.ec ↗</span>
                        </a>

                        <a
                          href="https://incatrailfoods.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-chip"
                        >
                          <span>incatrailfoods.com ↗</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="origin-media-stack">
                    <figure className="lab-frame">
                      <div className="lab-frame-header">
                        <span>{t.origin.packagingTag}</span>
                        <span>{t.origin.packagingMeta}</span>
                      </div>
                      <img
                        src="/images/apothecary-packaging.jpg"
                        alt={t.origin.packagingCaption}
                        className="lab-frame-img"
                        loading="lazy"
                      />
                      <figcaption className="lab-frame-caption">
                        {t.origin.packagingCaption}
                      </figcaption>
                    </figure>

                    <figure className="lab-frame">
                      <div className="lab-frame-header">
                        <span>{t.origin.terroirTag}</span>
                        <span>{t.origin.terroirMeta}</span>
                      </div>
                      <img
                        src="/images/zamora-origin.jpg"
                        alt={t.origin.terroirCaption}
                        className="lab-frame-img lab-frame-img-wide"
                        loading="lazy"
                      />
                      <figcaption className="lab-frame-caption">
                        {t.origin.terroirCaption}
                      </figcaption>
                    </figure>
                  </div>
                </div>

                {/* Inline Storefront CTA #2 (After Origin & Trust) */}
                <div className="inline-buy-banner">
                  <div className="inline-buy-copy">
                    <div className="inline-buy-eyebrow mono">{t.homeCtas.afterOriginEyebrow}</div>
                    <h3 className="inline-buy-title">{t.homeCtas.afterOriginTitle}</h3>
                    <p className="inline-buy-sub">{t.homeCtas.afterOriginSub}</p>
                  </div>
                  <a
                    href="/bloques"
                    className="btn btn-primary inline-buy-btn"
                    onClick={openStorefront}
                  >
                    {t.homeCtas.afterOriginBtn}
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 5: Compact B2B Partnership Block (Obsidian Slate #121016) */}
            <section id="b2b" className="section section-dark b2b-section">
              <div className="container">
                <div className="b2b-grid">
                  <div className="b2b-copy">
                    <p className="eyebrow eyebrow-light">{t.b2b.eyebrow}</p>
                    <h2 className="b2b-title">{t.b2b.title}</h2>
                    <p className="b2b-desc">{t.b2b.description}</p>
                  </div>

                  <div className="b2b-offer-panel">
                    <div className="b2b-kpi-grid">
                      <div className="b2b-kpi-cell">
                        <div className="b2b-kpi-value mono">{t.b2b.priceValue}</div>
                        <div className="b2b-kpi-label">{t.b2b.priceLabel}</div>
                      </div>
                      <div className="b2b-kpi-cell">
                        <div className="b2b-kpi-value mono">{t.b2b.minValue}</div>
                        <div className="b2b-kpi-label">{t.b2b.minLabel}</div>
                      </div>
                    </div>

                    <div className="b2b-cta-wrap">
                      <WhatsAppAction
                        phone={inventory.config.whatsappPhone}
                        label={t.b2b.ctaLabel}
                        message={b2bWaMessage}
                        copyLabel={t.common.copyText}
                        copiedLabel={t.common.copied}
                        variant="dark"
                        fullWidth
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: Nationwide Shipping & Local Ecuador Payments */}
            <section id="envios" className="section section-compact">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.logistics.eyebrow}</p>
                  <h2>{t.logistics.title}</h2>
                </div>

                <div className="logistics-grid">
                  <article className="logistics-card">
                    <div className="logistics-tag mono">SERVIENTREGA • 24 PROVINCIAS</div>
                    <h3>{t.logistics.shippingTitle}</h3>
                    <p className="logistics-body">{t.logistics.shippingBody}</p>
                  </article>

                  <article className="logistics-card">
                    <div className="logistics-tag mono">ECUADOR • PAGOS DIRECTOS</div>
                    <h3>{t.logistics.paymentsTitle}</h3>
                    <div className="payment-rows">
                      {t.logistics.payments.map((payment) => (
                        <div key={payment.method} className="payment-row">
                          <div className="payment-method mono">{payment.method}</div>
                          <div className="payment-detail">{payment.detail}</div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating Buy CTA Button (Visible only on Home page) */}
      {page === 'home' && (
        <a
          href="/bloques"
          className="floating-buy-cta"
          onClick={openStorefront}
          aria-label={`${t.common.floatingBuyLabel} — ${t.common.floatingBlocksCount(totalAvailableBlocks)}`}
        >
          <span className="floating-buy-dot" aria-hidden="true" />
          <span className="floating-buy-text">{t.common.floatingBuyLabel}</span>
          <span className="floating-buy-count mono">
            {t.common.floatingBlocksCount(totalAvailableBlocks)}
          </span>
          <span className="floating-buy-arrow" aria-hidden="true">
            →
          </span>
        </a>
      )}

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <BrandLogo
              inverted
              showParentLink
              parentPrefix={t.common.parentPrefix}
              onNavigateHome={page === 'storefront' ? () => navigateTo('home') : undefined}
            />
            <p className="footer-address">{t.footer.address}</p>
          </div>

          <div className="footer-meta">
            <div className="footer-ecosystem">{t.footer.ecosystem}</div>
            <div className="footer-links">
              <a href="/bloques" onClick={openStorefront}>
                {t.nav.blocks} ({totalAvailableBlocks})
              </a>
              <a
                href={buildWhatsAppUrl(inventory.config.whatsappPhone, generalWaMessage)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Business
              </a>
              <a href="https://facebook.com/eugenio.ec" target="_blank" rel="noopener noreferrer">
                Facebook (@eugenio.ec)
              </a>
              <a href="https://tiktok.com/@ayachui.ec" target="_blank" rel="noopener noreferrer">
                TikTok (@ayachui.ec)
              </a>
              <a href="https://incatrailfoods.com" target="_blank" rel="noopener noreferrer">
                incatrailfoods.com
              </a>
              <a href="https://tzunki.com" target="_blank" rel="noopener noreferrer">
                tzunki.com
              </a>
            </div>
            <div className="footer-rights mono">{t.footer.rights}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

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
      {/* SECTION 0: Compact 1-line Top Bar */}
      <div className="batch-ticker" role="region" aria-label="Lot Status">
        <div className="batch-ticker-inner">
          <span className="ticker-stream">{t.ticker.stream(totalAvailableBlocks)}</span>
          <a href="/bloques" className="ticker-stock" onClick={openStorefront}>
            <span className="ticker-pulse" aria-hidden="true" />
            <span>{t.ticker.availablePrefix}</span>
            <strong>
              {totalAvailableBlocks > 0
                ? `${totalAvailableBlocks} ${
                    totalAvailableBlocks === 1 ? t.ticker.blockSingular : t.ticker.blockPlural
                  }`
                : t.ticker.soldOutLabel}
            </strong>
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
            <a href="#diferencia" onClick={(e) => handleAnchorClick(e, 'diferencia')}>
              {t.nav.difference}
            </a>
            <a href="#beneficios" onClick={(e) => handleAnchorClick(e, 'beneficios')}>
              {t.nav.benefits}
            </a>
            <a href="#como-usar" onClick={(e) => handleAnchorClick(e, 'como-usar')}>
              {t.nav.howToUse}
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
            <a href="#diferencia" onClick={(e) => handleAnchorClick(e, 'diferencia')}>
              {t.nav.difference}
            </a>
            <a href="#beneficios" onClick={(e) => handleAnchorClick(e, 'beneficios')}>
              {t.nav.benefits}
            </a>
            <a href="#como-usar" onClick={(e) => handleAnchorClick(e, 'como-usar')}>
              {t.nav.howToUse}
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
            {/* SCREEN 1: Asymmetric Hero (45% concise copy / 55% powerful macro photo) */}
            <section className="hero-section">
              <div className="container hero-grid">
                <div className="hero-copy-col">
                  <p className="eyebrow">{t.hero.eyebrow}</p>
                  <h1>{t.hero.h1}</h1>
                  <p className="hero-subtitle">{t.hero.subtitle}</p>

                  <div className="hero-chips" role="list">
                    {t.hero.chips.map((chip) => (
                      <span key={chip} role="listitem" className="hero-chip mono">
                        {chip}
                      </span>
                    ))}
                  </div>

                  <div className="hero-cta-row">
                    <a
                      href="/bloques"
                      className="btn btn-primary"
                      onClick={openStorefront}
                    >
                      {t.hero.ctaPrimary}
                    </a>
                    <a href="#diferencia" className="btn btn-secondary">
                      {t.hero.ctaSecondary}
                    </a>
                  </div>
                </div>

                {/* Right 55%: Large High-Contrast Macro Visual */}
                <figure className="hero-visual-frame">
                  <img
                    src="/hero-oro-purpura.jpg"
                    alt={t.hero.visualAlt}
                    className="hero-visual-img"
                  />
                  <figcaption className="hero-visual-badge mono">
                    {t.hero.visualBadge}
                  </figcaption>
                </figure>
              </div>
            </section>

            {/* SCREEN 2 (on Home): Visual Contrast — Conventional Cacao vs. ORO PÚRPURA */}
            <section id="diferencia" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.difference.eyebrow}</p>
                  <h2>{t.difference.title}</h2>
                  <p className="section-subtitle">{t.difference.subtitle}</p>
                </div>

                <div className="comparison-table-wrap">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>{t.difference.colMetric}</th>
                        <th className="col-conv-head">
                          <span className="col-swatch swatch-brown" aria-hidden="true" />
                          <span>{t.difference.colConventional}</span>
                        </th>
                        <th className="col-oro">
                          <span className="col-swatch swatch-purple" aria-hidden="true" />
                          <span>{t.difference.colOro}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {t.difference.rows.map((row) => (
                        <tr key={row.metric}>
                          <td className="col-metric">{row.metric}</td>
                          <td className="col-conv" data-label={t.difference.colConventional}>
                            {row.conventional}
                          </td>
                          <td className="col-oro" data-label={t.difference.colOro}>
                            <div className="col-oro-value">{row.oro}</div>
                            {row.highlight && <span className="delta-tag mono">{row.highlight}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SCREEN 3 (on Home): Medicinal Properties & 30-Second Knife Ritual */}
            <section id="beneficios" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.benefits.eyebrow}</p>
                  <h2>{t.benefits.title}</h2>
                </div>

                {/* Part 4A: 6 Clear Health Benefit Cards */}
                <div className="benefits-grid">
                  {t.benefits.cards.map((card) => (
                    <article key={card.num} className="benefit-card">
                      <div className="benefit-top">
                        <span className="benefit-num mono">{card.num}</span>
                        <span className="benefit-tag mono">{card.tag}</span>
                      </div>
                      <h3 className="benefit-title">{card.title}</h3>
                      <p className="benefit-desc">{card.description}</p>
                    </article>
                  ))}
                </div>

                <p className="benefits-disclaimer mono">{t.benefits.disclaimer}</p>

                {/* Part 4B: Compact 3-Step Knife Ritual */}
                <div id="como-usar" className="ritual-strip-block">
                  <div className="ritual-strip-head">
                    <p className="eyebrow">{t.howToUse.eyebrow}</p>
                    <h3 className="ritual-strip-title">{t.howToUse.title}</h3>
                    <p className="ritual-strip-sub">{t.howToUse.subtitle}</p>
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
                        <h4 className="dose-title">{dose.title}</h4>
                        <p className="dose-desc">{dose.description}</p>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Inline Storefront CTA #1 */}
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

            {/* SCREEN 4 (on Home): Trust (Zamora, TZNK, Founder) + Compact B2B + Logistics */}
            <section id="origen" className="section">
              <div className="container">
                <div className="section-header">
                  <p className="eyebrow">{t.origin.eyebrow}</p>
                  <h2>{t.origin.title}</h2>
                </div>

                {/* 2-Column Trust Block */}
                <div className="trust-two-col">
                  <article className="origin-card">
                    <h3>{t.origin.zamoraTitle}</h3>
                    <p className="origin-body">{t.origin.zamoraBody}</p>
                    <div className="tznk-box">
                      <span className="tznk-box-badge mono">{t.origin.tznkBadge}</span>
                      <a
                        href="https://tzunki.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tznk-link mono"
                      >
                        {t.origin.tznkLinkLabel}
                      </a>
                    </div>
                  </article>

                  <article className="founder-card">
                    <div className="founder-role mono">{t.origin.founderRole}</div>
                    <h3 className="founder-name">{t.origin.founderName}</h3>
                    <p className="founder-bio">{t.origin.founderBio}</p>
                    <div className="founder-links">
                      <a
                        href="https://facebook.com/eugenio.ec"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-chip"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
                  </article>
                </div>

                {/* Inline Storefront CTA #2 */}
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

            {/* Compact B2B Partnership Block */}
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

            {/* Compact Logistics & Payments Strip */}
            <section className="section section-compact">
              <div className="container">
                <div className="logistics-grid">
                  <article className="logistics-card">
                    <div className="logistics-tag mono">SERVIENTREGA • 24 PROVINCIAS</div>
                    <h3>{t.logistics.shippingTitle}</h3>
                    <p className="logistics-body">{t.logistics.shippingBody}</p>
                  </article>

                  <article className="logistics-card">
                    <div className="logistics-tag mono">ECUADOR • PAGOS DIRECTOS</div>
                    <h3>{t.logistics.paymentsTitle}</h3>
                    <p className="logistics-body">{t.logistics.paymentsSummary}</p>
                  </article>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating Buy CTA Button (Home page only) */}
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

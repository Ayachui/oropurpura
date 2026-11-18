import { useCallback, useEffect, useState } from 'react';
import { BrandLogo } from './components/BrandLogo';
import { OroAdminModal } from './components/OroAdminModal';
import { TraceabilityPassport } from './components/TraceabilityPassport';
import { WhatsAppAction } from './components/WhatsAppAction';
import { CONTENT, type Lang, type PackWeight } from './data/content';
import type { OroPublicState, OroSetId, OroSkuId } from './types/liveInventory';
import { buildWhatsAppUrl } from './utils/whatsapp';

export function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<'focus' | 'energy' | 'ritual'>('focus');
  const [packWeight, setPackWeight] = useState<PackWeight>('250g');
  const [openSpecId, setOpenSpecId] = useState<string | null>('inca');
  const [liveInventory, setLiveInventory] = useState<OroPublicState | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.location.pathname.startsWith('/admin') ||
      new URLSearchParams(window.location.search).get('admin') === '1'
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

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch('/api/oropurpura/public', { cache: 'no-store' });
      if (!res.ok) return;
      const json = (await res.json()) as {
        ok?: boolean;
        state?: OroPublicState;
      } & Partial<OroPublicState>;
      if (!json.ok) return;
      if (json.state) {
        setLiveInventory(json.state);
      } else if (json.skus && json.sets && json.ticker) {
        setLiveInventory({
          generatedAt: json.generatedAt ?? Date.now(),
          skus: json.skus,
          sets: json.sets,
          ticker: json.ticker,
        });
      }
    } catch {
      // Graceful fallback to static catalog when API is unreachable
    }
  }, []);

  useEffect(() => {
    void fetchInventory();
  }, [fetchInventory]);

  useEffect(() => {
    if (!urlBatchCode || !liveInventory) return;
    const skuIds: OroSkuId[] = ['inca', 'andean', 'guayusa'];
    for (const id of skuIds) {
      const sku = liveInventory.skus[id];
      const matched =
        sku?.activeBatches?.some((b) => b.batchCode === urlBatchCode) ||
        sku?.primaryBatch?.batchCode === urlBatchCode;
      if (matched) {
        setOpenSpecId(id);
        const el = document.getElementById(`sku-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      }
    }
  }, [urlBatchCode, liveInventory]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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

      {/* SECTION 0B: Sticky Header */}
      <header className="site-header">
        <div className="container header-inner">
          <BrandLogo />

          <nav className="header-nav" aria-label="Primary">
            <a href="#why">{t.nav.why}</a>
            <a href="#calibrator">{t.nav.calibrator}</a>
            <a href="#shop">{t.nav.shop}</a>
            <a href="#science">{t.nav.science}</a>
            <a href="#origin">{t.nav.origin}</a>
            <a href="#b2b">{t.nav.b2b}</a>
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
            <a href="#why" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.why}
            </a>
            <a href="#calibrator" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.calibrator}
            </a>
            <a href="#shop" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.shop}
            </a>
            <a href="#science" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.science}
            </a>
            <a href="#origin" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.origin}
            </a>
            <a href="#b2b" onClick={() => setMobileMenuOpen(false)}>
              {t.nav.b2b}
            </a>
            <div style={{ paddingTop: '10px' }}>
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
        {/* SECTION 1: Hero */}
        <section className="hero-section">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">{t.hero.eyebrow}</p>
              <h1>
                {t.hero.h1Prefix}
                {t.hero.h1Number}
                {t.hero.h1Rest}
              </h1>
              <p className="hero-subtitle">{t.hero.subtitle}</p>

              <div className="hero-hook-box">
                <div className="hero-hook-lead">{t.hero.hookLead}</div>
                <div className="hero-hook-list">
                  {t.hero.hookPillars.map((pillar) => (
                    <div className="hero-hook-item" key={pillar.code}>
                      <span className="hero-hook-code">{pillar.code}</span>
                      <span>{pillar.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-cta-row">
                <a href="#shop" className="btn btn-primary">
                  {t.hero.ctaPrimary}
                </a>
                <a href="#calibrator" className="btn btn-secondary">
                  {t.hero.ctaSecondary}
                </a>
              </div>

              <div className="telemetry-grid">
                {t.hero.telemetry.map((item) => (
                  <div className="telemetry-cell" key={item.value}>
                    <div className="telemetry-value">{item.value}</div>
                    <div className="telemetry-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-diptych">
              <figure className="lab-frame" style={{ margin: 0 }}>
                <div className="lab-frame-header">
                  <span>{t.hero.diptychLeftTag}</span>
                  <span>FMAD // 18 µm</span>
                </div>
                <img
                  src="/images/glassy-fracture.jpg"
                  alt={t.hero.diptychLeftCaption}
                  className="lab-frame-img"
                />
                <figcaption className="lab-frame-caption">{t.hero.diptychLeftCaption}</figcaption>
              </figure>

              <figure className="lab-frame" style={{ margin: 0 }}>
                <div className="lab-frame-header">
                  <span>{t.hero.diptychRightTag}</span>
                  <span>NO OIL FILM</span>
                </div>
                <img
                  src="/images/ruby-lavender-elixir.jpg"
                  alt={t.hero.diptychRightCaption}
                  className="lab-frame-img"
                />
                <figcaption className="lab-frame-caption">{t.hero.diptychRightCaption}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* SECTION 2: Category Conflict */}
        <section id="why" className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">{t.conflict.eyebrow}</p>
              <h2>{t.conflict.title}</h2>
            </div>

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
        </section>

        {/* SECTION 3: Interactive State & Dose Calibrator */}
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
                        onClick={() => setSelectedGoalId(goal.id)}
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
                    <h3>{activeGoal.formulaName}</h3>
                    <span
                      className="sku-pill"
                      style={{ backgroundColor: activeGoal.accentColor }}
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
                      <div className="protocol-box-label">{activeGoal.protocolPrimaryLabel}</div>
                      <div>{activeGoal.protocolPrimary}</div>
                    </div>
                    <div className="protocol-box">
                      <div className="protocol-box-label">{activeGoal.protocolSecondaryLabel}</div>
                      <div>{activeGoal.protocolSecondary}</div>
                    </div>
                  </div>

                  <ul className="biochem-list">
                    {activeGoal.biochemistry.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

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

        {/* SECTION 4: D2C Sets & Individual Blocks */}
        <section id="shop" className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">{t.shop.eyebrow}</p>
              <h2>{t.shop.title}</h2>
              <p className="section-subtitle">{t.shop.subtitle}</p>
            </div>

            <div className="subsection-bar">
              <h3 className="mono">{t.shop.setsTabTitle}</h3>
              <span className="delta-tag">{t.common.freeShippingBadge}</span>
            </div>

            <div className="sets-grid">
              {t.shop.sets.map((bundle) => {
                const setInv = liveInventory?.sets?.[bundle.id as OroSetId];
                const hasLiveSets = Boolean(liveInventory && setInv);
                const isSetPreorder = Boolean(hasLiveSets && setInv && setInv.remainingCount <= 0);
                const setCtaLabel = isSetPreorder
                  ? lang === 'es'
                    ? `Reservar Preventa ${bundle.code} (${bundle.price}) por WhatsApp`
                    : `Pre-order ${bundle.code} (${bundle.price}) via WhatsApp`
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
                          src={
                            bundle.id === 'set-01'
                              ? '/images/sku-inca-silk.jpg'
                              : bundle.id === 'set-02'
                                ? '/images/set-alquimia-bundle.jpg'
                                : '/images/apothecary-packaging.jpg'
                          }
                          alt={bundle.name}
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
                                ? `Disponible: ${setInv.remainingCount} / ${setInv.quotaTotal}`
                                : `In Stock: ${setInv.remainingCount} / ${setInv.quotaTotal}`}
                          </span>
                        ) : null}
                      </div>
                      <div className="set-header-row">
                        <div>
                          <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--ink-muted)' }}>
                            {bundle.code}
                          </div>
                          <h3>{bundle.name}</h3>
                        </div>
                        <div className="set-price">{bundle.price}</div>
                      </div>
                      <div className="set-savings">{bundle.savings}</div>

                      <ul className="set-items" style={{ marginTop: '14px' }}>
                        {bundle.items.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>

                      <div className="set-gift" style={{ marginTop: '12px' }}>
                        {bundle.gift}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
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

            {/* 4.2 Individual Blocks Configurator */}
            <div className="subsection-bar">
              <div>
                <h3>{t.shop.blocksTitle}</h3>
                <p className="section-subtitle" style={{ marginTop: '6px', fontSize: '0.95rem' }}>
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

            <div className="sku-list">
              {t.shop.skus.map((sku) => {
                const isOpen = openSpecId === sku.id;
                const currentPrice = sku.prices[packWeight];
                const skuAvail = liveInventory?.skus?.[sku.id as OroSkuId];
                const hasLiveSku = Boolean(liveInventory && skuAvail);
                const isPackInStock = skuAvail ? skuAvail.packsAvailable[packWeight] : true;
                const isSkuPreorder = hasLiveSku && !isPackInStock;
                const blockCtaLabel = isSkuPreorder
                  ? lang === 'es'
                    ? `Pre-ordenar bloque (${packWeight})`
                    : `Pre-order block (${packWeight})`
                  : `${t.shop.orderBlockCta} (${packWeight})`;
                const blockMessage = isSkuPreorder
                  ? lang === 'es'
                    ? `Hola ORO PÚRPURA, quiero reservar en PREVENTA ${sku.name} en formato ${packWeight} (${currentPrice} USD). Mi ciudad es: `
                    : `Hi ORO PÚRPURA, I want to PRE-ORDER ${sku.name} in ${packWeight} format (${currentPrice} USD). My city is: `
                  : lang === 'es'
                    ? `Hola ORO PÚRPURA, quiero pedir ${sku.name} en formato ${packWeight} (${currentPrice} USD). Mi ciudad es: `
                    : `Hi ORO PÚRPURA, I want to order ${sku.name} in ${packWeight} format (${currentPrice} USD). My city is: `;

                return (
                  <article id={`sku-${sku.id}`} key={sku.id} className={`sku-card accent-${sku.accentToken}`}>
                    <div className="sku-main">
                      <div className="sku-top">
                        <div className="sku-identity">
                          <img
                            src={
                              sku.id === 'inca'
                                ? '/images/sku-inca-silk.jpg'
                                : sku.id === 'andean'
                                  ? '/images/sku-andean-gold.jpg'
                                  : '/images/ruby-lavender-elixir.jpg'
                            }
                            alt={sku.name}
                            className="sku-thumb"
                          />
                          <div>
                            <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                              {sku.code} • {sku.cacaoPercent}
                            </div>
                            <h3 style={{ marginTop: '4px' }}>{sku.name}</h3>
                            <p style={{ margin: '6px 0 0', color: 'var(--ink-muted)', fontSize: '0.94rem' }}>
                              {sku.tagline}
                            </p>
                            {hasLiveSku && skuAvail ? (
                              <div style={{ marginTop: '8px' }}>
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
                                      ? `Disponible • ${skuAvail.totalRemainingKg} kg en lote`
                                      : `In Stock • ${skuAvail.totalRemainingKg} kg ready`}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="sku-price-block">
                          <div className="sku-price">{currentPrice}</div>
                          <div className="sku-unit">{sku.unitCost[packWeight]}</div>
                        </div>
                      </div>

                      <div className="sku-actions-row">
                        <button
                          type="button"
                          className="btn-spec-toggle"
                          aria-expanded={isOpen}
                          onClick={() => setOpenSpecId(isOpen ? null : sku.id)}
                        >
                          {isOpen ? t.shop.closeSpecLabel : t.shop.openSpecLabel}
                        </button>

                        <WhatsAppAction
                          label={blockCtaLabel}
                          message={blockMessage}
                          copyLabel={t.common.copyText}
                          copiedLabel={t.common.copied}
                          variant="compact"
                        />
                      </div>

                      <TraceabilityPassport
                        lang={lang}
                        availability={skuAvail}
                        initialBatchCode={urlBatchCode}
                      />
                    </div>

                    {isOpen && (
                      <div className="sku-drawer">
                        <div>
                          <h4 className="mono" style={{ margin: '0 0 12px', fontSize: '0.82rem' }}>
                            {t.shop.ingredientsTitle}
                          </h4>
                          <table className="spec-table">
                            <tbody>
                              {sku.ingredients.map((ing) => (
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
                          <h4 className="mono" style={{ margin: '0 0 12px', fontSize: '0.82rem' }}>
                            {t.shop.nutritionTitle} ({sku.servingLabel})
                          </h4>
                          <table className="spec-table">
                            <thead>
                              <tr>
                                <th>Nutrient</th>
                                <th>{t.shop.col100g}</th>
                                <th>{t.shop.colServing}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sku.nutrition.map((row) => (
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
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 5: Science & Synergy */}
        <section id="science" className="section">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">{t.science.eyebrow}</p>
              <h2>{t.science.title}</h2>
              <p className="section-subtitle">{t.science.subtitle}</p>
            </div>

            <h3 className="mono" style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
              {t.science.cascadeTitle}
            </h3>
            <div className="cascade-grid">
              {t.science.cascadeCards.map((card) => (
                <div key={card.dp} className="cascade-card">
                  <div className="cascade-dp">{card.dp}</div>
                  <h3>{card.name}</h3>
                  <div className="cascade-window">{card.window}</div>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--ink-muted)' }}>
                    {card.mechanism}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="mono" style={{ marginBottom: '6px', fontSize: '0.88rem' }}>
              {t.science.synergyTitle}
            </h3>
            <p style={{ margin: '0 0 18px', color: 'var(--ink-muted)' }}>{t.science.synergySubtitle}</p>

            <div className="contours-grid">
              {t.science.contours.map((contour) => (
                <div key={contour.code} className="contour-card">
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                    {contour.code}
                  </div>
                  <h3 style={{ marginTop: '4px' }}>{contour.title}</h3>
                  <div className="contour-actives">{contour.actives}</div>
                  <p style={{ margin: 0, fontSize: '0.92rem' }}>{contour.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: Origin, Traceability & Founder */}
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

        {/* SECTION 7: B2B / HoReCa / 5–7 Bean Challenge */}
        <section id="b2b" className="section section-dark">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow eyebrow-light">{t.b2b.eyebrow}</p>
              <h2>{t.b2b.title}</h2>
              <p className="section-subtitle">{t.b2b.subtitle}</p>
            </div>

            <div className="b2b-grid">
              <div className="b2b-panel">
                <h3 className="mono" style={{ fontSize: '0.9rem', color: 'var(--chrome-silver)' }}>
                  {t.b2b.wholesaleTitle}
                </h3>
                <ul className="b2b-list">
                  {t.b2b.wholesalePoints.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </div>

              <div className="b2b-panel">
                <h3 className="mono" style={{ fontSize: '0.9rem', color: 'var(--chrome-silver)' }}>
                  {t.b2b.challengeTitle}
                </h3>
                <p style={{ margin: '12px 0 0', color: 'var(--chrome-silver)', fontSize: '0.94rem' }}>
                  {t.b2b.challengeDesc}
                </p>

                <div className="phases-grid">
                  {t.b2b.phases.map((ph) => (
                    <div key={ph.step} className="phase-box">
                      <div className="phase-step">{ph.step}</div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{ph.title}</div>
                      <div style={{ fontSize: '0.84rem', color: 'var(--chrome-silver)' }}>{ph.detail}</div>
                    </div>
                  ))}
                </div>

                <WhatsAppAction
                  label={t.b2b.ctaLabel}
                  message={t.b2b.whatsappMessage}
                  copyLabel={t.common.copyText}
                  copiedLabel={t.common.copied}
                  variant="dark"
                  fullWidth
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: Trust & Local Ecuador Payments */}
        <section className="section">
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <BrandLogo inverted />
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

      <OroAdminModal
        open={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onChanged={() => void fetchInventory()}
      />
    </div>
  );
}

export default App;

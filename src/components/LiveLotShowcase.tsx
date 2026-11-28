import { useState } from 'react';
import type { SiteContent } from '../data/content';
import type { InventoryConfig, InventoryLot, Lang } from '../types/inventory';
import {
  LOT_CATEGORIES,
  LOT_CATEGORY_ORDER,
  extractIngredientHighlights,
  resolveLotCategory,
  resolveLotImageUrl,
} from '../utils/lotCategories';
import {
  buildBlockWhatsAppMessage,
  formatBlockPrice,
  resolveLotPricePerGram,
  resolveLotPricePerKg,
} from '../utils/whatsapp';
import { WhatsAppAction } from './WhatsAppAction';

interface LiveLotShowcaseProps {
  lang: Lang;
  t: SiteContent;
  config: InventoryConfig;
  lots: InventoryLot[];
  onBackToHome: () => void;
}

function resolveHarvestDate(date: InventoryLot['harvestDate'], lang: Lang): string {
  if (typeof date === 'string') return date;
  return date[lang];
}

export function LiveLotShowcase({
  lang,
  t,
  config,
  lots,
  onBackToHome,
}: LiveLotShowcaseProps) {
  const activeLots = lots.filter((lot) => lot.active);
  const [selectedLotId, setSelectedLotId] = useState<string>(
    () => activeLots[0]?.lotId ?? 'ALL',
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const effectiveSelectedId =
    selectedLotId === 'ALL'
      ? 'ALL'
      : activeLots.some((lot) => lot.lotId === selectedLotId)
        ? selectedLotId
        : (activeLots[0]?.lotId ?? 'ALL');

  const visibleLots =
    effectiveSelectedId === 'ALL'
      ? activeLots
      : activeLots.filter((lot) => lot.lotId === effectiveSelectedId);

  const totalAvailable = activeLots.reduce(
    (sum, lot) => sum + lot.blocks.filter((b) => b.status === 'disponible').length,
    0,
  );

  const activeCategoryIds = new Set(
    activeLots.map((lot) => resolveLotCategory(lot, config).id),
  );

  return (
    <section id="bloques" className="section storefront-page">
      <div className="container">
        <div className="storefront-page-bar">
          <button
            type="button"
            className="btn-back-home mono"
            onClick={onBackToHome}
          >
            {t.common.backToHome}
          </button>
          <span className="storefront-live-pill mono">
            <span className="status-dot-emerald" aria-hidden="true" />
            {t.ticker.availablePrefix} {totalAvailable}{' '}
            {totalAvailable === 1 ? t.ticker.blockSingular : t.ticker.blockPlural}
          </span>
        </div>

        {/* Simplified, crystal-clear storefront header */}
        <div className="showcase-top">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <p className="eyebrow">{t.showcase.eyebrow}</p>
            <h1 className="storefront-h1">{t.showcase.title}</h1>
            <p className="section-subtitle">{t.showcase.subtitle}</p>
          </div>
        </div>

        {/* STEP 1: Visual Harvest & Category Picker */}
        {activeLots.length > 0 && (
          <div className="harvest-step-block">
            <div className="harvest-step-head">
              <div>
                <span className="step-eyebrow mono">{t.showcase.step1Eyebrow}</span>
                <h2 className="step-heading">{t.showcase.step1Title}</h2>
                <p className="step-hint">{t.showcase.step1Hint}</p>
              </div>
              {activeLots.length > 1 && (
                <button
                  type="button"
                  className={`compare-all-btn mono ${effectiveSelectedId === 'ALL' ? 'active' : ''}`}
                  aria-pressed={effectiveSelectedId === 'ALL'}
                  onClick={() =>
                    setSelectedLotId((prev) =>
                      prev === 'ALL' ? (activeLots[0]?.lotId ?? 'ALL') : 'ALL',
                    )
                  }
                >
                  {t.showcase.compareAllLabel} ({activeLots.length})
                </button>
              )}
            </div>

            {/* Rarity Tier Scale Guide */}
            <div className="tier-scale-bar" aria-label={t.showcase.tierScaleLabel}>
              <span className="tier-scale-label mono">{t.showcase.tierScaleLabel}</span>
              <div className="tier-scale-items">
                {LOT_CATEGORY_ORDER.map((catId) => {
                  const meta = LOT_CATEGORIES[catId];
                  const isPresent = activeCategoryIds.has(catId);
                  return (
                    <span
                      key={catId}
                      className={`tier-scale-chip ${isPresent ? 'is-present' : 'is-muted'}`}
                      title={meta.explainer[lang]}
                    >
                      <span
                        className="tier-scale-dot"
                        style={{ background: meta.gradient }}
                        aria-hidden="true"
                      />
                      <span className="tier-scale-name">{meta.shortTag[lang]}</span>
                      <span className="tier-scale-price mono">{meta.priceRangeLabel}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Interactive Harvest Cards */}
            <div
              className="harvest-picker-grid"
              role="tablist"
              aria-label={t.showcase.step1Title}
            >
              {activeLots.map((lot) => {
                const category = resolveLotCategory(lot, config);
                const lotPricePerKg = resolveLotPricePerKg(lot, config);
                const lotPricePerGram = resolveLotPricePerGram(lot, config);
                const availBlocks = lot.blocks
                  .filter((b) => b.status === 'disponible')
                  .sort((a, b) => a.weight_g - b.weight_g);
                const minWeight = availBlocks[0]?.weight_g ?? null;
                const fromPrice =
                  minWeight !== null ? formatBlockPrice(minWeight, lotPricePerGram) : null;
                const highlights = extractIngredientHighlights(lot.formula[lang], lang, 4);
                const imageUrl = resolveLotImageUrl(lot, config);
                const isSelected =
                  effectiveSelectedId === lot.lotId || effectiveSelectedId === 'ALL';
                const isSingleSelected = effectiveSelectedId === lot.lotId;

                return (
                  <button
                    key={lot.lotId}
                    type="button"
                    role="tab"
                    aria-selected={isSingleSelected}
                    className={`harvest-card ${isSelected ? 'is-selected' : ''}`}
                    style={
                      isSelected
                        ? {
                            borderColor: category.accent,
                            boxShadow: `0 10px 26px -14px ${category.accent}88`,
                          }
                        : undefined
                    }
                    onClick={() => setSelectedLotId(lot.lotId)}
                  >
                    {/* Gradient Category Ribbon */}
                    <div
                      className="harvest-card-ribbon"
                      style={{
                        background: category.gradient,
                        color: category.textOnGradient,
                      }}
                    >
                      <span className="harvest-ribbon-tier">
                        <span className="harvest-ribbon-stars" aria-hidden="true">
                          {category.stars}
                        </span>
                        <span>{category.name[lang]}</span>
                      </span>
                      <span className="harvest-ribbon-price mono">${lotPricePerKg}/kg</span>
                    </div>

                    {/* Card Main Content */}
                    <div
                      className="harvest-card-body"
                      style={isSelected ? { background: category.softBg } : undefined}
                    >
                      <div className="harvest-card-top-row">
                        <div className="harvest-card-thumb-wrap">
                          <img
                            src={imageUrl}
                            alt={lot.title[lang]}
                            className="harvest-card-thumb"
                            loading="lazy"
                          />
                        </div>
                        <div className="harvest-card-title-col">
                          <div className="harvest-card-code-row mono">
                            <span>{lot.lotId}</span>
                            <span>·</span>
                            <span>{lot.altitude}</span>
                          </div>
                          <div className="harvest-card-title">{lot.title[lang]}</div>
                          <div className="harvest-card-origin">{lot.origin[lang]}</div>
                        </div>
                      </div>

                      {highlights.length > 0 && (
                        <div className="harvest-card-tags" aria-label={t.showcase.formulaLabel}>
                          {highlights.map((item) => (
                            <span key={item} className="harvest-tag-pill">
                              {item}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="harvest-card-footer">
                        <div className="harvest-card-stock mono">
                          <span
                            className={
                              availBlocks.length > 0
                                ? 'status-dot-emerald'
                                : 'status-dot-muted'
                            }
                            aria-hidden="true"
                          />
                          <span>{t.showcase.availableShort(availBlocks.length)}</span>
                          {fromPrice && (
                            <>
                              <span className="harvest-stock-sep">·</span>
                              <span className="harvest-from-price">
                                {t.showcase.fromPriceLabel(fromPrice)}
                              </span>
                            </>
                          )}
                        </div>

                        <span
                          className={`harvest-select-pill mono ${isSingleSelected ? 'is-active' : ''}`}
                          style={
                            isSingleSelected
                              ? {
                                  background: category.gradient,
                                  color: category.textOnGradient,
                                  borderColor: 'transparent',
                                }
                              : undefined
                          }
                        >
                          {isSingleSelected ? t.showcase.selectedBadge : t.showcase.chooseLotCta}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeLots.length === 0 ? (
          <div className="empty-lot-card">
            <p>{t.showcase.noLotsFallback}</p>
          </div>
        ) : (
          <div className="lots-stack">
            {visibleLots.map((lot) => {
              const lotTitle = lot.title[lang];
              const category = resolveLotCategory(lot, config);
              const imageUrl = resolveLotImageUrl(lot, config);
              const lotPricePerKg = resolveLotPricePerKg(lot, config);
              const lotPricePerGram = resolveLotPricePerGram(lot, config);
              const highlights = extractIngredientHighlights(lot.formula[lang], lang, 6);
              const availableBlocks = lot.blocks
                .filter((b) => b.status === 'disponible')
                .sort((a, b) => a.weight_g - b.weight_g);
              const soldBlocks = lot.blocks.filter((b) => b.status === 'vendido');
              const orderedBlocks = onlyAvailable
                ? availableBlocks
                : [...availableBlocks, ...soldBlocks];
              const starterBlockId = availableBlocks[0]?.blockId ?? null;
              const inca = lot.incaTrailLot;

              return (
                <div key={lot.lotId} className="lot-group">
                  {/* Selected Lot Hero Visual + Passport */}
                  <header className="lot-hero-card">
                    {/* Left / Top: Generated Lot Artwork */}
                    <div className="lot-hero-media">
                      <img
                        key={`${lot.lotId}-${imageUrl}`}
                        src={imageUrl}
                        alt={`${lotTitle} — ${category.name[lang]}`}
                        className="lot-hero-img lot-hero-img-reveal"
                      />
                      <div className="lot-hero-scrim" aria-hidden="true" />

                      <div className="lot-hero-top-overlay">
                        <span
                          className="lot-category-pill"
                          style={{
                            background: category.gradient,
                            color: category.textOnGradient,
                          }}
                        >
                          <span aria-hidden="true">{category.stars}</span>
                          <span>{category.name[lang]}</span>
                          <span className="lot-category-pill-sep">•</span>
                          <span className="mono">${lotPricePerKg}/kg</span>
                        </span>
                      </div>

                      <div className="lot-hero-bottom-overlay">
                        <div className="lot-hero-origin-overlay">
                          <span className="lot-hero-origin-name">{lot.origin[lang]}</span>
                          <span className="lot-hero-origin-alt mono">
                            {lot.altitude} · {resolveHarvestDate(lot.harvestDate, lang)}
                          </span>
                        </div>
                        <a
                          href={inca?.traceUrl || lot.tznk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lot-hero-trace-link mono"
                        >
                          <span className="tznk-dot" aria-hidden="true" />
                          <span>{lot.tznk.badge}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </div>

                    {/* Right / Bottom: Harvest Passport Details */}
                    <div className="lot-hero-details">
                      <div className="lot-hero-meta-top">
                        <div className="lot-passport-badges">
                          <span className="lot-id-badge">{lot.lotId}</span>
                          <span className="lot-harvest-pill mono">
                            {t.showcase.harvestLabel}: {resolveHarvestDate(lot.harvestDate, lang)}
                          </span>
                        </div>
                        <span className="lot-avail-summary mono">
                          {availableBlocks.length} / {lot.blocks.length}{' '}
                          {availableBlocks.length === 1
                            ? t.ticker.blockSingular
                            : t.ticker.blockPlural}
                        </span>
                      </div>

                      <h2 className="lot-title">{lotTitle}</h2>

                      <div
                        className="lot-tier-explainer"
                        style={{
                          background: category.softBg,
                          borderLeftColor: category.accent,
                        }}
                      >
                        <span
                          className="lot-tier-dot-inline"
                          style={{ background: category.gradient }}
                          aria-hidden="true"
                        />
                        <span>
                          <strong>{category.name[lang]}</strong> — {category.explainer[lang]}
                        </span>
                      </div>

                      <div className="lot-detail-block">
                        <div className="lot-meta-label mono">{t.showcase.tastingLabel}</div>
                        <div className="lot-meta-value">{lot.tastingNotes[lang]}</div>
                      </div>

                      <div className="lot-detail-block">
                        <div className="lot-meta-label mono">{t.showcase.formulaLabel}</div>
                        {highlights.length > 0 && (
                          <div className="lot-formula-chips">
                            {highlights.map((chip) => (
                              <span key={chip} className="lot-formula-chip">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="lot-formula-full">{lot.formula[lang]}</p>
                      </div>

                      {inca && (
                        <div className="lot-almacen-strip mono">
                          <span className="lot-almacen-k">{t.showcase.almacenLabel}:</span>
                          {inca.farmerName && <span>{inca.farmerName}</span>}
                          {inca.secondaryDryingTempC && (
                            <span>· Secado ≤ {inca.secondaryDryingTempC} °C</span>
                          )}
                          {inca.finalMoisturePercent && (
                            <span>· {inca.finalMoisturePercent}% hum.</span>
                          )}
                          {inca.mucilageBrix && <span>· {inca.mucilageBrix} °Brix</span>}
                          {inca.nftTokenId && <span>· NFT #{inca.nftTokenId}</span>}
                        </div>
                      )}

                      <div
                        className="lot-logistics-strip"
                        style={{ borderLeftColor: category.accent }}
                      >
                        <span
                          className="lot-logistics-rate mono"
                          style={{
                            background: category.gradient,
                            color: category.textOnGradient,
                          }}
                        >
                          ${lotPricePerKg}/KG
                        </span>
                        <p className="lot-logistics-text">{t.showcase.logisticsNotice}</p>
                      </div>
                    </div>
                  </header>

                  {/* STEP 2: Blocks Section Header + Availability Toggle */}
                  <div className="step2-bar">
                    <div>
                      <span className="step-eyebrow mono">{t.showcase.step2Eyebrow}</span>
                      <h3 className="step2-heading">{t.showcase.step2Title}</h3>
                    </div>

                    <div
                      className="availability-filter"
                      role="group"
                      aria-label="Filtro de disponibilidad"
                    >
                      <button
                        type="button"
                        className={`avail-filter-btn mono ${onlyAvailable ? 'active' : ''}`}
                        aria-pressed={onlyAvailable}
                        onClick={() => setOnlyAvailable(true)}
                      >
                        {t.showcase.filterAvailableOnly}
                      </button>
                      <button
                        type="button"
                        className={`avail-filter-btn mono ${!onlyAvailable ? 'active' : ''}`}
                        aria-pressed={!onlyAvailable}
                        onClick={() => setOnlyAvailable(false)}
                      >
                        {t.showcase.filterIncludeSold}
                      </button>
                    </div>
                  </div>

                  {/* Actual-Weight Blocks Grid (Available first, Sold last) */}
                  <div className="blocks-grid">
                    {orderedBlocks.map((block) => {
                      const isAvailable = block.status === 'disponible';
                      const isStarter = isAvailable && block.blockId === starterBlockId;
                      const priceFormatted = formatBlockPrice(block.weight_g, lotPricePerGram);
                      const cupsEstimate = Math.max(1, Math.round(block.weight_g / 20));
                      const waMessage = buildBlockWhatsAppMessage({
                        lang,
                        lotId: lot.lotId,
                        lotTitle,
                        blockId: block.blockId,
                        weight_g: block.weight_g,
                        priceFormatted,
                        templates: config.whatsappTemplates,
                      });

                      return (
                        <article
                          key={`${lot.lotId}-${block.blockId}`}
                          className={`block-card ${isAvailable ? 'block-available' : 'block-sold'} ${
                            isStarter ? 'block-starter' : ''
                          }`}
                        >
                          {isAvailable && (
                            <div
                              className="block-category-accent"
                              style={{ background: category.gradient }}
                              aria-hidden="true"
                            />
                          )}

                          <div className="block-card-top">
                            <span className="block-id mono">
                              {t.showcase.blockPrefix} {block.blockId}
                            </span>
                            <div className="block-top-badges">
                              {isStarter && (
                                <span
                                  className="starter-pill mono"
                                  style={{
                                    background: category.gradient,
                                    color: category.textOnGradient,
                                  }}
                                >
                                  {t.showcase.starterBadge}
                                </span>
                              )}
                              {isAvailable ? (
                                <span className="block-status-badge status-available mono">
                                  <span className="status-dot-emerald" aria-hidden="true" />
                                  {t.showcase.statusAvailable}
                                </span>
                              ) : (
                                <span className="block-status-badge status-sold mono">
                                  {t.showcase.statusSold}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="block-weight-center">
                            <div className="block-weight-figure">
                              <span>{block.weight_g}</span>
                              <span className="block-weight-unit">g</span>
                            </div>
                            <div className="block-servings">
                              {t.showcase.servingsFormat(cupsEstimate)}
                            </div>
                          </div>

                          <div className="block-price-box">
                            <div
                              className={`block-price mono ${isAvailable ? '' : 'block-price-struck'}`}
                            >
                              {priceFormatted} <span className="block-currency">USD</span>
                            </div>
                            <div className="block-shipping-note mono">
                              {isAvailable ? t.showcase.plusShipping : lot.lotId}
                            </div>
                          </div>

                          <div className="block-card-footer">
                            {isAvailable ? (
                              <WhatsAppAction
                                phone={config.whatsappPhone}
                                label={t.showcase.reserveCta}
                                message={waMessage}
                                copyLabel={t.common.copyText}
                                copiedLabel={t.common.copied}
                                variant="primary"
                                fullWidth
                                compactCopy
                              />
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sold-disabled"
                                disabled
                              >
                                {t.showcase.soldButtonLabel}
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Simple 3-step summary bar */}
        <ol className="order-steps-bar" aria-label="Cómo reservar" style={{ marginTop: '34px' }}>
          {t.showcase.steps.map((step) => (
            <li key={step} className="order-step-item mono">
              {step}
            </li>
          ))}
        </ol>

        {/* Shipping & Local Payments Reference directly on the Storefront Page */}
        <div className="storefront-logistics-block">
          <div className="logistics-grid">
            <article className="logistics-card">
              <div className="logistics-tag mono">SERVIENTREGA • 24 PROVINCIAS</div>
              <h3>
                {(lang === 'es'
                  ? config.logistics?.shippingTitleEs
                  : config.logistics?.shippingTitleEn) || t.logistics.shippingTitle}
              </h3>
              <p className="logistics-body">
                {(lang === 'es'
                  ? config.logistics?.shippingBodyEs
                  : config.logistics?.shippingBodyEn) || t.logistics.shippingBody}
              </p>
            </article>

            <article className="logistics-card">
              <div className="logistics-tag mono">ECUADOR • PAGOS DIRECTOS</div>
              <h3>
                {(lang === 'es'
                  ? config.logistics?.paymentsTitleEs
                  : config.logistics?.paymentsTitleEn) || t.logistics.paymentsTitle}
              </h3>
              <p className="logistics-body">
                {(lang === 'es'
                  ? config.logistics?.paymentsSummaryEs
                  : config.logistics?.paymentsSummaryEn) || t.logistics.paymentsSummary}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

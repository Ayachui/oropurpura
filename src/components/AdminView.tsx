import { useEffect, useState } from 'react';
import { CONTENT } from '../data/content';
import type {
  IncaTrailLotLink,
  InventoryBlock,
  InventoryData,
  InventoryLot,
  LotCategoryId,
} from '../types/inventory';
import {
  checkAdminSession,
  consumeAdminHashToken,
  hasInjectedWallet,
  openBaseAdminSso,
  readStoredAdminToken,
  signInAdminWithWallet,
  signOutAdminSession,
} from '../utils/adminAuth';
import { fetchIncaTrailLots, generateOroLotImage } from '../utils/incaTrailLots';
import {
  LOT_CATEGORIES,
  LOT_CATEGORY_ORDER,
  formatAltitudeFromMeters,
  resolveLotCategory,
  resolveLotCategoryIdByPrice,
  resolveLotImageUrl,
} from '../utils/lotCategories';
import {
  DEFAULT_WHATSAPP_TEMPLATES,
  formatBlockPrice,
  resolveLotPricePerGram,
  resolveLotPricePerKg,
} from '../utils/whatsapp';
import { downloadBlockLabelPng } from '../utils/labelPng';

interface AdminViewProps {
  inventory: InventoryData;
  onSaveInventory: (next: InventoryData) => void;
  onResetToDefault: () => void;
  onBackToHome: () => void;
  onGoToShop: () => void;
}

function parseWeightList(raw: string, extraFields: string[]): number[] {
  const fromComma = raw
    .split(/[\s,;]+/)
    .map((s) => Number.parseInt(s.replace(/[^\d]/g, ''), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  const fromFields = extraFields
    .map((s) => Number.parseInt(s.replace(/[^\d]/g, ''), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  return [...fromComma, ...fromFields];
}

export function AdminView({
  inventory,
  onSaveInventory,
  onResetToDefault,
  onBackToHome,
  onGoToShop,
}: AdminViewProps) {
  const [sessionWallet, setSessionWallet] = useState<string>('');
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [authBusy, setAuthBusy] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [walletDetected] = useState<boolean>(() => hasInjectedWallet());

  const [incaLots, setIncaLots] = useState<IncaTrailLotLink[]>([]);
  const [lotsSource, setLotsSource] = useState<'loading' | 'api' | 'empty' | 'error'>('loading');
  const [lotsError, setLotsError] = useState<string>('');
  const [lotsRefreshKey, setLotsRefreshKey] = useState<number>(0);
  const [selectedIncaId, setSelectedIncaId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [lotPricePerKgInput, setLotPricePerKgInput] = useState<string>(
    String(Math.round(inventory.config.pricePerGramUsd * 1000)),
  );
  const [categoryOverride, setCategoryOverride] = useState<LotCategoryId | 'auto'>('auto');
  const [recipeText, setRecipeText] = useState<string>(
    inventory.lots[0]?.formula.es ||
      '70% cacao púrpura vivo pelado (sin cascarilla), panela orgánica, sal marina',
  );
  const [tastingNotesInput, setTastingNotesInput] = useState<string>('');
  const [autoGenerateImage, setAutoGenerateImage] = useState<boolean>(true);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [previewPromptSummary, setPreviewPromptSummary] = useState<string>('');
  const [creatingLotBusy, setCreatingLotBusy] = useState<boolean>(false);
  const [imageGenBusy, setImageGenBusy] = useState<boolean>(false);
  const [imageGenError, setImageGenError] = useState<string>('');
  const [regenLotId, setRegenLotId] = useState<string>('');
  const [weightsCsv, setWeightsCsv] = useState<string>('');
  const [extraWeights, setExtraWeights] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Section 03: Variables & Settings state
  const [whatsappPhone, setWhatsappPhone] = useState(inventory.config.whatsappPhone);
  const [pricePerGram, setPricePerGram] = useState(String(inventory.config.pricePerGramUsd));
  const [b2bDiscount, setB2bDiscount] = useState(
    String(inventory.config.b2bDiscountPercent ?? 40),
  );
  const [b2bMinKg, setB2bMinKg] = useState(String(inventory.config.b2bMinKgPerMonth));
  const [sheetsUrl, setSheetsUrl] = useState(inventory.config.googleSheetsCsvUrl || '');

  const [tplBlockEs, setTplBlockEs] = useState(
    inventory.config.whatsappTemplates?.blockEs || DEFAULT_WHATSAPP_TEMPLATES.blockEs,
  );
  const [tplBlockEn, setTplBlockEn] = useState(
    inventory.config.whatsappTemplates?.blockEn || DEFAULT_WHATSAPP_TEMPLATES.blockEn,
  );
  const [tplB2bEs, setTplB2bEs] = useState(
    inventory.config.whatsappTemplates?.b2bEs || DEFAULT_WHATSAPP_TEMPLATES.b2bEs,
  );
  const [tplGeneralEs, setTplGeneralEs] = useState(
    inventory.config.whatsappTemplates?.generalEs || DEFAULT_WHATSAPP_TEMPLATES.generalEs,
  );

  const [shippingTitleEs, setShippingTitleEs] = useState(
    inventory.config.logistics?.shippingTitleEs || CONTENT.es.logistics.shippingTitle,
  );
  const [shippingBodyEs, setShippingBodyEs] = useState(
    inventory.config.logistics?.shippingBodyEs || CONTENT.es.logistics.shippingBody,
  );
  const [paymentsTitleEs, setPaymentsTitleEs] = useState(
    inventory.config.logistics?.paymentsTitleEs || CONTENT.es.logistics.paymentsTitle,
  );
  const [paymentsSummaryEs, setPaymentsSummaryEs] = useState(
    inventory.config.logistics?.paymentsSummaryEs || CONTENT.es.logistics.paymentsSummary,
  );
  const [paymentsSummaryEn, setPaymentsSummaryEn] = useState(
    inventory.config.logistics?.paymentsSummaryEn || CONTENT.en.logistics.paymentsSummary,
  );
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  const [pngBusyKey, setPngBusyKey] = useState<string>('');

  const handleSaveBlockPng = async (lot: InventoryLot, block: InventoryBlock) => {
    const key = `${lot.lotId}-${block.blockId}`;
    setPngBusyKey(key);
    try {
      await downloadBlockLabelPng(lot, block, inventory.config);
    } finally {
      setPngBusyKey('');
    }
  };

  useEffect(() => {
    let cancelled = false;
    const fromHash = consumeAdminHashToken();
    const saved = fromHash || readStoredAdminToken();
    void checkAdminSession(saved).then((res) => {
      if (cancelled) return;
      setSessionWallet(res.valid && res.wallet ? res.wallet : '');
      setAuthChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleWalletSignIn = async () => {
    setAuthBusy(true);
    setAuthError('');
    try {
      const result = await signInAdminWithWallet();
      setSessionWallet(result.wallet);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error de autenticación';
      if (msg !== 'NO_INJECTED_WALLET') {
        setAuthError(msg);
      }
    } finally {
      setAuthBusy(false);
    }
  };

  const handleWalletSignOut = async () => {
    await signOutAdminSession();
    setSessionWallet('');
    setAuthError('');
  };

  useEffect(() => {
    if (!sessionWallet) return;
    const controller = new AbortController();
    void fetchIncaTrailLots(controller.signal).then(({ lots, source, error }) => {
      if (controller.signal.aborted) return;
      setIncaLots(lots);
      setLotsSource(source);
      setLotsError(error || '');
      setSelectedIncaId((prev) => {
        if (prev && lots.some((l) => l.sourceBatchId === prev)) return prev;
        return lots[0]?.sourceBatchId || '';
      });
    });
    return () => controller.abort();
  }, [sessionWallet, lotsRefreshKey]);

  const handleRefreshIncaLots = () => {
    setLotsSource('loading');
    setLotsError('');
    setLotsRefreshKey((k) => k + 1);
  };

  const selectedIncaLot =
    incaLots.find((l) => l.sourceBatchId === selectedIncaId) ?? incaLots[0] ?? null;

  const parsedWeights = parseWeightList(weightsCsv, extraWeights);
  const parsedLotPricePerKg = (() => {
    const n = Number.parseFloat(lotPricePerKgInput);
    return Number.isFinite(n) && n > 0 ? n : inventory.config.pricePerGramUsd * 1000;
  })();
  const lotPricePerGramPreview = parsedLotPricePerKg / 1000;
  const resolvedCategoryId: LotCategoryId =
    categoryOverride === 'auto'
      ? resolveLotCategoryIdByPrice(parsedLotPricePerKg)
      : categoryOverride;
  const resolvedCategoryMeta = LOT_CATEGORIES[resolvedCategoryId];

  const nextLotNumber = inventory.lots.length + 1;
  const nextLotId = `LOTE #${String(nextLotNumber).padStart(2, '0')}`;

  const requestDraftLotImage = async (lotTitle: string, altitudeText: string) => {
    if (!selectedIncaLot || !recipeText.trim()) return null;
    const res = await generateOroLotImage({
      lotId: nextLotId,
      title: lotTitle,
      categoryId: resolvedCategoryId,
      categoryLabel: resolvedCategoryMeta.name.es,
      pricePerKgUsd: parsedLotPricePerKg,
      formula: recipeText.trim(),
      tastingNotes: tastingNotesInput.trim() || undefined,
      sourceBatchId: selectedIncaLot.sourceBatchId,
      almacenFallback: {
        farmerName: selectedIncaLot.farmerName,
        community: selectedIncaLot.community,
        region: selectedIncaLot.region,
        altitude: altitudeText,
        harvestDate: selectedIncaLot.harvestDate,
        thermalShockTempC: selectedIncaLot.thermalShockTempC,
        secondaryDryingTempC: selectedIncaLot.secondaryDryingTempC,
        finalMoisturePercent: selectedIncaLot.finalMoisturePercent,
        variety: selectedIncaLot.variety,
        mucilageBrix: selectedIncaLot.mucilageBrix,
        buyerStory: selectedIncaLot.buyerStory,
        notes: selectedIncaLot.notes,
      },
      adminToken: readStoredAdminToken() || undefined,
    });
    return res;
  };

  const handleGeneratePreviewImage = async () => {
    if (!selectedIncaLot || !recipeText.trim()) return;
    setImageGenBusy(true);
    setImageGenError('');
    try {
      const lotTitle = customTitle.trim() || selectedIncaLot.title;
      const altitudeText = formatAltitudeFromMeters(selectedIncaLot.altitudeM);
      const res = await requestDraftLotImage(lotTitle, altitudeText);
      if (res?.ok && res.imageUrl) {
        setPreviewImageUrl(res.imageUrl);
        setPreviewPromptSummary(res.promptSummary || '');
      } else {
        setImageGenError(res?.error || 'No se pudo generar la imagen con IA');
      }
    } finally {
      setImageGenBusy(false);
    }
  };

  const handleRegenerateExistingLotImage = async (lot: InventoryLot) => {
    setRegenLotId(lot.lotId);
    setImageGenError('');
    try {
      const lotPricePerKg = resolveLotPricePerKg(lot, inventory.config);
      const cat = resolveLotCategory(lot, inventory.config);
      const harvestStr =
        typeof lot.harvestDate === 'string' ? lot.harvestDate : lot.harvestDate.es;
      const res = await generateOroLotImage({
        lotId: lot.lotId,
        title: lot.title.es,
        categoryId: cat.id,
        categoryLabel: cat.name.es,
        pricePerKgUsd: lotPricePerKg,
        formula: lot.formula.es,
        tastingNotes: lot.tastingNotes.es,
        sourceBatchId: lot.incaTrailLot?.sourceBatchId,
        almacenFallback: {
          farmerName: lot.incaTrailLot?.farmerName,
          community: lot.incaTrailLot?.community || lot.origin.es,
          region: lot.incaTrailLot?.region || 'Zamora-Chinchipe, Ecuador',
          altitude: lot.altitude,
          harvestDate: lot.incaTrailLot?.harvestDate || harvestStr,
          thermalShockTempC: lot.incaTrailLot?.thermalShockTempC,
          secondaryDryingTempC: lot.incaTrailLot?.secondaryDryingTempC,
          finalMoisturePercent: lot.incaTrailLot?.finalMoisturePercent,
          variety: lot.incaTrailLot?.variety,
          mucilageBrix: lot.incaTrailLot?.mucilageBrix,
          buyerStory: lot.incaTrailLot?.buyerStory,
          notes: lot.incaTrailLot?.notes,
        },
        adminToken: readStoredAdminToken() || undefined,
      });

      if (res.ok && res.imageUrl) {
        onSaveInventory({
          ...inventory,
          lots: inventory.lots.map((item) =>
            item.lotId === lot.lotId
              ? {
                  ...item,
                  imageUrl: res.imageUrl,
                  imagePromptSummary: res.promptSummary || item.imagePromptSummary,
                }
              : item,
          ),
        });
        setFeedbackMsg(`✓ Imagen IA actualizada para ${lot.lotId}.`);
        window.setTimeout(() => setFeedbackMsg(''), 4500);
      } else {
        setImageGenError(`${lot.lotId}: ${res.error || 'Error al generar imagen'}`);
      }
    } finally {
      setRegenLotId('');
    }
  };

  const handleAddProduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncaLot || parsedWeights.length === 0 || !recipeText.trim() || creatingLotBusy) {
      return;
    }

    setCreatingLotBusy(true);
    setImageGenError('');

    const lotTitle = customTitle.trim() || selectedIncaLot.title;
    const lotShortNum = String(nextLotNumber).padStart(2, '0');
    const altitudeText = formatAltitudeFromMeters(selectedIncaLot.altitudeM);

    let finalImageUrl = previewImageUrl.trim();
    let finalPromptSummary = previewPromptSummary;
    let imageNote = '';

    if (!finalImageUrl && autoGenerateImage) {
      const gen = await requestDraftLotImage(lotTitle, altitudeText);
      if (gen?.ok && gen.imageUrl) {
        finalImageUrl = gen.imageUrl;
        finalPromptSummary = gen.promptSummary || '';
        imageNote = ' · imagen IA generada';
      } else {
        imageNote = ' · imagen por defecto (puedes regenerarla con IA en el listado)';
        if (gen?.error) setImageGenError(gen.error);
      }
    }

    const newBlocks: InventoryBlock[] = parsedWeights.map((w, idx) => ({
      blockId: `#${lotShortNum}-${String(idx + 1).padStart(2, '0')}`,
      weight_g: w,
      status: 'disponible',
    }));

    const notesEs =
      tastingNotesInput.trim() || 'Cacao púrpura vivo sin fermentar ni tostar';
    const notesEn =
      tastingNotesInput.trim() || 'Unfermented, unroasted living purple cacao';

    const newLot: InventoryLot = {
      lotId: nextLotId,
      active: true,
      pricePerKgUsd: parsedLotPricePerKg,
      category: resolvedCategoryId,
      imageUrl: finalImageUrl || undefined,
      imagePromptSummary: finalPromptSummary || undefined,
      title: {
        es: lotTitle,
        en: lotTitle,
      },
      origin: {
        es: selectedIncaLot.community || 'Zamora-Chinchipe, Ecuador',
        en: selectedIncaLot.community || 'Zamora-Chinchipe, Ecuador',
      },
      altitude: altitudeText,
      harvestDate: selectedIncaLot.harvestDate || 'Noviembre 2026',
      tastingNotes: {
        es: notesEs,
        en: notesEn,
      },
      formula: {
        es: recipeText.trim(),
        en: recipeText.trim(),
      },
      tznk: {
        badge: 'VERIFICADO • INCA TRAIL FOODS',
        url: selectedIncaLot.traceUrl || 'https://www.incatrailfoods.com/products',
      },
      incaTrailLot: selectedIncaLot,
      blocks: newBlocks,
    };

    onSaveInventory({
      ...inventory,
      lots: [newLot, ...inventory.lots],
    });

    setWeightsCsv('');
    setExtraWeights([]);
    setCustomTitle('');
    setTastingNotesInput('');
    setPreviewImageUrl('');
    setPreviewPromptSummary('');
    setCategoryOverride('auto');
    setCreatingLotBusy(false);
    setFeedbackMsg(
      `✓ ${newLot.lotId} (${resolvedCategoryMeta.name.es} · $${parsedLotPricePerKg}/kg) creado con ${newBlocks.length} bloques${imageNote}.`,
    );
    window.setTimeout(() => setFeedbackMsg(''), 6000);
  };

  const handleToggleBlockStatus = (lotId: string, blockId: string) => {
    const updatedLots = inventory.lots.map((lot) => {
      if (lot.lotId !== lotId) return lot;
      return {
        ...lot,
        blocks: lot.blocks.map((b) =>
          b.blockId === blockId
            ? {
                ...b,
                status: (b.status === 'disponible' ? 'vendido' : 'disponible') as
                  | 'disponible'
                  | 'vendido',
              }
            : b,
        ),
      };
    });

    onSaveInventory({
      ...inventory,
      lots: updatedLots,
    });
  };

  const handleDeleteLot = (lotId: string) => {
    onSaveInventory({
      ...inventory,
      lots: inventory.lots.filter((l) => l.lotId !== lotId),
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(inventory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authChecking || !sessionWallet) {
    return (
      <section className="section admin-page">
        <div className="container">
          <div className="storefront-page-bar">
            <button type="button" className="btn-back-home mono" onClick={onBackToHome}>
              ← Volver al inicio
            </button>
            <button type="button" className="btn-back-home mono" onClick={onGoToShop}>
              Ver tienda (/bloques) →
            </button>
          </div>

          <div
            className="admin-card"
            style={{
              maxWidth: '520px',
              margin: '48px auto',
              textAlign: 'center',
              padding: '36px 28px',
            }}
          >
            <span className="mono admin-step-tag">UNIFIED BASE L2 ADMIN AUTH</span>
            <h1 className="admin-card-title" style={{ marginTop: '10px', fontSize: '1.6rem' }}>
              Acceso restringido · Admin Oro Púrpura
            </h1>
            <p className="section-subtitle" style={{ margin: '12px auto 24px', maxWidth: '420px' }}>
              {authChecking
                ? 'Verificando sesión administrativa de Base L2...'
                : 'Conecta la misma billetera administrativa de Base L2 usada en Campo y Tzunki (rol creador o administrador) para gestionar stock, etiquetas y variables.'}
            </p>

            {!authChecking && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                {walletDetected ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={authBusy}
                    onClick={() => void handleWalletSignIn()}
                    style={{ width: '100%' }}
                  >
                    {authBusy ? 'Esperando firma de billetera...' : 'Conectar y firmar con billetera Base L2'}
                  </button>
                ) : null}

                <button
                  type="button"
                  className={walletDetected ? 'btn btn-secondary' : 'btn btn-primary'}
                  disabled={authBusy}
                  onClick={openBaseAdminSso}
                  style={{ width: '100%' }}
                >
                  {walletDetected ? 'Entrar vía Base SSO (Tzunki) ↗' : 'Iniciar sesión con Base SSO (Tzunki) ↗'}
                </button>

                {authError && (
                  <p className="mono" style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>
                    {authError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section admin-page">
      <div className="container">
        <div className="storefront-page-bar">
          <button type="button" className="btn-back-home mono" onClick={onBackToHome}>
            ← Volver al inicio
          </button>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="mono admin-source-pill">
              ● {sessionWallet.slice(0, 6)}…{sessionWallet.slice(-4)}
            </span>
            <button
              type="button"
              className="btn-back-home mono"
              onClick={() => void handleWalletSignOut()}
            >
              Cerrar sesión
            </button>
            <button type="button" className="btn-back-home mono" onClick={onGoToShop}>
              Ver tienda (/bloques) →
            </button>
          </div>
        </div>

        <div className="section-header">
          <p className="eyebrow">PANEL DE PRODUCCIÓN • ORO PÚRPURA</p>
          <h1 className="storefront-h1">Admin de Stock, Lotes y Etiquetas 10×10</h1>
          <p className="section-subtitle">
            Agrega nuevos bloques desde los lotes de Inca Trail Foods, marca bloques vendidos y
            imprime etiquetas 10×10 cm con QR de trazabilidad.
          </p>
        </div>

        {/* SECTION 1: Agregar Producción al Stock */}
        <form className="admin-card" onSubmit={handleAddProduction}>
          <div className="admin-card-head">
            <div>
              <span className="mono admin-step-tag">01 // AGREGAR PRODUCCIÓN AL STOCK</span>
              <h2 className="admin-card-title">Nuevo lote de bloques ({nextLotId})</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="mono admin-source-pill">
                {lotsSource === 'api'
                  ? `● ${incaLots.length} lotes publicados con NFT (Almacén)`
                  : lotsSource === 'loading'
                    ? 'Cargando lotes con NFT...'
                    : lotsSource === 'empty'
                      ? 'Sin lotes publicados con NFT'
                      : 'Error al conectar con Inca Trail'}
              </span>
              <button
                type="button"
                className="btn-back-home mono"
                onClick={handleRefreshIncaLots}
                disabled={lotsSource === 'loading'}
              >
                ↻ Actualizar
              </button>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="inca-lot-select" className="mono admin-label">
                1. Lote publicado con NFT (Almacén / Inca Trail Foods)
              </label>
              <select
                id="inca-lot-select"
                className="admin-input"
                value={selectedIncaId}
                onChange={(e) => setSelectedIncaId(e.target.value)}
                disabled={incaLots.length === 0}
                required
              >
                {incaLots.length === 0 ? (
                  <option value="">
                    {lotsSource === 'loading'
                      ? 'Cargando lotes publicados con NFT...'
                      : lotsSource === 'error'
                        ? 'Error al cargar lotes desde Inca Trail / Almacén'
                        : 'No hay lotes publicados con NFT en Almacén'}
                  </option>
                ) : (
                  incaLots.map((lot) => {
                    const stockTag =
                      typeof lot.availableKg === 'number'
                        ? lot.availableKg > 0
                          ? ` · ${lot.availableKg} kg disp.`
                          : ' · Distribuido (0 kg)'
                        : '';
                    return (
                      <option key={lot.sourceBatchId} value={lot.sourceBatchId}>
                        {lot.sourceBatchId} • NFT #{lot.nftTokenId} — {lot.title}
                        {lot.community ? ` (${lot.community})` : ''}
                        {stockTag}
                      </option>
                    );
                  })
                )}
              </select>

              {selectedIncaLot && (
                <div
                  className="mono"
                  style={{
                    marginTop: '6px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  <span>NFT #{selectedIncaLot.nftTokenId}</span>
                  {selectedIncaLot.farmerName && <span>· {selectedIncaLot.farmerName}</span>}
                  {selectedIncaLot.community && <span>· {selectedIncaLot.community}</span>}
                  <a
                    href={selectedIncaLot.traceUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}
                  >
                    Ver en Inca Trail ↗
                  </a>
                </div>
              )}

              {lotsSource === 'empty' && (
                <p className="mono" style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Solo aparecen lotes cerrados con NFT acuñado en Almacén y publicados en Inca Trail Foods.
                </p>
              )}
              {lotsSource === 'error' && (
                <p className="mono" style={{ marginTop: '6px', fontSize: '0.75rem', color: '#f87171' }}>
                  No se pudo cargar /api/itf/showcase ({lotsError || 'error de red'}). Pulsa Actualizar.
                </p>
              )}
            </div>

            <div className="admin-field">
              <label htmlFor="lot-price-kg" className="mono admin-label">
                2. Precio por kg de este lote ($ USD / kg)
              </label>
              <input
                id="lot-price-kg"
                type="number"
                step="1"
                min="1"
                className="admin-input mono"
                value={lotPricePerKgInput}
                onChange={(e) => setLotPricePerKgInput(e.target.value)}
                placeholder="100"
                required
              />
              <div className="admin-category-row">
                <span
                  className="admin-category-pill mono"
                  style={{
                    background: resolvedCategoryMeta.gradient,
                    color: resolvedCategoryMeta.textOnGradient,
                  }}
                >
                  {resolvedCategoryMeta.stars} {resolvedCategoryMeta.name.es} · $
                  {parsedLotPricePerKg}/kg
                </span>
                <select
                  aria-label="Categoría de rareza"
                  className="admin-input admin-category-select mono"
                  value={categoryOverride}
                  onChange={(e) =>
                    setCategoryOverride(e.target.value as LotCategoryId | 'auto')
                  }
                >
                  <option value="auto">Auto según $/kg</option>
                  {LOT_CATEGORY_ORDER.map((id) => (
                    <option key={id} value={id}>
                      {LOT_CATEGORIES[id].stars} {LOT_CATEGORIES[id].name.es} (
                      {LOT_CATEGORIES[id].priceRangeLabel})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="lot-custom-title" className="mono admin-label">
                Nombre de la partida (opcional)
              </label>
              <input
                id="lot-custom-title"
                type="text"
                className="admin-input"
                placeholder={selectedIncaLot?.title || 'Ej. Cosecha Napurak — Sinergia INCA'}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="lot-tasting-notes" className="mono admin-label">
                Notas de cata / Perfil de sabor (opcional)
              </label>
              <input
                id="lot-tasting-notes"
                type="text"
                className="admin-input"
                placeholder="Ej. Mora silvestre, flores blancas, vainilla amazónica y sal marina"
                value={tastingNotesInput}
                onChange={(e) => setTastingNotesInput(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="recipe-input" className="mono admin-label">
                3. Receta / Fórmula (copiar desde calculadora — se usa también para la imagen IA)
              </label>
              <textarea
                id="recipe-input"
                rows={3}
                className="admin-input"
                value={recipeText}
                onChange={(e) => setRecipeText(e.target.value)}
                placeholder="Pega aquí la receta exacta de la calculadora..."
                required
              />
            </div>

            {/* Artwork generation block */}
            <div className="admin-field admin-field-full">
              <div className="admin-artwork-box">
                <div className="admin-artwork-head">
                  <div>
                    <span className="mono admin-label">
                      4. Imagen artística del lote (IA · categoría + ingredientes + datos Almacén)
                    </span>
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        checked={autoGenerateImage}
                        onChange={(e) => setAutoGenerateImage(e.target.checked)}
                      />
                      <span>
                        Generar automáticamente al crear el lote si no hay vista previa
                      </span>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={!selectedIncaLot || !recipeText.trim() || imageGenBusy || creatingLotBusy}
                    onClick={() => void handleGeneratePreviewImage()}
                  >
                    {imageGenBusy
                      ? 'Generando imagen IA...'
                      : previewImageUrl
                        ? '↻ Regenerar vista previa IA'
                        : '✨ Generar vista previa ahora'}
                  </button>
                </div>

                <div className="admin-artwork-preview-row">
                  <div className="admin-artwork-thumb-box">
                    <img
                      src={previewImageUrl || resolvedCategoryMeta.fallbackImage}
                      alt="Vista previa de imagen del lote"
                      className="admin-artwork-thumb"
                    />
                    <span className="admin-artwork-thumb-tag mono">
                      {previewImageUrl ? 'IMAGEN IA LISTA' : 'FALLBACK CATEGORÍA'}
                    </span>
                  </div>
                  <div className="admin-artwork-meta">
                    <label htmlFor="lot-image-url" className="mono admin-label">
                      URL de imagen (se llena automáticamente con IA o pega una URL propia)
                    </label>
                    <input
                      id="lot-image-url"
                      type="url"
                      className="admin-input mono"
                      placeholder="Se generará automáticamente al crear el lote..."
                      value={previewImageUrl}
                      onChange={(e) => setPreviewImageUrl(e.target.value)}
                    />
                    {previewPromptSummary && (
                      <p className="mono admin-artwork-summary">
                        Contexto usado: {previewPromptSummary}
                      </p>
                    )}
                    {imageGenError && (
                      <p className="mono admin-artwork-error">{imageGenError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="weights-csv" className="mono admin-label">
                5. Gramaje de los bloques (separados por coma, ej: 178, 186, 150)
              </label>
              <div className="admin-weights-row">
                <input
                  id="weights-csv"
                  type="text"
                  className="admin-input"
                  placeholder="178, 186, 150, 340"
                  value={weightsCsv}
                  onChange={(e) => setWeightsCsv(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setExtraWeights((prev) => [...prev, ''])}
                >
                  + Campo individual
                </button>
              </div>

              {extraWeights.length > 0 && (
                <div className="admin-extra-weights">
                  {extraWeights.map((val, i) => (
                    <div key={i} className="admin-extra-weight-chip">
                      <input
                        type="number"
                        min={1}
                        className="admin-input admin-input-sm"
                        placeholder="g"
                        value={val}
                        onChange={(e) => {
                          const next = [...extraWeights];
                          next[i] = e.target.value;
                          setExtraWeights(next);
                        }}
                      />
                      <button
                        type="button"
                        className="btn-remove-sm"
                        aria-label="Quitar"
                        onClick={() =>
                          setExtraWeights((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {parsedWeights.length > 0 && (
                <div className="admin-preview-chips">
                  {parsedWeights.map((w, idx) => (
                    <span key={`${w}-${idx}`} className="admin-preview-chip mono">
                      #{String(nextLotNumber).padStart(2, '0')}-{String(idx + 1).padStart(2, '0')} •{' '}
                      {w} g • {formatBlockPrice(w, lotPricePerGramPreview)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="admin-form-footer">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                !selectedIncaLot ||
                parsedWeights.length === 0 ||
                !recipeText.trim() ||
                creatingLotBusy ||
                imageGenBusy
              }
            >
              {creatingLotBusy
                ? autoGenerateImage && !previewImageUrl
                  ? 'Generando imagen IA y creando lote...'
                  : 'Creando lote...'
                : `Agregar ${parsedWeights.length || ''} bloques al stock →`}
            </button>
            {feedbackMsg && <span className="admin-feedback mono">{feedbackMsg}</span>}
          </div>
        </form>

        {/* SECTION 2: Lista de Inventario, Vendidos & Etiquetas 10x10 */}
        <div className="admin-card" style={{ marginTop: '28px' }}>
          <div className="admin-card-head">
            <div>
              <span className="mono admin-step-tag">02 // STOCK ACTUAL Y ETIQUETAS 10×10 CM</span>
              <h2 className="admin-card-title">Todos los lotes y bloques</h2>
            </div>
            <div className="admin-tools-row">
              <button type="button" className="btn-back-home mono" onClick={handleExportJson}>
                Exportar inventory.json
              </button>
              <button type="button" className="btn-back-home mono" onClick={onResetToDefault}>
                Restaurar base
              </button>
            </div>
          </div>

          <div className="admin-lots-list">
            {inventory.lots.map((lot) => {
              const availCount = lot.blocks.filter((b) => b.status === 'disponible').length;
              const lotPricePerKg = resolveLotPricePerKg(lot, inventory.config);
              const lotPricePerGram = resolveLotPricePerGram(lot, inventory.config);
              const lotCat = resolveLotCategory(lot, inventory.config);
              const lotImg = resolveLotImageUrl(lot, inventory.config);
              const isRegenerating = regenLotId === lot.lotId;
              return (
                <div key={lot.lotId} className="admin-lot-group">
                  <div className="admin-lot-header">
                    <div className="admin-lot-title-wrap">
                      <img
                        src={lotImg}
                        alt={lot.title.es}
                        className="admin-lot-mini-thumb"
                      />
                      <div>
                        <div className="admin-lot-badges-inline">
                          <span className="lot-id-badge">{lot.lotId}</span>
                          <span
                            className="admin-category-pill mono"
                            style={{
                              background: lotCat.gradient,
                              color: lotCat.textOnGradient,
                            }}
                          >
                            {lotCat.stars} {lotCat.name.es} · ${lotPricePerKg}/kg
                          </span>
                          <span className="mono admin-lot-count">
                            ({availCount}/{lot.blocks.length} disp.)
                          </span>
                        </div>
                        <strong className="admin-lot-title">{lot.title.es}</strong>
                      </div>
                    </div>
                    <div className="admin-lot-header-actions">
                      <button
                        type="button"
                        className="btn-regen-img mono"
                        disabled={Boolean(regenLotId)}
                        onClick={() => void handleRegenerateExistingLotImage(lot)}
                      >
                        {isRegenerating ? 'Generando IA...' : '✨ Generar imagen IA'}
                      </button>
                      <button
                        type="button"
                        className="btn-delete-lot mono"
                        onClick={() => handleDeleteLot(lot.lotId)}
                      >
                        Eliminar lote
                      </button>
                    </div>
                  </div>

                  <p className="admin-lot-formula">{lot.formula.es}</p>

                  <div className="admin-blocks-table">
                    {lot.blocks.map((block) => {
                      const isAvail = block.status === 'disponible';
                      return (
                        <div
                          key={`${lot.lotId}-${block.blockId}`}
                          className={`admin-block-row ${isAvail ? '' : 'is-sold'}`}
                        >
                          <div className="admin-block-info">
                            <span className="mono admin-block-id">{block.blockId}</span>
                            <span className="admin-block-weight">{block.weight_g} g</span>
                            <span className="mono admin-block-price">
                              {formatBlockPrice(block.weight_g, lotPricePerGram)}
                            </span>
                            <span
                              className={`block-status-badge mono ${
                                isAvail ? 'status-available' : 'status-sold'
                              }`}
                            >
                              {isAvail ? 'DISPONIBLE' : 'VENDIDO'}
                            </span>
                          </div>

                          <div className="admin-block-actions">
                            <button
                              type="button"
                              className={`btn-toggle-status mono ${isAvail ? '' : 'is-sold'}`}
                              onClick={() => handleToggleBlockStatus(lot.lotId, block.blockId)}
                            >
                              {isAvail ? 'Marcar vendido' : 'Marcar disponible'}
                            </button>
                            <button
                              type="button"
                              className="btn-print-label mono"
                              disabled={pngBusyKey === `${lot.lotId}-${block.blockId}`}
                              onClick={() => void handleSaveBlockPng(lot, block)}
                            >
                              {pngBusyKey === `${lot.lotId}-${block.blockId}`
                                ? 'Guardando...'
                                : 'Guardar PNG ⬇'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* SECTION 3: Editor de Variables (WhatsApp, Precios, Mensajes, Pagos, Sheets) */}
        <form
          className="admin-card"
          style={{ marginTop: '28px' }}
          onSubmit={(e) => {
            e.preventDefault();
            const parsedGram = Number.parseFloat(pricePerGram);
            const parsedDiscount = Number.parseFloat(b2bDiscount);
            const parsedMin = Number.parseFloat(b2bMinKg);

            onSaveInventory({
              ...inventory,
              config: {
                ...inventory.config,
                whatsappPhone: whatsappPhone.replace(/[^\d]/g, '') || '593982873007',
                pricePerGramUsd:
                  Number.isFinite(parsedGram) && parsedGram > 0 ? parsedGram : 0.1,
                b2bDiscountPercent:
                  Number.isFinite(parsedDiscount) && parsedDiscount > 0 ? parsedDiscount : 40,
                b2bMinKgPerMonth:
                  Number.isFinite(parsedMin) && parsedMin > 0 ? parsedMin : 3,
                googleSheetsCsvUrl: sheetsUrl.trim(),
                whatsappTemplates: {
                  ...inventory.config.whatsappTemplates,
                  blockEs: tplBlockEs,
                  blockEn: tplBlockEn,
                  b2bEs: tplB2bEs,
                  generalEs: tplGeneralEs,
                },
                logistics: {
                  ...inventory.config.logistics,
                  shippingTitleEs,
                  shippingBodyEs,
                  paymentsTitleEs,
                  paymentsSummaryEs,
                  paymentsSummaryEn,
                },
              },
            });
            setSettingsSavedMsg('✓ Variables guardadas y aplicadas en vivo.');
            window.setTimeout(() => setSettingsSavedMsg(''), 4000);
          }}
        >
          <div className="admin-card-head">
            <div>
              <span className="mono admin-step-tag">
                03 // EDITOR DE VARIABLES (WHATSAPP, PAGOS, PRECIOS Y MENSAJES)
              </span>
              <h2 className="admin-card-title">Configuración comercial del sitio</h2>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="cfg-wa-phone" className="mono admin-label">
                Teléfono WhatsApp Business (sin +)
              </label>
              <input
                id="cfg-wa-phone"
                type="text"
                className="admin-input mono"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="593982873007"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-price-g" className="mono admin-label">
                Tarifa base por defecto ($ USD por gramo — ej: 0.10 = $100/kg)
              </label>
              <input
                id="cfg-price-g"
                type="number"
                step="0.01"
                min="0.01"
                className="admin-input mono"
                value={pricePerGram}
                onChange={(e) => setPricePerGram(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-b2b-discount" className="mono admin-label">
                Descuento B2B (%)
              </label>
              <input
                id="cfg-b2b-discount"
                type="number"
                min="1"
                max="90"
                className="admin-input mono"
                value={b2bDiscount}
                onChange={(e) => setB2bDiscount(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-b2b-min" className="mono admin-label">
                Pedido mínimo B2B (kg / mes)
              </label>
              <input
                id="cfg-b2b-min"
                type="number"
                min="1"
                className="admin-input mono"
                value={b2bMinKg}
                onChange={(e) => setB2bMinKg(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-sheets-url" className="mono admin-label">
                Google Sheets CSV URL (opcional para sincronizar stock externo)
              </label>
              <input
                id="cfg-sheets-url"
                type="url"
                className="admin-input mono"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-tpl-block-es" className="mono admin-label">
                Mensaje WhatsApp al reservar bloque (ES) — Variables: {'{blockId}'}, {'{weight_g}'},{' '}
                {'{price}'}, {'{lotId}'}, {'{lotTitle}'}
              </label>
              <textarea
                id="cfg-tpl-block-es"
                rows={2}
                className="admin-input"
                value={tplBlockEs}
                onChange={(e) => setTplBlockEs(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-tpl-block-en" className="mono admin-label">
                Mensaje WhatsApp al reservar bloque (EN)
              </label>
              <textarea
                id="cfg-tpl-block-en"
                rows={2}
                className="admin-input"
                value={tplBlockEn}
                onChange={(e) => setTplBlockEn(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-tpl-b2b-es" className="mono admin-label">
                Mensaje WhatsApp B2B (ES) — {'{b2bDiscount}'}, {'{b2bMin}'}
              </label>
              <textarea
                id="cfg-tpl-b2b-es"
                rows={2}
                className="admin-input"
                value={tplB2bEs}
                onChange={(e) => setTplB2bEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-tpl-gen-es" className="mono admin-label">
                Mensaje WhatsApp general (Header / Footer, ES)
              </label>
              <textarea
                id="cfg-tpl-gen-es"
                rows={2}
                className="admin-input"
                value={tplGeneralEs}
                onChange={(e) => setTplGeneralEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-ship-title" className="mono admin-label">
                Título de envío (ES)
              </label>
              <input
                id="cfg-ship-title"
                type="text"
                className="admin-input"
                value={shippingTitleEs}
                onChange={(e) => setShippingTitleEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-pay-title" className="mono admin-label">
                Título de pagos (ES)
              </label>
              <input
                id="cfg-pay-title"
                type="text"
                className="admin-input"
                value={paymentsTitleEs}
                onChange={(e) => setPaymentsTitleEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-ship-body" className="mono admin-label">
                Condiciones de envío Servientrega (ES)
              </label>
              <textarea
                id="cfg-ship-body"
                rows={2}
                className="admin-input"
                value={shippingBodyEs}
                onChange={(e) => setShippingBodyEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-pay-summary-es" className="mono admin-label">
                Tipos de pago aceptados (ES)
              </label>
              <textarea
                id="cfg-pay-summary-es"
                rows={2}
                className="admin-input"
                value={paymentsSummaryEs}
                onChange={(e) => setPaymentsSummaryEs(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-pay-summary-en" className="mono admin-label">
                Tipos de pago aceptados (EN)
              </label>
              <input
                id="cfg-pay-summary-en"
                type="text"
                className="admin-input"
                value={paymentsSummaryEn}
                onChange={(e) => setPaymentsSummaryEn(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-footer">
            <button type="submit" className="btn btn-primary">
              Guardar variables del sitio
            </button>
            {settingsSavedMsg && <span className="admin-feedback mono">{settingsSavedMsg}</span>}
          </div>
        </form>
      </div>
    </section>
  );
}

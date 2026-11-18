export type Lang = 'es' | 'en';
export type PackWeight = '250g' | '500g' | '1000g';

export interface CalibratorGoal {
  id: 'focus' | 'energy' | 'ritual';
  tag: string;
  title: string;
  subtitle: string;
  formulaName: string;
  skuId: 'inca' | 'andean' | 'guayusa';
  skuBadge: string;
  accentColor: string;
  prepPrimaryLabel: string;
  prepPrimary: string;
  prepSecondaryLabel: string;
  prepSecondary: string;
  plainBenefits: string[];
  biochemistry: string[];
  cupCost: string;
  cafeComparison: string;
  recommendedSet: string;
  recommendedPrice: string;
  whatsappMessage: string;
}

export interface SetBundle {
  id: 'set-01' | 'set-02' | 'set-03';
  code: string;
  name: string;
  price: string;
  cupPriceHighlight: string;
  savings: string;
  badge: string;
  image: string;
  featured?: boolean;
  items: string[];
  gift: string;
  netWeight: string;
  yieldSummary: string;
  ctaLabel: string;
  whatsappMessage: string;
}

export interface SkuNutritionRow {
  label: string;
  per100g: string;
  perServing: string;
}

export interface SkuIngredient {
  name: string;
  share: string;
  functionDesc: string;
}

export interface IndividualSku {
  id: 'inca' | 'andean' | 'guayusa';
  code: string;
  name: string;
  shortBenefit: string;
  tasteNote: string;
  accentToken: 'purple' | 'ochre' | 'ruby';
  cacaoPercent: string;
  image: string;
  prices: Record<PackWeight, string>;
  unitCost: Record<PackWeight, string>;
  servingLabel: string;
  prepHint: string;
  ingredients: SkuIngredient[];
  nutrition: SkuNutritionRow[];
}

export interface LocaleContent {
  common: {
    copyText: string;
    copied: string;
    freeShippingBadge: string;
    orderViaWa: string;
    parentPrefix: string;
    backToStorefront: string;
    closeModal: string;
  };
  ticker: {
    text: string;
    availabilityLabel: string;
    availabilityValue: string;
  };
  nav: {
    shop: string;
    calibrator: string;
    why: string;
    origin: string;
    b2b: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    originBadge: string;
    h1Main: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    proofs: Array<{ value: string; label: string }>;
    visualTab1: string;
    visualTab2: string;
    diptychLeftTag: string;
    diptychLeftCaption: string;
    diptychRightTag: string;
    diptychRightCaption: string;
  };
  why: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: Array<{ num: string; title: string; detail: string; badge: string }>;
    openLabTableLabel: string;
  };
  conflict: {
    eyebrow: string;
    title: string;
    thesis: string;
    colParam: string;
    colConventional: string;
    colOro: string;
    rows: Array<{
      param: string;
      conventional: string;
      oro: string;
      deltaTag: string;
    }>;
  };
  shop: {
    eyebrow: string;
    title: string;
    subtitle: string;
    setsTabTitle: string;
    blocksTitle: string;
    blocksSubtitle: string;
    weightLabels: Record<PackWeight, { cells: string; weightNote: string }>;
    openSpecLabel: string;
    openPassportLabel: string;
    ingredientsTitle: string;
    nutritionTitle: string;
    col100g: string;
    colServing: string;
    orderBlockCta: string;
    sets: SetBundle[];
    skus: IndividualSku[];
  };
  calibrator: {
    eyebrow: string;
    title: string;
    subtitle: string;
    step1Label: string;
    step2Label: string;
    costLabel: string;
    vsCafeLabel: string;
    recommendedLabel: string;
    biochemToggleOpen: string;
    biochemToggleClose: string;
    ctaLabel: string;
    goals: CalibratorGoal[];
  };
  science: {
    eyebrow: string;
    title: string;
    subtitle: string;
    timeline: Array<{ time: string; title: string; summary: string }>;
    openDossierLabel: string;
    modalTitle: string;
    tabCascade: string;
    tabCircuits: string;
    tabTable: string;
    cascadeTitle: string;
    cascadeCards: Array<{
      dp: string;
      name: string;
      window: string;
      mechanism: string;
    }>;
    synergyTitle: string;
    synergySubtitle: string;
    contours: Array<{
      code: string;
      title: string;
      actives: string;
      detail: string;
    }>;
  };
  origin: {
    eyebrow: string;
    title: string;
    terroirTitle: string;
    terroirPoints: Array<{ label: string; value: string }>;
    tznkBadge: string;
    tznkDesc: string;
    tznkLinkLabel: string;
    packagingTag: string;
    terroirTag: string;
    founderRole: string;
    founderName: string;
    founderBio: string;
    verifiedLabel: string;
  };
  b2bTeaser: {
    eyebrow: string;
    title: string;
    desc: string;
    cta: string;
  };
  b2b: {
    eyebrow: string;
    title: string;
    subtitle: string;
    heroTag: string;
    heroCaption: string;
    wholesaleTitle: string;
    wholesalePoints: string[];
    challengeTitle: string;
    challengeDesc: string;
    kitContentsTitle: string;
    kitContents: string[];
    phases: Array<{ step: string; title: string; detail: string }>;
    ctaLabel: string;
    whatsappMessage: string;
  };
  trust: {
    eyebrow: string;
    title: string;
    shippingTitle: string;
    shippingDesc: string;
    paymentsTitle: string;
    paymentsList: Array<{ method: string; detail: string }>;
  };
  footer: {
    address: string;
    ecosystem: string;
    b2bLink: string;
    rights: string;
  };
}

export const CONTENT: Record<Lang, LocaleContent> = {
  es: {
    common: {
      copyText: 'Copiar texto',
      copied: 'Copiado ✓',
      freeShippingBadge: 'ENVÍO GRATIS ECUADOR',
      orderViaWa: 'Pedir por WhatsApp',
      parentPrefix: 'by',
      backToStorefront: '← Volver a la vitrina D2C',
      closeModal: 'Cerrar',
    },
    ticker: {
      text: 'CACAO NACIONAL VIVO • COSECHA ZAMORA-CHINCHIPE • 0% FERMENTACIÓN • ENVÍO GRATIS ECUADOR',
      availabilityLabel: 'DISPONIBLE:',
      availabilityValue: 'EN VITRINA',
    },
    nav: {
      shop: 'Sets & Bloques',
      calibrator: '¿Para ti?',
      why: '¿Por qué Vivo?',
      origin: 'Origen',
      b2b: 'Chefs · 5 Bean Challenge',
      cta: 'WhatsApp',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE, ECUADOR • CUNA MUNDIAL DEL CACAO',
      originBadge: 'ORIGEN 5300 AÑOS',
      h1Main: 'NO ES CHOCOLATE. ES CACAO VIVO.',
      subtitle:
        'Cacao púrpura ancestral sin fermentar ni tostar, porcionado en bloques o elixir. Come un cuadro directo o bátelo en agua caliente en 30 segundos: claridad mental sostenida, cero azúcar refinada y envío gratis en Ecuador.',
      ctaPrimary: 'Ver Sets con Envío Gratis',
      ctaSecondary: '¿Cuál es para mí? (30 seg)',
      proofs: [
        { value: '0% FERMENTACIÓN', label: 'Secado al vacío (< 10 h)' },
        { value: 'EAT OR BREW', label: 'Celdas listas sin usar báscula' },
        { value: 'ENVÍO GRATIS', label: 'A las 24 provincias Ecuador' },
      ],
      visualTab1: '01 · Grano Púrpura Vivo',
      visualTab2: '02 · Elixir en Taza (75 °C)',
      diptychLeftTag: 'CUT-TEST: PÚRPURA NATIVO',
      diptychLeftCaption: 'Grano vivo sin fermentar (izq.) vs. grano marrón tostado común (centro)',
      diptychRightTag: 'BREW: 72–75 °C',
      diptychRightCaption: 'Suspensión rubí-lavanda con espuma natural y cero grasa flotante',
    },
    why: {
      eyebrow: '01 // LA DIFERENCIA EN 10 SEGUNDOS',
      title: '¿POR QUÉ SE SIENTE DISTINTO AL CHOCOLATE COMÚN?',
      subtitle:
        'El chocolate artesanal es un postre delicioso, pero el calor del tueste (140 °C) destruye hasta el 80% de los antioxidantes activos. En ORO PÚRPURA conservamos el grano vivo desde Zamora.',
      cards: [
        {
          num: '01',
          badge: '0% TUESTE • ≤ 75–80 °C',
          title: 'Púrpura real, sin quemar',
          detail:
            'Detenemos la oxidación en menos de 10 horas desde la cosecha. El interior sigue siendo púrpura pizarra con notas frutales limpias y 0% acidez de vinagre.',
        },
        {
          num: '02',
          badge: 'HASTA 10× MÁS ACTIVOS',
          title: 'Claridad sin nerviosismo',
          detail:
            'Conserva 17–19.5 mg/g de (-)-epicatequina y 2.4% de teobromina nativa para horas de enfoque sereno y mejor circulación, sin taquicardia ni bajón.',
        },
        {
          num: '03',
          badge: 'LISTO EN 30 SEGUNDOS',
          title: 'Come un cuadro o bátelo',
          detail:
            'Cada bloque viene dividido en celdas exactas para derretir en boca como snack funcional o batir en 180 ml de agua caliente sin sedimentos pesados.',
        },
      ],
      openLabTableLabel: 'Ver comparativa bioquímica completa (6 parámetros) →',
    },
    conflict: {
      eyebrow: 'DOSIER COMPARATIVO // LABORATORIO',
      title: 'MUERTE TÉRMICA VS. MATRIZ VIVA',
      thesis:
        'La fermentación y el tueste (120–145 °C) crean un postre aromático. Pero el calor oxida hasta el 80% de los flavanoles vivos y vuelve marrón el grano. En ORO PÚRPURA estabilizamos la matriz viva en <10 horas desde la cosecha Shuar.',
      colParam: 'Parámetro Bioquímico',
      colConventional: 'Chocolate Convencional / Artesanal',
      colOro: 'ORO PÚRPURA (Cacao Vivo FMAD)',
      rows: [
        {
          param: 'Procesamiento térmico',
          conventional: 'Fermentación 5–8 días + pirólisis a 120–145 °C',
          oro: '0 días de fermentación • Estabilización al vacío ≤ 75–80 °C (7–10 h)',
          deltaTag: '7–10 h desde cosecha',
        },
        {
          param: 'Corte del endospermo (Cut-Test)',
          conventional: 'Marrón terroso (taninos oxidados)',
          oro: 'Púrpura pizarra monolítico (Deep Purple)',
          deltaTag: 'Antocianinas intactas',
        },
        {
          param: '(-)-Epicatequina monomérica (DP1)',
          conventional: '1.0 – 4.8 mg/g (degradación oxidativa)',
          oro: '17.0 – 19.5 mg/g (4× a 10× más bioactivo)',
          deltaTag: 'Hasta 10× DP1',
        },
        {
          param: 'Teobromina nativa',
          conventional: '1.2 – 1.7% (lavado por lixiviación ácida)',
          oro: '2.15 – 2.40% (energía estable sin pico adrenérgico)',
          deltaTag: '2.40% máx.',
        },
        {
          param: 'Perfil de ácidos orgánicos',
          conventional: 'Alta concentración de ácido acético volátil',
          oro: '0% ácido acético • Ácidos málico y cítrico nativos',
          deltaTag: '0% vinagre',
        },
        {
          param: 'Formato y pureza',
          conventional: 'Tableta dulce / masa cruda amarga difícil de dosificar',
          oro: 'Matriz sinérgica Eat / Brew (Clean Label, 0% fumigación)',
          deltaTag: 'Eat / Brew modular',
        },
      ],
    },
    shop: {
      eyebrow: '02 // VITRINA DIRECTA (D2C)',
      title: 'ELIGE TU SET CON ENVÍO GRATIS',
      subtitle:
        'Todo pedido se confirma directo por WhatsApp en 1 minuto (sin tarjetas en formularios). Entrega a domicilio en 24–48 h vía Servientrega en todo Ecuador.',
      setsTabTitle: '3 SETS CURADOS (ENVÍO GRATIS A LAS 24 PROVINCIAS)',
      blocksTitle: 'BLOQUES Y ELIXIR INDIVIDUALES',
      blocksSubtitle:
        '¿Prefieres una sola fórmula? Selecciona el peso para ver el precio y abre la ficha técnica o el pasaporte de lote solo si lo necesitas.',
      weightLabels: {
        '250g': { cells: '1 BLOQUE × 250 g (12 × 20.8 g)', weightNote: 'Uso diario • 12 a 24 días' },
        '500g': { cells: '2 BLOQUES × 250 g (24 × 20.8 g)', weightNote: 'Dúo / Ceremonia • 24 a 48 días' },
        '1000g': { cells: '4 BLOQUES × 250 g (48 × 20.8 g)', weightNote: 'Familia / Pro • Máximo ahorro' },
      },
      openSpecLabel: 'Ficha técnica y nutrientes',
      openPassportLabel: 'Pasaporte de lote / QR',
      ingredientsTitle: 'Fórmula & Función Bioquímica',
      nutritionTitle: 'Información Nutricional Estimada',
      col100g: 'Por 100 g',
      colServing: 'Por porción',
      orderBlockCta: 'Pedir en WhatsApp',
      sets: [
        {
          id: 'set-01',
          code: 'SET 01',
          name: '«ORIGEN 5300»',
          price: '$45.00',
          cupPriceHighlight: '$1.88 / taza',
          savings: 'Ahorras $7.00 con envío incluido',
          badge: 'INICIO • DOS FÓRMULAS EN BLOQUE',
          image: '/images/set-origen-bundle.jpg',
          items: [
            'INCA Ancestral Silk — Bloque 250 g (12 celdas)',
            'Andean Gold Craft — Bloque 250 g (12 celdas)',
          ],
          gift: 'Regalo incluido: 30 g granos enteros Glassy Crunch (Test 5 Bean Challenge)',
          netWeight: '530 g neto',
          yieldSummary: '24 tazas funcionales o 48 porciones snack',
          ctaLabel: 'Pedir Set 01 · $45',
          whatsappMessage:
            'Hola ORO PÚRPURA, quiero pedir el Set 01 «Origen 5300» ($45.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'set-02',
          code: 'SET 02',
          name: '«ALQUIMIA 360°»',
          price: '$65.00',
          cupPriceHighlight: '$1.33 / taza',
          savings: 'Ahorras $11.00 con envío incluido',
          badge: '★ MÁS ELEGIDO • CICLO COMPLETO',
          image: '/images/set-alquimia-bundle.jpg',
          featured: true,
          items: [
            'INCA Ancestral Silk — Bloque 250 g (Enfoque)',
            'Andean Gold Craft — Bloque 250 g (Ritual puro)',
            'Purple Guayusa Elixir — Doypack 250 g (Energía AM)',
          ],
          gift: 'Regalo incluido: 30 g granos enteros Glassy Crunch (Test 5 Bean Challenge)',
          netWeight: '780 g neto',
          yieldSummary: '45 bebidas o hasta 65 dosis combinadas',
          ctaLabel: 'Pedir Set 02 · $65',
          whatsappMessage:
            'Hola ORO PÚRPURA, quiero pedir el Set 02 «Alquimia 360°» ($65.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'set-03',
          code: 'SET 03',
          name: '«RITUAL MENSUAL / DÚO»',
          price: '$118.00',
          cupPriceHighlight: '$1.31 / taza',
          savings: 'Ahorras $16.00 con envío incluido',
          badge: 'MÁXIMO RENDIMIENTO • PAREJAS',
          image: '/images/set-ritual-bundle.jpg',
          items: [
            'INCA Ancestral Silk — 2 bloques × 250 g (24 × 20.8 g)',
            'Andean Gold Craft — 2 bloques × 250 g (24 × 20.8 g)',
            'Purple Guayusa Elixir — Doypack 500 g (42–83 bebidas)',
          ],
          gift: 'Regalo incluido: 30 g granos enteros Glassy Crunch (Test 5 Bean Challenge)',
          netWeight: '1,530 g neto',
          yieldSummary: '90 tazas estándar o 48 dosis ceremoniales',
          ctaLabel: 'Pedir Set 03 · $118',
          whatsappMessage:
            'Hola ORO PÚRPURA, quiero pedir el Set 03 «Ritual Mensual / Dúo» ($118.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
      ],
      skus: [
        {
          id: 'inca',
          code: 'SKU 01 // ENFOQUE',
          name: 'INCA Ancestral Silk',
          shortBenefit:
            'Claridad mental profunda sin cafeína. Cacao púrpura sedoso potenciado con maca, guayusa y especias amazónicas.',
          tasteNote: 'Sabor: Especiado suave, aterciopelado, dulzor mínimo de panela orgánica.',
          accentToken: 'purple',
          cacaoPercent: '67.0% Cacao Vivo',
          image: '/images/sku-inca-silk.jpg',
          prices: { '250g': '$24.50', '500g': '$44.50', '1000g': '$80.00' },
          unitCost: {
            '250g': '$2.04 / taza (20.8 g)',
            '500g': '$1.85 / taza (20.8 g)',
            '1000g': '$1.67 / taza (20.8 g)',
          },
          servingLabel: '1 celda (20.8 g)',
          prepHint: 'Derrite 1/2 celda en boca o bate 1 celda en 180 ml de agua a 72–75 °C.',
          ingredients: [
            { name: 'Pasta viva púrpura Cacao Zamora (18–20 µm con vella)', share: '62.24%', functionDesc: 'Flavanoles DP1 (~245 mg/celda) y DP2–DP7, teobromina y fibra prebiótica.' },
            { name: 'Manteca dorada nativa prensada en frío', share: '4.79%', functionDesc: 'Fluidez lipofílica suave y cristalización estable Forma V.' },
            { name: 'Micropulverizado de panela orgánica', share: '28.29%', functionDesc: 'D-glucosa para activar transporte intestinal SGLT1.' },
            { name: 'Complejo botánico (Maca, Hibisco, Guayusa, Vainilla, Ishpingo, Pimienta, Moringa, Copaiba)', share: '4.25%', functionDesc: 'Inhibición FAAH/UGT1A9/COMT, L-teanina y agonismo CB2/TRPA1.' },
            { name: 'Sal marina cristalina', share: '0.43%', functionDesc: 'Iones Na+ para bomba SGLT1 y supresión de amargor TAS2R14/39.' },
          ],
          nutrition: [
            { label: 'Energía', per100g: '528 kcal', perServing: '110 kcal' },
            { label: 'Grasas totales', per100g: '36.2 g', perServing: '7.5 g' },
            { label: 'Carbohidratos (Panela)', per100g: '38.5 g', perServing: '8.0 g' },
            { label: 'Fibra prebiótica (Vella)', per100g: '9.6 g', perServing: '2.0 g' },
            { label: 'Proteínas', per100g: '8.4 g', perServing: '1.7 g' },
            { label: '(-)-Epicatequina (DP1)', per100g: '~1,180 mg', perServing: '~245 mg' },
            { label: 'Teobromina nativa', per100g: '~1,400 mg', perServing: '~290 mg' },
          ],
        },
        {
          id: 'andean',
          code: 'SKU 02 // TERROIR PURO',
          name: 'Andean Gold Craft',
          shortBenefit:
            'El sabor puro de Zamora con cristales de sal marina y vainilla real, sin especias picantes. Ideal para todos los días o ceremonia.',
          tasteNote: 'Sabor: Cereza silvestre, floral nativo y toque salino equilibrado.',
          accentToken: 'ochre',
          cacaoPercent: '69.6% Cacao Vivo',
          image: '/images/sku-andean-gold.jpg',
          prices: { '250g': '$22.00', '500g': '$39.00', '1000g': '$72.00' },
          unitCost: {
            '250g': '$1.83 / taza (20.8 g)',
            '500g': '$1.63 / taza (20.8 g)',
            '1000g': '$1.50 / taza (20.8 g)',
          },
          servingLabel: '1 celda (20.8 g)',
          prepHint: 'Snack crujiente de 1/2 celda o bebida ceremonial con 1–2 celdas en agua caliente.',
          ingredients: [
            { name: 'Pasta viva púrpura Cacao Zamora (18–20 µm con vella)', share: '64.64%', functionDesc: 'Matriz intacta de polifenoles DP1 (~255 mg/celda) y teobromina.' },
            { name: 'Manteca dorada nativa prensada en frío', share: '4.97%', functionDesc: 'Brillo especular y chasquido vítreo (Forma V por cizalla).' },
            { name: 'Micropulverizado de panela orgánica', share: '29.39%', functionDesc: 'Equilibrio mineral y co-transporte de glucosa SGLT1.' },
            { name: 'Vaina de vainilla natural en polvo (<80 µm)', share: '0.55%', functionDesc: 'Redondeo aromático floral sin esencias sintéticas.' },
            { name: 'Sal marina cristalina', share: '0.45%', functionDesc: 'Iones Na+ para SGLT1 y bloqueo de amargor TAS2R14/39.' },
          ],
          nutrition: [
            { label: 'Energía', per100g: '536 kcal', perServing: '111 kcal' },
            { label: 'Grasas totales', per100g: '37.0 g', perServing: '7.7 g' },
            { label: 'Carbohidratos (Panela)', per100g: '39.8 g', perServing: '8.3 g' },
            { label: 'Fibra prebiótica (Vella)', per100g: '9.4 g', perServing: '1.95 g' },
            { label: 'Proteínas', per100g: '8.2 g', perServing: '1.7 g' },
            { label: '(-)-Epicatequina (DP1)', per100g: '~1,226 mg', perServing: '~255 mg' },
            { label: 'Teobromina nativa', per100g: '~1,450 mg', perServing: '~300 mg' },
          ],
        },
        {
          id: 'guayusa',
          code: 'SKU 03 // BEBIDA LIGERA',
          name: 'Purple Guayusa Elixir',
          shortBenefit:
            'Polvo fino de cacao prensado en frío (71.5%) con vainilla real, ishpingo, maca y guayusa suave (3.2%). Bebida chocolatada de frutos rojos sin amargor herbáceo.',
          tasteNote: 'Sabor: Cacao chocolatado con frutos rojos, vainilla e ishpingo cálido (cero amargor herbáceo).',
          accentToken: 'ruby',
          cacaoPercent: '71.5% Torta Desgrasada + 3.2% Guayusa',
          image: '/images/ruby-lavender-elixir.jpg',
          prices: { '250g': '$24.00', '500g': '$44.00', '1000g': '$79.00' },
          unitCost: {
            '250g': '$1.15 / bebida (12 g)',
            '500g': '$1.06 / bebida (12 g)',
            '1000g': '$0.95 / bebida (12 g)',
          },
          servingLabel: '2 cdta colmadas (12 g)',
          prepHint: 'Bate 2 cdta colmadas (12 g) en 180–200 ml de agua (75–80 °C) o usa 6 g en smoothie / café.',
          ingredients: [
            { name: 'Torta desgrasada púrpura Cacao Zamora (10–12% grasa, <80 µm)', share: '71.50%', functionDesc: '~230 mg (-)-epicatequina DP1 y ~250 mg teobromina por taza (12 g).' },
            { name: 'Panela orgánica micropulverizada (<1.2% humedad)', share: '19.50%', functionDesc: 'Redondea la astringencia (~2.1 g azúcares/taza) y activa bomba SGLT1.' },
            { name: 'Hoja de Guayusa amazónica (Ilex guayusa)', share: '3.20%', functionDesc: 'L-teanina y foco sereno sin amargor de clorofila.' },
            { name: 'Maca gelatinizada + Hibisco (Flor de Jamaica)', share: '3.80%', functionDesc: 'Maca suspende sin sedimento; hibisco fija tono rubí (pH ~4.0).' },
            { name: 'Vainilla natural + Ishpingo amazónico', share: '1.40%', functionDesc: 'Neutralizan nota herbácea, revelan frutos rojos y activan TRPA1.' },
            { name: 'Sal marina + Pimienta negra', share: '0.60%', functionDesc: 'Suprimen amargor TAS2R, aportan Na+ y bloquean UGT1A9/10.' },
          ],
          nutrition: [
            { label: 'Energía', per100g: '334 kcal', perServing: '40 kcal' },
            { label: 'Grasas totales', per100g: '7.9 g', perServing: '0.95 g' },
            { label: 'Carbohidratos (Panela)', per100g: '36.5 g', perServing: '4.4 g' },
            { label: 'Fibra prebiótica (Vella)', per100g: '27.5 g', perServing: '3.3 g' },
            { label: 'Proteínas', per100g: '16.2 g', perServing: '1.94 g' },
            { label: '(-)-Epicatequina (DP1)', per100g: '~1,917 mg', perServing: '~230 mg' },
            { label: 'Teobromina nativa', per100g: '~2,083 mg', perServing: '~250 mg' },
          ],
        },
      ],
    },
    calibrator: {
      eyebrow: '03 // GUÍA RÁPIDA EN 30 SEGUNDOS',
      title: '¿NO SABES CUÁL ELEGIR? CALIBRA TU OBJETIVO',
      subtitle: 'Toca tu momento del día y mira al instante la dosis, preparación y Set recomendado.',
      step1Label: '1. ELIGE TU OBJETIVO',
      step2Label: '2. TU FÓRMULA Y PREPARACIÓN',
      costLabel: 'Costo por porción',
      vsCafeLabel: 'vs. $3.50–$4.50 cafetería en Quito / Cuenca',
      recommendedLabel: 'Set ideal para ti',
      biochemToggleOpen: 'Ver detalle bioquímico de esta fórmula +',
      biochemToggleClose: 'Ocultar detalle bioquímico −',
      ctaLabel: 'Pedir este Set por WhatsApp',
      goals: [
        {
          id: 'focus',
          tag: 'SIN CAFEÍNA • TRABAJO PROFUNDO',
          title: 'Enfoque mental sin nervios',
          subtitle: 'Ideal para estudiar, programar, diseñar o trabajar horas con mente clara y sin caída.',
          formulaName: 'INCA Ancestral Silk',
          skuId: 'inca',
          skuBadge: '67.0% CACAO VIVO • SIN CAFEÍNA AÑADIDA',
          accentColor: '#3B0764',
          prepPrimaryLabel: 'En taza (Brew)',
          prepPrimary: 'Bate 1 celda (20.8 g) en 180 ml de agua caliente (72–75 °C) con espumador.',
          prepSecondaryLabel: 'Directo (Eat)',
          prepSecondary: 'Deja derretir 1/2 celda lentamente en boca antes de tu bloque de trabajo.',
          plainBenefits: [
            'Concentración serena de 3 a 5 horas sin ansiedad',
            'Mejor circulación cerebral y sensación cálida de bienestar',
            'Cero azúcar refinada y fibra natural que cuida tu digestión',
          ],
          biochemistry: [
            '~245 mg (-)-epicatequina DP1 por celda',
            'Teobromina 2.4% + L-teanina de guayusa (ondas Alfa 8–12 Hz)',
            'Macamidas de maca (inhiben FAAH) + Copaiba (CB2)',
            'Piperina + Moringa (bloqueo UGT1A9 / COMT)',
          ],
          cupCost: '$1.67 – $2.04 / taza',
          cafeComparison: 'Más de 45% de ahorro frente al café de especialidad',
          recommendedSet: 'Set 01 «Origen 5300»',
          recommendedPrice: '$45.00 USD',
          whatsappMessage:
            'Hola ORO PÚRPURA, usé la Guía para [Enfoque mental sin nervios] y quiero pedir [Set 01 «Origen 5300»] ($45.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'energy',
          tag: 'MAÑANA & DEPORTE • 40 KCAL',
          title: 'Energía matinal y pre-entreno',
          subtitle: 'Bebida chocolatada de frutos rojos (sin amargor herbáceo) o booster de 6 g en smoothie y café.',
          formulaName: 'Purple Guayusa Elixir',
          skuId: 'guayusa',
          skuBadge: '71.5% TORTA PRENSADA + 3.2% GUAYUSA',
          accentColor: '#881337',
          prepPrimaryLabel: 'Elixir en taza (12 g)',
          prepPrimary: 'Bate 2 cdta colmadas (12 g) en 180–200 ml de agua caliente (75–80 °C) 15–20 s.',
          prepSecondaryLabel: 'Booster smoothie / café (6 g)',
          prepSecondary: 'Suma 1 cdta colmada (6 g) a tu smoothie de banano/berries o café (Nootropic Mocha).',
          plainBenefits: [
            'Sabor chocolatado y frutos rojos con vainilla e ishpingo (cero amargor de hoja)',
            '~230 mg epicatequina DP1 + ~250 mg teobromina para flujo sanguíneo limpio',
            'Solo 40 kcal, 0.95 g grasa y suspensión estable sin sedimento en taza',
          ],
          biochemistry: [
            '~230 mg (-)-epicatequina DP1 + ~250 mg teobromina por taza (12 g)',
            '3.2% guayusa + L-teanina sin amargor de clorofila',
            '2.2% maca gelatinizada (suspensión sin sedimento + macamidas)',
            '0.8% vainilla + 0.6% ishpingo + 0.2% pimienta negra (TRPA1 + UGT1A9)',
          ],
          cupCost: '$0.95 – $1.15 / bebida',
          cafeComparison: '4× más económico que un latte o pre-entreno ($0.48 booster 6 g)',
          recommendedSet: 'Set 02 «Alquimia 360°»',
          recommendedPrice: '$65.00 USD',
          whatsappMessage:
            'Hola ORO PÚRPURA, usé la Guía para [Energía matinal y pre-entreno] y quiero pedir [Set 02 «Alquimia 360°»] ($65.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'ritual',
          tag: 'SABOR PURO • FAMILIA O CEREMONIA',
          title: 'Ritual diario o ceremonial',
          subtitle: 'Sabor frutal-floral puro de Zamora con sal marina y vainilla natural, para compartir o meditar.',
          formulaName: 'Andean Gold Craft',
          skuId: 'andean',
          skuBadge: '70% CACAO VIVO • SAL MARINA & VAINILLA',
          accentColor: '#9A6B16',
          prepPrimaryLabel: 'Uso diario (Eat / Brew)',
          prepPrimary: '1/2 a 1 celda (10.4–20.8 g) como snack cristalino o bebida suave vespertina.',
          prepSecondaryLabel: 'Dosis ceremonial',
          prepSecondary: '2 celdas de bloque de 250 g (41.7 g) disueltas lentamente.',
          plainBenefits: [
            'Notas auténticas de cereza silvestre y cacao vivo sin amargor agresivo',
            'Textura sedosa que se funde limpia en boca o en agua caliente',
            'Porcionado exacto para compartir en casa o guiar ceremonias sin báscula',
          ],
          biochemistry: [
            '~550 mg epicatequina + ~580 mg teobromina por dosis ceremonial (41.7 g)',
            'Sal marina bloquea receptores de amargor TAS2R14/39',
            'Panela orgánica + Na+ activan bomba SGLT1',
            'Templado Silk Forma V: quiebre sonoro y fundido a 36.6 °C',
          ],
          cupCost: '$1.20 – $1.83 / taza',
          cafeComparison: 'Dosis ceremonial calibrada lista para usar',
          recommendedSet: 'Set 03 «Ritual Mensual / Dúo»',
          recommendedPrice: '$118.00 USD',
          whatsappMessage:
            'Hola ORO PÚRPURA, usé la Guía para [Ritual diario o ceremonial] y quiero pedir [Set 03 «Ritual Mensual / Dúo»] ($118.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
      ],
    },
    science: {
      eyebrow: '04 // CIENCIA SIN COMPLICACIONES',
      title: 'QUÉ PASA EN TU CUERPO HORA A HORA',
      subtitle:
        'A diferencia del cacao crudo amargo que se absorbe poco, nuestras fórmulas combinan ingredientes amazónicos para que tu cuerpo aproveche cada miligramo.',
      timeline: [
        {
          time: '60 MIN',
          title: 'Flujo y calor natural',
          summary: 'Los flavanoles intactos activan el óxido nítrico y mejoran la circulación periférica.',
        },
        {
          time: '2–4 H',
          title: 'Enfoque sereno',
          summary: 'La teobromina y L-teanina sostienen un estado de alerta limpia, sin picos ni caídas.',
        },
        {
          time: '4–8 H',
          title: 'Energía estable',
          summary: 'Polifenoles de cadena media protegen tus vasos y suavizan la respuesta metabólica.',
        },
        {
          time: '12–24 H',
          title: 'Prebiótico real',
          summary: 'La cascarilla interna (vella) nutre la microbiota beneficiosa de forma natural.',
        },
      ],
      openDossierLabel: 'Abrir dosier científico completo (DP1–DP7, 4 Circuitos y Tabla Lab) →',
      modalTitle: 'Dosier Científico & Farmacocinética ORO PÚRPURA',
      tabCascade: 'Cascada DP1–DP7',
      tabCircuits: '4 Circuitos INCA',
      tabTable: 'Comparativa 6×3',
      cascadeTitle: 'CASCADA DE POLIFENOLES INTACTOS (DP1–DP7)',
      cascadeCards: [
        {
          dp: 'DP1 – DP2',
          name: 'Monómeros y Dímeros',
          window: 'Pico en sangre: 60 min',
          mechanism: 'Absorción directa en intestino delgado. Activan eNOS, elevan el óxido nítrico (NO) y generan vasodilatación periférica.',
        },
        {
          dp: 'DP3',
          name: 'Trímeros de Procianidina',
          window: 'Microcirculación cerebral',
          mechanism: 'Mejoran el flujo sanguíneo en el hipocampo, apoyando memoria de trabajo, neuroplasticidad y resistencia cognitiva.',
        },
        {
          dp: 'DP4 – DP5',
          name: 'Tetrámeros y Pentámeros',
          window: 'Protección metabólica',
          mechanism: 'Protegen el endotelio vascular frente a oxidación LDL y modulan α-amilasa / α-glucosidasa suavizando picos glucémicos.',
        },
        {
          dp: 'DP6 – DP7 + VELLA',
          name: 'Oligómeros + 8–10% Fibra',
          window: 'Efecto 12–24 horas',
          mechanism: 'Prebiótico selectivo en colon para Bifidobacterium y Lactobacillus; modulación inmune del tejido GALT.',
        },
      ],
      synergyTitle: 'POR QUÉ NO VENDEMOS PASTA 100% SOLA — 4 CIRCUITOS (INCA ANCESTRAL SILK)',
      synergySubtitle: 'Ingeniería fitoquímica cerrada para multiplicar la absorción real.',
      contours: [
        {
          code: 'CIRCUITO 01',
          title: 'Transporte SGLT1 & Quelación',
          actives: 'Panela orgánica + Sal marina + Hibisco',
          detail: 'Glucosa e iones Na+ activan el cotransportador SGLT1; los ácidos orgánicos del hibisco desquelatan el ácido fítico (IP6).',
        },
        {
          code: 'CIRCUITO 02',
          title: 'Bloqueo de Primer Paso',
          actives: 'Piperina + Ishpingo + Moringa',
          detail: 'Frenan la glucuronidación intestinal (UGT1A9/10) y metilación (COMT), extendiendo la vida media de la epicatequina y PEA.',
        },
        {
          code: 'CIRCUITO 03',
          title: 'Balance Neuro-Alfa',
          actives: 'Teobromina 2.4% + L-Teanina (Guayusa)',
          detail: 'Genera ondas cerebrales alfa coherentes (8–12 Hz) con alerta serena durante horas, sin taquicardia ni caída brusca.',
        },
        {
          code: 'CIRCUITO 04',
          title: 'Eje Endocannabinoide',
          actives: 'Maca (Macamidas) + Copaiba (β-cariofileno)',
          detail: 'Las macamidas inhiben FAAH protegiendo la anandamida nativa del cacao; el β-cariofileno activa selectivamente receptores CB2.',
        },
      ],
    },
    origin: {
      eyebrow: '05 // TRAZABILIDAD & CONFIANZA',
      title: 'HECHO EN ZAMORA CON FAMILIAS SHUAR',
      terroirTitle: 'CUNA DEL CACAO (5,300 AÑOS) & TRAZABILIDAD BASE L2',
      terroirPoints: [
        { label: 'Altitud de cosecha', value: '900 – 1,362 m s.n.m. (Salto del Inca, San Francisco del Vergel, Playas de Cuje)' },
        { label: 'Direct Trade Shuar', value: 'Alianza directa con familias de la comunidad Napurak / Asociación Los Bayanes' },
        { label: 'Regla 7–10 horas', value: 'Del corte en chakra al secado al vacío y sellado en Zamora en menos de 10 h' },
        { label: 'Bosque nativo', value: 'Cacao Nacional relicto bajo dosel amazónico — cero deforestación por CCN-51' },
      ],
      tznkBadge: 'PASAPORTE DIGITAL DE LOTE • BASE L2 / EAS',
      tznkDesc:
        'Cada etiqueta (10×10 cm) lleva un QR verificado vinculado al expediente de The Inca Trail Foods con coordenadas, altitud y hora exacta de estabilización.',
      tznkLinkLabel: 'Ver lotes verificados en incatrailfoods.com ↗',
      packagingTag: 'EMPAQUE APOTHECARY • 10 × 10 CM',
      terroirTag: 'CHAKRAS SHUAR • ZAMORA-CHINCHIPE',
      founderRole: 'FUNDADOR & INGENIERO DE PROCESOS',
      founderName: 'Eugenio Ayachui',
      founderBio:
        'Más de 11 años en Ecuador desarrollando estabilización en frío junto a comunidades amazónicas. Creador de The Inca Trail Foods / Cacao Zamora.',
      verifiedLabel: 'Perfiles verificados para comprobar autenticidad:',
    },
    b2bTeaser: {
      eyebrow: 'PROFESIONALES • ALTA COCINA • RETIROS',
      title: '¿Eres chef, dueño de restaurante o facilitador de retiros?',
      desc: 'Separamos nuestra área mayorista y el protocolo sensorial «The 5 Bean Challenge» en una sección dedicada.',
      cta: 'Ir a Chefs, B2B y The 5 Bean Challenge →',
    },
    b2b: {
      eyebrow: 'B2B • ALTA GASTRONOMÍA • CENTROS DE RETIRO',
      title: 'THE 5 BEAN CHALLENGE & MAYORISTAS',
      subtitle:
        'Abastecimiento directo desde Zamora para cocinas de autor en Quito, Cuenca y Guayaquil, y centros de retiro o yoga en Vilcabamba y Mindo.',
      heroTag: 'KIT SENSORIAL • 5 GRANOS EXACTOS',
      heroCaption: '5 granos enteros Glassy Crunch + 1 grano fermentado testigo para prueba comparativa',
      wholesaleTitle: 'CONDICIONES MAYORISTAS B2B',
      wholesalePoints: [
        'Formato modular estandarizado: bloques de 250 g (12 × 20.8 g); pedidos de 500 g (2 × 250 g) y 1 kg (4 × 250 g)',
        'Tarifa B2B desde $44.00 – $48.00 / kg según fórmula y volumen mensual',
        'Pigmento púrpura pizarra nativo, 0% notas de quemado o vinagre acético',
        'Despacho el mismo día vía cooperativa Zamora → Loja → Cuenca o Servientrega',
      ],
      challengeTitle: 'PROTOCOLO SENSORIAL DE 15 MINUTOS',
      challengeDesc:
        'La prueba somatosensorial directa con exactamente 5 granos enteros para comprobar en vivo la diferencia entre cacao vivo y cacao fermentado:',
      kitContentsTitle: 'QUÉ INCLUYE EL KIT DE CATA B2B:',
      kitContents: [
        '20 granos enteros Glassy Crunch (para 4 pruebas completas de 5 granos)',
        'Granos fermentados testigo para comparar corte, aroma y acidez',
        'Muestras de INCA Ancestral Silk, Andean Gold Craft y vial de Purple Guayusa Elixir',
      ],
      phases: [
        { step: 'FASE 01', title: 'Snap Test', detail: 'Chasquido vítreo junto al oído, corte púrpura monolítico y 0% olor a vinagre.' },
        { step: 'FASE 02', title: 'Dosis de 5 Granos', detail: 'Masticación de exactamente 5 granos (~6–7 g) con vella intacta: textura crujiente y perfil floral-frutal.' },
        { step: 'FASE 03', title: 'Respuesta NO (10–15 min)', detail: 'Vasodilatación tangible (calor en cuello y manos) y claridad mental sin taquicardia.' },
      ],
      ctaLabel: 'Kit 5 Beans & Precios B2B',
      whatsappMessage:
        'Hola Eugenio / ORO PÚRPURA, me interesa información B2B (precios por kg / Kit 5 Bean Challenge) para mi restaurante o centro de retiro en: ',
    },
    trust: {
      eyebrow: '06 // ENVÍOS Y PAGOS EN ECUADOR',
      title: 'COMPRA FÁCIL EN CHAT, SIN FORMULARIOS',
      shippingTitle: 'Envío Nacional Servientrega',
      shippingDesc: 'Entrega a domicilio en 24–48 horas en las 24 provincias. Gratis en todos los Sets.',
      paymentsTitle: 'Pagos seguros al coordinar en WhatsApp',
      paymentsList: [
        { method: 'Deuna! (QR 0% comisión)', detail: 'Pago inmediato desde tu app bancaria' },
        { method: 'Transferencia Bancaria', detail: 'Banco Pichincha • Banco Guayaquil • Produbanco' },
      ],
    },
    footer: {
      address: 'Taller de Estabilización & Molienda: Zamora, Zamora-Chinchipe, Ecuador.',
      ecosystem:
        'oropurpura.incatrailfoods.com — Iniciativa directa de The Inca Trail Foods / Cacao Zamora.',
      b2bLink: 'Chefs / 5 Bean Challenge (B2B)',
      rights: '© 2026 ORO PÚRPURA. Cacao vivo sin fermentar ni tostar.',
    },
  },
  en: {
    common: {
      copyText: 'Copy text',
      copied: 'Copied ✓',
      freeShippingBadge: 'FREE SHIPPING ECUADOR',
      orderViaWa: 'Order via WhatsApp',
      parentPrefix: 'by',
      backToStorefront: '← Back to D2C Storefront',
      closeModal: 'Close',
    },
    ticker: {
      text: 'LIVING CACAO NACIONAL • ZAMORA-CHINCHIPE HARVEST • 0% FERMENTATION • FREE ECUADOR SHIPPING',
      availabilityLabel: 'AVAILABLE:',
      availabilityValue: 'IN VITRINE',
    },
    nav: {
      shop: 'Sets & Blocks',
      calibrator: 'Find Yours',
      why: 'Why Living?',
      origin: 'Origin',
      b2b: 'Chefs · 5 Bean Challenge',
      cta: 'WhatsApp',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE, ECUADOR • WORLD CRADLE OF CACAO',
      originBadge: '5,300-YEAR ORIGIN',
      h1Main: "IT'S NOT CHOCOLATE. IT'S LIVING CACAO.",
      subtitle:
        'Unfermented, unroasted ancestral purple cacao in pre-scored blocks or cold-pressed elixir. Eat a square straight or whisk in hot water in 30 seconds: steady mental clarity, zero refined sugar, free shipping across Ecuador.',
      ctaPrimary: 'Browse Sets with Free Shipping',
      ctaSecondary: 'Which one fits me? (30 sec)',
      proofs: [
        { value: '0% FERMENTATION', label: 'Vacuum dried (< 10 h)' },
        { value: 'EAT OR BREW', label: 'Pre-scored cells, no scale needed' },
        { value: 'FREE SHIPPING', label: 'All 24 provinces via courier' },
      ],
      visualTab1: '01 · Living Purple Bean',
      visualTab2: '02 · Hot Elixir (75 °C)',
      diptychLeftTag: 'CUT-TEST: NATIVE PURPLE',
      diptychLeftCaption: 'Unfermented living bean (left) vs. roasted brown bean (center)',
      diptychRightTag: 'BREW: 72–75 °C',
      diptychRightCaption: 'Ruby-lavender foam suspension with zero oily surface film',
    },
    why: {
      eyebrow: '01 // THE DIFFERENCE IN 10 SECONDS',
      title: 'WHY IT FEELS NOTHING LIKE ORDINARY CHOCOLATE',
      subtitle:
        'Craft chocolate is a delicious confection, yet roasting at 140 °C destroys up to 80% of living flavanols. ORO PÚRPURA preserves the living fruit matrix straight from Zamora.',
      cards: [
        {
          num: '01',
          badge: '0% ROASTING • ≤ 75–80 °C',
          title: 'True purple, never burnt',
          detail:
            'We halt oxidation within 10 hours of harvest. The interior remains solid slate-purple with bright fruity notes and 0% vinegar harshness.',
        },
        {
          num: '02',
          badge: 'UP TO 10× MORE ACTIVES',
          title: 'Clean focus, zero jitters',
          detail:
            'Retains 17–19.5 mg/g of (-)-epicatechin and 2.4% native theobromine for hours of calm drive and blood flow without a coffee crash.',
        },
        {
          num: '03',
          badge: 'READY IN 30 SECONDS',
          title: 'Eat a square or whisk it',
          detail:
            'Pre-scored modular blocks dissolve smoothly in your mouth as a functional snack or whisk effortlessly into 180 ml hot water.',
        },
      ],
      openLabTableLabel: 'Open full biochemical comparison table (6 parameters) →',
    },
    conflict: {
      eyebrow: 'LAB COMPARISON // DOSSIER',
      title: 'THERMAL DEATH VS. LIVING MATRIX',
      thesis:
        'Fermentation and roasting (120–145 °C) are the art of crafting an aromatic confection. Yet heat oxidizes up to 80% of living flavanols and turns the seed brown. At ORO PÚRPURA we halt oxidation within 10 hours of Shuar harvest.',
      colParam: 'Biochemical Parameter',
      colConventional: 'Conventional / Craft Chocolate',
      colOro: 'ORO PÚRPURA (Living Cacao FMAD)',
      rows: [
        {
          param: 'Thermal processing',
          conventional: '5–8 days fermentation + pyrolysis at 120–145 °C',
          oro: '0 days fermentation • Vacuum stabilization ≤ 75–80 °C (7–10 h)',
          deltaTag: '7–10 h post-harvest',
        },
        {
          param: 'Endosperm Cut-Test',
          conventional: 'Earthy brown (oxidized tannins)',
          oro: 'Monolithic slate-purple (Deep Purple)',
          deltaTag: 'Intact anthocyanins',
        },
        {
          param: 'Monomeric (-)-Epicatechin (DP1)',
          conventional: '1.0 – 4.8 mg/g (oxidative loss)',
          oro: '17.0 – 19.5 mg/g (4× to 10× higher bioactivity)',
          deltaTag: 'Up to 10× DP1',
        },
        {
          param: 'Native theobromine',
          conventional: '1.2 – 1.7% (leached by acidic pulp)',
          oro: '2.15 – 2.40% (steady tone without jitters)',
          deltaTag: '2.40% peak',
        },
        {
          param: 'Organic acid profile',
          conventional: 'High volatile acetic acid (vinegar)',
          oro: '0% acetic acid • Native malic & citric acids',
          deltaTag: '0% vinegar',
        },
        {
          param: 'Format & purity',
          conventional: 'Sweet bar / bitter raw mass hard to dose',
          oro: 'Synergistic Eat / Brew matrix (Clean Label, 0% fumigation)',
          deltaTag: 'Modular Eat / Brew',
        },
      ],
    },
    shop: {
      eyebrow: '02 // DIRECT STOREFRONT (D2C)',
      title: 'CHOOSE YOUR SET WITH FREE SHIPPING',
      subtitle:
        'Every order is confirmed directly in WhatsApp in under a minute (no checkout forms). Door-to-door delivery in 24–48 h via Servientrega nationwide.',
      setsTabTitle: '3 CURATED SETS (FREE SERVIENTREGA ACROSS ECUADOR)',
      blocksTitle: 'INDIVIDUAL BLOCKS & ELIXIR',
      blocksSubtitle:
        'Prefer a single formula? Pick your weight below to view pricing, and open the technical sheet or batch passport whenever you want details.',
      weightLabels: {
        '250g': { cells: '1 BLOCK × 250 g (12 × 20.8 g)', weightNote: 'Daily ritual • 12–24 days' },
        '500g': { cells: '2 BLOCKS × 250 g (24 × 20.8 g)', weightNote: 'Duo / Ceremony • 24–48 days' },
        '1000g': { cells: '4 BLOCKS × 250 g (48 × 20.8 g)', weightNote: 'Family / Pro • Best value' },
      },
      openSpecLabel: 'Ingredients & Nutrition',
      openPassportLabel: 'Batch Passport / QR',
      ingredientsTitle: 'Formula & Biochemical Function',
      nutritionTitle: 'Estimated Nutrition Facts',
      col100g: 'Per 100 g',
      colServing: 'Per serving',
      orderBlockCta: 'Order on WhatsApp',
      sets: [
        {
          id: 'set-01',
          code: 'SET 01',
          name: '«ORIGEN 5300»',
          price: '$45.00',
          cupPriceHighlight: '$1.88 / cup',
          savings: 'Save $7.00 incl. shipping',
          badge: 'STARTER • TWO BLOCK FORMULAS',
          image: '/images/set-origen-bundle.jpg',
          items: [
            'INCA Ancestral Silk — 250 g block (12 cells)',
            'Andean Gold Craft — 250 g block (12 cells)',
          ],
          gift: 'Included Gift: 30 g whole Glassy Crunch beans (5 Bean Challenge)',
          netWeight: '530 g net',
          yieldSummary: '24 functional cups or 48 snack microdoses',
          ctaLabel: 'Order Set 01 · $45',
          whatsappMessage:
            'Hi ORO PÚRPURA, I want to order Set 01 «Origen 5300» ($45.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'set-02',
          code: 'SET 02',
          name: '«ALQUIMIA 360°»',
          price: '$65.00',
          cupPriceHighlight: '$1.33 / cup',
          savings: 'Save $11.00 incl. shipping',
          badge: '★ MOST CHOSEN • FULL DAILY CYCLE',
          image: '/images/set-alquimia-bundle.jpg',
          featured: true,
          items: [
            'INCA Ancestral Silk — 250 g block (Deep Focus)',
            'Andean Gold Craft — 250 g block (Pure Terroir)',
            'Purple Guayusa Elixir — 250 g pouch (Morning Energy)',
          ],
          gift: 'Included Gift: 30 g whole Glassy Crunch beans (5 Bean Challenge)',
          netWeight: '780 g net',
          yieldSummary: '45 drinks or up to 65 combined servings',
          ctaLabel: 'Order Set 02 · $65',
          whatsappMessage:
            'Hi ORO PÚRPURA, I want to order Set 02 «Alquimia 360°» ($65.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'set-03',
          code: 'SET 03',
          name: '«RITUAL MENSUAL / DÚO»',
          price: '$118.00',
          cupPriceHighlight: '$1.31 / cup',
          savings: 'Save $16.00 incl. shipping',
          badge: 'MAX VALUE • COUPLES & DAILY USE',
          image: '/images/set-ritual-bundle.jpg',
          items: [
            'INCA Ancestral Silk — 2 blocks × 250 g (24 × 20.8 g)',
            'Andean Gold Craft — 2 blocks × 250 g (24 × 20.8 g)',
            'Purple Guayusa Elixir — 500 g pouch (42–83 drinks)',
          ],
          gift: 'Included Gift: 30 g whole Glassy Crunch beans (5 Bean Challenge)',
          netWeight: '1,530 g net',
          yieldSummary: '90 standard cups or 48 ceremonial servings',
          ctaLabel: 'Order Set 03 · $118',
          whatsappMessage:
            'Hi ORO PÚRPURA, I want to order Set 03 «Ritual Mensual / Dúo» ($118.00 with free Servientrega shipping). My city is: ',
        },
      ],
      skus: [
        {
          id: 'inca',
          code: 'SKU 01 // DEEP FOCUS',
          name: 'INCA Ancestral Silk',
          shortBenefit:
            'Caffeine-free cognitive clarity. Silky living purple cacao enhanced with maca, guayusa, and Amazonian botanicals for peak absorption.',
          tasteNote: 'Taste: Warm gentle spices, velvety melt, lightly sweetened with panela.',
          accentToken: 'purple',
          cacaoPercent: '67.0% Living Cacao',
          image: '/images/sku-inca-silk.jpg',
          prices: { '250g': '$24.50', '500g': '$44.50', '1000g': '$80.00' },
          unitCost: {
            '250g': '$2.04 / cup (20.8 g)',
            '500g': '$1.85 / cup (20.8 g)',
            '1000g': '$1.67 / cup (20.8 g)',
          },
          servingLabel: '1 cell (20.8 g)',
          prepHint: 'Melt 1/2 cell directly or whisk 1 cell into 180 ml hot water (72–75 °C).',
          ingredients: [
            { name: 'Living purple Cacao Zamora paste (18–20 µm w/ vella)', share: '62.24%', functionDesc: 'DP1 (~245 mg/cell) & DP2–DP7 flavanols, theobromine, prebiotic fiber.' },
            { name: 'Cold-pressed native golden cacao butter', share: '4.79%', functionDesc: 'Gentle lipophilic fluidity and stable Form V crystallization.' },
            { name: 'Organic panela micropowder (<1.2% moisture)', share: '28.29%', functionDesc: 'D-glucose to activate SGLT1 intestinal transport.' },
            { name: 'Botanical complex (Maca, Hibiscus, Guayusa, Vanilla, Ishpingo, Pepper, Moringa, Copaiba)', share: '4.25%', functionDesc: 'FAAH/UGT1A9/COMT blockade, L-theanine, and CB2/TRPA1 agonism.' },
            { name: 'Crystalline sea salt', share: '0.43%', functionDesc: 'Na+ ions for SGLT1 pump and TAS2R14/39 bitterness masking.' },
          ],
          nutrition: [
            { label: 'Energy', per100g: '528 kcal', perServing: '110 kcal' },
            { label: 'Total Fat', per100g: '36.2 g', perServing: '7.5 g' },
            { label: 'Carbohydrates (Panela)', per100g: '38.5 g', perServing: '8.0 g' },
            { label: 'Prebiotic Fiber (Vella)', per100g: '9.6 g', perServing: '2.0 g' },
            { label: 'Protein', per100g: '8.4 g', perServing: '1.7 g' },
            { label: '(-)-Epicatechin (DP1)', per100g: '~1,180 mg', perServing: '~245 mg' },
            { label: 'Native Theobromine', per100g: '~1,400 mg', perServing: '~290 mg' },
          ],
        },
        {
          id: 'andean',
          code: 'SKU 02 // PURE TERROIR',
          name: 'Andean Gold Craft',
          shortBenefit:
            'Pure Zamora harvest profile finished with crystalline sea salt and real vanilla bean, zero hot spices. Perfect for daily enjoyment or ceremony.',
          tasteNote: 'Taste: Wild cherry, bright floral cacao, crisp salted balance.',
          accentToken: 'ochre',
          cacaoPercent: '69.6% Living Cacao',
          image: '/images/sku-andean-gold.jpg',
          prices: { '250g': '$22.00', '500g': '$39.00', '1000g': '$72.00' },
          unitCost: {
            '250g': '$1.83 / cup (20.8 g)',
            '500g': '$1.63 / cup (20.8 g)',
            '1000g': '$1.50 / cup (20.8 g)',
          },
          servingLabel: '1 cell (20.8 g)',
          prepHint: 'Eat 1/2 cell as a crisp snack or whisk 1–2 cells in hot water.',
          ingredients: [
            { name: 'Living purple Cacao Zamora paste (18–20 µm w/ vella)', share: '64.64%', functionDesc: 'Intact DP1 (~255 mg/cell) & DP2–DP7 polyphenol matrix.' },
            { name: 'Cold-pressed native golden cacao butter', share: '4.97%', functionDesc: 'Mirror gloss and crisp shear-tempered Form V snap.' },
            { name: 'Organic panela micropowder (<1.2% moisture)', share: '29.39%', functionDesc: 'Mineral balance and SGLT1 glucose co-transport.' },
            { name: 'Natural Ecuadorian vanilla bean (<80 µm)', share: '0.55%', functionDesc: 'Floral-berry aroma balance without synthetic extracts.' },
            { name: 'Crystalline sea salt', share: '0.45%', functionDesc: 'Na+ ions for SGLT1 and TAS2R14/39 bitterness suppression.' },
          ],
          nutrition: [
            { label: 'Energy', per100g: '536 kcal', perServing: '111 kcal' },
            { label: 'Total Fat', per100g: '37.0 g', perServing: '7.7 g' },
            { label: 'Carbohydrates (Panela)', per100g: '39.8 g', perServing: '8.3 g' },
            { label: 'Prebiotic Fiber (Vella)', per100g: '9.4 g', perServing: '1.95 g' },
            { label: 'Protein', per100g: '8.2 g', perServing: '1.7 g' },
            { label: '(-)-Epicatechin (DP1)', per100g: '~1,226 mg', perServing: '~255 mg' },
            { label: 'Native Theobromine', per100g: '~1,450 mg', perServing: '~300 mg' },
          ],
        },
        {
          id: 'guayusa',
          code: 'SKU 03 // LIGHT ELIXIR',
          name: 'Purple Guayusa Elixir',
          shortBenefit:
            'Fine cold-pressed cacao cake (71.5%) balanced with real vanilla, ishpingo, maca & gentle guayusa (3.2%). Velvety berry-chocolate cup with zero grassy bitterness.',
          tasteNote: 'Taste: Velvety berry-chocolate with real vanilla & warm ishpingo (zero grassy bitterness).',
          accentToken: 'ruby',
          cacaoPercent: '71.5% Cold-Pressed Cake + 3.2% Guayusa',
          image: '/images/ruby-lavender-elixir.jpg',
          prices: { '250g': '$24.00', '500g': '$44.00', '1000g': '$79.00' },
          unitCost: {
            '250g': '$1.15 / drink (12 g)',
            '500g': '$1.06 / drink (12 g)',
            '1000g': '$0.95 / drink (12 g)',
          },
          servingLabel: '2 heaped tsp (12 g)',
          prepHint: 'Whisk 2 heaped tsp (12 g) into 180–200 ml hot water (75–80 °C) or add 6 g to smoothies / coffee.',
          ingredients: [
            { name: 'Cold-pressed purple Cacao Zamora cake (10–12% fat, <80 µm)', share: '71.50%', functionDesc: '~230 mg (-)-epicatechin DP1 & ~250 mg theobromine per 12 g cup.' },
            { name: 'Organic panela micropowder (<1.2% moisture)', share: '19.50%', functionDesc: 'Rounds out astringency (~2.1 g sugars/cup) and activates SGLT1.' },
            { name: 'Amazonian Guayusa leaf (Ilex guayusa)', share: '3.20%', functionDesc: 'L-theanine & calm focus without chlorophyll bitterness.' },
            { name: 'Gelatinized Maca + Hibiscus (Flor de Jamaica)', share: '3.80%', functionDesc: 'Maca suspends with zero sediment; hibiscus locks ruby hue (pH ~4.0).' },
            { name: 'Natural Vanilla + Amazonian Ishpingo', share: '1.40%', functionDesc: 'Neutralizes grassy notes, lifts berry aromatics & activates TRPA1.' },
            { name: 'Crystalline Sea Salt + Black Pepper', share: '0.60%', functionDesc: 'Suppresses TAS2R bitterness, supplies Na+ & blocks UGT1A9/10.' },
          ],
          nutrition: [
            { label: 'Energy', per100g: '334 kcal', perServing: '40 kcal' },
            { label: 'Total Fat', per100g: '7.9 g', perServing: '0.95 g' },
            { label: 'Carbohydrates (Panela)', per100g: '36.5 g', perServing: '4.4 g' },
            { label: 'Prebiotic Fiber (Vella)', per100g: '27.5 g', perServing: '3.3 g' },
            { label: 'Protein', per100g: '16.2 g', perServing: '1.94 g' },
            { label: '(-)-Epicatechin (DP1)', per100g: '~1,917 mg', perServing: '~230 mg' },
            { label: 'Native Theobromine', per100g: '~2,083 mg', perServing: '~250 mg' },
          ],
        },
      ],
    },
    calibrator: {
      eyebrow: '03 // 30-SECOND MATCHER',
      title: 'NOT SURE WHICH ONE TO PICK? MATCH YOUR GOAL',
      subtitle: 'Tap your scenario to see the right formula, how to prepare it, and the best-value Set.',
      step1Label: '1. PICK YOUR GOAL',
      step2Label: '2. RECOMMENDED FORMULA & PREP',
      costLabel: 'Calculated cost per cup',
      vsCafeLabel: 'vs. $3.50–$4.50 specialty café in Quito / Cuenca',
      recommendedLabel: 'Best Set for this goal',
      biochemToggleOpen: 'Show formula biochemistry details +',
      biochemToggleClose: 'Hide biochemistry details −',
      ctaLabel: 'Order this Set on WhatsApp',
      goals: [
        {
          id: 'focus',
          tag: 'CAFFEINE-FREE • DEEP WORK',
          title: 'Deep mental focus without jitters',
          subtitle: 'Built for engineering, studying, creative flow, and long work blocks with zero crash.',
          formulaName: 'INCA Ancestral Silk',
          skuId: 'inca',
          skuBadge: '67.0% LIVING CACAO • ZERO ADDED CAFFEINE',
          accentColor: '#3B0764',
          prepPrimaryLabel: 'In a cup (Brew)',
          prepPrimary: 'Whisk 1 cell (20.8 g) in 180 ml hot water (72–75 °C) with a frother.',
          prepSecondaryLabel: 'Direct (Eat)',
          prepSecondary: 'Slowly melt 1/2 cell before starting your deep work session.',
          plainBenefits: [
            '3–5 hours of calm alertness without caffeine spikes',
            'Supports cerebral blood flow and warm physical focus',
            'Zero refined sugar and naturally rich in prebiotic fiber',
          ],
          biochemistry: [
            '~245 mg (-)-epicatechin DP1 per cell',
            '2.4% theobromine + guayusa L-theanine (Alpha waves 8–12 Hz)',
            'Maca macamides (FAAH inhibition) + Copaiba (CB2)',
            'Piperine + Moringa (UGT1A9 / COMT blockade)',
          ],
          cupCost: '$1.67 – $2.04 / cup',
          cafeComparison: '>45% savings vs. specialty coffee',
          recommendedSet: 'Set 01 «Origen 5300»',
          recommendedPrice: '$45.00 USD',
          whatsappMessage:
            'Hi ORO PÚRPURA, I used the Matcher for [Deep mental focus] and want to order [Set 01 «Origen 5300»] ($45.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'energy',
          tag: 'MORNING & WORKOUT • 40 KCAL',
          title: 'Morning energy & circulation',
          subtitle: 'Velvety berry-chocolate drink (zero grassy bitterness) or 6 g booster for smoothies & coffee.',
          formulaName: 'Purple Guayusa Elixir',
          skuId: 'guayusa',
          skuBadge: '71.5% COLD-PRESSED CAKE + 3.2% GUAYUSA',
          accentColor: '#881337',
          prepPrimaryLabel: 'Elixir in a cup (12 g)',
          prepPrimary: 'Whisk 2 heaped tsp (12 g) into 180–200 ml hot water (75–80 °C) for 15–20 s.',
          prepSecondaryLabel: 'Smoothie / coffee booster (6 g)',
          prepSecondary: 'Add 1 heaped tsp (6 g) to banana/berry smoothies or coffee (Nootropic Mocha).',
          plainBenefits: [
            'Velvety chocolate-berry flavor with vanilla & ishpingo (zero grassy bitterness)',
            '~230 mg epicatechin DP1 + ~250 mg theobromine for clean blood flow',
            'Just 40 kcal, 0.95 g fat, and stable suspension with zero sediment',
          ],
          biochemistry: [
            '~230 mg (-)-epicatechin DP1 + ~250 mg theobromine per 12 g cup',
            '3.2% guayusa + L-theanine without chlorophyll bitterness',
            '2.2% gelatinized maca (zero-sediment suspension + macamides)',
            '0.8% vanilla + 0.6% ishpingo + 0.2% black pepper (TRPA1 + UGT1A9)',
          ],
          cupCost: '$0.95 – $1.15 / drink',
          cafeComparison: '4× more affordable than a latte or pre-workout ($0.48 per 6 g booster)',
          recommendedSet: 'Set 02 «Alquimia 360°»',
          recommendedPrice: '$65.00 USD',
          whatsappMessage:
            'Hi ORO PÚRPURA, I used the Matcher for [Morning energy & circulation] and want to order [Set 02 «Alquimia 360°»] ($65.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'ritual',
          tag: 'PURE TERROIR • DAILY OR CEREMONY',
          title: 'Daily pleasure or ceremony',
          subtitle: 'Bright wild-cherry Zamora profile with sea salt and real vanilla, great to share or meditate.',
          formulaName: 'Andean Gold Craft',
          skuId: 'andean',
          skuBadge: '70% LIVING CACAO • SEA SALT & VANILLA',
          accentColor: '#9A6B16',
          prepPrimaryLabel: 'Daily (Eat / Brew)',
          prepPrimary: '1/2 to 1 cell (10.4–20.8 g) as a crisp snack or comforting evening drink.',
          prepSecondaryLabel: 'Ceremonial dose',
          prepSecondary: '2 cells of a 250 g block (41.7 g) melted slowly.',
          plainBenefits: [
            'Authentic berry-floral notes without roasted bitterness',
            'Velvety melt on the tongue or frothy cup in seconds',
            'Scale-free modular portions ready for home or group circles',
          ],
          biochemistry: [
            '~550 mg epicatechin + ~580 mg theobromine per ceremonial dose (41.7 g)',
            'Sea salt suppresses TAS2R14/39 bitterness receptors',
            'Organic panela + Na+ trigger SGLT1 symport',
            'Form V Silk temper: crisp snap and instant melt at 36.6 °C',
          ],
          cupCost: '$1.20 – $1.83 / cup',
          cafeComparison: 'Scale-free calibrated ceremonial dose',
          recommendedSet: 'Set 03 «Ritual Mensual / Dúo»',
          recommendedPrice: '$118.00 USD',
          whatsappMessage:
            'Hi ORO PÚRPURA, I used the Matcher for [Daily pleasure or ceremony] and want to order [Set 03 «Ritual Mensual / Dúo»] ($118.00 with free Servientrega shipping). My city is: ',
        },
      ],
    },
    science: {
      eyebrow: '04 // SCIENCE MADE CLEAR',
      title: 'WHAT HAPPENS IN YOUR BODY HOUR BY HOUR',
      subtitle:
        'Plain unformulated raw paste is hard to absorb. Our synergy pairs living cacao with native botanicals so every milligram works.',
      timeline: [
        {
          time: '60 MIN',
          title: 'Circulation & natural warmth',
          summary: 'Intact flavanols stimulate nitric oxide release for clean peripheral blood flow.',
        },
        {
          time: '2–4 H',
          title: 'Steady mental clarity',
          summary: 'Theobromine and L-theanine support coherent focus without adrenaline jitters.',
        },
        {
          time: '4–8 H',
          title: 'Balanced metabolic energy',
          summary: 'Longer polyphenol chains protect blood vessels and smooth energy release.',
        },
        {
          time: '12–24 H',
          title: 'Real prebiotic nourishment',
          summary: 'Intact inner cacao skin (vella) feeds beneficial gut microbiota naturally.',
        },
      ],
      openDossierLabel: 'Open full scientific dossier (DP1–DP7, 4 Circuits & Lab Table) →',
      modalTitle: 'ORO PÚRPURA Scientific & Pharmacokinetic Dossier',
      tabCascade: 'DP1–DP7 Cascade',
      tabCircuits: '4 INCA Circuits',
      tabTable: '6×3 Comparison',
      cascadeTitle: 'INTACT POLYPHENOL CASCADE (DP1–DP7)',
      cascadeCards: [
        {
          dp: 'DP1 – DP2',
          name: 'Monomers & Dimers',
          window: 'Blood peak: 60 min',
          mechanism: 'Rapid small-intestine uptake. Activate eNOS, boost nitric oxide (NO), and drive peripheral vasodilation.',
        },
        {
          dp: 'DP3',
          name: 'Procyanidin Trimers',
          window: 'Hippocampal perfusion',
          mechanism: 'Enhance cerebral microcirculation in the hippocampus, supporting working memory and cognitive stamina.',
        },
        {
          dp: 'DP4 – DP5',
          name: 'Tetramers & Pentamers',
          window: 'Metabolic shield',
          mechanism: 'Protect vascular endothelium from LDL oxidation and inhibit α-amylase / α-glucosidase to blunt glycemic spikes.',
        },
        {
          dp: 'DP6 – DP7 + VELLA',
          name: 'Oligomers + 8–10% Fiber',
          window: '12–24 hour window',
          mechanism: 'Selective colon prebiotic for Bifidobacterium and Lactobacillus; modulates GALT immune signaling.',
        },
      ],
      synergyTitle: 'WHY WE NEVER SELL PLAIN 100% PASTE — 4 CIRCUITS (INCA ANCESTRAL SILK)',
      synergySubtitle: 'Closed-loop phytochemical engineering to multiply real-world absorption.',
      contours: [
        {
          code: 'CIRCUIT 01',
          title: 'SGLT1 Transport & Chelation',
          actives: 'Organic panela + Sea salt + Hibiscus',
          detail: 'Glucose and Na+ ions fire the SGLT1 symporter; hibiscus organic acids de-chelate phytic acid (IP6).',
        },
        {
          code: 'CIRCUIT 02',
          title: 'First-Pass Blockade',
          actives: 'Piperine + Ishpingo + Moringa',
          detail: 'Inhibit intestinal glucuronidation (UGT1A9/10) and COMT methylation, extending epicatechin and PEA half-life.',
        },
        {
          code: 'CIRCUIT 03',
          title: 'Alpha-Wave Neuro Balance',
          actives: '2.4% Theobromine + L-Theanine (Guayusa)',
          detail: 'Generates coherent alpha brainwaves (8–12 Hz) for calm, sustained focus with zero tachycardia or crash.',
        },
        {
          code: 'CIRCUIT 04',
          title: 'Endocannabinoid Axis',
          actives: 'Maca (Macamides) + Copaiba (β-caryophyllene)',
          detail: 'Macamides inhibit FAAH to protect cacao anandamide; β-caryophyllene selectively activates CB2 receptors.',
        },
      ],
    },
    origin: {
      eyebrow: '05 // TRACEABILITY & TRUST',
      title: 'CRAFTED IN ZAMORA WITH SHUAR FAMILIES',
      terroirTitle: '5,300-YEAR CRADLE & BASE L2 TRACEABILITY',
      terroirPoints: [
        { label: 'Harvest elevation', value: '900 – 1,362 m a.s.l. (Salto del Inca, San Francisco del Vergel, Playas de Cuje)' },
        { label: 'Shuar Direct Trade', value: 'Direct alliance with Napurak community families / Los Bayanes association' },
        { label: '7–10 hour rule', value: 'Pod opening to vacuum stabilization and sealing in Zamora under 10 hours' },
        { label: 'Native canopy', value: 'Relict Cacao Nacional under old-growth shade — zero CCN-51 deforestation' },
      ],
      tznkBadge: 'DIGITAL BATCH PASSPORT • BASE L2 / EAS',
      tznkDesc:
        'Every 10×10 cm label carries a verified QR linked to the Inca Trail Foods dossier with coordinates, elevation, and exact stabilization timestamp.',
      tznkLinkLabel: 'Verify lots at incatrailfoods.com ↗',
      packagingTag: 'APOTHECARY PACKAGING • 10 × 10 CM',
      terroirTag: 'SHUAR CHAKRAS • ZAMORA-CHINCHIPE',
      founderRole: 'FOUNDER & FOOD PROCESS ENGINEER',
      founderName: 'Eugenio Ayachui',
      founderBio:
        '11+ years in Ecuador advancing cold stabilization with Amazonian communities. Creator of The Inca Trail Foods / Cacao Zamora.',
      verifiedLabel: 'Verified profiles to confirm authenticity:',
    },
    b2bTeaser: {
      eyebrow: 'PROFESSIONALS • FINE DINING • RETREATS',
      title: 'Are you a chef, restaurant owner, or retreat facilitator?',
      desc: 'We moved our wholesale B2B pricing and «The 5 Bean Challenge» tasting kit into a dedicated workspace.',
      cta: 'Open Chefs, B2B & The 5 Bean Challenge →',
    },
    b2b: {
      eyebrow: 'B2B • HAUTE CUISINE • RETREAT CENTERS',
      title: 'THE 5 BEAN CHALLENGE & WHOLESALE',
      subtitle:
        'Direct supply from Zamora to fine-dining kitchens in Quito, Cuenca, and Guayaquil, and yoga/retreat centers in Vilcabamba and Mindo.',
      heroTag: 'SENSORY KIT • EXACTLY 5 BEANS',
      heroCaption: '5 whole Glassy Crunch purple beans + 1 control fermented brown bean for side-by-side testing',
      wholesaleTitle: 'B2B WHOLESALE TERMS',
      wholesalePoints: [
        'Standardized modular format: 250 g blocks (12 × 20.8 g); 500 g (2 × 250 g) and 1 kg (4 × 250 g) orders',
        'Wholesale pricing from $44.00 – $48.00 / kg based on formula and monthly volume',
        'Pure slate-purple pigment, zero burnt notes or acetic vinegar off-flavors',
        'Same-day dispatch via Zamora → Loja → Cuenca cooperatives or Servientrega',
      ],
      challengeTitle: '15-MINUTE SOMATOSENSORY PROTOCOL',
      challengeDesc:
        'A direct live tasting test using exactly 5 whole beans so kitchens and facilitators can verify living cacao in 15 minutes:',
      kitContentsTitle: "WHAT'S INSIDE THE B2B TASTING KIT:",
      kitContents: [
        '20 whole Glassy Crunch beans (enough for 4 complete 5-bean tests)',
        'Control fermented brown beans to compare cut, snap, and aroma',
        'Tasting samples of INCA Ancestral Silk, Andean Gold Craft & Purple Guayusa Elixir vial',
      ],
      phases: [
        { step: 'PHASE 01', title: 'Snap Test', detail: 'Crisp glass-like crack next to the ear, solid purple interior, 0% vinegar aroma.' },
        { step: 'PHASE 02', title: '5-Bean Dose', detail: 'Chew exactly 5 whole beans (~6–7 g) with intact vella: crunchy texture and bright berry-floral notes.' },
        { step: 'PHASE 03', title: 'NO Response (10–15 min)', detail: 'Tangible vasodilation (warmth in neck and hands) and clear focus without jitters.' },
      ],
      ctaLabel: '5 Bean Kit & B2B Pricing',
      whatsappMessage:
        'Hi Eugenio / ORO PÚRPURA, I am interested in B2B wholesale pricing / the 5 Bean Challenge Kit for my restaurant or retreat center in: ',
    },
    trust: {
      eyebrow: '06 // ECUADOR SHIPPING & PAYMENTS',
      title: 'EFFORTLESS ORDERING IN CHAT, ZERO CHECKOUT FRICTION',
      shippingTitle: 'Nationwide Servientrega Courier',
      shippingDesc: 'Door-to-door delivery in 24–48 hours across all 24 provinces. Free on all Sets.',
      paymentsTitle: 'Secure Payment Methods via WhatsApp',
      paymentsList: [
        { method: 'Deuna! (0% fee QR)', detail: 'Instant payment from your Ecuadorian banking app' },
        { method: 'Local Bank Transfer', detail: 'Banco Pichincha • Banco Guayaquil • Produbanco' },
      ],
    },
    footer: {
      address: 'Stabilization & Grinding Workshop: Zamora, Zamora-Chinchipe, Ecuador.',
      ecosystem:
        'oropurpura.incatrailfoods.com — Direct-to-consumer initiative powered by The Inca Trail Foods / Cacao Zamora.',
      b2bLink: 'Chefs / 5 Bean Challenge (B2B)',
      rights: '© 2026 ORO PÚRPURA. Unfermented, unroasted living cacao.',
    },
  },
};

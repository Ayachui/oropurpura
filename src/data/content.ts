export type Lang = 'es' | 'en';
export type PackWeight = '250g' | '500g' | '1000g';

export interface CalibratorGoal {
  id: 'focus' | 'energy' | 'ritual';
  tag: string;
  title: string;
  subtitle: string;
  formulaName: string;
  skuBadge: string;
  accentColor: string;
  protocolPrimaryLabel: string;
  protocolPrimary: string;
  protocolSecondaryLabel: string;
  protocolSecondary: string;
  biochemistry: string[];
  cupCost: string;
  cafeComparison: string;
  recommendedSet: string;
  recommendedPrice: string;
  whatsappMessage: string;
}

export interface SetBundle {
  id: string;
  code: string;
  name: string;
  price: string;
  savings: string;
  badge: string;
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
  tagline: string;
  accentToken: 'purple' | 'ochre' | 'ruby';
  cacaoPercent: string;
  prices: Record<PackWeight, string>;
  unitCost: Record<PackWeight, string>;
  servingLabel: string;
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
  };
  ticker: {
    text: string;
    availabilityLabel: string;
    availabilityValue: string;
  };
  nav: {
    why: string;
    calibrator: string;
    shop: string;
    science: string;
    origin: string;
    b2b: string;
    cta: string;
  };
  hero: {
    eyebrow: string;
    h1Prefix: string;
    h1Number: string;
    h1Rest: string;
    hookLead: string;
    hookPillars: Array<{ code: string; text: string }>;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    telemetry: Array<{ value: string; label: string }>;
    diptychLeftTag: string;
    diptychLeftCaption: string;
    diptychRightTag: string;
    diptychRightCaption: string;
  };
  conflict: {
    eyebrow: string;
    title: string;
    thesis: string;
    colParam: string;
    colConventional: string;
    colOro: string;
    filterLabel: string;
    rows: Array<{
      param: string;
      conventional: string;
      oro: string;
      deltaTag: string;
    }>;
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
    ctaLabel: string;
    goals: CalibratorGoal[];
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
    closeSpecLabel: string;
    ingredientsTitle: string;
    nutritionTitle: string;
    col100g: string;
    colServing: string;
    orderBlockCta: string;
    sets: SetBundle[];
    skus: IndividualSku[];
  };
  science: {
    eyebrow: string;
    title: string;
    subtitle: string;
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
  b2b: {
    eyebrow: string;
    title: string;
    subtitle: string;
    wholesaleTitle: string;
    wholesalePoints: string[];
    challengeTitle: string;
    challengeDesc: string;
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
    rights: string;
  };
}

export const CONTENT: Record<Lang, LocaleContent> = {
  es: {
    common: {
      copyText: 'Copiar pedido',
      copied: 'Copiado ✓',
      freeShippingBadge: 'ENVÍO GRATIS ECUADOR',
      orderViaWa: 'Pedir por WhatsApp',
      parentPrefix: 'por',
    },
    ticker: {
      text: 'LOTE №01 • COSECHA NAPURAK (ZAMORA-CHINCHIPE) • 0% FERMENTACIÓN • ENVÍO GRATIS A TODO EL ECUADOR POR SERVIENTREGA',
      availabilityLabel: 'DISPONIBLE:',
      availabilityValue: '38 / 100 SETS',
    },
    nav: {
      why: 'El Porqué',
      calibrator: 'Calibrador',
      shop: 'Sets & Bloques',
      science: 'Ciencia DP1–7',
      origin: 'Origen TZNK',
      b2b: 'B2B / Chefs',
      cta: 'Pedir por WhatsApp',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE, ECUADOR • CUNA MUNDIAL DEL CACAO (5,300 AÑOS)',
      h1Prefix: 'ORIGEN ',
      h1Number: '5300',
      h1Rest: ': NO ES CHOCOLATE. ES CACAO VIVO.',
      hookLead: 'Energía neuronal y vascular directa desde Zamora a tu puerta en 24–48 h:',
      hookPillars: [
        { code: '01', text: 'Bloques modulares de pasta viva (250 g–1 kg) para comer o batir en agua' },
        { code: '02', text: 'Hasta 10× más (-)-epicatequina que el chocolate tostado' },
        { code: '03', text: 'Sets desde $45 con envío gratis Servientrega y pago en WhatsApp' },
      ],
      subtitle:
        'Pastas funcionales sinérgicas y Elixir de Guayusa elaborados con cacao púrpura ancestral sin fermentar ni tostar. Sin azúcar refinada ni aditivos.',
      ctaPrimary: 'Explorar Sets con Envío Gratis',
      ctaSecondary: 'Calibrar mi dosis (30 seg)',
      telemetry: [
        { value: '0 DÍAS', label: 'Fermentación (0% ácido acético)' },
        { value: '≤ 75–80 °C', label: 'Estabilización al vacío (7–10 h)' },
        { value: '17.0–19.5 mg/g', label: '(-)-Epicatequina nativa (DP1)' },
        { value: '24 PROVINCIAS', label: 'Envío gratis Servientrega' },
      ],
      diptychLeftTag: 'CUT-TEST: PÚRPURA NATIVO',
      diptychLeftCaption: 'Fractura vítrea (Glassy Crunch) vs. grano fermentado marrón',
      diptychRightTag: 'BREW: 72–75 °C',
      diptychRightCaption: 'Suspensión rubí-lavanda sin película grasa',
    },
    conflict: {
      eyebrow: '02 // CONFLICTO DE CATEGORÍAS',
      title: 'MUERTE TÉRMICA VS. MATRIZ VIVA',
      thesis:
        'La fermentación y el tueste (120–145 °C) son el arte de crear un postre aromático. Pero el calor oxida hasta el 80% de los flavanoles vivos y convierte el grano en marrón. En ORO PÚRPURA detenemos el tiempo en menos de 10 horas desde la cosecha Shuar para preservar la matriz viva del fruto.',
      colParam: 'Parámetro Bioquímico',
      colConventional: 'Chocolate Convencional / Artesanal',
      colOro: 'ORO PÚRPURA (Cacao Vivo FMAD)',
      filterLabel: 'Diferencia clave',
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
    calibrator: {
      eyebrow: '03 // CALIBRADOR DE ESTADO Y DOSIS',
      title: 'CALIBRA TU PROTOCOLO EN 30 SEGUNDOS',
      subtitle:
        'Selecciona tu objetivo fisiológico. El algoritmo calcula la fórmula exacta, dosis por celda, temperatura del agua y el Set óptimo con envío gratis.',
      step1Label: 'PASO 01 // ELIGE TU ESCENARIO',
      step2Label: 'PASO 02 // PROTOCOLO CALIBRADO',
      costLabel: 'Costo por taza calculado',
      vsCafeLabel: 'vs. $3.50–$4.50 cafetería en Quito / Cuenca',
      recommendedLabel: 'Set recomendado',
      ctaLabel: 'Pedir este protocolo por WhatsApp',
      goals: [
        {
          id: 'focus',
          tag: 'NEURO-SINERGIA • 0% CAFEÍNA AÑADIDA',
          title: 'Enfoque profundo sin cafeína',
          subtitle: 'Para trabajo cognitivo, programación, diseño y decisiones de alto nivel sin temblor ni bajón.',
          formulaName: 'SKU 01: INCA Ancestral Silk',
          skuBadge: '68.5% CACAO VIVO • 4 CIRCUITOS',
          accentColor: '#3B0764',
          protocolPrimaryLabel: 'BREW (Bebida funcional)',
          protocolPrimary: '1 celda (20.8 g) batida con espumador en 180 ml de agua a 72–75 °C.',
          protocolSecondaryLabel: 'EAT (Microdosis directa)',
          protocolSecondary: '1/2 celda (10.4 g) disuelta lentamente antes de tu bloque de trabajo.',
          biochemistry: [
            '~245 mg (-)-epicatequina DP1 por celda',
            'Teobromina 2.4% + L-teanina de guayusa (ondas Alfa 8–12 Hz)',
            'Macamidas de maca (inhiben FAAH) + Copaiba (CB2)',
            'Piperina + Moringa (bloqueo UGT1A9 / COMT)',
          ],
          cupCost: '$1.88 – $2.04 / taza',
          cafeComparison: 'Ahorras >45% frente al café de especialidad',
          recommendedSet: 'Set 01 «Origen 5300»',
          recommendedPrice: '$45.00 USD',
          whatsappMessage:
            'Hola ORO PÚRPURA, usé el Calibrador para [Enfoque profundo sin cafeína] y quiero pedir [Set 01 «Origen 5300»] ($45.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'energy',
          tag: 'VASCULAR NO • ZERO-WASTE PRENSADO EN FRÍO',
          title: 'Energía matinal y tono vascular',
          subtitle: 'Óxido nítrico (NO), flujo sanguíneo, pre-entrenamiento limpio y fibra prebiótica de vella.',
          formulaName: 'SKU 03: Purple Guayusa Elixir',
          skuBadge: '68% TORTA DESGRASADA + 12% GUAYUSA',
          accentColor: '#881337',
          protocolPrimaryLabel: 'BREW (Elixir rubí-lavanda)',
          protocolPrimary: '2 cucharaditas (10 g) batidas en 180–200 ml de agua caliente a 75–80 °C (sin sedimento).',
          protocolSecondaryLabel: 'BOOST (Potenciador diario)',
          protocolSecondary: '5–7 g (1 cdta) en tu smoothie, proteína o café filtrado (Amazonian Mocha).',
          biochemistry: [
            '26–30 mg/g de (-)-epicatequina en torta prensada en frío',
            '33 kcal • 0.79 g grasa • 2.88 g fibra prebiótica por 10 g',
            '~30 mg cafeína suave de guayusa + L-teanina (4–6 h estables)',
            'Hibisco pH 3.8–4.2 (quelación de fitatos) + SGLT1',
          ],
          cupCost: '$0.79 – $0.96 / taza',
          cafeComparison: '4× más económico que un pre-entreno o latte',
          recommendedSet: 'Set 02 «Alquimia 360°»',
          recommendedPrice: '$65.00 USD',
          whatsappMessage:
            'Hola ORO PÚRPURA, usé el Calibrador para [Energía matinal y tono vascular] y quiero pedir [Set 02 «Alquimia 360°»] ($65.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'ritual',
          tag: 'TERRUAR PURO • EAT / BREW / CEREMONIA',
          title: 'Ritual diario, familia o ceremonia',
          subtitle: 'Perfil frutal-floral nativo de Zamora con sal marina y vainilla real, sin especias picantes.',
          formulaName: 'SKU 02: Andean Gold Craft',
          skuBadge: '70% CACAO VIVO • SAL & VAINILLA',
          accentColor: '#9A6B16',
          protocolPrimaryLabel: 'EAT / BREW (Uso diario)',
          protocolPrimary: '1/2 a 1 celda (10.4–20.8 g) como snack cristalino o bebida vespertina en agua a 72–75 °C.',
          protocolSecondaryLabel: 'CEREMONY (Dosis ceremonial)',
          protocolSecondary: '2 celdas de 250 g (41.7 g) o 1 celda del bloque de 500 g (41.7 g).',
          biochemistry: [
            '~550 mg epicatequina + ~580 mg teobromina por dosis ceremonial (41.7 g)',
            'Sal marina bloquea receptores de amargor TAS2R14/39',
            'Panela orgánica + Na+ activan bomba SGLT1',
            'Templado Silk Forma V: quiebre sonoro y fundido a 36.6 °C',
          ],
          cupCost: '$1.20 – $1.83 / taza',
          cafeComparison: 'Estándar ceremonial calibrado sin báscula',
          recommendedSet: 'Set 03 «Ritual Mensual / Dúo»',
          recommendedPrice: '$118.00 USD',
          whatsappMessage:
            'Hola ORO PÚRPURA, usé el Calibrador para [Ritual diario, familia o ceremonia] y quiero pedir [Set 03 «Ritual Mensual / Dúo»] ($118.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
      ],
    },
    shop: {
      eyebrow: '04 // VITRINA DIRECTA (D2C)',
      title: 'SETS CURADOS CON ENVÍO GRATIS',
      subtitle:
        'Cada Set está calibrado por debajo de 2 kg para incluir envío gratis por Servientrega a las 24 provincias del Ecuador. Pago seguro en conversación (Deuna!, transferencia o PayPhone).',
      setsTabTitle: '3 SETS RITUALES (ENVÍO GRATIS SERVIENTREGA)',
      blocksTitle: 'BLOQUES INDIVIDUALES & CONFIGURADOR POR PESO',
      blocksSubtitle:
        'Moldes profesionales de policarbonato calibrados para dosificar sin báscula. Selecciona el gramaje para ver precio y ficha técnica.',
      weightLabels: {
        '250g': { cells: '12 CELDAS × 20.8 g', weightNote: 'Starter / Daily' },
        '500g': { cells: '12 CELDAS × 41.7 g', weightNote: 'Course / Ceremonial' },
        '1000g': { cells: '15 CELDAS × 66.7 g', weightNote: 'Family / Facilitator / Pro' },
      },
      openSpecLabel: 'Ficha Técnica & Nutricional +',
      closeSpecLabel: 'Ocultar Ficha −',
      ingredientsTitle: 'Fórmula & Función Bioquímica',
      nutritionTitle: 'Información Nutricional Estimada',
      col100g: 'Por 100 g',
      colServing: 'Por porción',
      orderBlockCta: 'Pedir bloque por WhatsApp',
      sets: [
        {
          id: 'set-01',
          code: 'SET 01',
          name: '«ORIGEN 5300»',
          price: '$45.00',
          savings: 'Ahorras $7.00 con envío incluido',
          badge: 'INICIO • DOS POLOS DEL CACAO VIVO',
          items: [
            'INCA Ancestral Silk — Bloque 250 g (12 celdas × 20.8 g)',
            'Andean Gold Craft — Bloque 250 g (12 celdas × 20.8 g)',
          ],
          gift: 'Regalo Unboxing: 30 g granos enteros Glassy Crunch (Test 5–7 Bean Challenge)',
          netWeight: '530 g neto',
          yieldSummary: '24 tazas ($1.88/taza) o 48 dosis snack ($0.94/dosis)',
          ctaLabel: 'Pedir Set 01 ($45) por WhatsApp',
          whatsappMessage:
            'Hola ORO PÚRPURA, quiero pedir el Set 01 «Origen 5300» ($45.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'set-02',
          code: 'SET 02',
          name: '«ALQUIMIA 360°»',
          price: '$65.00',
          savings: 'Ahorras $11.00 con envío incluido',
          badge: 'MÁS ELEGIDO • CICLO MAÑANA / DÍA / NOCHE',
          featured: true,
          items: [
            'INCA Ancestral Silk — Bloque 250 g (12 celdas × 20.8 g)',
            'Andean Gold Craft — Bloque 250 g (12 celdas × 20.8 g)',
            'Purple Guayusa Elixir — Doypack 250 g (25–50 bebidas)',
          ],
          gift: 'Regalo Unboxing: 30 g granos enteros Glassy Crunch',
          netWeight: '780 g neto',
          yieldSummary: '49 bebidas funcionales ($1.33/taza promedio)',
          ctaLabel: 'Pedir Set 02 ($65) por WhatsApp',
          whatsappMessage:
            'Hola ORO PÚRPURA, quiero pedir el Set 02 «Alquimia 360°» ($65.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
        {
          id: 'set-03',
          code: 'SET 03',
          name: '«RITUAL MENSUAL / DÚO»',
          price: '$118.00',
          savings: 'Ahorras $16.00 con envío incluido',
          badge: 'MÁXIMO RENDIMIENTO • PAREJAS O PRÁCTICA DIARIA',
          items: [
            'INCA Ancestral Silk — Bloque 500 g (12 celdas × 41.7 g)',
            'Andean Gold Craft — Bloque 500 g (12 celdas × 41.7 g)',
            'Purple Guayusa Elixir — Doypack 500 g (50–100 bebidas)',
          ],
          gift: 'Regalo Unboxing: 30 g granos enteros Glassy Crunch',
          netWeight: '1,530 g neto',
          yieldSummary: '98 tazas estándar ($1.20/taza) o 48 ceremonias de 41.7 g',
          ctaLabel: 'Pedir Set 03 ($118) por WhatsApp',
          whatsappMessage:
            'Hola ORO PÚRPURA, quiero pedir el Set 03 «Ritual Mensual / Dúo» ($118.00 con envío gratis Servientrega). Mi ciudad es: ',
        },
      ],
      skus: [
        {
          id: 'inca',
          code: 'SKU 01 // FLAGSHIP',
          name: 'INCA Ancestral Silk',
          tagline: 'Neuro-activador de 4 circuitos con reología aterciopelada Form V.',
          accentToken: 'purple',
          cacaoPercent: '68.50% Cacao Vivo (63% pasta 18 µm + 5.5% manteca VMC)',
          prices: { '250g': '$24.50', '500g': '$44.50', '1000g': '$80.00' },
          unitCost: {
            '250g': '$2.04 / taza (20.8 g)',
            '500g': '$1.85 / taza (20.8 g)',
            '1000g': '$1.78 / taza (22.2 g)',
          },
          servingLabel: '1 celda (20.8 g)',
          ingredients: [
            { name: 'Pasta viva púrpura Cacao Zamora (18 µm con vella)', share: '63.00%', functionDesc: 'Flavanoles DP1–DP7, teobromina 2.4%, fibra prebiótica.' },
            { name: 'Manteca dorada nativa VMC prensada en frío', share: '5.50%', functionDesc: 'Extracción lipofílica (60 °C Spice Blooming) sin disparo excesivo de CCK.' },
            { name: 'Micropulverizado de panela orgánica', share: '27.00%', functionDesc: 'D-glucosa para activar transporte intestinal SGLT1.' },
            { name: 'Maca gelatinizada + Hibisco + Guayusa + Vainilla', share: '3.13%', functionDesc: 'Inhibición FAAH (macamidas), quelación de fitatos y L-teanina.' },
            { name: 'Sal marina + Ishpingo + Pimienta negra + Moringa + Copaiba', share: '1.37%', functionDesc: 'Bloqueo UGT1A9/COMT, supresión TAS2R y agonismo CB2.' },
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
          code: 'SKU 02 // BASE GASTRONÓMICA',
          name: 'Andean Gold Craft (Salted & Vanilla)',
          tagline: 'Estándar puro del terroir de Zamora con notas de cereza silvestre y melaza.',
          accentToken: 'ochre',
          cacaoPercent: '70.00% Cacao Vivo (65% pasta 18 µm + 5.0% manteca VMC)',
          prices: { '250g': '$22.00', '500g': '$39.00', '1000g': '$72.00' },
          unitCost: {
            '250g': '$1.83 / taza (20.8 g)',
            '500g': '$1.63 / taza (20.8 g)',
            '1000g': '$1.60 / taza (22.2 g)',
          },
          servingLabel: '1 celda (20.8 g)',
          ingredients: [
            { name: 'Pasta viva púrpura Cacao Zamora (18 µm con vella)', share: '65.00%', functionDesc: 'Matriz intacta de polifenoles DP1–DP7 y teobromina.' },
            { name: 'Manteca dorada nativa VMC prensada en frío', share: '5.00%', functionDesc: 'Brillo especular y chasquido vítreo (Silk Forma V).' },
            { name: 'Micropulverizado de panela orgánica', share: '29.00%', functionDesc: 'Equilibrio mineral y co-transporte de glucosa SGLT1.' },
            { name: 'Vaina de vainilla natural en polvo', share: '0.55%', functionDesc: 'Redondeo aromático floral sin esencias sintéticas.' },
            { name: 'Sal marina cristalina', share: '0.45%', functionDesc: 'Iones Na+ para SGLT1 y bloqueo de amargor TAS2R14/39.' },
          ],
          nutrition: [
            { label: 'Energía', per100g: '536 kcal', perServing: '111 kcal' },
            { label: 'Grasas totales', per100g: '37.0 g', perServing: '7.7 g' },
            { label: 'Carbohidratos (Panela)', per100g: '39.8 g', perServing: '8.3 g' },
            { label: 'Fibra prebiótica (Vella)', per100g: '9.4 g', perServing: '1.95 g' },
            { label: 'Proteínas', per100g: '8.2 g', perServing: '1.7 g' },
            { label: '(-)-Epicatequina (DP1)', per100g: '~1,210 mg', perServing: '~252 mg' },
            { label: 'Teobromina nativa', per100g: '~1,450 mg', perServing: '~300 mg' },
          ],
        },
        {
          id: 'guayusa',
          code: 'SKU 03 // ZERO-WASTE ELIXIR',
          name: 'Purple Guayusa Elixir',
          tagline: 'Polvo micronizado (<80 µm) de torta prensada en frío + guayusa amazónica.',
          accentToken: 'ruby',
          cacaoPercent: '68.00% Torta Desgrasada Púrpura (1.58× Epicatequina)',
          prices: { '250g': '$24.00', '500g': '$44.00', '1000g': '$79.00' },
          unitCost: {
            '250g': '$0.96 / bebida (10 g)',
            '500g': '$0.88 / bebida (10 g)',
            '1000g': '$0.79 / bebida (10 g)',
          },
          servingLabel: '2 cdta (10 g)',
          ingredients: [
            { name: 'Torta desgrasada púrpura Cacao Zamora (<80 µm)', share: '68.00%', functionDesc: 'Superconcentración: 26–30 mg/g DP1 y 3.5% teobromina.' },
            { name: 'Hoja de Guayusa amazónica (Ilex guayusa)', share: '12.00%', functionDesc: 'L-teanina + ~30 mg cafeína suave para 4–6 h de claridad.' },
            { name: 'Panela orgánica micropulverizada', share: '14.50%', functionDesc: 'Activación de bomba SGLT1 sin dulzor empalagoso.' },
            { name: 'Hibisco (Flor de Jamaica) + Maca gelatinizada', share: '4.30%', functionDesc: 'Fija color rubí-lavanda (pH 3.8–4.2) y suspende sin sedimento.' },
            { name: 'Sal marina + Ishpingo + Pimienta negra', share: '1.20%', functionDesc: 'Vasodilatación TRPA1 y bloqueo enzimático UGT1A9/10.' },
          ],
          nutrition: [
            { label: 'Energía', per100g: '330 kcal', perServing: '33 kcal' },
            { label: 'Grasas totales', per100g: '7.9 g', perServing: '0.79 g' },
            { label: 'Carbohidratos netos', per100g: '34.0 g', perServing: '3.4 g' },
            { label: 'Fibra prebiótica (Vella)', per100g: '28.8 g', perServing: '2.88 g' },
            { label: 'Proteínas', per100g: '16.5 g', perServing: '1.65 g' },
            { label: '(-)-Epicatequina (DP1)', per100g: '~1,900 mg', perServing: '~190 mg' },
            { label: 'Cafeína natural (Guayusa)', per100g: '300 mg', perServing: '~30 mg' },
          ],
        },
      ],
    },
    science: {
      eyebrow: '05 // CIENCIA & FARMACOCINÉTICA',
      title: 'CASCADA FENÓLICA DP1–DP7 Y 4 CIRCUITOS DE SINERGIA',
      subtitle:
        'La pasta 100% cruda sin formular es astringente y de baja absorción. Nuestra matriz resuelve la biodisponibilidad en cuatro niveles fisiológicos.',
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
      eyebrow: '06 // TRAZABILIDAD & TRANSPARENCIA',
      title: 'ORIGEN ZAMORA, PROYECTO TZNK Y FUNDADOR',
      terroirTitle: 'CUNA ARQUEOLÓGICA (5,300 AÑOS) & DIRECT TRADE SHUAR',
      terroirPoints: [
        { label: 'Altitud de cosecha', value: '900 – 1,362 m s.n.m. (Salto del Inca, San Francisco del Vergel, Playas de Cuje)' },
        { label: 'Alianza Direct Trade', value: 'Familias agricultoras Shuar (Comunidad Napurak / Asociación Los Bayanes)' },
        { label: 'Conservación forestal', value: 'Cacao Nacional relicto bajo dosel nativo — cero deforestación por CCN-51' },
        { label: 'Regla 7–10 horas', value: 'Del corte en chakra a estabilización al vacío y sellado en Zamora en < 10 horas' },
      ],
      tznkBadge: 'PASAPORTE DIGITAL DE LOTE • PROYECTO TZNK / EAS',
      tznkDesc:
        'Cada etiqueta impresa en nuestra unidad Epson C6500 (10×10 cm) lleva un QR dinámico vinculado al protocolo de atestación TZNK con coordenadas, altitud y hora exacta de estabilización.',
      tznkLinkLabel: 'Verificar protocolo en tzunki.com ↗',
      packagingTag: 'SISTEMA APOTHECARY GRID • 10 × 10 CM',
      terroirTag: 'CHAKRAS SHUAR • ZAMORA-CHINCHIPE',
      founderRole: 'FUNDADOR & INGENIERO DE PROCESOS ALIMENTARIOS',
      founderName: 'Eugenio Ayachui',
      founderBio:
        'Más de 11 años en Ecuador desarrollando tecnología de estabilización en frío (FMAD / VMC) junto a comunidades amazónicas. Creador de The Inca Trail Foods / Cacao Zamora, plataforma alineada con la declaración patrimonial de la Asamblea Nacional sobre Palanda como cuna mundial del cacao.',
      verifiedLabel: 'Perfiles verificados para comprobar autenticidad antes de pedir:',
    },
    b2b: {
      eyebrow: '07 // B2B • ALTA GASTRONOMÍA • CENTROS DE RETIRO',
      title: 'PROTOCOLO «THE 5–7 BEAN CHALLENGE» PARA CHEFS Y FACILITADORES',
      subtitle:
        'Abastecemos directamente desde Zamora a restaurantes de alta cocina en Quito, Cuenca y Guayaquil, y centros de retiro / yoga en Vilcabamba y Mindo.',
      wholesaleTitle: 'CONDICIONES MAYORISTAS B2B',
      wholesalePoints: [
        'Formatos profesionales: bloques 500 g (12 × 41.7 g) y 1,000 g (15 × 66.7 g)',
        'Tarifa B2B desde $44.00 – $48.00 / kg según fórmula y volumen mensual',
        'Pigmento púrpura pizarra nativo, 0% notas de quemado o vinagre acético',
        'Despacho el mismo día vía cooperativa Zamora → Loja → Cuenca o Servientrega',
      ],
      challengeTitle: 'KIT DE CATA SENSORIAL DE 15 MINUTOS',
      challengeDesc:
        'Solicita nuestro kit B2B (20 granos enteros Glassy Crunch + grano fermentado testigo + muestras de INCA, Andean Gold y vial de Purple Guayusa Elixir) para vivir la prueba somatosensorial:',
      phases: [
        { step: 'FASE 01', title: 'Snap Test', detail: 'Chasquido vítreo junto al oído, corte púrpura monolítico y 0% olor a vinagre.' },
        { step: 'FASE 02', title: 'Dosis 5–7 Granos', detail: 'Masticación de 8–10 g con vella intacta: textura crujiente y perfil floral-frutal.' },
        { step: 'FASE 03', title: 'Respuesta NO (10–15 min)', detail: 'Vasodilatación tangible (calor en cuello y manos) y claridad mental sin taquicardia.' },
      ],
      ctaLabel: 'Solicitar Kit B2B / Cata para Chefs y Retiros',
      whatsappMessage:
        'Hola Eugenio / ORO PÚRPURA, me interesa información B2B (precios por kg / Kit 5–7 Bean Challenge) para mi restaurante o centro de retiro en: ',
    },
    trust: {
      eyebrow: '08 // LOGÍSTICA Y PAGOS EN ECUADOR',
      title: 'COMPRA SIN FRICCIÓN NI FORMULARIOS LARGOS',
      shippingTitle: 'Envío Nacional Servientrega',
      shippingDesc: 'Entrega a domicilio en 24–48 horas a las 24 provincias del Ecuador. Gratis en todos los Sets.',
      paymentsTitle: 'Métodos de Pago en Chat WhatsApp',
      paymentsList: [
        { method: 'Deuna! (QR 0% comisión)', detail: 'Pago instantáneo desde tu app bancaria' },
        { method: 'Transferencia Bancaria', detail: 'Banco Pichincha • Banco Guayaquil • Produbanco' },
        { method: 'Tarjetas vía PayPhone', detail: 'Visa / Mastercard / Amex mediante link seguro en WhatsApp' },
      ],
    },
    footer: {
      address: 'Taller de Estabilización & Molienda: Zamora, Zamora-Chinchipe, Ecuador.',
      ecosystem:
        'oropurpura.incatrailfoods.com — Proyecto de consumo directo impulsado por The Inca Trail Foods / Cacao Zamora & Proyecto TZNK.',
      rights: '© 2026 ORO PÚRPURA. Cacao vivo sin fermentar ni tostar.',
    },
  },
  en: {
    common: {
      copyText: 'Copy order',
      copied: 'Copied ✓',
      freeShippingBadge: 'FREE SHIPPING ECUADOR',
      orderViaWa: 'Order via WhatsApp',
      parentPrefix: 'by',
    },
    ticker: {
      text: 'BATCH №01 • NAPURAK HARVEST (ZAMORA-CHINCHIPE) • 0% FERMENTATION • FREE SERVIENTREGA SHIPPING ACROSS ECUADOR',
      availabilityLabel: 'AVAILABLE:',
      availabilityValue: '38 / 100 SETS',
    },
    nav: {
      why: 'Why',
      calibrator: 'Calibrator',
      shop: 'Sets & Blocks',
      science: 'DP1–7 Science',
      origin: 'TZNK Origin',
      b2b: 'B2B / Chefs',
      cta: 'Order on WhatsApp',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE, ECUADOR • WORLD CRADLE OF CACAO (5,300 YEARS)',
      h1Prefix: 'ORIGIN ',
      h1Number: '5300',
      h1Rest: ": IT'S NOT CHOCOLATE. IT'S LIVING CACAO.",
      hookLead: 'Direct neuro & vascular fuel from Zamora to your door in 24–48 h:',
      hookPillars: [
        { code: '01', text: 'Modular living cacao blocks (250 g–1 kg) to eat or whisk in hot water' },
        { code: '02', text: 'Up to 10× more (-)-epicatechin than roasted craft chocolate' },
        { code: '03', text: 'Curated Sets from $45 with free Ecuador shipping via WhatsApp' },
      ],
      subtitle:
        'Synergistic functional pastes and Guayusa Elixir crafted from unfermented, unroasted ancestral purple cacao. Zero refined sugar or fillers.',
      ctaPrimary: 'Explore Sets with Free Shipping',
      ctaSecondary: 'Calibrate my dose (30 sec)',
      telemetry: [
        { value: '0 DAYS', label: 'Fermentation (0% acetic acid)' },
        { value: '≤ 75–80 °C', label: 'Vacuum stabilization (7–10 h)' },
        { value: '17.0–19.5 mg/g', label: 'Native (-)-Epicatechin (DP1)' },
        { value: '24 PROVINCES', label: 'Free Servientrega delivery' },
      ],
      diptychLeftTag: 'CUT-TEST: NATIVE PURPLE',
      diptychLeftCaption: 'Glassy fracture vs. conventional brown fermented bean',
      diptychRightTag: 'BREW: 72–75 °C',
      diptychRightCaption: 'Ruby-lavender suspension with zero oily film',
    },
    conflict: {
      eyebrow: '02 // CATEGORY CONFLICT',
      title: 'THERMAL DEATH VS. LIVING MATRIX',
      thesis:
        'Fermentation and roasting (120–145 °C) are the art of crafting an aromatic confection. Yet heat oxidizes up to 80% of living flavanols and turns the seed brown. At ORO PÚRPURA we halt oxidation within 10 hours of Shuar harvest to preserve the living fruit matrix.',
      colParam: 'Biochemical Parameter',
      colConventional: 'Conventional / Craft Chocolate',
      colOro: 'ORO PÚRPURA (Living Cacao FMAD)',
      filterLabel: 'Key delta',
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
    calibrator: {
      eyebrow: '03 // STATE & DOSE CALIBRATOR',
      title: 'CALIBRATE YOUR PROTOCOL IN 30 SECONDS',
      subtitle:
        'Select your physiological goal. The calibrator outputs the exact formula, cell dosage, water temperature, and optimal Set with free shipping.',
      step1Label: 'STEP 01 // CHOOSE YOUR SCENARIO',
      step2Label: 'STEP 02 // CALIBRATED PROTOCOL',
      costLabel: 'Calculated cost per cup',
      vsCafeLabel: 'vs. $3.50–$4.50 specialty café in Quito / Cuenca',
      recommendedLabel: 'Recommended Set',
      ctaLabel: 'Order this protocol via WhatsApp',
      goals: [
        {
          id: 'focus',
          tag: 'NEURO-SYNERGY • 0% ADDED CAFFEINE',
          title: 'Deep caffeine-free focus',
          subtitle: 'For engineering, deep work, and executive clarity with zero jitters or crash.',
          formulaName: 'SKU 01: INCA Ancestral Silk',
          skuBadge: '68.5% LIVING CACAO • 4 CIRCUITS',
          accentColor: '#3B0764',
          protocolPrimaryLabel: 'BREW (Functional drink)',
          protocolPrimary: '1 cell (20.8 g) whisked with a frother in 180 ml hot water at 72–75 °C.',
          protocolSecondaryLabel: 'EAT (Direct microdose)',
          protocolSecondary: '1/2 cell (10.4 g) melted slowly before a deep work session.',
          biochemistry: [
            '~245 mg (-)-epicatechin DP1 per cell',
            '2.4% theobromine + guayusa L-theanine (Alpha waves 8–12 Hz)',
            'Maca macamides (FAAH inhibition) + Copaiba (CB2)',
            'Piperine + Moringa (UGT1A9 / COMT blockade)',
          ],
          cupCost: '$1.88 – $2.04 / cup',
          cafeComparison: '>45% savings vs. specialty coffee',
          recommendedSet: 'Set 01 «Origen 5300»',
          recommendedPrice: '$45.00 USD',
          whatsappMessage:
            'Hi ORO PÚRPURA, I used the Calibrator for [Deep caffeine-free focus] and want to order [Set 01 «Origen 5300»] ($45.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'energy',
          tag: 'VASCULAR NO • COLD-PRESSED ZERO-WASTE',
          title: 'Morning energy & vascular tone',
          subtitle: 'Nitric oxide (NO), blood flow, clean pre-workout, and prebiotic vella fiber.',
          formulaName: 'SKU 03: Purple Guayusa Elixir',
          skuBadge: '68% COLD-PRESSED CAKE + 12% GUAYUSA',
          accentColor: '#881337',
          protocolPrimaryLabel: 'BREW (Ruby-lavender elixir)',
          protocolPrimary: '2 teaspoons (10 g) whisked in 180–200 ml hot water at 75–80 °C (zero sediment).',
          protocolSecondaryLabel: 'BOOST (Daily booster)',
          protocolSecondary: '5–7 g (1 tsp) in your morning smoothie, protein shake, or filter coffee.',
          biochemistry: [
            '26–30 mg/g (-)-epicatechin in cold-pressed cacao cake',
            '33 kcal • 0.79 g fat • 2.88 g prebiotic fiber per 10 g',
            '~30 mg gentle guayusa caffeine + L-theanine (4–6 h steady)',
            'Hibiscus pH 3.8–4.2 (phytate chelation) + SGLT1',
          ],
          cupCost: '$0.79 – $0.96 / cup',
          cafeComparison: '4× more affordable than a latte or pre-workout',
          recommendedSet: 'Set 02 «Alquimia 360°»',
          recommendedPrice: '$65.00 USD',
          whatsappMessage:
            'Hi ORO PÚRPURA, I used the Calibrator for [Morning energy & vascular tone] and want to order [Set 02 «Alquimia 360°»] ($65.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'ritual',
          tag: 'PURE TERROIR • EAT / BREW / CEREMONY',
          title: 'Daily ritual, family or ceremony',
          subtitle: 'Pure wild-cherry and floral Zamora terroir with sea salt and real vanilla.',
          formulaName: 'SKU 02: Andean Gold Craft',
          skuBadge: '70% LIVING CACAO • SALT & VANILLA',
          accentColor: '#9A6B16',
          protocolPrimaryLabel: 'EAT / BREW (Daily ritual)',
          protocolPrimary: '1/2 to 1 cell (10.4–20.8 g) as a crisp snack or evening drink in 72–75 °C water.',
          protocolSecondaryLabel: 'CEREMONY (Ceremonial dose)',
          protocolSecondary: '2 cells of 250 g block (41.7 g) or 1 cell of 500 g block (41.7 g).',
          biochemistry: [
            '~550 mg epicatechin + ~580 mg theobromine per ceremonial dose (41.7 g)',
            'Sea salt suppresses TAS2R14/39 bitterness receptors',
            'Organic panela + Na+ trigger SGLT1 symport',
            'Form V Silk temper: crisp snap and instant melt at 36.6 °C',
          ],
          cupCost: '$1.20 – $1.83 / cup',
          cafeComparison: 'Exact ceremonial standard without a scale',
          recommendedSet: 'Set 03 «Ritual Mensual / Dúo»',
          recommendedPrice: '$118.00 USD',
          whatsappMessage:
            'Hi ORO PÚRPURA, I used the Calibrator for [Daily ritual, family or ceremony] and want to order [Set 03 «Ritual Mensual / Dúo»] ($118.00 with free Servientrega shipping). My city is: ',
        },
      ],
    },
    shop: {
      eyebrow: '04 // DIRECT STOREFRONT (D2C)',
      title: 'CURATED SETS WITH FREE SHIPPING',
      subtitle:
        'Every Set stays under the 2 kg Servientrega tier so we include honest free courier shipping to all 24 provinces in Ecuador. Pay safely in chat (Deuna!, bank transfer, or PayPhone card link).',
      setsTabTitle: '3 RITUAL SETS (FREE SERVIENTREGA DELIVERY)',
      blocksTitle: 'INDIVIDUAL BLOCKS & WEIGHT CONFIGURATOR',
      blocksSubtitle:
        'Professional polycarbonate molds calibrated for scale-free dosing. Toggle weight to inspect pricing and technical sheets.',
      weightLabels: {
        '250g': { cells: '12 CELLS × 20.8 g', weightNote: 'Starter / Daily' },
        '500g': { cells: '12 CELLS × 41.7 g', weightNote: 'Course / Ceremonial' },
        '1000g': { cells: '15 CELLS × 66.7 g', weightNote: 'Family / Facilitator / Pro' },
      },
      openSpecLabel: 'Technical & Nutrition Sheet +',
      closeSpecLabel: 'Hide Sheet −',
      ingredientsTitle: 'Formula & Biochemical Function',
      nutritionTitle: 'Estimated Nutrition Facts',
      col100g: 'Per 100 g',
      colServing: 'Per serving',
      orderBlockCta: 'Order block via WhatsApp',
      sets: [
        {
          id: 'set-01',
          code: 'SET 01',
          name: '«ORIGEN 5300»',
          price: '$45.00',
          savings: 'Save $7.00 incl. shipping',
          badge: 'STARTER • TWO POLES OF LIVING CACAO',
          items: [
            'INCA Ancestral Silk — 250 g block (12 cells × 20.8 g)',
            'Andean Gold Craft — 250 g block (12 cells × 20.8 g)',
          ],
          gift: 'Unboxing Gift: 30 g whole Glassy Crunch beans (5–7 Bean Challenge)',
          netWeight: '530 g net',
          yieldSummary: '24 cups ($1.88/cup) or 48 snack doses ($0.94/dose)',
          ctaLabel: 'Order Set 01 ($45) on WhatsApp',
          whatsappMessage:
            'Hi ORO PÚRPURA, I want to order Set 01 «Origen 5300» ($45.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'set-02',
          code: 'SET 02',
          name: '«ALQUIMIA 360°»',
          price: '$65.00',
          savings: 'Save $11.00 incl. shipping',
          badge: 'MOST CHOSEN • MORNING / DAY / NIGHT CYCLE',
          featured: true,
          items: [
            'INCA Ancestral Silk — 250 g block (12 cells × 20.8 g)',
            'Andean Gold Craft — 250 g block (12 cells × 20.8 g)',
            'Purple Guayusa Elixir — 250 g pouch (25–50 drinks)',
          ],
          gift: 'Unboxing Gift: 30 g whole Glassy Crunch beans',
          netWeight: '780 g net',
          yieldSummary: '49 functional drinks ($1.33/cup average)',
          ctaLabel: 'Order Set 02 ($65) on WhatsApp',
          whatsappMessage:
            'Hi ORO PÚRPURA, I want to order Set 02 «Alquimia 360°» ($65.00 with free Servientrega shipping). My city is: ',
        },
        {
          id: 'set-03',
          code: 'SET 03',
          name: '«RITUAL MENSUAL / DÚO»',
          price: '$118.00',
          savings: 'Save $16.00 incl. shipping',
          badge: 'MAX YIELD • COUPLES OR DAILY PRACTICE',
          items: [
            'INCA Ancestral Silk — 500 g block (12 cells × 41.7 g)',
            'Andean Gold Craft — 500 g block (12 cells × 41.7 g)',
            'Purple Guayusa Elixir — 500 g pouch (50–100 drinks)',
          ],
          gift: 'Unboxing Gift: 30 g whole Glassy Crunch beans',
          netWeight: '1,530 g net',
          yieldSummary: '98 standard cups ($1.20/cup) or 48 ceremonies of 41.7 g',
          ctaLabel: 'Order Set 03 ($118) on WhatsApp',
          whatsappMessage:
            'Hi ORO PÚRPURA, I want to order Set 03 «Ritual Mensual / Dúo» ($118.00 with free Servientrega shipping). My city is: ',
        },
      ],
      skus: [
        {
          id: 'inca',
          code: 'SKU 01 // FLAGSHIP',
          name: 'INCA Ancestral Silk',
          tagline: '4-circuit neuro-activator with velvety Form V Silk rheology.',
          accentToken: 'purple',
          cacaoPercent: '68.50% Living Cacao (63% 18 µm paste + 5.5% VMC butter)',
          prices: { '250g': '$24.50', '500g': '$44.50', '1000g': '$80.00' },
          unitCost: {
            '250g': '$2.04 / cup (20.8 g)',
            '500g': '$1.85 / cup (20.8 g)',
            '1000g': '$1.78 / cup (22.2 g)',
          },
          servingLabel: '1 cell (20.8 g)',
          ingredients: [
            { name: 'Living purple Cacao Zamora paste (18 µm w/ vella)', share: '63.00%', functionDesc: 'DP1–DP7 flavanols, 2.4% theobromine, prebiotic fiber.' },
            { name: 'Cold-pressed native VMC golden butter', share: '5.50%', functionDesc: 'Lipophilic extraction (60 °C Spice Blooming) without CCK spike.' },
            { name: 'Organic panela micropowder', share: '27.00%', functionDesc: 'D-glucose to activate SGLT1 intestinal transport.' },
            { name: 'Gelatinized maca + Hibiscus + Guayusa + Vanilla', share: '3.13%', functionDesc: 'FAAH inhibition (macamides), phytate chelation, L-theanine.' },
            { name: 'Sea salt + Ishpingo + Black pepper + Moringa + Copaiba', share: '1.37%', functionDesc: 'UGT1A9/COMT blockade, TAS2R suppression, CB2 agonism.' },
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
          code: 'SKU 02 // GASTRONOMIC BASE',
          name: 'Andean Gold Craft (Salted & Vanilla)',
          tagline: 'Pure Zamora terroir benchmark with wild cherry and molasses notes.',
          accentToken: 'ochre',
          cacaoPercent: '70.00% Living Cacao (65% 18 µm paste + 5.0% VMC butter)',
          prices: { '250g': '$22.00', '500g': '$39.00', '1000g': '$72.00' },
          unitCost: {
            '250g': '$1.83 / cup (20.8 g)',
            '500g': '$1.63 / cup (20.8 g)',
            '1000g': '$1.60 / cup (22.2 g)',
          },
          servingLabel: '1 cell (20.8 g)',
          ingredients: [
            { name: 'Living purple Cacao Zamora paste (18 µm w/ vella)', share: '65.00%', functionDesc: 'Intact DP1–DP7 polyphenol and theobromine matrix.' },
            { name: 'Cold-pressed native VMC golden butter', share: '5.00%', functionDesc: 'Mirror gloss and crisp Form V Silk snap.' },
            { name: 'Organic panela micropowder', share: '29.00%', functionDesc: 'Mineral balance and SGLT1 glucose co-transport.' },
            { name: 'Natural vanilla bean powder', share: '0.55%', functionDesc: 'Floral aromatic rounding with zero synthetic extracts.' },
            { name: 'Crystalline sea salt', share: '0.45%', functionDesc: 'Na+ ions for SGLT1 and TAS2R14/39 bitterness suppression.' },
          ],
          nutrition: [
            { label: 'Energy', per100g: '536 kcal', perServing: '111 kcal' },
            { label: 'Total Fat', per100g: '37.0 g', perServing: '7.7 g' },
            { label: 'Carbohydrates (Panela)', per100g: '39.8 g', perServing: '8.3 g' },
            { label: 'Prebiotic Fiber (Vella)', per100g: '9.4 g', perServing: '1.95 g' },
            { label: 'Protein', per100g: '8.2 g', perServing: '1.7 g' },
            { label: '(-)-Epicatechin (DP1)', per100g: '~1,210 mg', perServing: '~252 mg' },
            { label: 'Native Theobromine', per100g: '~1,450 mg', perServing: '~300 mg' },
          ],
        },
        {
          id: 'guayusa',
          code: 'SKU 03 // ZERO-WASTE ELIXIR',
          name: 'Purple Guayusa Elixir',
          tagline: 'Micronized (<80 µm) cold-pressed purple cake + Amazonian guayusa.',
          accentToken: 'ruby',
          cacaoPercent: '68.00% Cold-Pressed Purple Cake (1.58× Epicatechin)',
          prices: { '250g': '$24.00', '500g': '$44.00', '1000g': '$79.00' },
          unitCost: {
            '250g': '$0.96 / drink (10 g)',
            '500g': '$0.88 / drink (10 g)',
            '1000g': '$0.79 / drink (10 g)',
          },
          servingLabel: '2 tsp (10 g)',
          ingredients: [
            { name: 'Cold-pressed purple Cacao Zamora cake (<80 µm)', share: '68.00%', functionDesc: 'Super-concentrated: 26–30 mg/g DP1 & 3.5% theobromine.' },
            { name: 'Amazonian Guayusa leaf (Ilex guayusa)', share: '12.00%', functionDesc: 'L-theanine + ~30 mg gentle caffeine for 4–6 h clarity.' },
            { name: 'Organic panela micropowder', share: '14.50%', functionDesc: 'SGLT1 pump activation without cloying sweetness.' },
            { name: 'Hibiscus + Gelatinized Maca', share: '4.30%', functionDesc: 'Locks ruby-lavender color (pH 3.8–4.2) & suspends particles.' },
            { name: 'Sea salt + Ishpingo + Black pepper', share: '1.20%', functionDesc: 'TRPA1 vasodilation & UGT1A9/10 enzyme blockade.' },
          ],
          nutrition: [
            { label: 'Energy', per100g: '330 kcal', perServing: '33 kcal' },
            { label: 'Total Fat', per100g: '7.9 g', perServing: '0.79 g' },
            { label: 'Net Carbohydrates', per100g: '34.0 g', perServing: '3.4 g' },
            { label: 'Prebiotic Fiber (Vella)', per100g: '28.8 g', perServing: '2.88 g' },
            { label: 'Protein', per100g: '16.5 g', perServing: '1.65 g' },
            { label: '(-)-Epicatechin (DP1)', per100g: '~1,900 mg', perServing: '~190 mg' },
            { label: 'Natural Caffeine (Guayusa)', per100g: '300 mg', perServing: '~30 mg' },
          ],
        },
      ],
    },
    science: {
      eyebrow: '05 // SCIENCE & PHARMACOKINETICS',
      title: 'DP1–DP7 PHENOLIC CASCADE & 4 SYNERGY CIRCUITS',
      subtitle:
        'Unformulated 100% raw paste is astringent and poorly absorbed. Our matrix solves bioavailability across four physiological pathways.',
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
      eyebrow: '06 // TRACEABILITY & TRANSPARENCY',
      title: 'ZAMORA ORIGIN, PROYECTO TZNK & FOUNDER',
      terroirTitle: '5,300-YEAR CRADLE & SHUAR DIRECT TRADE',
      terroirPoints: [
        { label: 'Harvest elevation', value: '900 – 1,362 m a.s.l. (Salto del Inca, San Francisco del Vergel, Playas de Cuje)' },
        { label: 'Direct Trade alliance', value: 'Shuar farming families (Napurak community / Los Bayanes association)' },
        { label: 'Forest stewardship', value: 'Relict Cacao Nacional under native canopy — zero CCN-51 deforestation' },
        { label: '7–10 hour rule', value: 'Pod opening to vacuum stabilization & sealing in Zamora under 10 hours' },
      ],
      tznkBadge: 'DIGITAL BATCH PASSPORT • PROYECTO TZNK / EAS',
      tznkDesc:
        'Every 10×10 cm label printed on our Epson C6500 carries a dynamic QR linked to the TZNK attestation protocol with coordinates, elevation, and exact stabilization timestamp.',
      tznkLinkLabel: 'Verify protocol at tzunki.com ↗',
      packagingTag: 'APOTHECARY GRID SYSTEM • 10 × 10 CM',
      terroirTag: 'SHUAR CHAKRAS • ZAMORA-CHINCHIPE',
      founderRole: 'FOUNDER & FOOD PROCESS ENGINEER',
      founderName: 'Eugenio Ayachui',
      founderBio:
        '11+ years in Ecuador developing cold stabilization technology (FMAD / VMC) alongside Amazonian communities. Creator of The Inca Trail Foods / Cacao Zamora, aligned with the National Assembly patrimonial declaration of Palanda as the world cradle of cacao.',
      verifiedLabel: 'Verified profiles to confirm authenticity before ordering:',
    },
    b2b: {
      eyebrow: '07 // B2B • HAUTE CUISINE • RETREAT CENTERS',
      title: '«THE 5–7 BEAN CHALLENGE» FOR CHEFS & FACILITATORS',
      subtitle:
        'Direct supply from Zamora to fine-dining kitchens in Quito, Cuenca, and Guayaquil, and yoga/retreat centers in Vilcabamba and Mindo.',
      wholesaleTitle: 'B2B WHOLESALE TERMS',
      wholesalePoints: [
        'Pro formats: 500 g (12 × 41.7 g) and 1,000 g (15 × 66.7 g) modular blocks',
        'Wholesale pricing from $44.00 – $48.00 / kg based on formula and monthly volume',
        'Pure slate-purple pigment, zero burnt notes or acetic vinegar off-flavors',
        'Same-day dispatch via Zamora → Loja → Cuenca bus cooperatives or Servientrega',
      ],
      challengeTitle: '15-MINUTE SENSORY TASTING KIT',
      challengeDesc:
        'Request our B2B tasting kit (20 whole Glassy Crunch beans + control fermented brown bean + INCA, Andean Gold samples & Purple Guayusa Elixir vial) for the live somatosensory test:',
      phases: [
        { step: 'PHASE 01', title: 'Snap Test', detail: 'Crisp glass-like crack next to the ear, solid purple interior, 0% vinegar aroma.' },
        { step: 'PHASE 02', title: '5–7 Bean Dose', detail: 'Chew 8–10 g with intact vella: crunchy texture and bright berry-floral notes.' },
        { step: 'PHASE 03', title: 'NO Response (10–15 min)', detail: 'Tangible vasodilation (warmth in neck and hands) and clear focus without jitters.' },
      ],
      ctaLabel: 'Request B2B Kit / Tasting for Chefs & Retreats',
      whatsappMessage:
        'Hi Eugenio / ORO PÚRPURA, I am interested in B2B wholesale pricing / the 5–7 Bean Challenge Kit for my restaurant or retreat center in: ',
    },
    trust: {
      eyebrow: '08 // ECUADOR LOGISTICS & PAYMENTS',
      title: 'FRICTIONLESS ORDERING WITHOUT LONG CHECKOUTS',
      shippingTitle: 'Nationwide Servientrega Courier',
      shippingDesc: 'Door-to-door delivery in 24–48 hours across all 24 Ecuadorian provinces. Free on all Sets.',
      paymentsTitle: 'Payment Methods in WhatsApp Chat',
      paymentsList: [
        { method: 'Deuna! (QR 0% fee)', detail: 'Instant payment from your Ecuadorian banking app' },
        { method: 'Local Bank Transfer', detail: 'Banco Pichincha • Banco Guayaquil • Produbanco' },
        { method: 'Cards via PayPhone', detail: 'Visa / Mastercard / Amex via secure PayPhone link in WhatsApp' },
      ],
    },
    footer: {
      address: 'Stabilization & Grinding Workshop: Zamora, Zamora-Chinchipe, Ecuador.',
      ecosystem:
        'oropurpura.incatrailfoods.com — Direct-to-consumer initiative powered by The Inca Trail Foods / Cacao Zamora & Proyecto TZNK.',
      rights: '© 2026 ORO PÚRPURA. Unfermented, unroasted living cacao.',
    },
  },
};

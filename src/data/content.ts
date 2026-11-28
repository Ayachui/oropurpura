import type { Lang } from '../types/inventory';

export interface SiteContent {
  meta: {
    title: string;
  };
  common: {
    parentPrefix: string;
    copyText: string;
    copied: string;
    allLotsLabel: string;
    backToHome: string;
    floatingBuyLabel: string;
    floatingBlocksCount: (count: number) => string;
  };
  ticker: {
    stream: (count: number) => string;
    availablePrefix: string;
    blockSingular: string;
    blockPlural: string;
    soldOutLabel: string;
  };
  nav: {
    blocks: string;
    difference: string;
    benefits: string;
    howToUse: string;
    b2b: string;
    whatsappDirect: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    subtitle: string;
    chips: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    visualBadge: string;
    visualAlt: string;
  };
  difference: {
    eyebrow: string;
    title: string;
    subtitle: string;
    colMetric: string;
    colConventional: string;
    colOro: string;
    rows: Array<{
      metric: string;
      conventional: string;
      oro: string;
      highlight?: string;
    }>;
  };
  benefits: {
    eyebrow: string;
    title: string;
    cards: Array<{
      num: string;
      tag: string;
      title: string;
      description: string;
    }>;
    disclaimer: string;
  };
  howToUse: {
    eyebrow: string;
    title: string;
    subtitle: string;
    doses: Array<{
      amount: string;
      measure: string;
      title: string;
      tempBadge: string;
      description: string;
    }>;
  };
  homeCtas: {
    afterRitualEyebrow: string;
    afterRitualTitle: string;
    afterRitualSub: string;
    afterRitualBtn: string;
    afterOriginEyebrow: string;
    afterOriginTitle: string;
    afterOriginSub: string;
    afterOriginBtn: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    subtitle: string;
    step1Eyebrow: string;
    step1Title: string;
    step1Hint: string;
    tierScaleLabel: string;
    selectedBadge: string;
    chooseLotCta: string;
    fromPriceLabel: (price: string) => string;
    compareAllLabel: string;
    step2Eyebrow: string;
    step2Title: string;
    steps: string[];
    starterBadge: string;
    filterAvailableOnly: string;
    filterIncludeSold: string;
    lotStatusBadge: string;
    harvestLabel: string;
    originLabel: string;
    altitudeLabel: string;
    tastingLabel: string;
    formulaLabel: string;
    almacenLabel: string;
    logisticsNotice: string;
    blockPrefix: string;
    statusAvailable: string;
    statusSold: string;
    plusShipping: string;
    reserveCta: string;
    soldButtonLabel: string;
    servingsFormat: (cups: number) => string;
    availableShort: (count: number) => string;
    noLotsFallback: string;
  };
  origin: {
    eyebrow: string;
    title: string;
    zamoraTitle: string;
    zamoraBody: string;
    tznkBadge: string;
    tznkLinkLabel: string;
    founderRole: string;
    founderName: string;
    founderBio: string;
    packagingTag: string;
    packagingMeta: string;
    packagingCaption: string;
    terroirTag: string;
    terroirMeta: string;
    terroirCaption: string;
  };
  b2b: {
    eyebrow: string;
    title: string;
    priceValue: string;
    priceLabel: string;
    minValue: string;
    minLabel: string;
    description: string;
    ctaLabel: string;
  };
  logistics: {
    shippingTitle: string;
    shippingBody: string;
    paymentsTitle: string;
    paymentsSummary: string;
  };
  footer: {
    address: string;
    ecosystem: string;
    rights: string;
  };
}

export const CONTENT: Record<Lang, SiteContent> = {
  es: {
    meta: {
      title: 'ORO PÚRPURA — No es chocolate. Es cacao púrpura vivo.',
    },
    common: {
      parentPrefix: 'by',
      copyText: 'Copiar texto',
      copied: 'Copiado ✓',
      allLotsLabel: 'Todos los lotes',
      backToHome: '← Volver al inicio',
      floatingBuyLabel: 'Comprar',
      floatingBlocksCount: (count) =>
        count === 1 ? '1 bloque disp.' : `${count} bloques disp.`,
    },
    ticker: {
      stream: (count) =>
        `MICRO-LOTES VIVOS DE ZAMORA-CHINCHIPE • 0% FERMENTACIÓN • BLOQUES ÚNICOS ($100/KG) • DISPONIBLES: ${count} ${
          count === 1 ? 'BLOQUE' : 'BLOQUES'
        }`,
      availablePrefix: 'DISPONIBLES:',
      blockSingular: 'BLOQUE',
      blockPlural: 'BLOQUES',
      soldOutLabel: 'LOTE AGOTADO',
    },
    nav: {
      blocks: 'Bloques',
      difference: 'Diferencia',
      benefits: 'Beneficios',
      howToUse: 'Cómo Usar',
      b2b: 'B2B',
      whatsappDirect: 'WhatsApp',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE • ORIGEN 5300 AÑOS',
      h1: 'NO ES CHOCOLATE. ES CACAO PÚRPURA VIVO.',
      subtitle:
        'Pasta pura de cacao ancestral sin fermentar ni tostar. Parte trozos de tu bloque, mídelos a cucharadas y prepárala en 30 segundos para enfoque mental, circulación y vitalidad.',
      chips: [
        '🟣 100% Púrpura Nativo',
        '⚡ Hasta 10× más antioxidantes',
        '⚖️ Bloques únicos de peso real',
      ],
      ctaPrimary: 'Elegir mi bloque disponible →',
      ctaSecondary: '¿Por qué es diferente?',
      visualBadge: 'CORTE REAL • SIN FERMENTAR • ZAMORA, ECUADOR',
      visualAlt:
        'Monolito artesanal de cacao púrpura vivo sin fermentar con fractura mineral, trozos irregulares partidos del bloque y bebida rubí-púrpura.',
    },
    difference: {
      eyebrow: 'EL GRAN CONTRASTE • 5 DIFERENCIAS CLARAS',
      title: '¿Por qué nuestro cacao es púrpura y el resto es marrón?',
      subtitle:
        'El cacao en el árbol es púrpura brillante. La industria lo fermenta durante días y lo tuesta a 140 °C para hacer dulces: ese calor lo vuelve marrón y destruye hasta el 90% de sus propiedades medicinales.',
      colMetric: 'Criterio',
      colConventional: 'Cacao Convencional (Marrón • Procesado)',
      colOro: 'ORO PÚRPURA (Púrpura Vivo • Origen 5300)',
      rows: [
        {
          metric: '1. Color del grano',
          conventional: 'Marrón — resultado de oxidación y calor excesivo.',
          oro: 'Púrpura intenso — pigmentos naturales vivos (antocianinas).',
        },
        {
          metric: '2. Procesamiento',
          conventional: '5–7 días de fermentación + tueste agresivo a 120–145 °C.',
          oro: '0 días de fermentación. 0% tostado. Secado suave al vacío ≤ 75 °C en menos de 10 h.',
          highlight: '0% FERMENTACIÓN',
        },
        {
          metric: '3. Antioxidantes',
          conventional: 'Se pierde hasta el 80–90% (1.0–4.8 mg/g de epicatequina).',
          oro: '4–10× más polifenoles activos (17.0–19.5 mg/g) para tu cuerpo.',
          highlight: '4–10× MÁS POTENCIA',
        },
        {
          metric: '4. Sabor y pureza',
          conventional: 'Acidez acética de fermentación, amargor quemado o exceso de azúcar.',
          oro: '0% ácido acético. Sabor limpio a mora silvestre y flores, sin cascarilla.',
          highlight: '0% ÁCIDO ACÉTICO',
        },
        {
          metric: '5. Efecto en ti',
          conventional: 'Postre industrial con pico rápido de azúcar.',
          oro: 'Nutracéutico vivo para circulación, foco limpio y energía estable por 4–6 h.',
        },
      ],
    },
    benefits: {
      eyebrow: 'PROPIEDADES MEDICINALES Y BENEFICIOS',
      title: '¿Qué hace el cacao púrpura vivo en tu cuerpo?',
      cards: [
        {
          num: '01',
          tag: 'Óxido Nítrico',
          title: 'Corazón y Circulación',
          description:
            'Dilata los vasos sanguíneos, mejora la oxigenación y apoya una presión arterial saludable. Sentirás un calor vital limpio en 15–45 minutos.',
        },
        {
          num: '02',
          tag: 'Teobromina Nativa',
          title: 'Enfoque Mental sin Nerviosismo',
          description:
            'Aumenta el flujo sanguíneo al cerebro y mejora la concentración durante 4–6 horas, sin taquicardia ni el bajón del café.',
        },
        {
          num: '03',
          tag: 'Anandamida + Magnesio',
          title: 'Ánimo y Calma Emocional',
          description:
            'Activa las moléculas naturales del bienestar y reduce el estrés diario. Genera claridad mental y serenidad sostenida.',
        },
        {
          num: '04',
          tag: 'Polifenoles DP4–DP5',
          title: 'Control del Azúcar y Metabolismo',
          description:
            'Ayuda a suavizar los picos de glucosa después de las comidas. Protege las arterias frente a la oxidación del colesterol.',
        },
        {
          num: '05',
          tag: 'Prebióticos DP6–DP7',
          title: 'Microbiota Intestinal y Defensas',
          description:
            'Sus polifenoles complejos llegan intactos al intestino para nutrir tus bacterias benéficas. Fortalece tu inmunidad natural.',
        },
        {
          num: '06',
          tag: '80–95 mg GAE/g',
          title: 'Potencia Antioxidante Celular',
          description:
            'Combate la inflamación silenciosa y el envejecimiento celular. Densidad antioxidante hasta 10× mayor que el chocolate oscuro común.',
        },
      ],
      disclaimer:
        'Alimento funcional 100% natural de grano entero pelado (sin cascarilla). No es un medicamento ni sustituye tratamiento médico.',
    },
    howToUse: {
      eyebrow: 'CÓMO PREPARARLO EN 30 SEGUNDOS',
      title: 'Parte trozos de tu bloque y mídelos a cucharadas',
      subtitle:
        'Al partir el bloque con cuchillo se quiebra de forma natural en trozos y migas de distintos tamaños: mide tu dosis fácilmente con cucharadas o cucharaditas.',
      doses: [
        {
          amount: '20 g',
          measure: '2 cdas. soperas de trozos',
          title: 'Taza Diaria',
          tempBadge: '180 ml • 72–75 °C',
          description:
            'Mide 2 cucharadas de trozos partidos y bate 20 seg en 180 ml de agua caliente a 72–75 °C (sin hervir) para enfoque limpio.',
        },
        {
          amount: '40 g',
          measure: '4 cdas. soperas de trozos',
          title: 'Dosis Ceremonial',
          tempBadge: '200 ml • 72–75 °C',
          description:
            'Mide 4 cucharadas de trozos y bate en 200 ml de agua a 72–75 °C para meditación o trabajo creativo profundo.',
        },
        {
          amount: '5–10 g',
          measure: '1–2 cdtas. o 1 trozo',
          title: 'Directo (Eat)',
          tempBadge: 'SIN AGUA',
          description:
            'Desprende un trozo o 1–2 cucharaditas de fragmentos y déjalos fundir en la boca antes de entrenar o trabajar.',
        },
      ],
    },
    homeCtas: {
      afterRitualEyebrow: 'MICRO-LOTES ACTIVOS • PRECIO POR PESO REAL',
      afterRitualTitle: '¿Listo para probar tu primer monolito vivo?',
      afterRitualSub:
        'Explora los bloques disponibles del lote actual y reserva el tuyo en 1 clic por WhatsApp.',
      afterRitualBtn: 'Elegir mi bloque disponible →',
      afterOriginEyebrow: 'ENVÍOS SERVIENTREGA (24–48 H) A LAS 24 PROVINCIAS',
      afterOriginTitle: 'Reserva tu bloque único del lote actual',
      afterOriginSub:
        'Precio exacto calculado según el peso real y la rareza de cada cosecha. El envío se calcula aparte al confirmar tu ciudad.',
      afterOriginBtn: 'Ir a la vitrina de bloques →',
    },
    showcase: {
      eyebrow: 'TIENDA • CACAO PÚRPURA VIVO',
      title: 'Elige tu Cacao Púrpura',
      subtitle:
        'Cada cosecha tiene su propia receta, origen y nivel de rareza. Primero elige la cosecha que más te atraiga y luego escoge el peso de tu bloque.',
      step1Eyebrow: 'PASO 1 · ELIGE LA COSECHA',
      step1Title: '¿Qué cosecha quieres probar?',
      step1Hint:
        'El precio por kilo refleja la rareza del origen y la receta — desde $100/kg en nuestra Cosecha Clásica hasta micro-lotes de colección.',
      tierScaleLabel: 'Guía de categorías por rareza:',
      selectedBadge: '✓ Seleccionada',
      chooseLotCta: 'Ver bloques →',
      fromPriceLabel: (price) => `desde ${price}`,
      compareAllLabel: 'Ver todas las cosechas',
      step2Eyebrow: 'PASO 2 · ELIGE EL TAMAÑO DE TU BLOQUE',
      step2Title: 'Bloques artesanales de esta cosecha',
      steps: [
        '1. Elige tu cosecha arriba',
        '2. Escoge un bloque disponible según su peso',
        '3. Reserva por WhatsApp y recibe por Servientrega',
      ],
      starterBadge: 'IDEAL PARA EMPEZAR',
      filterAvailableOnly: 'Solo disponibles',
      filterIncludeSold: 'Mostrar vendidos',
      lotStatusBadge: 'MICRO-LOTE ARTESANAL',
      harvestLabel: 'COSECHA',
      originLabel: 'Origen / Comunidad',
      altitudeLabel: 'Altitud',
      tastingLabel: 'Perfil de sabor',
      formulaLabel: 'Ingredientes',
      almacenLabel: 'Datos del lote (Almacén)',
      logisticsNotice:
        'Pagas el peso exacto de tu bloque según la tarifa de esta cosecha. El envío por Servientrega se calcula aparte al confirmar tu ciudad en WhatsApp.',
      blockPrefix: 'BLOQUE',
      statusAvailable: 'DISPONIBLE',
      statusSold: 'VENDIDO',
      plusShipping: '+ envío Servientrega',
      reserveCta: 'Reservar en WhatsApp →',
      soldButtonLabel: 'Bloque reservado',
      servingsFormat: (cups) => `≈ ${cups} tazas de 20 g`,
      availableShort: (count) => `${count} disp.`,
      noLotsFallback: 'Próxima cosecha en preparación. Escríbenos por WhatsApp para reservar.',
    },
    origin: {
      eyebrow: 'ORIGEN ZAMORA-CHINCHIPE • PROYECTO TZNK & FUNDADOR',
      title: 'Trazabilidad directa desde la cuna del cacao',
      zamoraTitle: 'Origen Zamora & Proyecto TZNK',
      zamoraBody:
        'Recolección directa en bosques montanos de Zamora-Chinchipe (900–1,362 m) junto a familias Shuar (Napurak y Los Bayanes). Cada bloque viaja al vacío en bolsa metalizada con QR-pasaporte TZNK.',
      tznkBadge: 'TRAZABILIDAD VERIFICADA • INCA TRAIL FOODS',
      tznkLinkLabel: 'Verificar en incatrailfoods.com ↗',
      founderRole: 'FUNDADOR • THE INCA TRAIL FOODS / CACAO ZAMORA',
      founderName: 'Eugenio Ayachui',
      founderBio:
        'Ingeniero de procesos alimentarios en Zamora, Ecuador. Creador de la plataforma tecnológica que preserva el cacao púrpura vivo sin fermentar.',
      packagingTag: 'EMPAQUE AL VACÍO + QR TZNK',
      packagingMeta: 'PESO REAL',
      packagingCaption: 'Bolsa metalizada al vacío con etiqueta variable del peso exacto.',
      terroirTag: 'CHAKRA SHUAR • ZAMORA',
      terroirMeta: '900–1,362 m',
      terroirCaption: 'Cacao Nacional relicto bajo dosel amazónico en Zamora-Chinchipe.',
    },
    b2b: {
      eyebrow: 'ALIADOS B2B • CAFETERÍAS, CENTROS DE RETIRO, FACILITADORES Y TIENDAS',
      title: 'Abastecimiento profesional de cacao púrpura vivo',
      priceValue: '40% DCTO',
      priceLabel: 'Descuento permanente para socios B2B sobre la tarifa de cada lote',
      minValue: 'Desde 3 kg / mes',
      minLabel: 'Pedido mínimo mensual recurrente',
      description:
        'Los socios comerciales que realizan pedidos mensuales desde 3 kg reciben un 40% de descuento en cualquier lote disponible en Quito, Guayaquil, Cuenca y Vilcabamba. Envío Servientrega aparte según tarifa.',
      ctaLabel: 'Solicitar condiciones B2B por WhatsApp →',
    },
    logistics: {
      shippingTitle: 'Envíos Servientrega (24–48 h)',
      shippingBody:
        'A las 24 provincias del Ecuador — costo calculado según tu ciudad y pagado por separado.',
      paymentsTitle: 'Pagos en Ecuador',
      paymentsSummary:
        'Deuna! (QR) • Transferencia Pichincha / Guayaquil / Produbanco • Tarjetas vía PayPhone.',
    },
    footer: {
      address: 'Zamora, Zamora-Chinchipe, Ecuador',
      ecosystem:
        'oropurpura.incatrailfoods.com • ORO PÚRPURA — Un proyecto de The Inca Trail Foods / Cacao Zamora',
      rights: '© 2026 ORO PÚRPURA • ORIGEN 5300',
    },
  },
  en: {
    meta: {
      title: "ORO PÚRPURA — It's not chocolate. It's living purple cacao.",
    },
    common: {
      parentPrefix: 'by',
      copyText: 'Copy text',
      copied: 'Copied ✓',
      allLotsLabel: 'All active lots',
      backToHome: '← Back to home',
      floatingBuyLabel: 'Buy',
      floatingBlocksCount: (count) =>
        count === 1 ? '1 block avail.' : `${count} blocks avail.`,
    },
    ticker: {
      stream: (count) =>
        `LIVING MICRO-LOTS FROM ZAMORA-CHINCHIPE • 0% FERMENTATION • UNIQUE BLOCKS ($100/KG) • AVAILABLE: ${count} ${
          count === 1 ? 'BLOCK' : 'BLOCKS'
        }`,
      availablePrefix: 'AVAILABLE:',
      blockSingular: 'BLOCK',
      blockPlural: 'BLOCKS',
      soldOutLabel: 'LOT SOLD OUT',
    },
    nav: {
      blocks: 'Blocks',
      difference: 'Difference',
      benefits: 'Benefits',
      howToUse: 'How to Use',
      b2b: 'B2B',
      whatsappDirect: 'WhatsApp',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE • 5,300-YEAR ORIGIN',
      h1: "IT'S NOT CHOCOLATE. IT'S LIVING PURPLE CACAO.",
      subtitle:
        'Pure unfermented, unroasted ancestral cacao paste. Break off chunks from your block, measure by the spoonful, and brew in 30 seconds for mental focus, circulation, and vitality.',
      chips: [
        '🟣 100% Native Purple',
        '⚡ Up to 10× more antioxidants',
        '⚖️ Unique actual-weight blocks',
      ],
      ctaPrimary: 'Pick my available block →',
      ctaSecondary: 'Why is it different?',
      visualBadge: 'REAL CUT • UNFERMENTED • ZAMORA, ECUADOR',
      visualAlt:
        'Artisan unfermented deep-purple cacao monolith with natural mineral fracture, hand-broken irregular chunks, and ruby-purple cacao brew.',
    },
    difference: {
      eyebrow: 'THE CORE CONTRAST • 5 CLEAR DIFFERENCES',
      title: 'Why is our cacao purple while everything else is brown?',
      subtitle:
        'Cacao on the tree is vibrant purple. The industry ferments it for days and roasts it at 140 °C to make candy—turning it brown and destroying up to 90% of its medicinal compounds.',
      colMetric: 'Parameter',
      colConventional: 'Conventional Cacao (Brown • Processed)',
      colOro: 'ORO PÚRPURA (Living Purple • Origin 5300)',
      rows: [
        {
          metric: '1. Bean color',
          conventional: 'Brown — caused by oxidation and high-heat roasting.',
          oro: 'Vibrant purple — living natural pigments (anthocyanins).',
        },
        {
          metric: '2. Processing',
          conventional: '5–7 days fermentation + aggressive roasting at 120–145 °C.',
          oro: '0 days fermentation. 0% roasting. Gentle vacuum drying ≤ 75 °C in under 10 h.',
          highlight: '0% FERMENTATION',
        },
        {
          metric: '3. Antioxidants',
          conventional: 'Up to 80–90% destroyed (1.0–4.8 mg/g epicatechin).',
          oro: '4–10× more active polyphenols (17.0–19.5 mg/g) intact.',
          highlight: '4–10× HIGHER',
        },
        {
          metric: '4. Taste & purity',
          conventional: 'Vinegary acetic acidity, burnt bitterness, or heavy sugar.',
          oro: '0% acetic acid. Clean wild blackberry & floral notes, hull-free.',
          highlight: '0% ACETIC ACID',
        },
        {
          metric: '5. Effect on you',
          conventional: 'Confectionery dessert with a quick sugar spike.',
          oro: 'Living nutraceutical for circulation, clean focus, and steady 4–6 h energy.',
        },
      ],
    },
    benefits: {
      eyebrow: 'MEDICINAL PROPERTIES & HEALTH BENEFITS',
      title: 'What does living purple cacao do for your body?',
      cards: [
        {
          num: '01',
          tag: 'Nitric Oxide',
          title: 'Heart & Circulation',
          description:
            'Dilates blood vessels, boosts oxygenation, and supports healthy blood pressure. Feel a clean wave of physical warmth in 15–45 minutes.',
        },
        {
          num: '02',
          tag: 'Native Theobromine',
          title: 'Calm Focus Without Jitters',
          description:
            'Increases cerebral blood flow, sharpening memory and focus for 4–6 hours—without tachycardia or a coffee crash.',
        },
        {
          num: '03',
          tag: 'Anandamide + Magnesium',
          title: 'Mood & Emotional Calm',
          description:
            'Activates natural bliss molecules and eases daily stress. Creates sustained mental clarity and emotional calm.',
        },
        {
          num: '04',
          tag: 'DP4–DP5 Polyphenols',
          title: 'Blood Sugar & Metabolism',
          description:
            'Helps smooth post-meal glucose spikes and protects arterial walls against cholesterol oxidation.',
        },
        {
          num: '05',
          tag: 'DP6–DP7 Prebiotics',
          title: 'Gut Microbiome & Immunity',
          description:
            'Complex polyphenols reach the colon intact to nourish beneficial gut bacteria and strengthen natural immunity.',
        },
        {
          num: '06',
          tag: '80–95 mg GAE/g',
          title: 'Cellular Antioxidant Shield',
          description:
            'Fights silent inflammation and cellular aging with up to 10× the antioxidant density of regular dark chocolate.',
        },
      ],
      disclaimer:
        '100% natural functional food made from whole peeled cacao nibs (hull-free). Not a medicine and does not replace medical care.',
    },
    howToUse: {
      eyebrow: 'HOW TO PREPARE IN 30 SECONDS',
      title: 'Break off chunks from your block and measure by the spoon',
      subtitle:
        'When cut with a knife, pure cacao naturally breaks and crumbles into irregular pieces of different sizes—making it easy to dose by tablespoons or teaspoons.',
      doses: [
        {
          amount: '20 g',
          measure: '2 tbsp broken chunks',
          title: 'Daily Cup',
          tempBadge: '180 ml • 72–75 °C',
          description:
            'Measure 2 tablespoons of broken pieces and whisk 20 sec in 180 ml hot water at 72–75 °C (do not boil) for clean focus.',
        },
        {
          amount: '40 g',
          measure: '4 tbsp broken chunks',
          title: 'Ceremonial Dose',
          tempBadge: '200 ml • 72–75 °C',
          description:
            'Measure 4 tablespoons of broken pieces and whisk in 200 ml water at 72–75 °C for meditation or deep creative sessions.',
        },
        {
          amount: '5–10 g',
          measure: '1–2 tsp or 1 chunk',
          title: 'Direct (Eat)',
          tempBadge: 'NO WATER',
          description:
            'Break off a chunk or 1–2 teaspoons of crumbles and let them melt slowly on your palate before training or deep work.',
        },
      ],
    },
    homeCtas: {
      afterRitualEyebrow: 'ACTIVE MICRO-LOTS • ACTUAL-WEIGHT PRICING',
      afterRitualTitle: 'Ready to try your first living monolith?',
      afterRitualSub:
        'Browse available blocks from the current lot and reserve yours in 1 click on WhatsApp.',
      afterRitualBtn: 'Pick my available block →',
      afterOriginEyebrow: 'SERVIENTREGA SHIPPING (24–48 H) ACROSS ALL 24 PROVINCES',
      afterOriginTitle: 'Reserve your unique block from the current lot',
      afterOriginSub:
        'Exact pricing calculated from actual weight and harvest rarity. Shipping is calculated separately for your city.',
      afterOriginBtn: 'Open block storefront →',
    },
    showcase: {
      eyebrow: 'SHOP • LIVING PURPLE CACAO',
      title: 'Choose Your Purple Cacao',
      subtitle:
        'Each harvest has its own recipe, origin, and rarity level. First pick the harvest that speaks to you, then choose your hand-weighed block.',
      step1Eyebrow: 'STEP 1 · PICK YOUR HARVEST',
      step1Title: 'Which harvest would you like to try?',
      step1Hint:
        'The per-kilo rate reflects origin rarity and recipe — starting at $100/kg for our Classic Harvest up to ultra-rare collector micro-lots.',
      tierScaleLabel: 'Rarity category guide:',
      selectedBadge: '✓ Selected',
      chooseLotCta: 'View blocks →',
      fromPriceLabel: (price) => `from ${price}`,
      compareAllLabel: 'Show all harvests',
      step2Eyebrow: 'STEP 2 · PICK YOUR BLOCK WEIGHT',
      step2Title: 'Artisan blocks from this harvest',
      steps: [
        '1. Pick a harvest above',
        '2. Choose an available block by weight',
        '3. Reserve via WhatsApp for Servientrega delivery',
      ],
      starterBadge: 'GREAT FIRST BLOCK',
      filterAvailableOnly: 'Available only',
      filterIncludeSold: 'Show sold',
      lotStatusBadge: 'ARTISAN MICRO-LOT',
      harvestLabel: 'HARVEST',
      originLabel: 'Origin / Community',
      altitudeLabel: 'Altitude',
      tastingLabel: 'Flavor profile',
      formulaLabel: 'Ingredients',
      almacenLabel: 'Almacén lot metrics',
      logisticsNotice:
        'You pay the exact weight of your block at this harvest rate. Servientrega shipping across Ecuador is calculated separately on WhatsApp.',
      blockPrefix: 'BLOCK',
      statusAvailable: 'AVAILABLE',
      statusSold: 'SOLD',
      plusShipping: '+ Servientrega shipping',
      reserveCta: 'Reserve on WhatsApp →',
      soldButtonLabel: 'Block reserved',
      servingsFormat: (cups) => `≈ ${cups} cups (20 g)`,
      availableShort: (count) => `${count} avail.`,
      noLotsFallback: 'Next harvest in preparation. Message us on WhatsApp to reserve.',
    },
    origin: {
      eyebrow: 'ZAMORA-CHINCHIPE ORIGIN • PROYECTO TZNK & FOUNDER',
      title: 'Direct traceability from the cradle of cacao',
      zamoraTitle: 'Zamora Origin & Proyecto TZNK',
      zamoraBody:
        'Direct harvest in Zamora-Chinchipe montane forests (900–1,362 m) with Shuar partner families (Napurak & Los Bayanes). Vacuum-sealed in foil pouches with a TZNK QR passport.',
      tznkBadge: 'VERIFIED TRACEABILITY • INCA TRAIL FOODS',
      tznkLinkLabel: 'Verify at incatrailfoods.com ↗',
      founderRole: 'FOUNDER • THE INCA TRAIL FOODS / CACAO ZAMORA',
      founderName: 'Eugenio Ayachui',
      founderBio:
        'Food process innovation engineer in Zamora, Ecuador. Creator of the platform preserving living unfermented purple cacao.',
      packagingTag: 'VACUUM SEALED + TZNK QR',
      packagingMeta: 'EXACT WEIGHT',
      packagingCaption: 'Metallized vacuum pouch with variable label showing exact block weight.',
      terroirTag: 'SHUAR CHAKRA • ZAMORA',
      terroirMeta: '900–1,362 m',
      terroirCaption: 'Heirloom Cacao Nacional grown under Amazonian canopy in Zamora-Chinchipe.',
    },
    b2b: {
      eyebrow: 'B2B PARTNERS • CAFÉS, RETREAT CENTERS, FACILITATORS & SHOPS',
      title: 'Professional supply of living purple cacao',
      priceValue: '40% OFF',
      priceLabel: 'Permanent B2B partner discount off any lot rate',
      minValue: 'From 3 kg / mo',
      minLabel: 'Minimum monthly recurring order',
      description:
        'Business partners ordering 3 kg or more per month receive a 40% discount across any available lot in Quito, Guayaquil, Cuenca, and Vilcabamba. Servientrega shipping billed separately.',
      ctaLabel: 'Request B2B terms via WhatsApp →',
    },
    logistics: {
      shippingTitle: 'Servientrega Shipping (24–48 h)',
      shippingBody:
        'Across all 24 provinces of Ecuador — calculated by city and paid separately.',
      paymentsTitle: 'Payments in Ecuador',
      paymentsSummary:
        'Deuna! (QR) • Bank Transfer (Pichincha / Guayaquil / Produbanco) • Cards via PayPhone.',
    },
    footer: {
      address: 'Zamora, Zamora-Chinchipe, Ecuador',
      ecosystem:
        'oropurpura.incatrailfoods.com • ORO PÚRPURA — A project by The Inca Trail Foods / Cacao Zamora',
      rights: '© 2026 ORO PÚRPURA • ORIGEN 5300',
    },
  },
};

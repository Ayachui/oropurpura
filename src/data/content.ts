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
  };
  ticker: {
    text: string;
    availablePrefix: string;
    blockSingular: string;
    blockPlural: string;
    soldOutLabel: string;
  };
  nav: {
    blocks: string;
    howToUse: string;
    science: string;
    origin: string;
    b2b: string;
    whatsappDirect: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    telemetryTitle: string;
    telemetry: Array<{ value: string; label: string }>;
    diptychLeftTag: string;
    diptychLeftMeta: string;
    diptychLeftCaption: string;
    diptychRightTag: string;
    diptychRightMeta: string;
    diptychRightCaption: string;
  };
  showcase: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: string[];
    starterBadge: string;
    lotStatusBadge: string;
    harvestLabel: string;
    originLabel: string;
    altitudeLabel: string;
    tastingLabel: string;
    formulaLabel: string;
    logisticsNotice: string;
    blockPrefix: string;
    statusAvailable: string;
    statusSold: string;
    plusShipping: string;
    reserveCta: string;
    soldButtonLabel: string;
    servingsFormat: (cups: number, ceremonies: number) => string;
    availableShort: (count: number) => string;
    noLotsFallback: string;
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
    visualLeftTag: string;
    visualLeftMeta: string;
    visualLeftCaption: string;
    visualRightTag: string;
    visualRightMeta: string;
    visualRightCaption: string;
  };
  science: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tableColMetric: string;
    tableColConventional: string;
    tableColOro: string;
    tableRows: Array<{
      metric: string;
      conventional: string;
      oro: string;
      highlight?: string;
    }>;
    cascadeEyebrow: string;
    cascadeTitle: string;
    vectors: Array<{
      laja: string;
      dpRange: string;
      title: string;
      mechanism: string;
    }>;
  };
  origin: {
    eyebrow: string;
    title: string;
    directTradeTitle: string;
    directTradeBody: string;
    terroirPoints: Array<{ label: string; value: string }>;
    tznkBadge: string;
    tznkDesc: string;
    tznkLinkLabel: string;
    founderRole: string;
    founderName: string;
    founderBio: string;
    verifiedChannelsLabel: string;
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
    eyebrow: string;
    title: string;
    shippingTitle: string;
    shippingBody: string;
    paymentsTitle: string;
    payments: Array<{ method: string; detail: string }>;
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
      title: 'ORO PÚRPURA — Origen 5300: No es chocolate. Es cacao vivo.',
    },
    common: {
      parentPrefix: 'by',
      copyText: 'Copiar texto',
      copied: 'Copiado ✓',
      allLotsLabel: 'Todos los lotes',
    },
    ticker: {
      text: 'MICRO-LOTES VIVOS DE ZAMORA-CHINCHIPE • 0% FERMENTACIÓN • BLOQUES ÚNICOS POR PESO REAL ($100/KG) • ENVÍOS SERVIENTREGA A TODO EL ECUADOR',
      availablePrefix: 'DISPONIBLES AHORA:',
      blockSingular: 'BLOQUE',
      blockPlural: 'BLOQUES',
      soldOutLabel: 'LOTE AGOTADO',
    },
    nav: {
      blocks: 'Bloques Vivos',
      howToUse: 'Cómo Usar',
      science: 'Ciencia DP1–7',
      origin: 'Origen TZNK',
      b2b: 'B2B ($60/kg)',
      whatsappDirect: 'WhatsApp Directo',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE, ECUADOR • CUNA MUNDIAL DEL CACAO (5,300 AÑOS)',
      h1: 'ORIGEN 5300: NO ES CHOCOLATE. ES CACAO VIVO.',
      subtitle:
        'Pasta viva de cacao púrpura ancestral sin fermentar ni tostar, elaborada exclusivamente con grano pelado de Zamora-Chinchipe. Moldeada artesanalmente en monolitos únicos de peso real para enfoque mental, vitalidad y ceremonias.',
      ctaPrimary: 'Ver bloques disponibles del lote',
      ctaSecondary: '¿Cómo se prepara? (20 g)',
      telemetryTitle: '¿POR QUÉ CACAO PÚRPURA VIVO? — 4 DIFERENCIAS CLAVE',
      telemetry: [
        {
          value: 'COLOR PÚRPURA REAL',
          label: 'Sin fermentar ni tostar: conserva su pigmento natural vivo, no marrón quemado',
        },
        {
          value: '4–10× MÁS ANTIOXIDANTES',
          label: 'Polifenoles vivos intactos que el tueste del chocolate comercial destruye',
        },
        {
          value: 'ENFOQUE SIN NERVIOSISMO',
          label: 'Energía limpia y sostenida por teobromina natural, sin temblor ni bajón del café',
        },
        {
          value: 'LISTO EN 30 SEGUNDOS',
          label: 'Córtalo a cuchillo en virutas: cómelo directo o bátelo en agua caliente (72–75 °C)',
        },
      ],
      diptychLeftTag: 'CUT-TEST: PÚRPURA NATIVO',
      diptychLeftMeta: 'GLASSY CRUNCH • 0% FERMENTACIÓN',
      diptychLeftCaption:
        'Fractura vítrea púrpura del grano pelado frente al grano fermentado marrón oxidado.',
      diptychRightTag: 'CORTE EN VIRUTAS • EAT / BREW',
      diptychRightMeta: '20.0 g • DOSIS DIARIA',
      diptychRightCaption:
        'Monolito artesanal cortado a cuchillo en virutas finas sobre báscula de precisión.',
    },
    showcase: {
      eyebrow: 'VITRINA VIVA • MICRO-LOTES ACTUALES',
      title: 'Bloques Únicos del Lote Actual',
      subtitle:
        'Cada monolito se moldea artesanalmente en Zamora con su peso real único. Tarifa única de $100 / kg ($0.10 / g).',
      steps: [
        '1. Elige un bloque disponible',
        '2. Toca WhatsApp e indica tu ciudad',
        '3. Confirmas envío Servientrega y pagas por Deuna! o transferencia',
      ],
      starterBadge: 'IDEAL PARA EMPEZAR',
      lotStatusBadge: 'MICRO-LOTE ARTESANAL',
      harvestLabel: 'COSECHA',
      originLabel: 'Origen / Finca',
      altitudeLabel: 'Altitud',
      tastingLabel: 'Perfil Sensorial',
      formulaLabel: 'Composición / Sinergia del lote',
      logisticsNotice:
        'Tarifa transparente: $100 / kg ($0.10 / g). Cada bloque tiene un peso real único. El envío por Servientrega a todo el Ecuador se calcula y paga por separado al confirmar tu reserva en WhatsApp.',
      blockPrefix: 'BLOQUE',
      statusAvailable: 'DISPONIBLE',
      statusSold: 'VENDIDO',
      plusShipping: '+ envío Servientrega',
      reserveCta: 'Reservar por WhatsApp →',
      soldButtonLabel: 'Bloque reservado / Vendido',
      servingsFormat: (cups, ceremonies) =>
        `≈ ${cups} tazas de 20 g o ${ceremonies} ceremonias`,
      availableShort: (count) => `${count} disp.`,
      noLotsFallback: 'Próxima cosecha en preparación. Escríbenos por WhatsApp para reservar turno.',
    },
    howToUse: {
      eyebrow: 'CÓMO DISFRUTARLO • SIN MOLDES NI CÁLCULOS',
      title: 'Ritual de Corte en Virutas',
      subtitle:
        'No necesitas moldes ni medidas complicadas. Toma un cuchillo de cocina y corta virutas finas directamente del monolito.',
      doses: [
        {
          amount: '20 g',
          measure: '≈ 2 cucharadas de virutas',
          title: 'Taza Diaria / Enfoque',
          tempBadge: '180 ml • 72–75 °C',
          description:
            'Bate con molinillo, batidor de mano o mini-espumador en 180 ml de agua caliente a 72–75 °C (sin hervir). Brinda enfoque cognitivo limpio sin temblor ni bajón de cafeína.',
        },
        {
          amount: '40 g',
          measure: '≈ 4 cucharadas de virutas',
          title: 'Dosis Ceremonial',
          tempBadge: '200–220 ml • 72–75 °C',
          description:
            'Bate en 200–220 ml de agua a 72–75 °C para práctica meditativa profunda, sesiones creativas extendidas o trabajo de respiración consciente.',
        },
        {
          amount: '10 g',
          measure: 'Láminas finas a cuchillo',
          title: 'Consumo Directo (Eat)',
          tempBadge: 'SUBLINGUAL • SIN AGUA',
          description:
            'Corta láminas delgadas con cuchillo y déjalas fundirse lentamente en boca antes de trabajar o entrenar para una absorción sublingual rápida.',
        },
      ],
      visualLeftTag: 'CORTE EN VIRUTAS • CUCHILLO DE COCINA',
      visualLeftMeta: '20.0 g = 2 CUCHARADAS',
      visualLeftCaption:
        'Las virutas finas se disuelven en 30 segundos en agua caliente sin formar película pesada.',
      visualRightTag: 'SUSPENSIÓN RUBÍ-PÚRPURA',
      visualRightMeta: '72–75 °C • NO HERVIR',
      visualRightCaption:
        'Emulsión rubí-púrpura viva en vaso de borosilicato: antocianinas y flavanoles intactos.',
    },
    science: {
      eyebrow: 'BIOQUÍMICA DEL CACAO SIN FERMENTAR',
      title: 'Matriz Viva vs. Muerte Térmica',
      subtitle:
        'La fermentación prolongada y el tueste a 120–145 °C destruyen hasta el 80% de los polifenoles nativos. Nuestra estabilización al vacío preserva la matriz púrpura intacta a partir de grano pelado puro.',
      tableColMetric: 'Parámetro Analítico',
      tableColConventional: 'Fermentación y Tueste (120–145 °C)',
      tableColOro: 'ORO PÚRPURA (Vacío ≤ 75–80 °C • 7–10 h)',
      tableRows: [
        {
          metric: 'Corte transversal (Cut-Test)',
          conventional: 'Marrón oxidado, estructura porosa y taninos condensados',
          oro: 'Púrpura pizarra vítreo monolítico sin oxidación fermentativa',
          highlight: '0% FERMENTACIÓN',
        },
        {
          metric: '(-)-Epicatequina nativa (DP1)',
          conventional: '1.0–4.8 mg/g (pérdida térmica y enzimática)',
          oro: '17.0–19.5 mg/g de flavanol monomérico biodisponible',
          highlight: '4–10× SUPERIOR',
        },
        {
          metric: 'Teobromina nativa',
          conventional: 'Parcialmente lixiviada durante 5–7 días de fermentación',
          oro: '2.15–2.40% conservada íntegra en la matriz celular',
          highlight: 'ENERGÍA SERENA',
        },
        {
          metric: 'Acidez acética y pureza del grano',
          conventional: 'Alta acidez acética por fermentación; a menudo con restos de cáscara',
          oro: '0% ácido acético • 100% grano pelado limpio (sin cascarilla)',
          highlight: '0% ÁCIDO ACÉTICO',
        },
      ],
      cascadeEyebrow: 'LAS 3 LAJAS • CASCADA FENÓLICA DP1–DP7',
      cascadeTitle: 'Tres vectores fisiológicos del cacao púrpura vivo',
      vectors: [
        {
          laja: 'VECTOR 01',
          dpRange: 'DP1–DP2',
          title: 'Corazón & Circulación',
          mechanism:
            'Activación de la enzima eNOS y síntesis de óxido nítrico (NO): vasodilatación suave, mejor irrigación periférica y calidez física perceptible en 45–60 min.',
        },
        {
          laja: 'VECTOR 02',
          dpRange: 'DP3 + TEOBROMINA',
          title: 'Mente & Enfoque',
          mechanism:
            'Soporte a la microcirculación del hipocampo y neurovasculatura para concentración sostenida y lucidez tranquila sin taquicardia.',
        },
        {
          laja: 'VECTOR 03',
          dpRange: 'DP4–DP7',
          title: 'Equilibrio Metabólico',
          mechanism:
            'Protección del endotelio vascular frente al estrés oxidativo y modulación prebiótica suave de la microbiota intestinal.',
        },
      ],
    },
    origin: {
      eyebrow: 'ZAMORA-CHINCHIPE • PROYECTO TZNK & FUNDADOR',
      title: 'Origen Directo en la Cuna del Cacao',
      directTradeTitle: 'Recolección directa con familias Shuar (Direct Trade)',
      directTradeBody:
        'Trabajamos directamente con chakras forestales de altura de Cacao Nacional relicto (900–1,362 m s.n.m.) en las comunidades Shuar Napurak y Los Bayanes, Zamora-Chinchipe. Cada bloque se empaca al vacío en bolsa metalizada y lleva etiqueta variable de 10 × 10 cm con su peso exacto y QR-pasaporte de lote del Proyecto TZNK.',
      terroirPoints: [
        { label: 'COMUNIDADES', value: 'Napurak & Los Bayanes (Zamora-Chinchipe)' },
        { label: 'ALTITUD', value: '900–1,362 m s.n.m. • Bosque montano amazónico' },
        { label: 'EMPAQUE', value: 'Vacío + bolsa metalizada + etiqueta variable 10 × 10 cm' },
      ],
      tznkBadge: 'TZNK VERIFIED • TRAZABILIDAD DE LOTE',
      tznkDesc:
        'Cada micro-lote cuenta con registro verificable de cosecha, origen Shuar y atestación digital en el ecosistema Proyecto TZNK.',
      tznkLinkLabel: 'Verificar ecosistema Proyecto TZNK (tzunki.com) ↗',
      founderRole: 'FUNDADOR & INGENIERO DE PROCESOS ALIMENTARIOS',
      founderName: 'Eugenio Ayachui',
      founderBio:
        'Ingeniero tecnólogo en innovación alimentaria radicado en Zamora, Ecuador. Creador de la plataforma tecnológica The Inca Trail Foods / Cacao Zamora, dedicada a preservar la bioactividad viva del cacao amazónico ecuatoriano.',
      verifiedChannelsLabel: 'Canales verificados del fundador:',
      packagingTag: 'ETIQUETA APOTECARIA VARIABLE • 10 × 10 CM',
      packagingMeta: 'PESO REAL + QR TZNK',
      packagingCaption:
        'Bolsa metalizada al vacío con etiqueta mineral impresa con el peso exacto de cada monolito.',
      terroirTag: 'CHAKRA FORESTAL • ZAMORA-CHINCHIPE',
      terroirMeta: '900–1,362 m s.n.m.',
      terroirCaption:
        'Cacao Nacional relicto cultivado bajo dosel amazónico junto a familias Shuar.',
    },
    b2b: {
      eyebrow: 'ALIADOS B2B • CAFETERÍAS, CENTROS DE RETIRO, FACILITADORES Y TIENDAS',
      title: 'Abastecimiento profesional de cacao púrpura vivo',
      priceValue: '$60 / kg',
      priceLabel: 'Tarifa especial B2B (40% de ahorro frente a D2C)',
      minValue: 'Desde 3 kg / mes',
      minLabel: 'Pedido mínimo mensual recurrente',
      description:
        'Suministro directo de bloques vivos para barras de café de especialidad, estudios de yoga, facilitadores de ceremonias de cacao y centros de retiro en Quito, Guayaquil, Cuenca y Vilcabamba. El envío por Servientrega se paga por separado según tarifa del transportista.',
      ctaLabel: 'Solicitar condiciones B2B por WhatsApp →',
    },
    logistics: {
      eyebrow: 'ENVÍOS Y PAGOS EN ECUADOR',
      title: 'Logística transparente desde Zamora',
      shippingTitle: 'Envíos Nacionales — Servientrega (24–48 h)',
      shippingBody:
        'Despachos desde Zamora a las 24 provincias del Ecuador vía Servientrega (24–48 h). El costo de envío se calcula según tu ciudad y se paga por separado al confirmar tu reserva en WhatsApp.',
      paymentsTitle: 'Medios de Pago en Ecuador',
      payments: [
        {
          method: 'Deuna! (QR 0% comisión)',
          detail: 'Pago inmediato desde tu app bancaria sin recargos adicionales.',
        },
        {
          method: 'Transferencia Bancaria',
          detail: 'Banco Pichincha • Banco Guayaquil • Produbanco.',
        },
        {
          method: 'Tarjetas vía link PayPhone',
          detail: 'Visa, Mastercard y American Express mediante enlace seguro.',
        },
      ],
    },
    footer: {
      address: 'Zamora, Zamora-Chinchipe, Ecuador',
      ecosystem:
        'oropurpura.incatrailfoods.com — Un proyecto de The Inca Trail Foods / Cacao Zamora & Proyecto TZNK',
      rights: '© 2026 ORO PÚRPURA • ORIGEN 5300',
    },
  },
  en: {
    meta: {
      title: "ORO PÚRPURA — Origin 5300: It's not chocolate. It's living cacao.",
    },
    common: {
      parentPrefix: 'by',
      copyText: 'Copy text',
      copied: 'Copied ✓',
      allLotsLabel: 'All active lots',
    },
    ticker: {
      text: 'LIVING MICRO-LOTS FROM ZAMORA-CHINCHIPE • 0% FERMENTATION • UNIQUE ACTUAL-WEIGHT BLOCKS ($100/KG) • SERVIENTREGA SHIPPING ACROSS ECUADOR',
      availablePrefix: 'AVAILABLE NOW:',
      blockSingular: 'BLOCK',
      blockPlural: 'BLOCKS',
      soldOutLabel: 'LOT SOLD OUT',
    },
    nav: {
      blocks: 'Live Blocks',
      howToUse: 'How to Use',
      science: 'Science DP1–7',
      origin: 'Origin TZNK',
      b2b: 'B2B ($60/kg)',
      whatsappDirect: 'Direct WhatsApp',
    },
    hero: {
      eyebrow: 'ZAMORA-CHINCHIPE, ECUADOR • WORLD CRADLE OF CACAO (5,300 YEARS)',
      h1: "ORIGIN 5300: IT'S NOT CHOCOLATE. IT'S LIVING CACAO.",
      subtitle:
        'Living ancestral purple cacao paste, unfermented and unroasted, crafted exclusively from peeled Zamora-Chinchipe nibs. Artisan-cast into unique actual-weight monoliths for mental focus, vitality, and ceremonies.',
      ctaPrimary: 'View available lot blocks',
      ctaSecondary: 'How to prepare? (20 g)',
      telemetryTitle: 'WHY LIVING PURPLE CACAO? — 4 KEY DIFFERENCES',
      telemetry: [
        {
          value: 'TRUE NATURAL PURPLE',
          label: 'Unfermented & unroasted: keeps its living violet pigment instead of burnt brown',
        },
        {
          value: '4–10× MORE ANTIOXIDANTS',
          label: 'Intact living polyphenols that commercial chocolate roasting destroys',
        },
        {
          value: 'CALM, CLEAN FOCUS',
          label: 'Steady natural theobromine energy without coffee jitters or afternoon crash',
        },
        {
          value: 'READY IN 30 SECONDS',
          label: 'Shave curls with a knife: eat directly or whisk into hot water (72–75 °C)',
        },
      ],
      diptychLeftTag: 'CUT-TEST: NATIVE PURPLE',
      diptychLeftMeta: 'GLASSY CRUNCH • 0% FERMENTATION',
      diptychLeftCaption:
        'Glassy violet fracture of peeled unfermented bean vs. oxidized brown fermented bean.',
      diptychRightTag: 'KNIFE SHAVINGS • EAT / BREW',
      diptychRightMeta: '20.0 g • DAILY DOSE',
      diptychRightCaption:
        'Artisan monolith shaved with a kitchen knife onto a precision scale (20 g).',
    },
    showcase: {
      eyebrow: 'LIVE SHOWCASE • CURRENT MICRO-LOTS',
      title: 'Unique Blocks from the Current Lot',
      subtitle:
        'Every monolith is hand-cast in Zamora with its own exact actual weight. Flat rate of $100 / kg ($0.10 / g).',
      steps: [
        '1. Pick an available block',
        '2. Tap WhatsApp & enter your city',
        '3. Confirm Servientrega shipping & pay via Deuna! or transfer',
      ],
      starterBadge: 'GREAT FIRST BLOCK',
      lotStatusBadge: 'ARTISAN MICRO-LOT',
      harvestLabel: 'HARVEST',
      originLabel: 'Origin / Farm',
      altitudeLabel: 'Altitude',
      tastingLabel: 'Tasting Notes',
      formulaLabel: 'Lot Composition / Botanical Synergy',
      logisticsNotice:
        'Transparent rate: $100 / kg ($0.10 / g). Each block has a unique actual weight. Servientrega shipping across Ecuador is calculated and paid separately upon WhatsApp confirmation.',
      blockPrefix: 'BLOCK',
      statusAvailable: 'AVAILABLE',
      statusSold: 'SOLD',
      plusShipping: '+ Servientrega shipping',
      reserveCta: 'Reserve via WhatsApp →',
      soldButtonLabel: 'Block reserved / Sold',
      servingsFormat: (cups, ceremonies) =>
        `≈ ${cups} cups (20 g) or ${ceremonies} ceremonies`,
      availableShort: (count) => `${count} avail.`,
      noLotsFallback: 'Next harvest is currently being cast. Message us on WhatsApp to reserve early.',
    },
    howToUse: {
      eyebrow: 'HOW TO ENJOY • NO MOLDS OR CALCULATORS',
      title: 'Knife-Shaving Ritual (Virutas)',
      subtitle:
        'No molds or complicated measurements needed. Take a kitchen knife and shave fine curls directly from the monolith.',
      doses: [
        {
          amount: '20 g',
          measure: '≈ 2 tbsp of shavings',
          title: 'Daily Cup / Focus',
          tempBadge: '180 ml • 72–75 °C',
          description:
            'Whisk or froth in 180 ml of hot water at 72–75 °C (do not boil). Delivers clean cognitive focus without jitters or a caffeine crash.',
        },
        {
          amount: '40 g',
          measure: '≈ 4 tbsp of shavings',
          title: 'Ceremonial Dose',
          tempBadge: '200–220 ml • 72–75 °C',
          description:
            'Whisk into 200–220 ml of water at 72–75 °C for deep meditation, creative deep-work sessions, or conscious breathwork.',
        },
        {
          amount: '10 g',
          measure: 'Thin knife slices',
          title: 'Direct Consumption (Eat)',
          tempBadge: 'SUBLINGUAL • NO WATER',
          description:
            'Slice thin wafers with a knife and let them dissolve slowly on your palate before work or training for fast sublingual absorption.',
        },
      ],
      visualLeftTag: 'KNIFE SHAVINGS • KITCHEN BLADE',
      visualLeftMeta: '20.0 g = 2 TABLESPOONS',
      visualLeftCaption:
        'Fine purple curls emulsify in 30 seconds in hot water with a velvety texture.',
      visualRightTag: 'RUBY-PURPLE SUSPENSION',
      visualRightMeta: '72–75 °C • DO NOT BOIL',
      visualRightCaption:
        'Living ruby-purple brew in borosilicate glass: intact anthocyanins and flavanols.',
    },
    science: {
      eyebrow: 'UNFERMENTED CACAO BIOCHEMISTRY',
      title: 'Living Matrix vs. Thermal Death',
      subtitle:
        'Conventional fermentation and 120–145 °C roasting destroy up to 80% of native polyphenols. Our vacuum stabilization preserves the intact purple matrix from pure peeled nibs.',
      tableColMetric: 'Analytical Parameter',
      tableColConventional: 'Fermentation & Roasting (120–145 °C)',
      tableColOro: 'ORO PÚRPURA (Vacuum ≤ 75–80 °C • 7–10 h)',
      tableRows: [
        {
          metric: 'Cut-Test Cross Section',
          conventional: 'Oxidized brown interior, porous structure & condensed tannins',
          oro: 'Monolithic glassy slate-purple cut with zero fermentative oxidation',
          highlight: '0% FERMENTATION',
        },
        {
          metric: 'Native (-)-Epicatechin (DP1)',
          conventional: '1.0–4.8 mg/g (thermal & enzymatic degradation)',
          oro: '17.0–19.5 mg/g bioavailable monomeric flavanol',
          highlight: '4–10× HIGHER',
        },
        {
          metric: 'Native Theobromine',
          conventional: 'Partially leached during 5–7 days of fermentation',
          oro: '2.15–2.40% preserved intact in the cellular matrix',
          highlight: 'STEADY ENERGY',
        },
        {
          metric: 'Acetic Acidity & Nib Purity',
          conventional: 'High acetic acidity from fermentation; often contains shell fragments',
          oro: '0% acetic acid • 100% clean peeled nibs (hull-free)',
          highlight: '0% ACETIC ACID',
        },
      ],
      cascadeEyebrow: 'LAS 3 LAJAS • DP1–DP7 PHENOLIC CASCADE',
      cascadeTitle: 'Three physiological vectors of living purple cacao',
      vectors: [
        {
          laja: 'VECTOR 01',
          dpRange: 'DP1–DP2',
          title: 'Heart & Circulation',
          mechanism:
            'Activates eNOS and nitric oxide (NO) synthesis for gentle vasodilation, microcirculation, and noticeable physical warmth within 45–60 min.',
        },
        {
          laja: 'VECTOR 02',
          dpRange: 'DP3 + THEOBROMINE',
          title: 'Mind & Focus',
          mechanism:
            'Supports hippocampal microcirculation for sustained mental clarity and calm alertness without tachycardia.',
        },
        {
          laja: 'VECTOR 03',
          dpRange: 'DP4–DP7',
          title: 'Metabolic Balance',
          mechanism:
            'Endothelial protection against oxidative stress paired with gentle prebiotic support for the gut microbiome.',
        },
      ],
    },
    origin: {
      eyebrow: 'ZAMORA-CHINCHIPE • PROYECTO TZNK & FOUNDER',
      title: 'Direct Origin in the Cradle of Cacao',
      directTradeTitle: 'Direct Trade with Shuar families',
      directTradeBody:
        'Sourced directly from high-altitude heirloom Cacao Nacional forest chakras (900–1,362 m) in the Shuar communities of Napurak and Los Bayanes, Zamora-Chinchipe. Every monolith is vacuum-sealed inside a metallized pouch with an individual 10 × 10 cm variable label bearing its exact weight and Proyecto TZNK QR lot passport.',
      terroirPoints: [
        { label: 'COMMUNITIES', value: 'Napurak & Los Bayanes (Zamora-Chinchipe)' },
        { label: 'ALTITUDE', value: '900–1,362 m • Upper Amazon montane forest' },
        { label: 'PACKAGING', value: 'Vacuum + metallized pouch + 10 × 10 cm variable label' },
      ],
      tznkBadge: 'TZNK VERIFIED • LOT TRACEABILITY',
      tznkDesc:
        'Every micro-lot carries verifiable harvest records, Shuar community provenance, and digital attestation in the Proyecto TZNK registry.',
      tznkLinkLabel: 'Explore Proyecto TZNK registry (tzunki.com) ↗',
      founderRole: 'FOUNDER & FOOD PROCESS INNOVATION ENGINEER',
      founderName: 'Eugenio Ayachui',
      founderBio:
        'Food innovation process engineer based in Zamora, Ecuador. Creator of The Inca Trail Foods / Cacao Zamora, dedicated to preserving the living bioactivity of ancestral Amazonian cacao.',
      verifiedChannelsLabel: 'Verified founder channels:',
      packagingTag: 'VARIABLE APOTHECARY LABEL • 10 × 10 CM',
      packagingMeta: 'EXACT WEIGHT + TZNK QR',
      packagingCaption:
        'Vacuum-sealed foil pouch with mineral label printed with each monolith’s exact weight.',
      terroirTag: 'FOREST CHAKRA • ZAMORA-CHINCHIPE',
      terroirMeta: '900–1,362 m',
      terroirCaption:
        'Heirloom Cacao Nacional harvested under Amazonian canopy with Shuar partner families.',
    },
    b2b: {
      eyebrow: 'B2B PARTNERS • CAFÉS, RETREAT CENTERS, FACILITATORS & SHOPS',
      title: 'Professional supply of living purple cacao',
      priceValue: '$60 / kg',
      priceLabel: 'Special B2B rate (40% savings vs. D2C)',
      minValue: 'From 3 kg / mo',
      minLabel: 'Minimum recurring monthly order',
      description:
        'Direct monolith supply for specialty coffee bars, yoga studios, cacao ceremony facilitators, and retreat centers in Quito, Guayaquil, Cuenca, and Vilcabamba. Servientrega shipping is paid separately at carrier rate.',
      ctaLabel: 'Request B2B terms via WhatsApp →',
    },
    logistics: {
      eyebrow: 'SHIPPING & PAYMENTS IN ECUADOR',
      title: 'Transparent logistics from Zamora',
      shippingTitle: 'Nationwide Shipping — Servientrega (24–48 h)',
      shippingBody:
        'Dispatched from Zamora to all 24 provinces of Ecuador via Servientrega (24–48 h). Shipping cost is calculated according to your city and paid separately upon WhatsApp reservation confirmation.',
      paymentsTitle: 'Local Payment Methods in Ecuador',
      payments: [
        {
          method: 'Deuna! (QR 0% fee)',
          detail: 'Instant QR payment directly from your banking app with zero surcharge.',
        },
        {
          method: 'Bank Transfer',
          detail: 'Banco Pichincha • Banco Guayaquil • Produbanco.',
        },
        {
          method: 'Cards via PayPhone Link',
          detail: 'Visa, Mastercard, and American Express via secure payment link.',
        },
      ],
    },
    footer: {
      address: 'Zamora, Zamora-Chinchipe, Ecuador',
      ecosystem:
        'oropurpura.incatrailfoods.com — A project by The Inca Trail Foods / Cacao Zamora & Proyecto TZNK',
      rights: '© 2026 ORO PÚRPURA • ORIGEN 5300',
    },
  },
};

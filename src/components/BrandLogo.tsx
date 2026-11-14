interface BrandLogoProps {
  inverted?: boolean;
  showParentLink?: boolean;
  parentPrefix?: string;
}

export function BrandLogo({
  inverted = false,
  showParentLink = false,
  parentPrefix = 'by',
}: BrandLogoProps) {
  const strokeColor = inverted ? '#F4F2F7' : '#121016';
  const coreColor = inverted ? '#C084FC' : '#3B0764';

  return (
    <div className="brand-lockup">
      <a href="#top" className="brand-main" aria-label="ORO PÚRPURA — Origen 5300">
        <svg
          width="44"
          height="44"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="brand-monolith"
          shapeRendering="geometricPrecision"
        >
          {/* Outer Monolith with 45° Glassy Crunch chamfer at top-right */}
          <path
            d="M8 8 H72 L92 28 V92 H8 V8 Z"
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
          {/* Palanda 2-turn orthogonal spiral */}
          <path
            d="M22 22 H67 L78 33 V78 H22 V36 H64 V64 H36"
            stroke={strokeColor}
            strokeWidth="4.2"
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
          {/* Las 3 Lajas (Central Mayo-Chinchipe stelae) */}
          <rect x="40" y="42" width="5" height="16" fill={coreColor} />
          <rect x="48" y="38" width="5" height="20" fill={coreColor} />
          <rect x="56" y="44" width="5" height="14" fill={coreColor} />
        </svg>
        <div className="brand-text">
          <span className="brand-wordmark">ORO PÚRPURA</span>
          <span className="brand-descriptor">ORIGEN 5300 • ZAMORA</span>
        </div>
      </a>
      {showParentLink && (
        <a
          href="https://incatrailfoods.com"
          target="_blank"
          rel="noopener noreferrer"
          className="brand-parent-link"
        >
          {parentPrefix} The Inca Trail Foods
        </a>
      )}
    </div>
  );
}

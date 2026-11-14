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
          {/* Outer Monolith with 45° Glassy Crunch chamfer */}
          <path
            d="M8 8 H68 L92 32 V92 H8 V8 Z"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
          {/* Open Palanda orthogonal spiral turn */}
          <path
            d="M24 24 H63 L76 37 V76 H24 V44"
            stroke={strokeColor}
            strokeWidth="5.5"
            strokeLinejoin="miter"
            strokeLinecap="square"
          />
          {/* Las 3 Lajas — bold staggered stelae */}
          <rect x="36" y="40" width="7" height="24" fill={coreColor} />
          <rect x="47" y="34" width="7" height="30" fill={coreColor} />
          <rect x="58" y="44" width="7" height="20" fill={coreColor} />
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

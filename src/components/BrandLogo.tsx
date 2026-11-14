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
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="brand-monolith"
        >
          <path
            d="M5 5 H75 L95 25 V95 H5 V5 Z"
            stroke={strokeColor}
            strokeWidth="6"
            strokeLinejoin="miter"
          />
          <path
            d="M21 21 H68 L79 32 V79 H21 V37 H63 V63 H37"
            stroke={strokeColor}
            strokeWidth="5"
            strokeLinejoin="miter"
          />
          <rect x="42" y="42" width="4" height="16" fill={coreColor} />
          <rect x="49" y="39" width="4" height="19" fill={coreColor} />
          <rect x="56" y="43" width="4" height="15" fill={coreColor} />
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

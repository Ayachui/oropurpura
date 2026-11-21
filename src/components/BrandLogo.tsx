import { useId } from 'react';

interface BrandLogoProps {
  inverted?: boolean;
  showParentLink?: boolean;
  parentPrefix?: string;
  onNavigateHome?: () => void;
}

export function BrandLogo({
  inverted = false,
  showParentLink = false,
  parentPrefix = 'by',
  onNavigateHome,
}: BrandLogoProps) {
  const uid = useId().replace(/:/g, '');
  const ink = inverted ? '#E9D5FF' : '#320A63';

  return (
    <div className={inverted ? 'brand-lockup brand-lockup--inverted' : 'brand-lockup'}>
      <a
        href="#top"
        className="brand-main"
        aria-label="ORO PÚRPURA — Cacao Funcional · Origen 5300 · Zamora"
        onClick={(e) => {
          if (onNavigateHome) {
            e.preventDefault();
            onNavigateHome();
          }
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="brand-crest"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <mask
              id={`${uid}-nature`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="200"
              height="200"
            >
              <rect width="200" height="200" fill="white" />
              <path
                d="M 95.5 44 C 71 62, 62 83, 62 104 C 62 125, 71 146, 95.5 164"
                stroke="black"
                strokeWidth="4.4"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 85 72 C 91 74, 92.5 84, 85 89 C 77.5 84, 79 74, 85 72 Z" fill="black" />
              <path
                d="M 84.5 94.5 C 91.5 97, 93 108, 84.5 113.5 C 76 108, 77.5 97, 84.5 94.5 Z"
                fill="black"
              />
              <path d="M 85 119 C 91 121, 92.5 131, 85 136 C 77.5 131, 79 121, 85 119 Z" fill="black" />
              <path
                d="M 52 93 C 35 83, 24 70, 17 55"
                stroke="black"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 55 138 C 36 138, 22 132, 13 121"
                stroke="black"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
            </mask>
            <mask
              id={`${uid}-ring`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="200"
              height="200"
            >
              <rect width="200" height="200" fill="white" />
              <polygon points="100,2 109,21 127,26 109,31 100,46 91,31 73,26 91,21" fill="black" />
              <polygon points="100,168 113,183 100,198 87,183" fill="black" />
              <path d="M 58 98 C 30 92, 13 72, 10 44 C 37 49, 55 68, 60 94 Z" fill="black" />
              <path d="M 62 144 C 33 151, 13 141, 4 114 C 30 113, 49 122, 62 138 Z" fill="black" />
              <circle cx="173" cy="60" r="13" fill="black" />
              <circle cx="181" cy="104" r="13.5" fill="black" />
              <circle cx="173" cy="148" r="13" fill="black" />
              <line x1="145" y1="74" x2="173" y2="60" stroke="black" strokeWidth="11" />
              <line x1="152" y1="104" x2="181" y2="104" stroke="black" strokeWidth="11" />
              <line x1="145" y1="134" x2="173" y2="148" stroke="black" strokeWidth="11" />
            </mask>
          </defs>

          {/* Sacred Portal Ring & Celestial Anchors */}
          <circle
            cx="100"
            cy="104"
            r="76"
            stroke={ink}
            strokeWidth="3.6"
            fill="none"
            mask={`url(#${uid}-ring)`}
          />
          <g fill={ink}>
            <polygon points="100,7 104.8,21 118,25.5 104.8,30 100,42 95.2,30 82,25.5 95.2,21" />
            <polygon points="100,172.5 109,183.5 100,194.5 91,183.5" />
          </g>

          {/* Nature (Left): Living Cacao Pod + 3 Cacao Beans + 2 Sculpted Leaves */}
          <g fill={ink} mask={`url(#${uid}-nature)`}>
            <path d="M 97 35 C 64 50, 46 76, 46 104 C 46 132, 64 158, 97 173 L 97 35 Z" />
            <path d="M 54 96 C 29 88, 15 69, 13 46 C 36 51, 51 69, 57 93 Z" />
            <path d="M 58 141 C 32 146, 15 137, 8 116 C 30 115, 47 123, 59 136 Z" />
          </g>

          {/* Science / Hi-Tech (Right): 3-Facet Glassy Cacao Crystal + 3 Molecular Arms */}
          <g stroke={ink} strokeLinecap="round" strokeLinejoin="miter" fill="none">
            <polygon points="103,35 135,56 153,86 153,122 135,152 103,173" strokeWidth="5.2" />
            <polyline points="103,35 129,76 103,104 129,132 103,173" strokeWidth="3.8" />
            <line x1="129" y1="76" x2="153" y2="86" strokeWidth="3.6" />
            <line x1="103" y1="104" x2="153" y2="104" strokeWidth="3.8" />
            <line x1="129" y1="132" x2="153" y2="122" strokeWidth="3.6" />
            <polygon points="103,35 129,76 103,104" fill={ink} stroke="none" />
            <polygon points="129,132 153,122 153,104 103,104" fill={ink} stroke="none" />
            <polyline points="143,70 156,60 166,60" strokeWidth="4.2" />
            <line x1="153" y1="104" x2="174" y2="104" strokeWidth="4.4" />
            <polyline points="143,138 156,148 166,148" strokeWidth="4.2" />
          </g>

          <g>
            <circle cx="173" cy="60" r="7.2" stroke={ink} strokeWidth="3.8" fill="none" />
            <circle cx="181" cy="104" r="7.6" fill={ink} />
            <circle cx="173" cy="148" r="7.2" stroke={ink} strokeWidth="3.8" fill="none" />
          </g>
        </svg>
        <div className="brand-text">
          <span className="brand-wordmark">ORO PÚRPURA</span>
          <span className="brand-descriptor">CACAO FUNCIONAL · ZAMORA</span>
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

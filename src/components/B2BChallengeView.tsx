import type { LocaleContent } from '../data/content';
import { WhatsAppAction } from './WhatsAppAction';

interface B2BChallengeViewProps {
  t: LocaleContent;
  onBack: () => void;
}

export function B2BChallengeView({ t, onBack }: B2BChallengeViewProps) {
  return (
    <section className="b2b-page section-dark">
      <div className="container">
        <div className="b2b-topbar">
          <button type="button" className="btn-back-store" onClick={onBack}>
            {t.common.backToStorefront}
          </button>
          <span className="mono b2b-route-badge">B2B // HORECA // 5 BEAN CHALLENGE</span>
        </div>

        <div className="b2b-hero-grid">
          <div>
            <p className="eyebrow eyebrow-light">{t.b2b.eyebrow}</p>
            <h1 className="b2b-h1">{t.b2b.title}</h1>
            <p className="b2b-lead">{t.b2b.subtitle}</p>

            <div className="b2b-cta-wrap">
              <WhatsAppAction
                label={t.b2b.ctaLabel}
                message={t.b2b.whatsappMessage}
                copyLabel={t.common.copyText}
                copiedLabel={t.common.copied}
                variant="dark"
                fullWidth
              />
            </div>
          </div>

          <figure className="lab-frame lab-frame-dark" style={{ margin: 0 }}>
            <div className="lab-frame-header lab-frame-header-dark">
              <span>{t.b2b.heroTag}</span>
              <span>5 BEANS • ~6–7 G</span>
            </div>
            <img
              src="/images/five-bean-challenge.jpg"
              alt={t.b2b.heroCaption}
              className="lab-frame-img"
            />
            <figcaption className="lab-frame-caption lab-frame-caption-dark">
              {t.b2b.heroCaption}
            </figcaption>
          </figure>
        </div>

        <div className="b2b-grid">
          <div className="b2b-panel">
            <h2 className="b2b-panel-title mono">{t.b2b.challengeTitle}</h2>
            <p className="b2b-panel-desc">{t.b2b.challengeDesc}</p>

            <div className="phases-grid">
              {t.b2b.phases.map((ph) => (
                <div key={ph.step} className="phase-box">
                  <div className="phase-step">{ph.step}</div>
                  <div className="phase-title">{ph.title}</div>
                  <div className="phase-detail">{ph.detail}</div>
                </div>
              ))}
            </div>

            <div className="b2b-kit-box">
              <div className="mono b2b-kit-heading">{t.b2b.kitContentsTitle}</div>
              <ul className="b2b-list">
                {t.b2b.kitContents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="b2b-panel b2b-wholesale-panel">
            <div>
              <h2 className="b2b-panel-title mono">{t.b2b.wholesaleTitle}</h2>
              <ul className="b2b-list" style={{ marginTop: '18px' }}>
                {t.b2b.wholesalePoints.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="b2b-bottom-cta">
              <WhatsAppAction
                label={t.b2b.ctaLabel}
                message={t.b2b.whatsappMessage}
                copyLabel={t.common.copyText}
                copiedLabel={t.common.copied}
                variant="dark"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { buildWhatsAppUrl, copyOrderText } from '../utils/whatsapp';

interface WhatsAppActionProps {
  phone: string;
  label: string;
  message: string;
  copyLabel: string;
  copiedLabel: string;
  variant?: 'primary' | 'secondary' | 'dark';
  fullWidth?: boolean;
  compactCopy?: boolean;
}

export function WhatsAppAction({
  phone,
  label,
  message,
  copyLabel,
  copiedLabel,
  variant = 'primary',
  fullWidth = false,
  compactCopy = false,
}: WhatsAppActionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyOrderText(message);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div
      className={`wa-action-group ${fullWidth ? 'wa-full' : ''} ${
        compactCopy ? 'wa-compact-copy' : ''
      }`}
    >
      <a
        href={buildWhatsAppUrl(phone, message)}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn-${variant}`}
      >
        <span className="wa-dot" aria-hidden="true" />
        <span>{label}</span>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className={`btn-copy ${variant === 'dark' ? 'btn-copy-dark' : ''} ${
          compactCopy ? 'btn-copy-icon' : ''
        }`}
        title={copied ? copiedLabel : copyLabel}
        aria-label={copied ? copiedLabel : copyLabel}
      >
        {compactCopy ? (
          copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="square"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="9"
                y="9"
                width="11"
                height="11"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M5 15H4V4h11v1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          )
        ) : copied ? (
          copiedLabel
        ) : (
          copyLabel
        )}
      </button>
    </div>
  );
}

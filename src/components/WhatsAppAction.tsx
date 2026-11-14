import { useState } from 'react';
import { buildWhatsAppUrl, copyOrderText } from '../utils/whatsapp';

interface WhatsAppActionProps {
  label: string;
  message: string;
  copyLabel: string;
  copiedLabel: string;
  variant?: 'primary' | 'secondary' | 'dark' | 'compact';
  fullWidth?: boolean;
}

export function WhatsAppAction({
  label,
  message,
  copyLabel,
  copiedLabel,
  variant = 'primary',
  fullWidth = false,
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
    <div className={`wa-action-group ${fullWidth ? 'wa-full' : ''}`}>
      <a
        href={buildWhatsAppUrl(message)}
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
        className={`btn-copy ${variant === 'dark' ? 'btn-copy-dark' : ''}`}
        title={copyLabel}
        aria-label={copyLabel}
      >
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  );
}

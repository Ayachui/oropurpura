import { useEffect, type ReactNode } from 'react';

interface ModalDrawerProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  closeLabel?: string;
  children: ReactNode;
  wide?: boolean;
}

export function ModalDrawer({
  open,
  onClose,
  eyebrow,
  title,
  closeLabel = 'Cerrar',
  children,
  wide = false,
}: ModalDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="oro-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`oro-modal-panel ${wide ? 'oro-modal-wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="oro-modal-header">
          <div>
            {eyebrow ? <div className="eyebrow" style={{ marginBottom: '4px' }}>{eyebrow}</div> : null}
            <h3 className="oro-modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="oro-modal-close"
            onClick={onClose}
            aria-label={closeLabel}
          >
            ✕
          </button>
        </div>
        <div className="oro-modal-body">{children}</div>
      </div>
    </div>
  );
}

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Remover",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-verde-escuro/40 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="font-serif text-lg text-verde-escuro mb-2">{title}</h2>
        <p className="text-sm text-verde-muted font-light leading-relaxed mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full text-sm font-medium text-verde-muted hover:bg-verde-claro transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {isConfirming ? "Removendo..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
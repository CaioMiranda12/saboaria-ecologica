"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Excluir",
  cancelLabel = "Fechar",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Portal evita que o modal herde <form>/<label> pai (cliques e submit acidentais)
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={description ? "confirm-modal-description" : undefined}
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-verde-escuro/60 transition-colors hover:bg-verde-principal/10 hover:text-verde-escuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-principal/40"
        >
          <X size={18} />
        </button>

        <h2
          id="confirm-modal-title"
          className="pr-8 font-serif text-lg font-bold text-verde-escuro"
        >
          {title}
        </h2>

        {description && (
          <p id="confirm-modal-description" className="mt-2 text-sm text-verde-escuro/70">
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-verde-principal/30 px-5 py-2 text-sm font-medium text-verde-escuro transition-colors hover:bg-verde-principal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-principal/40"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/40"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
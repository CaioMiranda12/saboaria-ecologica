"use client";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

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
  const titleId = useId();
  const descriptionId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isConfirming) {
        event.preventDefault();
        onCancel();
      }
      if (event.key === "Tab") {
        const first = cancelRef.current;
        const last = confirmRef.current;
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [isOpen, isConfirming, onCancel]);
  if (!isOpen || typeof document === "undefined") return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-verde-escuro/50 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isConfirming) onCancel();
      }}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-[#cce3c7] bg-gradient-to-br from-white to-[#f3faef] p-4 shadow-2xl sm:p-6"
      >
        <h2 id={titleId} className="mb-2 font-serif text-xl text-verde-escuro">
          {title}
        </h2>
        <p id={descriptionId} className="mb-6 text-sm leading-relaxed text-verde-muted">
          {description}
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            className="rounded-full px-4 py-2 text-sm font-medium text-verde-muted transition-colors hover:bg-verde-claro focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-principal disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            ref={confirmRef}
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className="rounded-full bg-verde-principal px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verde-principal disabled:opacity-60"
          >
            {isConfirming ? "Aguarde..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

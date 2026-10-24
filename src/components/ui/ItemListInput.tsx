"use client";

import { useState, type KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { formInputClass } from "@/components/ui/FormField";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

type ItemListInputProps = {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  /** Nome do item no singular, usado no modal de exclusão (ex.: "ingrediente"). */
  itemLabel?: string;
  disabled?: boolean;
};

export function ItemListInput({
  value,
  onChange,
  placeholder,
  addLabel = "Adicionar",
  itemLabel = "item",
  disabled,
}: ItemListInputProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  function handleAdd() {
    // Vírgulas são removidas porque o valor é persistido como lista separada por vírgula
    const item = draft.replace(/,/g, " ").replace(/\s+/g, " ").trim();
    if (!item) return;

    const alreadyExists = value.some((existing) => existing.toLowerCase() === item.toLowerCase());
    if (alreadyExists) {
      setError("Esse item já foi adicionado.");
      return;
    }

    onChange([...value, item]);
    setDraft("");
    setError(undefined);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // Enter adiciona o item em vez de enviar o formulário
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdd();
    }
  }

  function handleConfirmRemove() {
    if (pendingIndex === null) return;
    onChange(value.filter((_, i) => i !== pendingIndex));
    setPendingIndex(null);
  }

  const pendingItem = pendingIndex !== null ? value[pendingIndex] : undefined;

  return (
    <div className="flex flex-col gap-3">
      <input
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          if (error) setError(undefined);
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className={formInputClass}
      />

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled || !draft.trim()}
        className="inline-flex items-center gap-2 self-start rounded-full border border-verde-principal px-4 py-2 text-sm font-medium text-verde-principal transition-colors hover:bg-verde-principal hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-principal/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-verde-principal"
      >
        <Plus size={16} />
        {addLabel}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {value.length > 0 && (
        <ul className="flex flex-col gap-2">
          {value.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-verde-principal/30 bg-verde-principal/5 px-4 py-2.5"
            >
              <span className="min-w-0 break-words text-sm text-verde-escuro">{item}</span>
              <button
                type="button"
                onClick={() => setPendingIndex(index)}
                disabled={disabled}
                aria-label={`Remover ${item}`}
                title="Remover"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-verde-escuro/60 transition-colors hover:bg-verde-principal/10 hover:text-verde-escuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-principal/40 disabled:opacity-60"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={pendingItem !== undefined}
        title={`Excluir ${itemLabel}?`}
        description={`Tem certeza que deseja excluir "${pendingItem ?? ""}"? Ele será removido da lista.`}
        confirmLabel="Excluir"
        cancelLabel="Fechar"
        onConfirm={handleConfirmRemove}
        onClose={() => setPendingIndex(null)}
      />
    </div>
  );
}
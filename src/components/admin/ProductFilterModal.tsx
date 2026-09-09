"use client";

import { useEffect, useState } from "react";
import { productTypeValues } from "@/schemas/product.schema";
import { PRODUCT_TYPE_LABELS } from "@/constants/product";
import { FormField, formInputClass } from "@/components/ui/FormField";

export type ProductFilters = {
  type: string;
  weight: string;
  featured: "ALL" | "YES" | "NO";
};

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  type: "ALL",
  weight: "ALL",
  featured: "ALL",
};

type ProductFilterModalProps = {
  isOpen: boolean;
  appliedFilters: ProductFilters;
  weightOptions: string[];
  onApply: (filters: ProductFilters) => void;
  onClose: () => void;
};

export function ProductFilterModal({
  isOpen,
  appliedFilters,
  weightOptions,
  onApply,
  onClose,
}: ProductFilterModalProps) {
  const [draftFilters, setDraftFilters] = useState(appliedFilters);

  useEffect(() => {
    if (isOpen) {
      setDraftFilters(appliedFilters);
    }
  }, [isOpen, appliedFilters]);

  if (!isOpen) {
    return null;
  }

  const handleApply = () => {
    onApply(draftFilters);
    onClose();
  };

  const handleClear = () => {
    onApply(DEFAULT_PRODUCT_FILTERS);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-verde-escuro/40 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(event) => event.stopPropagation()}>
        <h2 className="font-serif text-lg text-verde-escuro mb-5">Filtrar produtos</h2>

        <div className="flex flex-col gap-4 mb-6">
          <FormField label="Tipo">
            <select
              value={draftFilters.type}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, type: event.target.value }))}
              className={formInputClass}
            >
              <option value="ALL">Todos</option>
              {productTypeValues.map((value) => (
                <option key={value} value={value}>
                  {PRODUCT_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Peso">
            <select
              value={draftFilters.weight}
              onChange={(event) => setDraftFilters((prev) => ({ ...prev, weight: event.target.value }))}
              className={formInputClass}
            >
              <option value="ALL">Todos</option>
              {weightOptions.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Destaque">
            <select
              value={draftFilters.featured}
              onChange={(event) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  featured: event.target.value as ProductFilters["featured"],
                }))
              }
              className={formInputClass}
            >
              <option value="ALL">Todos</option>
              <option value="YES">Sim</option>
              <option value="NO">Não</option>
            </select>
          </FormField>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-full text-sm font-medium text-verde-muted hover:bg-verde-claro transition-colors"
          >
            Limpar filtros
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-full text-sm font-medium bg-verde-principal text-white hover:bg-verde-escuro transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
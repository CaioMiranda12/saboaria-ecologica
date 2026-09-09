"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { toast } from "react-toastify";
import { useProducts } from "@/hooks/useProducts";
import { useDeleteProduct } from "@/hooks/useProductMutations";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ProductFilterModal,
  DEFAULT_PRODUCT_FILTERS,
  type ProductFilters,
} from "@/components/admin/ProductFilterModal";
import { PRODUCT_TYPE_LABELS } from "@/constants/product";

function isFiltersActive(filters: ProductFilters) {
  return (
    filters.type !== DEFAULT_PRODUCT_FILTERS.type ||
    filters.weight !== DEFAULT_PRODUCT_FILTERS.weight ||
    filters.featured !== DEFAULT_PRODUCT_FILTERS.featured
  );
}

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const confirmDialog = useConfirmDialog<{ id: string; name: string }>();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_PRODUCT_FILTERS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const weightOptions = useMemo(() => {
    if (!products) return [];
    const uniqueWeights = new Set(products.map((product) => product.weight).filter(Boolean) as string[]);
    return Array.from(uniqueWeights);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch = product.mainName.toLowerCase().includes(normalizedSearch);
      const matchesType = filters.type === "ALL" || product.type === filters.type;
      const matchesWeight = filters.weight === "ALL" || product.weight === filters.weight;
      const matchesFeatured =
        filters.featured === "ALL" || (filters.featured === "YES" ? product.isFeatured : !product.isFeatured);

      return matchesSearch && matchesType && matchesWeight && matchesFeatured;
    });
  }, [products, search, filters]);

  const handleConfirmDelete = () => {
    if (!confirmDialog.target) return;

    deleteProduct.mutate(confirmDialog.target.id, {
      onSuccess: () => {
        toast.success("Produto removido");
        confirmDialog.close();
      },
      onError: () => toast.error("Não foi possível remover o produto"),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl text-verde-escuro">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 bg-verde-principal text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-verde-escuro transition-colors"
        >
          <Plus size={16} />
          Novo produto
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-verde-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome..."
            className="w-full border border-verde-medio/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-verde-escuro placeholder:text-verde-muted/60 focus:outline-none focus:border-verde-medio transition-colors"
          />
        </div>

        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="relative flex items-center gap-2 border border-verde-medio/20 text-verde-escuro px-4 py-2.5 rounded-xl text-sm font-medium hover:border-verde-medio transition-colors"
        >
          <Filter size={16} />
          Filtros
          {isFiltersActive(filters) && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-verde-principal" />
          )}
        </button>
      </div>

      {isLoading && <p className="text-sm text-verde-muted font-light">Carregando...</p>}

      {products && products.length > 0 && filteredProducts.length === 0 && (
        <p className="text-sm text-verde-muted font-light">Nenhum produto encontrado para esse filtro.</p>
      )}

      {products?.length === 0 && (
        <p className="text-sm text-verde-muted font-light">Nenhum produto cadastrado ainda.</p>
      )}

      {filteredProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-verde-medio/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-verde-claro/40 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-verde-escuro">Nome</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Tipo</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Peso</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Destaque</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-verde-medio/10">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-3 text-verde-escuro font-medium">{product.mainName}</td>
                  <td className="px-5 py-3 text-verde-muted">{PRODUCT_TYPE_LABELS[product.type]}</td>
                  <td className="px-5 py-3 text-verde-muted">{product.weight ?? "—"}</td>
                  <td className="px-5 py-3 text-verde-muted">{product.isFeatured ? "Sim" : "Não"}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/produtos/${product.id}`}
                        className="p-2 rounded-lg text-verde-muted hover:text-verde-principal hover:bg-verde-claro transition-colors"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => confirmDialog.open({ id: product.id, name: product.mainName })}
                        className="p-2 rounded-lg text-verde-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFilterModal
        isOpen={isFilterModalOpen}
        appliedFilters={filters}
        weightOptions={weightOptions}
        onApply={setFilters}
        onClose={() => setIsFilterModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Remover produto"
        description={`Tem certeza que deseja remover "${confirmDialog.target?.name}"? Essa ação não pode ser desfeita.`}
        isConfirming={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={confirmDialog.close}
      />
    </div>
  );
}
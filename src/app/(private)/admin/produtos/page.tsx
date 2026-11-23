"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search, Filter, ImageIcon } from "lucide-react";
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
import { optimizeImageUrl } from "@/utils/cloudinary";

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
  const [visibility, setVisibility] = useState("ALL");
  const [sort, setSort] = useState("order");
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

      const matchesVisibility = visibility === "ALL" || (visibility === "PUBLIC" ? product.isPublished : !product.isPublished);
      return matchesSearch && matchesType && matchesWeight && matchesFeatured && matchesVisibility;
    }).sort((a, b) => sort === "name" ? a.mainName.localeCompare(b.mainName) : sort === "newest" ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : a.displayOrder - b.displayOrder);
  }, [products, search, filters, visibility, sort]);

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

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-verde-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome..."
            className="w-full admin-control pl-10 pr-4 py-2.5 text-sm text-verde-escuro placeholder:text-verde-muted/60 focus:outline-none focus:border-verde-medio transition-colors"
          />
        </div>

        <select aria-label="Visibilidade dos produtos" value={visibility} onChange={(e) => setVisibility(e.target.value)} className="admin-control px-3 py-2.5 text-sm bg-white">
          <option value="ALL">Todos os produtos</option><option value="PUBLIC">Publicados</option><option value="HIDDEN">Ocultos</option>
        </select>
        <select aria-label="Ordenação dos produtos" value={sort} onChange={(e) => setSort(e.target.value)} className="admin-control px-3 py-2.5 text-sm bg-white">
          <option value="order">Ordem de exibição</option><option value="name">Nome (A-Z)</option><option value="newest">Mais recentes</option>
        </select>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="relative flex items-center gap-2 admin-control text-verde-escuro px-4 py-2.5 rounded-xl text-sm font-medium hover:border-verde-medio transition-colors"
        >
          <Filter size={16} />
          Filtros
          {isFiltersActive(filters) && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-verde-principal" />
          )}
        </button>
      </div>

      {products && <p className="text-xs text-verde-muted mb-3" aria-live="polite">{filteredProducts.length} de {products.length} produtos</p>}
      {isLoading && <p className="text-sm text-verde-muted font-light" role="status">Carregando produtos...</p>}

      {products && products.length > 0 && filteredProducts.length === 0 && (
        <div className="admin-empty" role="status">Nenhum produto corresponde aos filtros. Ajuste a busca para tentar novamente.</div>
      )}

      {products?.length === 0 && (
        <div className="admin-empty" role="status">Nenhum produto cadastrado. Use “Novo produto” para começar.</div>
      )}

      {filteredProducts.length > 0 && (
        <div className="admin-panel overflow-hidden">
          <div className="overflow-x-auto"><table className="admin-table min-w-[760px] text-sm">
            <thead className="text-left">
              <tr>
                <th className="px-5 py-3 w-20 font-medium text-verde-escuro">Imagem</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Nome</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Tipo</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Peso</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Destaque</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">No site</th>
                <th className="px-5 py-3 font-medium text-verde-escuro">Ordem</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-5 py-3">
                    {product.imageUrl ? (
                      <img
                        src={optimizeImageUrl(product.imageUrl, 96)}
                        alt={product.mainName}
                        loading="lazy"
                        className="h-12 w-12 rounded-lg border border-verde-medio/10 bg-verde-claro object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-verde-claro/50 text-verde-muted">
                        <ImageIcon size={18} />
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-verde-escuro font-medium">{product.mainName}</td>
                  <td className="px-5 py-3 text-verde-muted">{PRODUCT_TYPE_LABELS[product.type]}</td>
                  <td className="px-5 py-3 text-verde-muted">{product.weight ?? "—"}</td>
                  <td className="px-5 py-3 text-verde-muted">{product.isFeatured ? "Sim" : "Não"}</td>
                  <td className="px-5 py-3 text-verde-muted">{product.isPublished ? "Publicado" : "Oculto"}</td>
                  <td className="px-5 py-3 text-verde-muted">{product.displayOrder}</td>
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
          </table></div>
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
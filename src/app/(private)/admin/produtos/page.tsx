"use client";
import PublicImage from "@/components/PublicImage";

import { useCanDeleteRecords } from "@/components/admin/AdminPermissions";

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
  const canDelete = useCanDeleteRecords();
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
    const uniqueWeights = new Set(
      products.map((product) => product.weight).filter(Boolean) as string[],
    );
    return Array.from(uniqueWeights);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    const normalizedSearch = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const matchesSearch = product.mainName.toLowerCase().includes(normalizedSearch);
        const matchesType = filters.type === "ALL" || product.type === filters.type;
        const matchesWeight = filters.weight === "ALL" || product.weight === filters.weight;
        const matchesFeatured =
          filters.featured === "ALL" ||
          (filters.featured === "YES" ? product.isFeatured : !product.isFeatured);

        const matchesVisibility =
          visibility === "ALL" ||
          (visibility === "PUBLIC" ? product.isPublished : !product.isPublished);
        return (
          matchesSearch && matchesType && matchesWeight && matchesFeatured && matchesVisibility
        );
      })
      .sort((a, b) =>
        sort === "name"
          ? a.mainName.localeCompare(b.mainName)
          : sort === "newest"
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : a.displayOrder - b.displayOrder,
      );
  }, [products, search, filters, visibility, sort]);

  const handleConfirmDelete = () => {
    if (!canDelete) return;
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-verde-escuro">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-full bg-verde-principal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-verde-escuro"
        >
          <Plus size={16} />
          Novo produto
        </Link>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search
            size={16}
            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-verde-muted"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome..."
            className="admin-control w-full py-2.5 pr-4 pl-10 text-sm text-verde-escuro transition-colors placeholder:text-verde-muted/60 focus:border-verde-medio focus:outline-none"
          />
        </div>

        <select
          aria-label="Visibilidade dos produtos"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="admin-control bg-white px-3 py-2.5 text-sm"
        >
          <option value="ALL">Todos os produtos</option>
          <option value="PUBLIC">Publicados</option>
          <option value="HIDDEN">Ocultos</option>
        </select>
        <select
          aria-label="Ordenação dos produtos"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="admin-control bg-white px-3 py-2.5 text-sm"
        >
          <option value="order">Ordem de exibição</option>
          <option value="name">Nome (A-Z)</option>
          <option value="newest">Mais recentes</option>
        </select>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="admin-control relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-verde-escuro transition-colors hover:border-verde-medio"
        >
          <Filter size={16} />
          Filtros
          {isFiltersActive(filters) && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-verde-principal" />
          )}
        </button>
      </div>

      {products && (
        <p className="mb-3 text-xs text-verde-muted" aria-live="polite">
          {filteredProducts.length} de {products.length} produtos
        </p>
      )}
      {isLoading && (
        <p className="text-sm font-light text-verde-muted" role="status">
          Carregando produtos...
        </p>
      )}

      {products && products.length > 0 && filteredProducts.length === 0 && (
        <div className="admin-empty" role="status">
          Nenhum produto corresponde aos filtros. Ajuste a busca para tentar novamente.
        </div>
      )}

      {products?.length === 0 && (
        <div className="admin-empty" role="status">
          Nenhum produto cadastrado. Use “Novo produto” para começar.
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="admin-panel overflow-hidden">
          <p className="mb-2 text-xs text-verde-muted lg:hidden">
            Deslize a tabela para consultar todas as colunas.
          </p>
          <div
            role="region"
            aria-label="Tabela de produtos"
            tabIndex={0}
            className="max-w-full overflow-x-auto overscroll-x-contain"
          >
            <table className="admin-table min-w-[760px] text-sm">
              <thead className="text-left">
                <tr>
                  <th className="w-20 px-5 py-3 font-medium text-verde-escuro">Imagem</th>
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
                        <PublicImage
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
                    <td className="px-5 py-3 font-medium text-verde-escuro">{product.mainName}</td>
                    <td className="px-5 py-3 text-verde-muted">
                      {PRODUCT_TYPE_LABELS[product.type]}
                    </td>
                    <td className="px-5 py-3 text-verde-muted">{product.weight ?? "—"}</td>
                    <td className="px-5 py-3 text-verde-muted">
                      {product.isFeatured ? "Sim" : "Não"}
                    </td>
                    <td className="px-5 py-3 text-verde-muted">
                      {product.isPublished ? "Publicado" : "Oculto"}
                    </td>
                    <td className="px-5 py-3 text-verde-muted">{product.displayOrder}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="rounded-lg p-2 text-verde-muted transition-colors hover:bg-verde-claro hover:text-verde-principal"
                          aria-label="Editar"
                        >
                          <Pencil size={16} />
                        </Link>
                        {canDelete && (
                          <button
                            onClick={() =>
                              confirmDialog.open({ id: product.id, name: product.mainName })
                            }
                            className="rounded-lg p-2 text-verde-muted transition-colors hover:bg-red-50 hover:text-red-600"
                            aria-label="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        isOpen={canDelete && confirmDialog.isOpen}
        title="Remover produto"
        description={`Tem certeza que deseja remover "${confirmDialog.target?.name}"? Essa ação não pode ser desfeita.`}
        isConfirming={deleteProduct.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={confirmDialog.close}
      />
    </div>
  );
}

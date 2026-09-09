"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useProducts } from "@/hooks/useProducts";
import { useDeleteProduct } from "@/hooks/useProductMutations";
import { PRODUCT_TYPE_LABELS } from "@/constants/product";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const confirmDialog = useConfirmDialog<{ id: string; name: string }>();

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

      {isLoading && <p className="text-sm text-verde-muted font-light">Carregando...</p>}

      {products?.length === 0 && (
        <p className="text-sm text-verde-muted font-light">Nenhum produto cadastrado ainda.</p>
      )}

      {products && products.length > 0 && (
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
              {products.map((product) => (
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
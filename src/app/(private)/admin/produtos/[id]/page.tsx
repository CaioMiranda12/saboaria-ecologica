"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProduct } from "@/hooks/useProduct";
import { useUpdateProduct } from "@/hooks/useProductMutations";
import type { ProductFormValues } from "@/schemas/product.schema";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct(id);

  const handleSubmit = (values: ProductFormValues) => {
    updateProduct.mutate(values, {
      onSuccess: () => {
        toast.success("Produto atualizado");
        router.push("/admin/produtos");
      },
      onError: () => toast.error("Não foi possível atualizar o produto"),
    });
  };

  if (isLoading) {
    return <p className="text-sm text-verde-muted font-light">Carregando...</p>;
  }

  if (!product) {
    return <p className="text-sm text-verde-muted font-light">Produto não encontrado.</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-verde-escuro mb-6">Editar produto</h1>
      <ProductForm
        defaultValues={{
          ...product,
          complementName: product.complementName ?? undefined,
          weight: product.weight ?? undefined,
          usageInstructions: product.usageInstructions ?? undefined,
          badge: product.badge ?? undefined,
          imageUrl: product.imageUrl ?? undefined,
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateProduct.isPending}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ProductForm } from "@/components/admin/ProductForm";
import { useCreateProduct } from "@/hooks/useProductMutations";
import type { ProductFormValues } from "@/schemas/product.schema";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const handleSubmit = (values: ProductFormValues) => {
    createProduct.mutate(values, {
      onSuccess: () => {
        toast.success("Produto criado com sucesso");
        router.push("/admin/produtos");
      },
      onError: () => toast.error("Não foi possível criar o produto"),
    });
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-verde-escuro mb-6">Novo produto</h1>
      <ProductForm onSubmit={handleSubmit} isSubmitting={createProduct.isPending} submitLabel="Criar produto" />
    </div>
  );
}
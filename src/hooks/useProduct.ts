import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { Product } from "@prisma/client";

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data } = await httpClient.get<{ product: Product }>(`/admin/products/${id}`);
      return data.product;
    },
    enabled: Boolean(id),
  });
}
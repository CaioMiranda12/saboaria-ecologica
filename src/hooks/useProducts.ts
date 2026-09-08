import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { Product } from "@prisma/client";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await httpClient.get<{ products: Product[] }>("/admin/products");
      return data.products;
    },
  });
}
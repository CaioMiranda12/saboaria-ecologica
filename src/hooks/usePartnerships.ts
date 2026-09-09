import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { Partnership } from "@prisma/client";

export function usePartnerships() {
  return useQuery({
    queryKey: ["partnerships"],
    queryFn: async () => {
      const { data } = await httpClient.get<{ partnerships: Partnership[] }>("/admin/partnerships");
      return data.partnerships;
    },
  });
}
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { SiteContent } from "@prisma/client";

export function useSiteContent() {
  return useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const { data } = await httpClient.get<{ siteContent: SiteContent | null }>("/admin/site-content");
      return data.siteContent;
    },
  });
}
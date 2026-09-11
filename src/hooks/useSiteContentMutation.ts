import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { SiteContentFormValues } from "@/schemas/site-content.schema";

export function useUpdateSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: SiteContentFormValues) => httpClient.patch("/admin/site-content", values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["site-content"] }),
  });
}
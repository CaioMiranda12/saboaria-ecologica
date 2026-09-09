import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { PartnershipFormValues } from "@/schemas/partnership.schema";

export function useCreatePartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PartnershipFormValues) => httpClient.post("/admin/partnerships", values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partnerships"] }),
  });
}

export function useUpdatePartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: PartnershipFormValues }) =>
      httpClient.patch(`/admin/partnerships/${id}`, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partnerships"] }),
  });
}

export function useDeletePartnership() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => httpClient.delete(`/admin/partnerships/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["partnerships"] }),
  });
}
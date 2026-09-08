import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { TeamMemberFormValues } from "@/schemas/team-member.schema";

export function useCreateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TeamMemberFormValues) => httpClient.post("/admin/team-members", values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-members"] }),
  });
}

export function useUpdateTeamMember(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TeamMemberFormValues) => httpClient.patch(`/admin/team-members/${id}`, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-members"] }),
  });
}

export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => httpClient.delete(`/admin/team-members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-members"] }),
  });
}
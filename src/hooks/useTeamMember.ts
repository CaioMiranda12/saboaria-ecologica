import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { TeamMember } from "@prisma/client";

export function useTeamMember(id: string) {
  return useQuery({
    queryKey: ["team-members", id],
    queryFn: async () => {
      const { data } = await httpClient.get<{ teamMember: TeamMember }>(`/admin/team-members/${id}`);
      return data.teamMember;
    },
    enabled: Boolean(id),
  });
}
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/http";
import type { TeamMember } from "@prisma/client";

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data } = await httpClient.get<{ teamMembers: TeamMember[] }>("/admin/team-members");
      return data.teamMembers;
    },
  });
}
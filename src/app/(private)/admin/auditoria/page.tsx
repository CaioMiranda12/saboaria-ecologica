import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-authorization";
import AuditExplorer from "./audit-explorer";
export const dynamic = "force-dynamic";
export default async function AuditoriaPage() {
  if (!(await requireAdminRole())) redirect("/admin");
  return <AuditExplorer />;
}

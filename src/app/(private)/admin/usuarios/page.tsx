import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-authorization";
import { UserManager } from "@/components/admin/UserManager";
export const dynamic = "force-dynamic";
export default async function UsersPage() {
  if (!await requireAdminRole()) redirect("/admin");
  return <UserManager />;
}

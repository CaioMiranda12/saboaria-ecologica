import { AdminPermissions } from "@/components/admin/AdminPermissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  const admin = await prisma.admin.findUnique({ where: { id: session.adminId }, select: { role: true } });
  if (!admin) redirect("/login");

  return (
    <div className="admin-shell min-h-screen flex">
      <a className="skip-link" href="#admin-conteudo">Ir para o conteúdo administrativo</a>
      <AdminSidebar role={admin.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar adminEmail={session.email} role={admin.role} />
        <main id="admin-conteudo" tabIndex={-1} className="min-w-0 flex-1 p-3 sm:p-5 xl:p-8"><AdminPermissions role={admin.role}>{children}</AdminPermissions></main>
      </div>
    </div>
  );
}
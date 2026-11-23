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

  return (
    <div className="admin-shell min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar adminEmail={session.email} />
        <main className="flex-1 p-5 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
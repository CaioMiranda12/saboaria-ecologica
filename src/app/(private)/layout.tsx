import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/jwt";
import { AUTH_COOKIE_NAME } from "@/constants/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect("/login");
  }

  let adminEmail: string;

  try {
    const payload = await verifyAdminToken(token);
    adminEmail = payload.email;
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-verde-claro/30 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar adminEmail={adminEmail} />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
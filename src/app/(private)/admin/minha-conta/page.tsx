import { TwoFactorSettings } from "@/components/admin/TwoFactorSettings";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AccountSettings } from "@/components/admin/AccountSettings";

export const dynamic = "force-dynamic";

export default async function MyAccountPage() {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  const admin = await prisma.admin.findUnique({ where: { id: session.adminId }, select: { name: true, email: true, role: true, createdAt: true, updatedAt: true, emailFactor: true } });
  if (!admin) redirect("/login");
  return <><AccountSettings initialName={admin.name} email={admin.email} role={admin.role} createdAt={admin.createdAt.toISOString()} updatedAt={admin.updatedAt.toISOString()} /><TwoFactorSettings emailEnabled={admin.emailFactor} emailAvailable={!!(process.env.RESEND_API_KEY && process.env.PASSWORD_RESET_FROM_EMAIL)}/></>;
}

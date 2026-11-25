import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-authorization";
import { prisma } from "@/lib/prisma";
import { seoPages } from "@/lib/seo-pages";
import { SeoEditor } from "@/components/admin/SeoEditor";
export const dynamic = "force-dynamic";
export default async function SeoPage() {
  if (!(await requireAdminRole())) redirect("/admin");
  const saved = await prisma.pageSeo.findMany();
  const pages = seoPages.map((p) => {
    const row = saved.find((r) => r.path === p.path);
    return {
      path: p.path,
      label: p.label,
      title: row?.title ?? p.title,
      description: row?.description ?? p.description,
      imageUrl: row?.imageUrl ?? "",
    };
  });
  return <SeoEditor pages={pages} />;
}

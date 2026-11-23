import { NextResponse } from "next/server";
import { requireAdminRole } from "@/lib/admin-authorization";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  if (!await requireAdminRole()) return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Math.min(100000, Number(params.get("page")) || 1));
  const pageSize = Math.max(1, Math.min(100, Number(params.get("pageSize")) || 20));
  const search = (params.get("search") || "").trim().slice(0, 120);
  const action = params.get("action") || "";
  const resource = params.get("resource") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const dateStart = /^\d{4}-\d{2}-\d{2}$/.test(from) ? new Date(`${from}T00:00:00-03:00`) : null;
  const dateEnd = /^\d{4}-\d{2}-\d{2}$/.test(to) ? new Date(`${to}T23:59:59.999-03:00`) : null;
  const where: Prisma.AuditEventWhereInput = {
    ...(search ? { OR: [{ actorName: { contains: search, mode: "insensitive" } }, { actorEmail: { contains: search, mode: "insensitive" } }, { resourceId: { contains: search, mode: "insensitive" } }] } : {}),
    ...(action && ["CREATE", "UPDATE", "DELETE"].includes(action) ? { action } : {}),
    ...(resource && ["products", "team-members", "partnerships", "admins"].includes(resource) ? { resource } : {}),
    ...(dateStart || dateEnd ? { createdAt: { ...(dateStart && !isNaN(+dateStart) ? { gte: dateStart } : {}), ...(dateEnd && !isNaN(+dateEnd) ? { lte: dateEnd } : {}) } } : {}),
  };
  const [total, events] = await prisma.$transaction([
    prisma.auditEvent.count({ where }),
    prisma.auditEvent.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * pageSize, take: pageSize }),
  ]);
  return NextResponse.json({ events, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) }, { headers: { "Cache-Control": "no-store" } });
}

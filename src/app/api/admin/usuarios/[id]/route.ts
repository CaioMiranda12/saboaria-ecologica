import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/admin-authorization";
import { getAdminSession } from "@/lib/session";
import { recordAudit } from "@/lib/audit";
import { userUpdateSchema } from "@/schemas/admin-user.schema";
type Context={params:Promise<{id:string}>};
export async function PATCH(request:Request,{params}:Context) {
  if(!await requireAdminRole()) return NextResponse.json({message:"Acesso restrito"},{status:403});
  const {id}=await params;
  const parsed=userUpdateSchema.safeParse(await request.json().catch(()=>null));
  if(!parsed.success) return NextResponse.json({message:"Dados inválidos. Senha mínima: 12 caracteres."},{status:400});
  const existing=await prisma.admin.findUnique({where:{id}});
  if(!existing) return NextResponse.json({message:"Usuário não encontrado"},{status:404});
  if(existing.role==="ADMIN" && parsed.data.role==="EDITOR") {
    const total=await prisma.admin.count({where:{role:"ADMIN"}});
    if(total<=1) return NextResponse.json({message:"É necessário manter pelo menos um administrador."},{status:409});
  }
  const {password,...fields}=parsed.data;
  await prisma.admin.update({where:{id},data:{...fields,...(password?{passwordHash:await bcrypt.hash(password,12),sessionVersion:{increment:1}}:{})}});
  const session=await getAdminSession(); if(session) await recordAudit(session,"UPDATE","admins",id);
  return NextResponse.json({ok:true});
}
export async function DELETE(_request:Request,{params}:Context) {
  if(!await requireAdminRole()) return NextResponse.json({message:"Acesso restrito"},{status:403});
  const {id}=await params; const session=await getAdminSession();
  if(session?.adminId===id) return NextResponse.json({message:"Você não pode excluir a própria conta."},{status:409});
  const existing=await prisma.admin.findUnique({where:{id}});
  if(!existing) return NextResponse.json({message:"Usuário não encontrado"},{status:404});
  if(existing.role==="ADMIN" && await prisma.admin.count({where:{role:"ADMIN"}})<=1) return NextResponse.json({message:"É necessário manter pelo menos um administrador."},{status:409});
  await prisma.admin.delete({where:{id}});
  if(session) await recordAudit(session,"DELETE","admins",id);
  return NextResponse.json({ok:true});
}

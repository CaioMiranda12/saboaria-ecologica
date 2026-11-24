import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { loginLimit, loginFailure } from '@/lib/login-protection';
import { issueEmailCode, consumeEmailCode } from "@/lib/email-factor";
import bcrypt from 'bcrypt';
import { z } from 'zod';
const schema=z.object({action:z.enum(['emailSetup','emailEnable','emailDisable','emailDisableSetup']),password:z.string().min(1).max(128),code:z.string().max(64).optional()});
export async function POST(request:Request){
 const session=await getAdminSession(); if(!session)return NextResponse.json({message:'Sessão expirada'},{status:401});
 const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({message:'Dados inválidos'},{status:400});
 const {action,password,code}=parsed.data;
 const admin=await prisma.admin.findUnique({where:{id:session.adminId}});if(!admin)return NextResponse.json({message:'Conta não encontrada'},{status:404});
 const ip=request.headers.get('x-real-ip')??'unknown';const email=`2fa:${admin.email}`;
 if(await loginLimit(email,ip))return NextResponse.json({message:'Aguarde 15 minutos'},{status:429});
 const invalid=async()=>{await loginFailure(email,ip);return NextResponse.json({message:'Senha ou código inválido'},{status:400});};
 if(!await bcrypt.compare(password,admin.passwordHash))return invalid();
 try{
 if(action==='emailSetup'&&!admin.emailFactor){await issueEmailCode(admin,'enable');return NextResponse.json({emailSent:true});}
 if(action==='emailDisableSetup'&&admin.emailFactor){await issueEmailCode(admin,'disable');return NextResponse.json({emailSent:true});}
 let data;
 if((action==='emailEnable'&&!admin.emailFactor)||(action==='emailDisable'&&admin.emailFactor)){if(!code||!await consumeEmailCode(admin,action==='emailEnable'?'enable':'disable',code))return invalid();data={emailFactor:action==='emailEnable',sessionVersion:{increment:1}};}
 else return NextResponse.json({message:'Operação indisponível'},{status:409});
 const updated=await prisma.$transaction(async tx=>{const result=await tx.admin.updateMany({where:{id:admin.id,sessionVersion:session.sessionVersion,emailFactor:admin.emailFactor},data});if(!result.count)return result;
 await tx.auditEvent.create({data:{actorId:admin.id,actorName:admin.name,actorEmail:admin.email,action:action==='emailEnable'?'ENABLE_EMAIL_FACTOR':'DISABLE_EMAIL_FACTOR',resource:'admins',resourceId:admin.id}});return result;});
 if(!updated.count)return NextResponse.json({message:'Sessão alterada'},{status:409});
 return NextResponse.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({message:'Não foi possível configurar o 2FA. Confira a configuração do servidor.'},{status:500});}
}

import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { newSecret, encryptSecret, decryptSecret, matchingStep, newRecoveryCodes, recoveryHash } from '@/lib/totp';
import { loginLimit, loginFailure } from '@/lib/login-protection';
import bcrypt from 'bcrypt';
import { z } from 'zod';
const schema=z.object({action:z.enum(['setup','enable','disable']),password:z.string().min(1).max(128),setup:z.string().max(512).optional(),code:z.string().max(64).optional()});
export async function POST(request:Request){
 const session=await getAdminSession(); if(!session)return NextResponse.json({message:'Sessão expirada'},{status:401});
 const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({message:'Dados inválidos'},{status:400});
 const {action,password,setup,code}=parsed.data;
 const admin=await prisma.admin.findUnique({where:{id:session.adminId}});if(!admin)return NextResponse.json({message:'Conta não encontrada'},{status:404});
 const ip=request.headers.get('x-real-ip')??'unknown';const email=`2fa:${admin.email}`;
 if(await loginLimit(email,ip))return NextResponse.json({message:'Aguarde 15 minutos'},{status:429});
 const invalid=async()=>{await loginFailure(email,ip);return NextResponse.json({message:'Senha ou código inválido'},{status:400});};
 if(!await bcrypt.compare(password,admin.passwordHash))return invalid();
 try{
 if(action==='setup'&&!admin.totpSecret){const secret=newSecret();return NextResponse.json({secret,setup:encryptSecret(`${Date.now()}:${secret}`,admin.id)},{headers:{'Cache-Control':'no-store'}});}
 let data;
 let codes:string[]=[];
 if(action==='enable'&&!admin.totpSecret&&setup&&code){const [time,secret]=decryptSecret(setup,admin.id).split(':');if(Date.now()-Number(time)>600000)return invalid();const step=matchingStep(secret,code,-1);if(step===null)return invalid();codes=newRecoveryCodes();data={totpSecret:encryptSecret(secret,admin.id),totpLastStep:step,totpRecovery:codes.map(recoveryHash),sessionVersion:{increment:1}};}
 else if(action==='disable'&&admin.totpSecret&&code){if(matchingStep(decryptSecret(admin.totpSecret,admin.id),code,admin.totpLastStep)===null&&!admin.totpRecovery.includes(recoveryHash(code)))return invalid();data={totpSecret:null,totpLastStep:-1,totpRecovery:[],sessionVersion:{increment:1}};}
 else return NextResponse.json({message:'Operação indisponível'},{status:409});
 const updated=await prisma.$transaction(async tx=>{const result=await tx.admin.updateMany({where:{id:admin.id,sessionVersion:session.sessionVersion,totpLastStep:admin.totpLastStep,totpRecovery:{equals:admin.totpRecovery}},data});if(!result.count)return result;
 await tx.auditEvent.create({data:{actorId:admin.id,actorName:admin.name,actorEmail:admin.email,action:action==='enable'?'ENABLE_2FA':'DISABLE_2FA',resource:'admins',resourceId:admin.id}});return result;});
 if(!updated.count)return NextResponse.json({message:'Sessão alterada'},{status:409});
 return NextResponse.json({ok:true,codes},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({message:'Não foi possível configurar o 2FA. Confira a configuração do servidor.'},{status:500});}
}

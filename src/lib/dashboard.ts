import { prisma } from '@/lib/prisma';
import { cmsPageUpdateSchema } from '@/schemas/cms.schema';
import { isCmsPageSlug } from '@/constants/cms-pages';

const dayKey = (date: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Fortaleza', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => [k,canonical(v)]));
  return value;
}
export async function loadDashboard(actor: { id: string; role: 'ADMIN' | 'EDITOR' }, days: number) {
  const today = dayKey(new Date());
  const end = new Date(`${today}T00:00:00-03:00`);
  const start = new Date(end.getTime() - (days-1)*86400000);
  const until = new Date(end.getTime()+86400000);
  const scope = actor.role === 'ADMIN' ? {} : { actorId: actor.id };
  const [products, pages, media, team, partners, events, recent, users] = await Promise.all([
    prisma.product.findMany({select:{isPublished:true,imageUrl:true,shortDescription:true,fullDescription:true}}),
    prisma.cmsPage.findMany({include:{sections:true,publication:true}}),
    prisma.mediaAsset.findMany({select:{altText:true,mimeType:true}}),
    prisma.teamMember.count(),
    prisma.partnership.findMany({select:{logoUrl:true}}),
    prisma.auditEvent.findMany({where:{...scope,createdAt:{gte:start,lt:until}},select:{createdAt:true}}),
    prisma.auditEvent.findMany({where:{...scope,createdAt:{gte:start,lt:until}},orderBy:[{createdAt:'desc'},{id:'desc'}],take:10,select:{id:true,action:true,resource:true,actorName:true,createdAt:true}}),
    actor.role === 'ADMIN' ? prisma.admin.findMany({select:{role:true,emailFactor:true}}) : Promise.resolve(null),
  ]);
  const statuses = pages.filter(p=>isCmsPageSlug(p.slug)).map(p=>{
    const draft = cmsPageUpdateSchema.safeParse({sections:p.sections.map(({key,title,position,enabled,content})=>({key,title,position,enabled,content}))});
    const published = cmsPageUpdateSchema.safeParse({sections:p.publication?.sections??[]});
    const normalize = (sections: {key:string}[]) => JSON.stringify(canonical([...sections].sort((a,b)=>a.key.localeCompare(b.key))));
    const status = !p.publication ? 'never' : !draft.success || !published.success || normalize(draft.data.sections)!==normalize(published.data.sections) ? 'pending' : 'current';
    return {slug:p.slug,title:p.title,status};
  });
  const counts = new Map<string,number>();
  for(const event of events){const key=dayKey(event.createdAt);counts.set(key,(counts.get(key)??0)+1);}
  const activity = Array.from({length:days},(_,i)=>{const key=dayKey(new Date(start.getTime()+i*86400000));return {day:key,count:counts.get(key)??0};});
  return { products:products.length, active:products.filter(p=>p.isPublished).length, statuses, media:media.length, team, partners:partners.length, activity,recent, users:users?.length??null, admins:users?.filter(u=>u.role==='ADMIN').length??0, protectedUsers:users?.filter(u=>u.emailFactor).length??0, unprotectedAdmins:users?.filter(u=>u.role==='ADMIN'&&!u.emailFactor).length??0, missingImages:products.filter(p=>!p.imageUrl?.trim()).length, missingDescriptions:products.filter(p=>!p.shortDescription.trim()||!p.fullDescription.trim()).length, missingAlt:media.filter(m=>m.mimeType.startsWith('image/')&&!m.altText.trim()).length, missingLogos:partners.filter(p=>!p.logoUrl?.trim()).length };
}

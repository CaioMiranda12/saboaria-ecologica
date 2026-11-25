import { pageMetadata } from "@/lib/seo";
import { publicSection, cmsText } from "@/lib/cms-public";
import { listTeamMembers } from "@/services/team-member.service";

export const dynamic = "force-dynamic";

export default async function Equipe() {
  const [section, equipe] = await Promise.all([publicSection("equipe", "introducao"), listTeamMembers()]);
  const content = section?.content ?? {};
  return (
    <section className="px-5 md:px-20 py-14 md:py-20 bg-creme relative">
      <img
        src='/logo-2.png'
        alt="Saboaria Ecológica"
        className="absolute top-16 right-6 w-24 md:w-32 object-contain z-40"
      />

      <div className="max-w-5xl mx-auto pt-32 md:pt-0">
        <h2 className="font-serif text-3xl md:text-5xl text-verde-escuro mb-4">
          {cmsText(content.title, "Nossa equipe")}
        </h2>
        <p className="text-verde-muted font-light leading-relaxed max-w-xl mb-12">
          {cmsText(content.description, "Pessoas comprometidas com o impacto social e ambiental que move a Saboaria Ecológica.")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipe.length === 0 && <p className="text-verde-muted">Nenhum integrante cadastrado no momento.</p>}
          {equipe.map((membro) => (
            <div
              key={membro.id}
              className="bg-white border border-verde-medio/10 rounded-2xl p-6 flex gap-4 items-start"
            >
              {membro.imageUrl ? <img src={membro.imageUrl} alt={membro.name} className="w-12 h-12 rounded-full object-cover shrink-0" /> : <div className="w-12 h-12 rounded-full bg-verde-principal flex items-center justify-center font-serif font-bold text-white text-sm shrink-0">
                {membro.initials}
              </div>}
              <div>
                <p className="text-sm font-semibold text-verde-escuro">{membro.name}</p>
                <p className="text-xs text-verde-principal font-medium mb-2">{membro.role}</p>
                <p className="text-xs text-verde-muted font-light leading-relaxed">{membro.bio}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export async function generateMetadata() { return pageMetadata("/equipe"); }

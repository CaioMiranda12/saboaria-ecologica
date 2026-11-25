import PublicImage from "@/components/PublicImage";
import { pageMetadata } from "@/lib/seo";
import { publicSection, cmsText } from "@/lib/cms-public";
import { listTeamMembers } from "@/services/team-member.service";

export const dynamic = "force-dynamic";

export default async function Equipe() {
  const [section, equipe] = await Promise.all([
    publicSection("equipe", "introducao"),
    listTeamMembers(),
  ]);
  const content = section?.content ?? {};
  return (
    <section className="relative flex-1 bg-creme px-5 py-14 md:px-20 md:py-20">
      <PublicImage
        src="/logo-2.png"
        alt="Saboaria Ecológica"
        className="absolute top-16 right-6 z-40 w-24 object-contain md:w-32"
      />

      <div className="mx-auto max-w-5xl pt-32 md:pt-0">
        <h2 className="mb-4 font-serif text-3xl text-verde-escuro md:text-5xl">
          {cmsText(content.title, "Nossa equipe")}
        </h2>
        <p className="mb-12 max-w-xl leading-relaxed font-light text-verde-muted">
          {cmsText(
            content.description,
            "Pessoas comprometidas com o impacto social e ambiental que move a Saboaria Ecológica.",
          )}
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {equipe.length === 0 && (
            <p className="text-verde-muted">Nenhum integrante cadastrado no momento.</p>
          )}
          {equipe.map((membro) => (
            <div
              key={membro.id}
              className="flex items-start gap-4 rounded-2xl border border-verde-medio/10 bg-white p-6"
            >
              {membro.imageUrl ? (
                <PublicImage
                  maxWidth={96}
                  width={48}
                  height={48}
                  src={membro.imageUrl}
                  alt={membro.name}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-verde-principal font-serif text-sm font-bold text-white">
                  {membro.initials}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-verde-escuro">{membro.name}</p>
                <p className="mb-2 text-xs font-medium text-verde-principal">{membro.role}</p>
                <p className="text-xs leading-relaxed font-light text-verde-muted">{membro.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function generateMetadata() {
  return pageMetadata("/equipe");
}

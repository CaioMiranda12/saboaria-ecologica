import Link from "next/link";
import { redirect } from "next/navigation";
import { Archive, ArrowLeft, Download, FileText, ShieldCheck } from "lucide-react";
import { requireAdminRole } from "@/lib/admin-authorization";
import { getSiteContent } from "@/services/site-content.service";

const fields = [
  {
    key: "description",
    label: "Descrição da marca",
    destination: "Sobre nós",
    href: "/admin/paginas/sobre",
  },
  { key: "mission", label: "Missão", destination: "Sobre nós", href: "/admin/paginas/sobre" },
  { key: "vision", label: "Visão", destination: "Sobre nós", href: "/admin/paginas/sobre" },
  { key: "values", label: "Valores", destination: "Sobre nós", href: "/admin/paginas/sobre" },
  {
    key: "foundedYear",
    label: "Ano de fundação",
    destination: "Sobre nós (revisar)",
    href: "/admin/paginas/sobre",
  },
  { key: "whatsapp", label: "WhatsApp", destination: "Contato", href: "/admin/paginas/contato" },
  { key: "instagram", label: "Instagram", destination: "Contato", href: "/admin/paginas/contato" },
  { key: "email", label: "E-mail", destination: "Contato", href: "/admin/paginas/contato" },
  {
    key: "linkedin",
    label: "LinkedIn",
    destination: "Contato (revisar)",
    href: "/admin/paginas/contato",
  },
  { key: "address", label: "Endereço", destination: "Contato", href: "/admin/paginas/contato" },
] as const;

export default async function LegacyContentArchive() {
  const admin = await requireAdminRole();
  if (!admin) redirect("/admin/paginas");
  const record = await getSiteContent();

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      <Link
        href="/admin/paginas"
        className="inline-flex items-center gap-2 text-sm font-medium text-verde-principal hover:underline"
      >
        <ArrowLeft size={16} /> Páginas do site
      </Link>
      <header className="rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-[#e9f6e5] via-[#f6fbf4] to-white p-6 shadow-sm sm:p-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Archive size={14} /> Arquivo legado • somente leitura
        </div>
        <h1 className="font-serif text-3xl text-verde-escuro">Dados institucionais antigos</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-verde-muted">
          Esta área preserva dados do sistema anterior. Ela não altera o site público e não publica
          conteúdo. Para editar as páginas atuais, utilize os editores do CMS.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/admin/paginas"
            className="inline-flex items-center gap-2 rounded-xl bg-verde-principal px-4 py-2.5 text-sm font-semibold text-white hover:bg-verde-escuro"
          >
            <FileText size={16} /> Abrir páginas do site
          </Link>
          {record && (
            <a
              href="/api/admin/site-content/export"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-verde-escuro hover:bg-emerald-50"
            >
              <Download size={16} /> Exportar backup JSON
            </a>
          )}
        </div>
      </header>
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-[#f3f9f0] p-4 text-sm text-verde-escuro">
        <ShieldCheck className="mt-0.5 shrink-0" size={20} />
        <p>
          <strong>Sem migração automática:</strong> compare cada informação com a página
          correspondente antes de copiar. Dados antigos não serão sobrescritos nem excluídos.
        </p>
      </div>
      {!record ? (
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-verde-muted">
          Nenhum registro legado encontrado. Utilize{" "}
          <Link href="/admin/paginas" className="font-semibold text-verde-principal underline">
            Páginas do site
          </Link>
          .
        </div>
      ) : (
        <section className="space-y-4" aria-label="Campos do arquivo legado">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-verde-escuro">Informações preservadas</h2>
            <p className="text-xs text-verde-muted">
              Última alteração:{" "}
              {new Intl.DateTimeFormat("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "America/Fortaleza",
              }).format(record.updatedAt)}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {fields.map(({ key, label, destination, href }) => (
              <article
                key={key}
                className="min-w-0 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white to-[#f4faf1] p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-verde-escuro">{label}</h3>
                  <Link
                    href={href}
                    className="text-xs font-medium text-verde-principal underline underline-offset-2"
                  >
                    Editar em {destination}
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-verde-muted">
                  {record[key] || "Não preenchido"}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import Link from "next/link";
import InstitutionalEditor from "@/components/admin/InstitutionalEditor";
export default function Page() { return <div className="mx-auto max-w-5xl space-y-5"><Link href="/admin/paginas" className="text-sm text-verde-muted hover:underline">← Páginas do site</Link><h1 className="font-serif text-3xl text-verde-escuro">Editar Sobre nós</h1><p className="text-sm text-verde-muted">Altere os campos e salve para atualizar o site público.</p><InstitutionalEditor slug="sobre"/></div>; }

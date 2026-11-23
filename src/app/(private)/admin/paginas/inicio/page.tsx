import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HomeEditor from '@/components/admin/HomeEditor';

export default function EditHomePage() {
  return <div className="mx-auto max-w-6xl space-y-5">
    <Link href="/admin/paginas" className="inline-flex items-center gap-2 text-sm text-verde-muted hover:text-verde-principal"><ArrowLeft size={16}/> Páginas do site</Link>
    <div><h1 className="font-serif text-3xl text-verde-escuro">Editar página inicial</h1><p className="mt-2 text-sm text-verde-muted">Altere textos e imagens. Ao salvar, as mudanças ficam disponíveis no site público.</p></div>
    <HomeEditor />
  </div>;
}

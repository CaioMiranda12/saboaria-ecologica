import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-creme">
      <a className="skip-link" href="#conteudo-principal">Ir para o conteúdo principal</a>
      <Header />
      <main id="conteudo-principal" tabIndex={-1} className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
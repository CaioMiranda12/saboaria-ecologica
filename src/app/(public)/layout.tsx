import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">Ir para o conteúdo principal</a>
      <Header />
      <main id="conteudo-principal" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
}
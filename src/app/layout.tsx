import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Saboaria Ecológica",
  description: "Limpeza que cuida do planeta.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">

      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
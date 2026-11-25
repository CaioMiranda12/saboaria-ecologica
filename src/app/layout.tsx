import type { Metadata } from "next";
import { publicIndexOrigin } from "@/lib/site-url";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  ...(publicIndexOrigin() ? {} : { robots: { index: false, follow: false } }),
  title: "Saboaria Ecológica",
  description: "Limpeza que cuida do planeta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          {children}
          <ToastContainer position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}

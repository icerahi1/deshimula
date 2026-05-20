import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeshiMula",
  description: "Bangladeshi company reviews and experience sharing platform.",
  metadataBase: new URL("https://deshimula.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="bn">
      <body>
        <SiteHeader user={currentUser} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}

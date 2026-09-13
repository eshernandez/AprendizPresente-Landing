import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./globals.css";
import { getSiteConfig, siteDescription, siteTitle } from "@/lib/site.mjs";

export function generateMetadata(): Metadata {
  const { siteUrl } = getSiteConfig();
  return {
    metadataBase: new URL(siteUrl),
    title: siteTitle,
    description: siteDescription,
    alternates: { canonical: "/" },
    applicationName: "AprendizPresente",
    robots: { index: true, follow: true },
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: siteUrl,
      siteName: "AprendizPresente",
      locale: "es_CO",
      type: "website",
    },
    twitter: { card: "summary", title: siteTitle, description: siteDescription },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#102e2c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}

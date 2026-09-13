import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site.mjs";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: "/healthz" }, sitemap: `${getSiteConfig().siteUrl}/sitemap.xml` };
}

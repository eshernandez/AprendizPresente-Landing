import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/site.mjs";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getSiteConfig().siteUrl, changeFrequency: "monthly", priority: 1 }];
}

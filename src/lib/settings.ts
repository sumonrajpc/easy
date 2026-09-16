import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export type SiteSettings = {
  siteName: string;
  tagline: string;
  logoUrl: string;
  accentColor: string;
  bannerText: string;
  marqueeText: string;
  heroVideoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  bkashNumber: string;
  nagadNumber: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "EasySkillBD",
  tagline: "Don't Just Try—Work Harder, Dream Bigger, Shine Brighter.",
  logoUrl: "",
  accentColor: "#7c3aed",
  bannerText: "Don't Just Try—Work Harder, Dream Bigger, Shine Brighter.",
  marqueeText:
    "🎉 New batch of Web Development starting soon! • 📢 Get 20% off on Digital Marketing course this month • 🚀 Live doubt-clearing classes every Friday • 🏆 500+ students placed in top companies",
  heroVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  heroTitle: "Learn Skills That Actually Pay in Bangladesh",
  heroSubtitle:
    "Job-focused courses in Web Development, Digital Marketing, Graphics Design & more — taught in Bangla, built for your career.",
  whatsapp: "8801715710019",
  phone: "+8801715710019",
  email: "info.easyskill@gmail.com",
  address: "Ghatail-1980, Tangail, Dhaka, Bangladesh",
  bkashNumber: "01715710019",
  nagadNumber: "01715710019",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.select().from(siteSettings);
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row.value !== null) map[row.key] = row.value;
    }
    return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

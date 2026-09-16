import Link from "next/link";
import { Phone, Mail, MapPin, Globe, Video, Share2 } from "lucide-react";
import Logo from "./Logo";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer id="contact" className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="[&_span]:text-white">
            <Logo logoUrl={settings.logoUrl} siteName={settings.siteName} />
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            {settings.siteName} is Bangladesh&rsquo;s growing online learning platform helping
            students and professionals build in-demand skills through practical,
            project-based courses.
          </p>
          <p className="mt-4 text-sm font-semibold text-brand-300">{settings.tagline}</p>
          <div className="mt-5 flex gap-3">
            {[Globe, Video, Share2].map((Icon, i) => (
              <span
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition hover:bg-brand-600 hover:text-white"
              >
                <Icon size={16} />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-brand-300">Home</Link></li>
            <li><Link href="/courses" className="hover:text-brand-300">All Courses</Link></li>
            <li><Link href="/register" className="hover:text-brand-300">Become an Instructor</Link></li>
            <li><Link href="/login" className="hover:text-brand-300">Student Login</Link></li>
            <li><Link href="/admin" className="hover:text-brand-300">Admin Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Contact Us
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="mt-0.5 shrink-0 text-brand-400" />
              <a href={`tel:${settings.phone}`} className="hover:text-brand-300">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-brand-400" />
              <a href={`mailto:${settings.email}`} className="hover:text-brand-300">
                {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-400" />
              <span>{settings.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5">
        <p className="mx-auto max-w-7xl px-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved. Built with
          &hearts; in Bangladesh.
        </p>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Languages,
  ChevronDown,
} from "lucide-react";
import Logo from "./Logo";
import { useLanguage } from "@/lib/i18n";
import { logoutAction } from "@/app/actions/auth";

type HeaderUser = {
  name: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
} | null;

export default function Header({
  user,
  logoUrl,
  siteName,
}: {
  user: HeaderUser;
  logoUrl?: string;
  siteName?: string;
}) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const dashHref =
    user?.role === "ADMIN" ? "/admin" : user?.role === "INSTRUCTOR" ? "/instructor" : "/dashboard";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(query ? `/courses?q=${encodeURIComponent(query)}` : "/courses");
    setMobileOpen(false);
  }

  const notifications = [
    { title: "Welcome to EasySkillBD!", time: "Just now" },
    { title: "New batch starting this Friday", time: "2h ago" },
    { title: "Your assignment was graded", time: "1d ago" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo logoUrl={logoUrl} siteName={siteName} />

        <nav className="ml-4 hidden items-center gap-6 lg:flex">
          <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-brand-600">
            {t("nav_home")}
          </Link>
          <Link href="/courses" className="text-sm font-semibold text-slate-700 hover:text-brand-600">
            {t("nav_courses")}
          </Link>
          <Link href="/#about" className="text-sm font-semibold text-slate-700 hover:text-brand-600">
            {t("nav_about")}
          </Link>
          <Link href="/#contact" className="text-sm font-semibold text-slate-700 hover:text-brand-600">
            {t("nav_contact")}
          </Link>
        </nav>

        <form
          onSubmit={handleSearch}
          className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 md:flex"
        >
          <Search size={16} className="text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-brand-400 hover:text-brand-600"
            title="Switch language"
          >
            <Languages size={14} />
            {lang === "en" ? "EN" : "বাং"}
          </button>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
            >
              <Bell size={19} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
                <p className="px-3 py-2 text-xs font-bold uppercase text-slate-400">
                  Notifications
                </p>
                {notifications.map((n, i) => (
                  <div key={i} className="rounded-xl px-3 py-2 hover:bg-slate-50">
                    <p className="text-sm font-medium text-slate-700">{n.title}</p>
                    <p className="text-xs text-slate-400">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1.5 pl-1.5 pr-3 hover:bg-slate-200"
              >
                <span className="gradient-brand flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-2xl">
                  <Link
                    href={dashHref}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard size={16} /> {t("dashboard")}
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} /> {t("logout")}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="gradient-brand rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30"
              >
                {t("register")}
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="mb-3 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {t("nav_home")}
            </Link>
            <Link href="/courses" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {t("nav_courses")}
            </Link>
            <Link href="/#about" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {t("nav_about")}
            </Link>
            <Link href="/#contact" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {t("nav_contact")}
            </Link>
            {!user && (
              <div className="mt-2 flex gap-2 border-t border-slate-100 pt-3">
                <Link href="/login" className="flex-1 rounded-full border border-slate-200 py-2 text-center text-sm font-semibold text-slate-700">
                  {t("login")}
                </Link>
                <Link href="/register" className="gradient-brand flex-1 rounded-full py-2 text-center text-sm font-semibold text-white">
                  {t("register")}
                </Link>
              </div>
            )}
            {user && (
              <Link href={dashHref} className="mt-2 flex items-center gap-2 rounded-lg border-t border-slate-100 px-3 py-2.5 pt-4 text-sm font-semibold text-brand-600">
                <User size={16} /> {t("dashboard")}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

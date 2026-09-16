"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";

const dict = {
  en: {
    nav_home: "Home",
    nav_courses: "Courses",
    nav_about: "About",
    nav_contact: "Contact",
    search_placeholder: "Search courses...",
    login: "Login",
    register: "Get Started",
    logout: "Logout",
    dashboard: "Dashboard",
    hero_cta: "Browse Courses",
    hero_watch: "Watch Intro",
    popular_courses: "Popular Courses",
    popular_courses_sub: "Hand-picked, job-focused courses to launch your career",
    testimonials: "What Our Students Say",
    enroll_now: "Enroll Now",
    view_details: "View Details",
    footer_about:
      "EasySkillBD is Bangladesh's growing online learning platform helping students and professionals build in-demand skills through practical, project-based courses.",
    quick_links: "Quick Links",
    contact_us: "Contact Us",
    all_rights: "All rights reserved.",
    students: "Students",
    courses_label: "Courses",
    instructors: "Instructors",
  },
  bn: {
    nav_home: "হোম",
    nav_courses: "কোর্সসমূহ",
    nav_about: "আমাদের সম্পর্কে",
    nav_contact: "যোগাযোগ",
    search_placeholder: "কোর্স খুঁজুন...",
    login: "লগইন",
    register: "শুরু করুন",
    logout: "লগআউট",
    dashboard: "ড্যাশবোর্ড",
    hero_cta: "কোর্স দেখুন",
    hero_watch: "পরিচিতি ভিডিও",
    popular_courses: "জনপ্রিয় কোর্সসমূহ",
    popular_courses_sub: "ক্যারিয়ার গড়তে বাছাইকৃত, চাকরি-উপযোগী কোর্স",
    testimonials: "শিক্ষার্থীরা যা বলছেন",
    enroll_now: "ভর্তি হোন",
    view_details: "বিস্তারিত দেখুন",
    footer_about:
      "ইজিস্কিলবিডি বাংলাদেশের একটি ক্রমবর্ধমান অনলাইন লার্নিং প্ল্যাটফর্ম যা শিক্ষার্থী ও পেশাজীবীদের প্র্যাকটিক্যাল কোর্সের মাধ্যমে দক্ষ করে তোলে।",
    quick_links: "গুরুত্বপূর্ণ লিংক",
    contact_us: "যোগাযোগ করুন",
    all_rights: "সর্বস্বত্ব সংরক্ষিত।",
    students: "শিক্ষার্থী",
    courses_label: "কোর্স",
    instructors: "প্রশিক্ষক",
  },
} as const;

export type DictKey = keyof typeof dict.en;

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("easyskillbd_lang") as Lang | null;
    if (saved === "bn" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("easyskillbd_lang", l);
  };

  const t = (key: DictKey) => dict[lang][key] ?? dict.en[key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

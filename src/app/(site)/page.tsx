import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, BookOpen, Award, Zap, Video, MessageSquare } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import HeroVideoModal from "@/components/HeroVideoModal";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { getPublishedCourses, getFeaturedTestimonials, getPlatformStats } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [courses, testimonials, stats, settings] = await Promise.all([
    getPublishedCourses(),
    getFeaturedTestimonials(),
    getPlatformStats(),
    getSiteSettings(),
  ]);

  const featured = courses.slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 pb-20 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-600 blur-[100px]" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-accent-500 blur-[110px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-xs font-bold text-brand-300">
              <Zap size={14} /> #1 Learning Platform in Bangladesh
            </span>
            <h1 className="text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.1] text-white">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {settings.heroSubtitle}
            </p>
            <p className="mt-3 text-sm font-semibold text-accent-500">{settings.tagline}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="gradient-brand inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-white shadow-xl shadow-brand-600/40 transition hover:scale-105"
              >
                Browse Courses <ArrowRight size={18} />
              </Link>
              <HeroVideoModal videoUrl={settings.heroVideoUrl} label="Watch Intro" />
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.studentTotal}+</p>
                <p className="text-xs font-medium text-slate-400">Active Students</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.courseTotal}+</p>
                <p className="text-xs font-medium text-slate-400">Job-Focused Courses</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{stats.instructorTotal}+</p>
                <p className="text-xs font-medium text-slate-400">Expert Instructors</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="glow-card rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="space-y-4">
                {[
                  { icon: Video, label: "Live Class + Recorded Videos" },
                  { icon: Award, label: "Verified Course Completion Certificate" },
                  { icon: MessageSquare, label: "1-on-1 Doubt Solving Support" },
                  { icon: ShieldCheck, label: "bKash / Nagad Secure Payment" },
                ].map(({ icon: Icon, label }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"
                  >
                    <span className="gradient-brand flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white">
                      <Icon size={20} />
                    </span>
                    <p className="font-semibold text-white">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-600">
            Featured
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Popular Courses</h2>
          <p className="mt-2 max-w-xl text-slate-500">
            Hand-picked, job-focused courses to launch your career
          </p>
        </div>

        {featured.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400">Courses coming soon. Please check back!</p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-200 px-7 py-3 font-bold text-brand-700 transition hover:bg-brand-50"
          >
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* WHY US */}
      <section id="about" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Why Choose {settings.siteName}?
            </h2>
            <p className="mt-2 text-slate-500">Built for Bangladeshi learners, by industry experts</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BookOpen, title: "Project-Based Learning", desc: "Learn by building real projects that go straight into your portfolio." },
              { icon: Users, title: "Expert Instructors", desc: "Learn from industry professionals with real world experience." },
              { icon: Award, title: "Verified Certificates", desc: "Get a shareable certificate after completing every course." },
              { icon: ShieldCheck, title: "Easy bKash/Nagad Payment", desc: "Pay conveniently using Bangladesh's most trusted mobile wallets." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="glow-card rounded-2xl border border-slate-100 p-6 text-center">
                <span className="gradient-brand mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white">
                  <Icon size={26} />
                </span>
                <h3 className="mb-2 font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="bg-gradient-to-b from-brand-50 to-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                What Our Students Say
              </h2>
              <p className="mt-2 text-slate-500">Real feedback from real learners</p>
            </div>
            <TestimonialCarousel items={testimonials} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="gradient-brand">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">{settings.tagline}</p>
          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-brand-700 shadow-2xl transition hover:scale-105"
          >
            Join EasySkillBD Today <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  Flame,
  PlayCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getEnrolledCoursesWithProgress } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const enrolled = await getEnrolledCoursesWithProgress(user.id);
  const completedCourses = enrolled.filter((course) => course.percent === 100).length;
  const averageProgress = enrolled.length
    ? Math.round(enrolled.reduce((total, course) => total + course.percent, 0) / enrolled.length)
    : 0;
  const nextCourse = [...enrolled].sort((a, b) => b.percent - a.percent).find((course) => course.percent < 100) ?? enrolled[0];
  const firstName = user.name.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-7xl animate-fade-in font-[family-name:var(--font-hind-siliguri)]">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-10">
        <div className="absolute -right-20 -top-28 size-80 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 size-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-violet-100">
              <Sparkles className="size-3.5" /> Your learning space
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Keep your momentum, {firstName}.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Small steps compound into big skills. Pick up where you left off and make today count.
            </p>
            {nextCourse ? (
              <Link href={`/dashboard/courses/${nextCourse.course.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-violet-100">
                <PlayCircle className="size-4" /> Continue learning <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link href="/courses" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-violet-100">
                Explore courses <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-orange-400 text-lg font-extrabold">
              {user.avatarUrl ? <Image src={user.avatarUrl} alt={`${user.name} avatar`} width={48} height={48} className="size-full object-cover" /> : firstName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold">{user.name}</p>
              <p className="text-xs text-slate-300">Student account</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active courses", value: enrolled.length, icon: BookOpen, tone: "text-violet-600 bg-violet-50" },
          { label: "Average progress", value: `${averageProgress}%`, icon: TrendingUp, tone: "text-emerald-600 bg-emerald-50" },
          { label: "Certificates", value: completedCourses, icon: Award, tone: "text-amber-600 bg-amber-50" },
          { label: "Learning streak", value: "7 days", icon: Flame, tone: "text-orange-600 bg-orange-50" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className={`mb-4 flex size-10 items-center justify-center rounded-xl ${stat.tone}`}><stat.icon className="size-5" /></div>
            <p className="text-2xl font-extrabold tracking-tight text-slate-950">{stat.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_20rem]">
        <section>
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Your library</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">Continue learning</h2></div>
            <Link href="/dashboard/my-courses" className="hidden items-center gap-1 text-sm font-bold text-brand-600 sm:flex">View all <ArrowRight className="size-4" /></Link>
          </div>
          {enrolled.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><BookOpen className="mx-auto size-8 text-slate-400" /><p className="mt-3 font-semibold text-slate-700">Your learning library is waiting.</p><p className="mt-1 text-sm text-slate-500">Choose a course to start building your next skill.</p><Link href="/courses" className="gradient-brand mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white">Browse courses <ArrowRight className="size-4" /></Link></div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {enrolled.map((item) => (
                <Link key={item.enrollmentId} href={`/dashboard/courses/${item.course.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-36 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-orange-400">{item.course.thumbnail && <Image src={item.course.thumbnail} alt={item.course.title} fill className="object-cover transition duration-500 group-hover:scale-105" />}</div>
                  <div className="p-2 pt-4"><div className="flex items-center justify-between gap-3"><h3 className="line-clamp-1 font-bold text-slate-950">{item.course.title}</h3><ArrowRight className="size-4 shrink-0 text-brand-600 transition group-hover:translate-x-1" /></div><div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500"><span>{item.percent}% complete</span><span>{item.percent === 100 ? <CheckCircle2 className="inline size-4 text-emerald-500" /> : <Clock3 className="inline size-4" />}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="gradient-brand h-full rounded-full transition-all" style={{ width: `${item.percent}%` }} /></div></div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><div className="flex size-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Flame className="size-4" /></div><div><p className="text-sm font-bold text-slate-950">Stay consistent</p><p className="text-xs text-slate-500">Your weekly goal</p></div></div><div className="mt-6 flex items-center justify-center"><div className="flex size-32 flex-col items-center justify-center rounded-full border-[10px] border-orange-100 border-t-orange-500"><span className="text-2xl font-extrabold text-slate-950">7</span><span className="text-xs font-semibold text-slate-500">day streak</span></div></div><p className="mt-5 text-center text-sm leading-5 text-slate-500">You&apos;re building a great habit. Keep going to reach your next milestone.</p><Link href="/dashboard/assignments" className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">View assignments <ArrowRight className="size-4" /></Link></aside>
      </div>
    </div>
  );
}

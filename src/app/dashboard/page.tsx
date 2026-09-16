import Link from "next/link";
import Image from "next/image";
import { BookOpen, TrendingUp, Award, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getEnrolledCoursesWithProgress } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const enrolled = await getEnrolledCoursesWithProgress(user.id);

  const completedCourses = enrolled.filter((e) => e.percent === 100).length;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {user.name.split(" ")[0]}! 👋</h1>
      <p className="mt-1 text-slate-500">Here&apos;s an overview of your learning journey.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BookOpen size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{enrolled.length}</p>
          <p className="text-sm text-slate-500">Enrolled Courses</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {enrolled.length > 0 ? Math.round(enrolled.reduce((a, e) => a + e.percent, 0) / enrolled.length) : 0}%
          </p>
          <p className="text-sm text-slate-500">Average Progress</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Award size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{completedCourses}</p>
          <p className="text-sm text-slate-500">Certificates Earned</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Continue Learning</h2>
        <Link href="/courses" className="text-sm font-semibold text-brand-600">
          Browse more courses
        </Link>
      </div>

      {enrolled.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="mb-3 text-slate-500">You haven&apos;t enrolled in any course yet.</p>
          <Link href="/courses" className="gradient-brand inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white">
            Explore Courses <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {enrolled.map((e) => (
            <div key={e.enrollmentId} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                {e.course.thumbnail ? (
                  <Image src={e.course.thumbnail} alt={e.course.title} fill className="object-cover" />
                ) : (
                  <div className="gradient-brand h-full w-full" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <p className="line-clamp-1 font-bold text-slate-900">{e.course.title}</p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="gradient-brand h-full rounded-full" style={{ width: `${e.percent}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">{e.percent}% complete</span>
                  <Link href={`/dashboard/courses/${e.course.slug}`} className="text-xs font-bold text-brand-600">
                    Continue &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

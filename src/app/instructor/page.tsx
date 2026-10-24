import Link from "next/link";
import { BookOpen, Users, TrendingUp, Star, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getInstructorOverview } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function InstructorOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const stats = await getInstructorOverview(user.id);

  const cards = [
    { label: "My Courses", value: stats.courseTotal, icon: BookOpen, color: "bg-brand-50 text-brand-600" },
    { label: "Total Students", value: stats.studentTotal, icon: Users, color: "bg-indigo-50 text-indigo-600" },
    { label: "Enrollments", value: stats.enrollmentTotal, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
    { label: "Avg. Rating", value: stats.avgRating ? stats.avgRating.toFixed(1) : "—", icon: Star, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {user.name.split(" ")[0]}!</h1>
      <p className="mt-1 text-slate-500">Here&apos;s how your courses are performing.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-slate-100 bg-white p-5">
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{c.value}</p>
              <p className="text-sm text-slate-500">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">Manage your courses</h2>
        <p className="mt-1 text-sm text-slate-500">
          View your courses, students, assignments and quizzes.
        </p>
        <Link
          href="/instructor/courses"
          className="gradient-brand mt-4 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold text-white"
        >
          Go to My Courses <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

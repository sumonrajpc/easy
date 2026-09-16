import Link from "next/link";
import Image from "next/image";
import { Users, Star } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getInstructorCourses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function InstructorCoursesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const courses = await getInstructorCourses(user.id);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">My Courses</h1>
      <p className="mt-1 text-slate-500">Courses you teach on EasySkillBD.</p>

      {courses.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          You don&apos;t have any courses yet.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
              <div className="relative h-36 w-full">
                {c.thumbnail ? (
                  <Image src={c.thumbnail} alt={c.title} fill className="object-cover" />
                ) : (
                  <div className="gradient-brand h-full w-full" />
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${
                    c.isPublished ? "bg-emerald-500 text-white" : "bg-slate-900/70 text-white"
                  }`}
                >
                  {c.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <div className="p-4">
                <p className="line-clamp-1 font-bold text-slate-900">{c.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{c.category ?? "General"}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Users size={14} /> {c.studentCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500" />
                    {c.avgRating ? Number(c.avgRating).toFixed(1) : "—"}
                  </span>
                  <span className="ml-auto font-semibold text-slate-800">
                    ৳{Number(c.price).toLocaleString("en-US")}
                  </span>
                </div>
                <Link
                  href={`/instructor/courses/${c.id}`}
                  className="mt-4 inline-block w-full rounded-xl border border-slate-200 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

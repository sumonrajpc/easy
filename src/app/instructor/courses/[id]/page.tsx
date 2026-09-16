import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, BookOpen, ClipboardList } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getInstructorCourseDetail } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function InstructorCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const data = await getInstructorCourseDetail(user.id, Number(id));
  if (!data) notFound();

  const { course, studentCount, modules, assignments } = data;
  const lessonCount = modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div>
      <Link
        href="/instructor/courses"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={15} /> Back to My Courses
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{course.title}</h1>
          <p className="mt-1 text-slate-500">{course.category ?? "General"}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            course.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}
        >
          {course.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Users size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{studentCount}</p>
          <p className="text-sm text-slate-500">Enrolled Students</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BookOpen size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{lessonCount}</p>
          <p className="text-sm text-slate-500">Lessons in {modules.length} modules</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <ClipboardList size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{assignments.length}</p>
          <p className="text-sm text-slate-500">Assignments</p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-bold text-slate-900">Curriculum</h2>
      <div className="mt-4 space-y-3">
        {modules.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
            No modules added yet.
          </p>
        ) : (
          modules.map((m) => (
            <div key={m.id} className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="font-bold text-slate-900">{m.title}</p>
              <ul className="mt-2 space-y-1">
                {m.lessons.map((l) => (
                  <li key={l.id} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                    {l.title}
                    {l.isFreePreview && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Free
                      </span>
                    )}
                  </li>
                ))}
                {m.lessons.length === 0 && (
                  <li className="text-sm text-slate-400">No lessons in this module.</li>
                )}
              </ul>
            </div>
          ))
        )}
      </div>

      <h2 className="mt-8 text-lg font-bold text-slate-900">Assignments &amp; Submissions</h2>
      <div className="mt-4 space-y-4">
        {assignments.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
            No assignments created yet.
          </p>
        ) : (
          assignments.map((a) => (
            <div key={a.id} className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="font-bold text-slate-900">{a.title}</p>
              {a.description && <p className="mt-1 text-sm text-slate-500">{a.description}</p>}
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {a.submissions.length} submission{a.submissions.length === 1 ? "" : "s"}
              </p>
              {a.submissions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {a.submissions.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">{s.studentName ?? "Student"}</span>
                        {s.note && <span className="ml-2 text-slate-500">{s.note}</span>}
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          s.grade != null ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {s.grade != null ? `Graded: ${s.grade}` : "Awaiting grade"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

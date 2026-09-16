import { getAllCoursesForAdmin } from "@/lib/queries";
import { toggleCoursePublishAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Courses</h1>
      <p className="mt-1 text-slate-500">Manage all courses on the platform.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        {courses.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No courses yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Instructor</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Students</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-semibold text-slate-800">{c.title}</td>
                  <td className="px-5 py-3 text-slate-600">{c.instructorName ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-600">৳{Number(c.price).toLocaleString("en-US")}</td>
                  <td className="px-5 py-3 text-slate-600">{c.studentCount}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        c.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {c.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <form action={toggleCoursePublishAction}>
                      <input type="hidden" name="courseId" value={c.id} />
                      <input type="hidden" name="isPublished" value={String(!c.isPublished)} />
                      <button
                        type="submit"
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {c.isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

import { getAllCoursesForAdmin } from "@/lib/queries";
import { deleteCourseAction, toggleCoursePublishAction, updateCourseAction } from "@/app/actions/admin";
import { VideoUploadForm } from "@/components/admin/VideoUploadForm";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Courses</h1>
      <p className="mt-1 text-slate-500">Edit course details, manage publishing, and attach hosted video URLs.</p>
      <div className="mt-6 grid gap-5">
        {courses.length === 0 ? <p className="rounded-2xl bg-white p-8 text-center text-slate-500">No courses yet.</p> : courses.map((course) => (
          <article key={course.id} className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><h2 className="font-bold text-slate-900">{course.title}</h2><p className="text-sm text-slate-500">{course.instructorName ?? "Unassigned"} · {course.studentCount} students</p></div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${course.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{course.isPublished ? "Published" : "Draft"}</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <form action={updateCourseAction} className="contents">
                <input type="hidden" name="courseId" value={course.id} />
                <label className="text-sm font-semibold text-slate-700">Title<input name="title" defaultValue={course.title} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /></label>
                <label className="text-sm font-semibold text-slate-700">Slug<input name="slug" defaultValue={course.slug} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /></label>
                <label className="text-sm font-semibold text-slate-700">Price<input name="price" defaultValue={String(course.price)} inputMode="decimal" required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /></label>
                <label className="text-sm font-semibold text-slate-700">Video URL<input name="promoVideoUrl" placeholder="https://..." className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-normal" /></label>
                <div className="flex flex-wrap gap-2 md:col-span-4"><button className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700" type="submit">Save changes</button></div>
              </form>
              <div className="flex flex-wrap gap-2 md:col-span-4">
                <form action={toggleCoursePublishAction}><input type="hidden" name="courseId" value={course.id} /><input type="hidden" name="isPublished" value={String(!course.isPublished)} /><button type="submit" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700">{course.isPublished ? "Unpublish" : "Publish"}</button></form>
                <form action={deleteCourseAction}><input type="hidden" name="courseId" value={course.id} /><button type="submit" className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700">Delete</button></form>
              </div>
            </div>
            <VideoUploadForm courseId={course.id} currentUrl={course.promoVideoUrl} />
          </article>
        ))}
      </div>
    </div>
  );
}

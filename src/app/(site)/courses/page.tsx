import { getPublishedCourses } from "@/lib/queries";
import CourseCard from "@/components/CourseCard";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "Web Development",
  "Digital Marketing",
  "Graphics Design",
  "Programming",
];

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const courses = await getPublishedCourses({ q, category });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Explore All Courses</h1>
        <p className="mt-2 text-slate-500">
          Find the skill that will change your career — {courses.length} courses available
        </p>
      </div>

      <form className="mx-auto mb-8 flex max-w-lg items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by title or category..."
          className="w-full bg-transparent text-sm outline-none"
        />
        <button className="gradient-brand rounded-full px-4 py-1.5 text-xs font-bold text-white">
          Search
        </button>
      </form>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <a
          href="/courses"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            !category ? "gradient-brand text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All
        </a>
        {CATEGORIES.map((c) => (
          <a
            key={c}
            href={`/courses?category=${encodeURIComponent(c)}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              category === c ? "gradient-brand text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {c}
          </a>
        ))}
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-slate-400">No courses found matching your search.</p>
      )}
    </div>
  );
}

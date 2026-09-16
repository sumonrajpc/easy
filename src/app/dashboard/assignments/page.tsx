import { CheckCircle2, Clock, Link as LinkIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getStudentAssignments } from "@/lib/queries";
import AssignmentSubmitForm from "@/components/AssignmentSubmitForm";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const assignments = await getStudentAssignments(user.id);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Assignments</h1>
      <p className="mt-1 text-slate-500">Submit your work and track feedback from instructors.</p>

      <div className="mt-6 space-y-4">
        {assignments.length === 0 && (
          <p className="text-slate-400">No assignments available yet.</p>
        )}
        {assignments.map(({ assignment, courseTitle, submission }) => (
          <div key={assignment.id} className="rounded-2xl border border-slate-100 bg-white p-5">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold text-slate-900">{assignment.title}</p>
              {submission ? (
                submission.grade !== null ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={13} /> Graded: {submission.grade}/100
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-600">
                    <Clock size={13} /> Awaiting Review
                  </span>
                )
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                  Not Submitted
                </span>
              )}
            </div>
            <p className="mb-1 text-xs font-semibold text-brand-600">{courseTitle}</p>
            <p className="mb-3 text-sm text-slate-500">{assignment.description}</p>
            {assignment.dueDate && (
              <p className="mb-3 text-xs text-slate-400">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </p>
            )}

            {submission?.feedback && (
              <div className="mb-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                <p className="mb-1 text-xs font-bold text-slate-400">Instructor Feedback</p>
                {submission.feedback}
              </div>
            )}

            {submission && (
              <p className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
                <LinkIcon size={12} /> Submitted:{" "}
                <a href={submission.fileUrl ?? "#"} target="_blank" className="text-brand-600 underline">
                  {submission.fileUrl}
                </a>
              </p>
            )}

            <AssignmentSubmitForm
              assignmentId={assignment.id}
              defaultFileUrl={submission?.fileUrl ?? ""}
              defaultNote={submission?.note ?? ""}
              alreadySubmitted={!!submission}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

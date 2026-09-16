"use client";

import { useActionState, useState } from "react";
import { submitAssignmentAction } from "@/app/actions/student";
import type { FormState } from "@/app/actions/courses";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function AssignmentSubmitForm({
  assignmentId,
  defaultFileUrl,
  defaultNote,
  alreadySubmitted,
}: {
  assignmentId: number;
  defaultFileUrl: string;
  defaultNote: string;
  alreadySubmitted: boolean;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(submitAssignmentAction, null);
  const [open, setOpen] = useState(!alreadySubmitted);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-bold text-brand-600 underline">
        Update submission
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-2 border-t border-slate-100 pt-3">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <input
        name="fileUrl"
        required
        defaultValue={defaultFileUrl}
        placeholder="GitHub / Google Drive / Live URL"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <textarea
        name="note"
        rows={2}
        defaultValue={defaultNote}
        placeholder="Add a note for your instructor (optional)"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <FormMessage state={state} />
      <SubmitButton className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white">
        {alreadySubmitted ? "Update Submission" : "Submit Assignment"}
      </SubmitButton>
    </form>
  );
}

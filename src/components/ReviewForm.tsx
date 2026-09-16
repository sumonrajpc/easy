"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReviewAction, type FormState } from "@/app/actions/courses";
import SubmitButton from "./SubmitButton";
import FormMessage from "./FormMessage";

export default function ReviewForm({ courseId }: { courseId: number }) {
  const [state, formAction] = useActionState<FormState, FormData>(submitReviewAction, null);
  const [rating, setRating] = useState(5);

  return (
    <form action={formAction} className="rounded-xl border border-slate-100 bg-white p-5">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="rating" value={rating} />
      <p className="mb-2 text-sm font-semibold text-slate-700">Leave a review</p>
      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button type="button" key={i} onClick={() => setRating(i)}>
            <Star
              size={22}
              className={i <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
            />
          </button>
        ))}
      </div>
      <textarea
        name="comment"
        rows={3}
        required
        placeholder="Share your experience about this course..."
        className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
      <FormMessage state={state} />
      <div className="mt-3">
        <SubmitButton>Submit Review</SubmitButton>
      </div>
    </form>
  );
}

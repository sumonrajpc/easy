"use server";

import { db } from "@/db";
import {
  progress,
  assignments,
  submissions,
  questions,
  quizAttempts,
  certificates,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import type { FormState } from "./courses";

export async function toggleLessonCompleteAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;

  const lessonId = Number(formData.get("lessonId"));
  const courseSlug = String(formData.get("courseSlug") || "");
  const completed = formData.get("completed") === "true";

  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, user.id), eq(progress.lessonId, lessonId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(progress)
      .set({ isCompleted: completed, completedAt: completed ? new Date() : null })
      .where(eq(progress.id, existing[0].id));
  } else {
    await db.insert(progress).values({
      userId: user.id,
      lessonId,
      isCompleted: completed,
      completedAt: completed ? new Date() : null,
    });
  }

  revalidatePath(`/dashboard/courses/${courseSlug}`);
}

export async function submitAssignmentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please login first." };

  const assignmentId = Number(formData.get("assignmentId"));
  const fileUrl = String(formData.get("fileUrl") || "").trim();
  const note = String(formData.get("note") || "").trim();

  if (!fileUrl) return { error: "Please provide a file/drive/github link." };

  const [existingAssignment] = await db
    .select()
    .from(assignments)
    .where(eq(assignments.id, assignmentId))
    .limit(1);
  if (!existingAssignment) return { error: "Assignment not found." };

  const existing = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.assignmentId, assignmentId),
        eq(submissions.studentId, user.id),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(submissions)
      .set({ fileUrl, note, submittedAt: new Date(), grade: null, feedback: null })
      .where(eq(submissions.id, existing[0].id));
  } else {
    await db.insert(submissions).values({
      assignmentId,
      studentId: user.id,
      fileUrl,
      note,
    });
  }

  revalidatePath("/dashboard");
  return { success: "Assignment submitted successfully!" };
}

export async function submitQuizAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please login first." };

  const quizId = Number(formData.get("quizId"));
  const courseSlug = String(formData.get("courseSlug") || "");
  const allQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId));

  let score = 0;
  const answers: Record<string, string> = {};
  for (const q of allQuestions) {
    const chosen = String(formData.get(`q_${q.id}`) || "");
    answers[String(q.id)] = chosen;
    if (chosen === q.correctAnswer) score += 1;
  }

  await db.insert(quizAttempts).values({
    quizId,
    userId: user.id,
    score,
    total: allQuestions.length,
    answers,
  });

  revalidatePath(`/dashboard/courses/${courseSlug}`);
  return { success: `You scored ${score}/${allQuestions.length}` } as FormState;
}

export async function issueCertificateAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return;
  const courseId = Number(formData.get("courseId"));

  const existing = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.userId, user.id), eq(certificates.courseId, courseId)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(certificates).values({
      userId: user.id,
      courseId,
      code: `ESB-${nanoid(8).toUpperCase()}`,
    });
  }

  revalidatePath(`/dashboard/certificate/${courseId}`);
}



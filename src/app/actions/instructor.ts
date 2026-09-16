"use server";

import { db } from "@/db";
import {
  assignments,
  submissions,
  quizzes,
  questions,
  courses,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { FormState } from "./courses";

async function assertCourseOwner(courseId: number) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authorized");
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course) throw new Error("Course not found");
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized");
  }
  return course;
}

export async function createAssignmentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const courseId = Number(formData.get("courseId"));
  try {
    await assertCourseOwner(courseId);
  } catch {
    return { error: "Not authorized." };
  }

  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Title is required." };

  const description = String(formData.get("description") || "");
  const dueDateStr = String(formData.get("dueDate") || "");

  await db.insert(assignments).values({
    courseId,
    title,
    description,
    dueDate: dueDateStr ? new Date(dueDateStr) : null,
  });

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: "Assignment created." };
}

export async function deleteAssignmentAction(formData: FormData) {
  const assignmentId = Number(formData.get("assignmentId"));
  const courseId = Number(formData.get("courseId"));
  await db.delete(assignments).where(eq(assignments.id, assignmentId));
  revalidatePath(`/instructor/courses/${courseId}`);
}

export async function gradeSubmissionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const submissionId = Number(formData.get("submissionId"));
  const courseId = Number(formData.get("courseId"));
  const grade = Number(formData.get("grade"));
  const feedback = String(formData.get("feedback") || "");

  try {
    await assertCourseOwner(courseId);
  } catch {
    return { error: "Not authorized." };
  }

  await db
    .update(submissions)
    .set({ grade, feedback })
    .where(eq(submissions.id, submissionId));

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: "Submission graded." };
}

export async function createQuizAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const lessonId = Number(formData.get("lessonId"));
  const courseId = Number(formData.get("courseId"));
  const title = String(formData.get("title") || "Quiz").trim();

  try {
    await assertCourseOwner(courseId);
  } catch {
    return { error: "Not authorized." };
  }

  await db.insert(quizzes).values({ lessonId, title });
  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: "Quiz created." };
}

export async function addQuestionAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const quizId = Number(formData.get("quizId"));
  const courseId = Number(formData.get("courseId"));
  const question = String(formData.get("question") || "").trim();
  const optionsRaw = String(formData.get("options") || "");
  const correctAnswer = String(formData.get("correctAnswer") || "").trim();

  try {
    await assertCourseOwner(courseId);
  } catch {
    return { error: "Not authorized." };
  }

  const optionsJson = optionsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!question || optionsJson.length < 2 || !correctAnswer) {
    return { error: "Please provide a question, at least 2 options, and the correct answer." };
  }

  const existing = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId));

  await db.insert(questions).values({
    quizId,
    question,
    optionsJson,
    correctAnswer,
    order: existing.length,
  });

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: "Question added." };
}

export async function deleteQuestionAction(formData: FormData) {
  const questionId = Number(formData.get("questionId"));
  const courseId = Number(formData.get("courseId"));
  await db.delete(questions).where(eq(questions.id, questionId));
  revalidatePath(`/instructor/courses/${courseId}`);
}

"use server";

import { db } from "@/db";
import {
  courses,
  modules,
  lessons,
  reviews,
  payments,
  enrollments,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FormState = { error?: string; success?: string } | null;

// -------------------- CHECKOUT / PAYMENT --------------------
export async function submitPaymentAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please login before enrolling." };

  const courseId = Number(formData.get("courseId"));
  const method = String(formData.get("method") || "BKASH") as
    | "BKASH"
    | "NAGAD";
  const senderNumber = String(formData.get("senderNumber") || "").trim();
  const trxId = String(formData.get("trxId") || "").trim();

  if (!courseId || !senderNumber || !trxId) {
    return { error: "Please fill in all payment fields." };
  }

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course) return { error: "Course not found." };

  const existingEnrollment = await db
    .select()
    .from(enrollments)
    .where(
      and(eq(enrollments.userId, user.id), eq(enrollments.courseId, courseId)),
    )
    .limit(1);
  if (existingEnrollment.length > 0) {
    return { error: "You are already enrolled in this course." };
  }

  await db.insert(payments).values({
    userId: user.id,
    courseId,
    amount: course.price,
    method,
    senderNumber,
    trxId,
    status: "PENDING",
  });

  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/dashboard");
  return {
    success:
      "আপনার পেমেন্ট রিকোয়েস্ট গৃহীত হয়েছে! Admin verify করার পর কোর্সটি আপনার ড্যাশবোর্ডে যুক্ত হবে।",
  };
}

// -------------------- REVIEWS --------------------
export async function submitReviewAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please login to leave a review." };

  const courseId = Number(formData.get("courseId"));
  const rating = Number(formData.get("rating") || 5);
  const comment = String(formData.get("comment") || "").trim();

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course) return { error: "Course not found." };

  await db
    .insert(reviews)
    .values({ courseId, userId: user.id, rating, comment })
    .onConflictDoUpdate({
      target: [reviews.userId, reviews.courseId],
      set: { rating, comment },
    });

  revalidatePath(`/courses/${course.slug}`);
  return { success: "Thank you for your review!" };
}

// -------------------- INSTRUCTOR: COURSE MANAGEMENT --------------------
export async function createCourseAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "INSTRUCTOR" && user.role !== "ADMIN")) {
    return { error: "Not authorized." };
  }

  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Title is required." };

  const price = String(formData.get("price") || "0");
  const description = String(formData.get("description") || "");
  const excerpt = String(formData.get("excerpt") || "");
  const category = String(formData.get("category") || "General");
  const level = String(formData.get("level") || "Beginner");
  const thumbnail = String(formData.get("thumbnail") || "");
  const promoVideoUrl = String(formData.get("promoVideoUrl") || "");
  const techStack = String(formData.get("techStack") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let slug = slugify(title);
  const dupes = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug));
  if (dupes.length > 0) slug = `${slug}-${Date.now().toString(36)}`;

  const [course] = await db
    .insert(courses)
    .values({
      title,
      slug,
      price,
      description,
      excerpt,
      category,
      level,
      thumbnail,
      promoVideoUrl,
      techStack,
      instructorId: user.id,
      isPublished: false,
    })
    .returning();

  revalidatePath("/instructor");
  redirect(`/instructor/courses/${course.id}`);
}

export async function updateCourseAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authorized." };

  const courseId = Number(formData.get("courseId"));
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course) return { error: "Course not found." };
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    return { error: "Not authorized." };
  }

  const techStack = String(formData.get("techStack") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await db
    .update(courses)
    .set({
      title: String(formData.get("title") || course.title),
      price: String(formData.get("price") || course.price),
      description: String(formData.get("description") || ""),
      excerpt: String(formData.get("excerpt") || ""),
      category: String(formData.get("category") || ""),
      level: String(formData.get("level") || ""),
      thumbnail: String(formData.get("thumbnail") || ""),
      promoVideoUrl: String(formData.get("promoVideoUrl") || ""),
      techStack,
      isPublished: formData.get("isPublished") === "on",
    })
    .where(eq(courses.id, courseId));

  revalidatePath(`/instructor/courses/${courseId}`);
  revalidatePath(`/courses/${course.slug}`);
  return { success: "Course updated successfully." };
}

export async function deleteCourseAction(formData: FormData) {
  const user = await getCurrentUser();
  const courseId = Number(formData.get("courseId"));
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course || !user) return;
  if (course.instructorId !== user.id && user.role !== "ADMIN") return;

  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/instructor");
  redirect("/instructor");
}

// -------------------- MODULES --------------------
export async function createModuleAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await getCurrentUser();
  const courseId = Number(formData.get("courseId"));
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Module title is required." };

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course || !user) return { error: "Not authorized." };
  if (course.instructorId !== user.id && user.role !== "ADMIN") {
    return { error: "Not authorized." };
  }

  const existing = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, courseId));

  await db.insert(modules).values({
    title,
    courseId,
    order: existing.length,
  });

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: "Module added." };
}

export async function deleteModuleAction(formData: FormData) {
  const moduleId = Number(formData.get("moduleId"));
  const courseId = Number(formData.get("courseId"));
  await db.delete(modules).where(eq(modules.id, moduleId));
  revalidatePath(`/instructor/courses/${courseId}`);
}

// -------------------- LESSONS --------------------
export async function createLessonAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const moduleId = Number(formData.get("moduleId"));
  const courseId = Number(formData.get("courseId"));
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Lesson title is required." };

  const existing = await db
    .select()
    .from(lessons)
    .where(eq(lessons.moduleId, moduleId));

  await db.insert(lessons).values({
    title,
    moduleId,
    videoUrl: String(formData.get("videoUrl") || ""),
    content: String(formData.get("content") || ""),
    liveClassUrl: String(formData.get("liveClassUrl") || "") || null,
    isFreePreview: formData.get("isFreePreview") === "on",
    order: existing.length,
  });

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: "Lesson added." };
}

export async function updateLessonAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const lessonId = Number(formData.get("lessonId"));
  const courseId = Number(formData.get("courseId"));

  await db
    .update(lessons)
    .set({
      title: String(formData.get("title") || ""),
      videoUrl: String(formData.get("videoUrl") || ""),
      content: String(formData.get("content") || ""),
      liveClassUrl: String(formData.get("liveClassUrl") || "") || null,
      isFreePreview: formData.get("isFreePreview") === "on",
    })
    .where(eq(lessons.id, lessonId));

  revalidatePath(`/instructor/courses/${courseId}`);
  return { success: "Lesson updated." };
}

export async function deleteLessonAction(formData: FormData) {
  const lessonId = Number(formData.get("lessonId"));
  const courseId = Number(formData.get("courseId"));
  await db.delete(lessons).where(eq(lessons.id, lessonId));
  revalidatePath(`/instructor/courses/${courseId}`);
}

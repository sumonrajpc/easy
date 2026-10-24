"use server";

import { db } from "@/db";
import { payments, users, enrollments, courses, siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { FormState } from "./courses";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") throw new Error("Not authorized");
  return user;
}

export async function approvePaymentAction(formData: FormData) {
  await requireAdmin();
  const paymentId = Number(formData.get("paymentId"));

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, paymentId))
    .limit(1);
  if (!payment) return;

  await db
    .update(payments)
    .set({ status: "APPROVED", reviewedAt: new Date() })
    .where(eq(payments.id, paymentId));

  await db
    .insert(enrollments)
    .values({ userId: payment.userId, courseId: payment.courseId })
    .onConflictDoNothing();

  revalidatePath("/admin/payments");
  revalidatePath("/dashboard");
}

export async function rejectPaymentAction(formData: FormData) {
  await requireAdmin();
  const paymentId = Number(formData.get("paymentId"));
  await db
    .update(payments)
    .set({ status: "REJECTED", reviewedAt: new Date() })
    .where(eq(payments.id, paymentId));
  revalidatePath("/admin/payments");
}

export async function updateUserRoleAction(formData: FormData) {
  await requireAdmin();
  const userId = Number(formData.get("userId"));
  const role = String(formData.get("role")) as "STUDENT" | "INSTRUCTOR" | "ADMIN";
  await db.update(users).set({ role }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

export async function toggleUserActiveAction(formData: FormData) {
  await requireAdmin();
  const userId = Number(formData.get("userId"));
  const isActive = formData.get("isActive") === "true";
  await db.update(users).set({ isActive }).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

export async function toggleCoursePublishAction(formData: FormData) {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  const isPublished = formData.get("isPublished") === "true";
  if (!Number.isInteger(courseId) || courseId < 1) throw new Error("Invalid course");
  await db.update(courses).set({ isPublished }).where(eq(courses.id, courseId));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function updateCourseAction(formData: FormData) {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const price = String(formData.get("price") ?? "0").trim();
  const promoVideoUrl = String(formData.get("promoVideoUrl") ?? "").trim();
  if (!Number.isInteger(courseId) || courseId < 1 || !title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Invalid course details");
  }
  if (!/^\d+(?:\.\d{1,2})?$/.test(price)) throw new Error("Invalid price");
  if (promoVideoUrl && !/^https?:\/\//i.test(promoVideoUrl)) throw new Error("Video URL must start with http:// or https://");
  await db.update(courses).set({ title, slug, price, promoVideoUrl: promoVideoUrl || null }).where(eq(courses.id, courseId));
  revalidatePath("/admin/courses");
  revalidatePath(`/courses/${slug}`);
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  const courseId = Number(formData.get("courseId"));
  if (!Number.isInteger(courseId) || courseId < 1) throw new Error("Invalid course");
  await db.delete(courses).where(eq(courses.id, courseId));
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function updateMarqueeAction(formData: FormData) {
  await requireAdmin();
  const marqueeText = String(formData.get("marqueeText") ?? "").trim();
  if (!marqueeText || marqueeText.length > 240) throw new Error("Invalid marquee text");
  await db.insert(siteSettings).values({ key: "marqueeText", value: marqueeText }).onConflictDoUpdate({ target: siteSettings.key, set: { value: marqueeText } });
  revalidatePath("/");
  revalidatePath("/admin/site");
}

export async function updateSiteSettingsAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const keys = [
    "siteName",
    "tagline",
    "logoUrl",
    "accentColor",
    "bannerText",
    "marqueeText",
    "heroVideoUrl",
    "heroTitle",
    "heroSubtitle",
    "whatsapp",
    "phone",
    "email",
    "address",
    "bkashNumber",
    "nagadNumber",
  ];

  for (const key of keys) {
    const value = formData.get(key);
    if (value !== null) {
      await db
        .insert(siteSettings)
        .values({ key, value: String(value) })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: String(value) },
        });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { success: "Settings updated successfully." };
}

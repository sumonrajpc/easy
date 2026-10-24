import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const courseId = Number(formData.get("courseId"));
  const file = formData.get("file");

  if (!Number.isInteger(courseId) || courseId < 1 || !(file instanceof File)) {
    return NextResponse.json({ error: "A valid course and video file are required." }, { status: 400 });
  }
  if (!file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Please select a video file." }, { status: 400 });
  }
  if (file.size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: "Video must be 500 MB or smaller." }, { status: 413 });
  }

  const [course] = await db.select({ id: courses.id }).from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : ".mp4";
  const blob = await put(`course-videos/${courseId}/${crypto.randomUUID()}${extension}`, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  await db.update(courses).set({ promoVideoUrl: blob.url }).where(eq(courses.id, courseId));
  return NextResponse.json({ url: blob.url });
}

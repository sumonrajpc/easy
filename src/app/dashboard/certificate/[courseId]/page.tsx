import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { courses, certificates, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getEnrolledCoursesWithProgress } from "@/lib/queries";
import { nanoid } from "nanoid";
import CertificateView from "@/components/CertificateView";

export const dynamic = "force-dynamic";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const cId = Number(courseId);
  const enrolled = await getEnrolledCoursesWithProgress(user.id);
  const record = enrolled.find((e) => e.course.id === cId);
  if (!record || record.percent < 100) notFound();

  const [course] = await db.select().from(courses).where(eq(courses.id, cId)).limit(1);
  const [instructor] = await db.select().from(users).where(eq(users.id, course.instructorId)).limit(1);

  let [cert] = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.userId, user.id), eq(certificates.courseId, cId)))
    .limit(1);

  if (!cert) {
    [cert] = await db
      .insert(certificates)
      .values({ userId: user.id, courseId: cId, code: `ESB-${nanoid(8).toUpperCase()}` })
      .returning();
  }

  return (
    <CertificateView
      studentName={user.name}
      courseTitle={course.title}
      instructorName={instructor?.name ?? "EasySkillBD"}
      code={cert.code}
      issuedAt={cert.issuedAt.toString()}
    />
  );
}

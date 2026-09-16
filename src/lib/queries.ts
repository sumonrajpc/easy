import { db } from "@/db";
import {
  courses,
  reviews,
  enrollments,
  users,
  modules,
  lessons,
  progress,
} from "@/db/schema";
import { and, avg, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { CourseCardData } from "@/components/CourseCard";

export async function getPublishedCourses(opts?: {
  q?: string;
  category?: string;
}): Promise<CourseCardData[]> {
  const conditions = [eq(courses.isPublished, true)];
  if (opts?.q) {
    conditions.push(
      or(
        ilike(courses.title, `%${opts.q}%`),
        ilike(courses.category, `%${opts.q}%`),
      )!,
    );
  }
  if (opts?.category) {
    conditions.push(eq(courses.category, opts.category));
  }

  const rows = await db
    .select({
      id: courses.id,
      slug: courses.slug,
      title: courses.title,
      excerpt: courses.excerpt,
      thumbnail: courses.thumbnail,
      price: courses.price,
      category: courses.category,
      level: courses.level,
      techStack: courses.techStack,
      instructorName: users.name,
      createdAt: courses.createdAt,
      avgRating: avg(reviews.rating),
      reviewCount: count(reviews.id),
    })
    .from(courses)
    .leftJoin(reviews, eq(reviews.courseId, courses.id))
    .leftJoin(users, eq(users.id, courses.instructorId))
    .where(and(...conditions))
    .groupBy(courses.id, users.name)
    .orderBy(desc(courses.createdAt));

  const enrollCounts = await db
    .select({ courseId: enrollments.courseId, total: count(enrollments.id) })
    .from(enrollments)
    .groupBy(enrollments.courseId);
  const enrollMap = new Map(enrollCounts.map((e) => [e.courseId, e.total]));

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    thumbnail: r.thumbnail,
    price: r.price,
    category: r.category,
    level: r.level,
    techStack: r.techStack,
    rating: r.avgRating ? Number(r.avgRating) : 0,
    reviewCount: r.reviewCount,
    studentCount: enrollMap.get(r.id) ?? 0,
    instructorName: r.instructorName ?? undefined,
  }));
}

export async function getCourseBySlug(slug: string) {
  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.slug, slug))
    .limit(1);
  if (!course) return null;

  const [instructor] = await db
    .select()
    .from(users)
    .where(eq(users.id, course.instructorId))
    .limit(1);

  const courseModules = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, course.id))
    .orderBy(modules.order);

  const moduleIds = courseModules.map((m) => m.id);
  const allLessons = moduleIds.length
    ? await db
        .select()
        .from(lessons)
        .where(sql`${lessons.moduleId} in ${moduleIds}`)
        .orderBy(lessons.order)
    : [];

  const courseReviews = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userName: users.name,
    })
    .from(reviews)
    .leftJoin(users, eq(users.id, reviews.userId))
    .where(eq(reviews.courseId, course.id))
    .orderBy(desc(reviews.createdAt));

  const [{ total: studentCount }] = await db
    .select({ total: count(enrollments.id) })
    .from(enrollments)
    .where(eq(enrollments.courseId, course.id));

  const avgRating =
    courseReviews.length > 0
      ? courseReviews.reduce((a, r) => a + r.rating, 0) / courseReviews.length
      : 0;

  return {
    course,
    instructor,
    modules: courseModules.map((m) => ({
      ...m,
      lessons: allLessons.filter((l) => l.moduleId === m.id),
    })),
    reviews: courseReviews,
    studentCount,
    avgRating,
  };
}

export async function getFeaturedTestimonials() {
  const rows = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      userName: users.name,
      courseTitle: courses.title,
    })
    .from(reviews)
    .leftJoin(users, eq(users.id, reviews.userId))
    .leftJoin(courses, eq(courses.id, reviews.courseId))
    .where(sql`${reviews.rating} >= 4 and ${reviews.comment} is not null`)
    .orderBy(desc(reviews.createdAt))
    .limit(8);

  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment ?? "",
    name: r.userName ?? "Student",
    courseTitle: r.courseTitle ?? "",
  }));
}

export async function getEnrolledCoursesWithProgress(userId: number) {
  const enrolledRows = await db
    .select({
      enrollmentId: enrollments.id,
      enrolledAt: enrollments.enrolledAt,
      course: courses,
    })
    .from(enrollments)
    .innerJoin(courses, eq(courses.id, enrollments.courseId))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.enrolledAt));

  const result = [];
  for (const row of enrolledRows) {
    const courseModules = await db
      .select({ id: modules.id })
      .from(modules)
      .where(eq(modules.courseId, row.course.id));
    const moduleIds = courseModules.map((m) => m.id);

    let totalLessons = 0;
    let completedLessons = 0;
    if (moduleIds.length > 0) {
      const allLessons = await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(sql`${lessons.moduleId} in ${moduleIds}`);
      totalLessons = allLessons.length;

      if (totalLessons > 0) {
        const lessonIds = allLessons.map((l) => l.id);
        const completed = await db
          .select({ id: progress.id })
          .from(progress)
          .where(
            sql`${progress.userId} = ${userId} and ${progress.lessonId} in ${lessonIds} and ${progress.isCompleted} = true`,
          );
        completedLessons = completed.length;
      }
    }

    result.push({
      ...row,
      totalLessons,
      completedLessons,
      percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    });
  }

  return result;
}

export async function getCoursePlayerData(userId: number, slug: string) {
  const { assignments, quizzes, questions, quizAttempts } = await import("@/db/schema");

  const [course] = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  if (!course) return null;

  const enrolledRows = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, course.id)))
    .limit(1);
  if (enrolledRows.length === 0) return null;

  const courseModules = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, course.id))
    .orderBy(modules.order);
  const moduleIds = courseModules.map((m) => m.id);

  const allLessons = moduleIds.length
    ? await db.select().from(lessons).where(sql`${lessons.moduleId} in ${moduleIds}`).orderBy(lessons.order)
    : [];
  const lessonIds = allLessons.map((l) => l.id);

  const progressRows = lessonIds.length
    ? await db
        .select()
        .from(progress)
        .where(sql`${progress.userId} = ${userId} and ${progress.lessonId} in ${lessonIds}`)
    : [];
  const progressMap = new Map(progressRows.map((p) => [p.lessonId, p.isCompleted]));

  const allQuizzes = lessonIds.length
    ? await db.select().from(quizzes).where(sql`${quizzes.lessonId} in ${lessonIds}`)
    : [];
  const quizIds = allQuizzes.map((q) => q.id);
  const allQuestions = quizIds.length
    ? await db.select().from(questions).where(sql`${questions.quizId} in ${quizIds}`).orderBy(questions.order)
    : [];
  const attempts = quizIds.length
    ? await db
        .select()
        .from(quizAttempts)
        .where(sql`${quizAttempts.userId} = ${userId} and ${quizAttempts.quizId} in ${quizIds}`)
        .orderBy(desc(quizAttempts.takenAt))
    : [];

  const modulesWithLessons = courseModules.map((m) => ({
    ...m,
    lessons: allLessons
      .filter((l) => l.moduleId === m.id)
      .map((l) => {
        const quiz = allQuizzes.find((q) => q.lessonId === l.id);
        const lastAttempt = quiz ? attempts.find((a) => a.quizId === quiz.id) : undefined;
        return {
          ...l,
          isCompleted: progressMap.get(l.id) ?? false,
          quiz: quiz
            ? {
                ...quiz,
                questions: allQuestions.filter((q) => q.quizId === quiz.id),
                lastAttempt: lastAttempt ?? null,
              }
            : null,
        };
      }),
  }));

  const totalLessons = allLessons.length;
  const completedLessons = progressRows.filter((p) => p.isCompleted).length;

  const courseAssignments = await db
    .select()
    .from(assignments)
    .where(eq(assignments.courseId, course.id));

  const { submissions } = await import("@/db/schema");
  const assignmentsWithSubmission = [];
  for (const a of courseAssignments) {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(and(eq(submissions.assignmentId, a.id), eq(submissions.studentId, userId)))
      .limit(1);
    assignmentsWithSubmission.push({ ...a, submission: submission ?? null });
  }

  return {
    course,
    modules: modulesWithLessons,
    assignments: assignmentsWithSubmission,
    percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

export async function getStudentAssignments(userId: number) {
  const { assignments, submissions } = await import("@/db/schema");

  const enrolledCourseIds = await db
    .select({ courseId: enrollments.courseId })
    .from(enrollments)
    .where(eq(enrollments.userId, userId));
  const courseIds = enrolledCourseIds.map((e) => e.courseId);
  if (courseIds.length === 0) return [];

  const rows = await db
    .select({
      assignment: assignments,
      courseTitle: courses.title,
      courseSlug: courses.slug,
    })
    .from(assignments)
    .innerJoin(courses, eq(courses.id, assignments.courseId))
    .where(sql`${assignments.courseId} in ${courseIds}`)
    .orderBy(desc(assignments.createdAt));

  const result = [];
  for (const row of rows) {
    const [submission] = await db
      .select()
      .from(submissions)
      .where(
        and(eq(submissions.assignmentId, row.assignment.id), eq(submissions.studentId, userId)),
      )
      .limit(1);
    result.push({ ...row, submission: submission ?? null });
  }
  return result;
}

export async function getPlatformStats() {
  const [[{ total: studentTotal }], [{ total: courseTotal }], [{ total: instructorTotal }]] =
    await Promise.all([
      db.select({ total: count(users.id) }).from(users).where(eq(users.role, "STUDENT")),
      db.select({ total: count(courses.id) }).from(courses).where(eq(courses.isPublished, true)),
      db.select({ total: count(users.id) }).from(users).where(eq(users.role, "INSTRUCTOR")),
    ]);

  return { studentTotal, courseTotal, instructorTotal };
}

// ------------------------------- ADMIN -------------------------------
export async function getAdminOverview() {
  const { payments } = await import("@/db/schema");
  const [
    [{ total: studentTotal }],
    [{ total: instructorTotal }],
    [{ total: courseTotal }],
    [{ total: publishedTotal }],
    [{ total: enrollmentTotal }],
    [{ total: pendingPayments }],
    [{ sum: approvedRevenue }],
  ] = await Promise.all([
    db.select({ total: count(users.id) }).from(users).where(eq(users.role, "STUDENT")),
    db.select({ total: count(users.id) }).from(users).where(eq(users.role, "INSTRUCTOR")),
    db.select({ total: count(courses.id) }).from(courses),
    db.select({ total: count(courses.id) }).from(courses).where(eq(courses.isPublished, true)),
    db.select({ total: count(enrollments.id) }).from(enrollments),
    db.select({ total: count(payments.id) }).from(payments).where(eq(payments.status, "PENDING")),
    db
      .select({ sum: sql<string>`coalesce(sum(${payments.amount}), 0)` })
      .from(payments)
      .where(eq(payments.status, "APPROVED")),
  ]);

  return {
    studentTotal,
    instructorTotal,
    courseTotal,
    publishedTotal,
    enrollmentTotal,
    pendingPayments,
    approvedRevenue: Number(approvedRevenue ?? 0),
  };
}

export async function getRecentEnrollments(limit = 6) {
  const rows = await db
    .select({
      id: enrollments.id,
      enrolledAt: enrollments.enrolledAt,
      studentName: users.name,
      courseTitle: courses.title,
    })
    .from(enrollments)
    .leftJoin(users, eq(users.id, enrollments.userId))
    .leftJoin(courses, eq(courses.id, enrollments.courseId))
    .orderBy(desc(enrollments.enrolledAt))
    .limit(limit);
  return rows;
}

export async function getAllUsersByRole(role: "STUDENT" | "INSTRUCTOR" | "ADMIN") {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      isActive: users.isActive,
      createdAt: users.createdAt,
      lastActiveAt: users.lastActiveAt,
    })
    .from(users)
    .where(eq(users.role, role))
    .orderBy(desc(users.createdAt));
  return rows;
}

export async function getAllCoursesForAdmin() {
  const rows = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      price: courses.price,
      category: courses.category,
      isPublished: courses.isPublished,
      createdAt: courses.createdAt,
      instructorName: users.name,
      studentCount: count(enrollments.id),
    })
    .from(courses)
    .leftJoin(users, eq(users.id, courses.instructorId))
    .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
    .groupBy(courses.id, users.name)
    .orderBy(desc(courses.createdAt));
  return rows;
}

export async function getAllPayments() {
  const { payments } = await import("@/db/schema");
  const rows = await db
    .select({
      id: payments.id,
      amount: payments.amount,
      method: payments.method,
      senderNumber: payments.senderNumber,
      trxId: payments.trxId,
      status: payments.status,
      createdAt: payments.createdAt,
      studentName: users.name,
      studentEmail: users.email,
      courseTitle: courses.title,
    })
    .from(payments)
    .leftJoin(users, eq(users.id, payments.userId))
    .leftJoin(courses, eq(courses.id, payments.courseId))
    .orderBy(desc(payments.createdAt));
  return rows;
}

// ------------------------------- INSTRUCTOR -------------------------------
export async function getInstructorOverview(instructorId: number) {
  const instructorCourses = await db
    .select({ id: courses.id })
    .from(courses)
    .where(eq(courses.instructorId, instructorId));
  const courseIds = instructorCourses.map((c) => c.id);

  let studentTotal = 0;
  let enrollmentTotal = 0;
  let avgRating = 0;
  if (courseIds.length > 0) {
    const [{ total: enrollTotal }] = await db
      .select({ total: count(enrollments.id) })
      .from(enrollments)
      .where(sql`${enrollments.courseId} in ${courseIds}`);
    enrollmentTotal = enrollTotal;

    const distinctStudents = await db
      .select({ userId: enrollments.userId })
      .from(enrollments)
      .where(sql`${enrollments.courseId} in ${courseIds}`)
      .groupBy(enrollments.userId);
    studentTotal = distinctStudents.length;

    const [{ rating }] = await db
      .select({ rating: avg(reviews.rating) })
      .from(reviews)
      .where(sql`${reviews.courseId} in ${courseIds}`);
    avgRating = rating ? Number(rating) : 0;
  }

  return {
    courseTotal: courseIds.length,
    studentTotal,
    enrollmentTotal,
    avgRating,
  };
}

export async function getInstructorCourseDetail(instructorId: number, courseId: number) {
  const { assignments, submissions } = await import("@/db/schema");

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
  if (!course) return null;
  if (course.instructorId !== instructorId) return null;

  const courseModules = await db
    .select()
    .from(modules)
    .where(eq(modules.courseId, course.id))
    .orderBy(modules.order);
  const moduleIds = courseModules.map((m) => m.id);
  const allLessons = moduleIds.length
    ? await db.select().from(lessons).where(sql`${lessons.moduleId} in ${moduleIds}`).orderBy(lessons.order)
    : [];

  const [{ total: studentCount }] = await db
    .select({ total: count(enrollments.id) })
    .from(enrollments)
    .where(eq(enrollments.courseId, course.id));

  const courseAssignments = await db
    .select()
    .from(assignments)
    .where(eq(assignments.courseId, course.id))
    .orderBy(desc(assignments.createdAt));

  const assignmentIds = courseAssignments.map((a) => a.id);
  const allSubmissions = assignmentIds.length
    ? await db
        .select({
          id: submissions.id,
          assignmentId: submissions.assignmentId,
          note: submissions.note,
          fileUrl: submissions.fileUrl,
          grade: submissions.grade,
          feedback: submissions.feedback,
          submittedAt: submissions.submittedAt,
          studentName: users.name,
        })
        .from(submissions)
        .leftJoin(users, eq(users.id, submissions.studentId))
        .where(sql`${submissions.assignmentId} in ${assignmentIds}`)
        .orderBy(desc(submissions.submittedAt))
    : [];

  return {
    course,
    studentCount,
    modules: courseModules.map((m) => ({
      ...m,
      lessons: allLessons.filter((l) => l.moduleId === m.id),
    })),
    assignments: courseAssignments.map((a) => ({
      ...a,
      submissions: allSubmissions.filter((s) => s.assignmentId === a.id),
    })),
  };
}

export async function getInstructorCourses(instructorId: number) {
  const rows = await db
    .select({
      id: courses.id,
      title: courses.title,
      slug: courses.slug,
      price: courses.price,
      category: courses.category,
      thumbnail: courses.thumbnail,
      isPublished: courses.isPublished,
      createdAt: courses.createdAt,
      studentCount: count(enrollments.id),
      avgRating: avg(reviews.rating),
    })
    .from(courses)
    .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
    .leftJoin(reviews, eq(reviews.courseId, courses.id))
    .where(eq(courses.instructorId, instructorId))
    .groupBy(courses.id)
    .orderBy(desc(courses.createdAt));
  return rows;
}

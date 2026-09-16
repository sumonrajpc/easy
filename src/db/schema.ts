import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ------------------------------- ENUMS -------------------------------
export const roleEnum = pgEnum("role", ["STUDENT", "INSTRUCTOR", "ADMIN"]);
export const paymentMethodEnum = pgEnum("payment_method", ["BKASH", "NAGAD"]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// ------------------------------- USERS -------------------------------
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }).notNull(),
    password: text("password").notNull(),
    role: roleEnum("role").notNull().default("STUDENT"),
    avatarUrl: text("avatar_url"),
    phone: varchar("phone", { length: 32 }),
    bio: text("bio"),
    isActive: boolean("is_active").notNull().default(true),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

// ------------------------------- COURSES -------------------------------
export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    excerpt: text("excerpt"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
    thumbnail: text("thumbnail"),
    promoVideoUrl: text("promo_video_url"),
    category: varchar("category", { length: 120 }),
    level: varchar("level", { length: 60 }).default("Beginner"),
    techStack: jsonb("tech_stack").$type<string[]>().default([]),
    isPublished: boolean("is_published").notNull().default(false),
    instructorId: integer("instructor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("courses_slug_idx").on(t.slug)],
);

// ------------------------------- MODULES -------------------------------
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  order: integer("order").notNull().default(0),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ------------------------------- LESSONS -------------------------------
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  videoUrl: text("video_url"),
  content: text("content"),
  liveClassUrl: text("live_class_url"),
  isFreePreview: boolean("is_free_preview").notNull().default(false),
  order: integer("order").notNull().default(0),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ------------------------------- ENROLLMENTS -------------------------------
export const enrollments = pgTable(
  "enrollments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("enrollments_user_course_idx").on(t.userId, t.courseId)],
);

// ------------------------------- PROGRESS -------------------------------
export const progress = pgTable(
  "progress",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("progress_user_lesson_idx").on(t.userId, t.lessonId)],
);

// ------------------------------- ASSIGNMENTS -------------------------------
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ------------------------------- SUBMISSIONS -------------------------------
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  studentId: integer("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileUrl: text("file_url"),
  note: text("note"),
  grade: integer("grade"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ------------------------------- QUIZZES -------------------------------
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .notNull()
    .references(() => lessons.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ------------------------------- QUESTIONS -------------------------------
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  optionsJson: jsonb("options_json").$type<string[]>().notNull().default([]),
  correctAnswer: text("correct_answer").notNull(),
  order: integer("order").notNull().default(0),
});

// ------------------------------- QUIZ ATTEMPTS -------------------------------
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  score: integer("score").notNull().default(0),
  total: integer("total").notNull().default(0),
  answers: jsonb("answers").$type<Record<string, string>>().default({}),
  takenAt: timestamp("taken_at", { withTimezone: true }).notNull().defaultNow(),
});

// ------------------------------- REVIEWS -------------------------------
export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull().default(5),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("reviews_user_course_idx").on(t.userId, t.courseId)],
);

// ------------------------------- PAYMENTS -------------------------------
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  senderNumber: varchar("sender_number", { length: 32 }).notNull(),
  trxId: varchar("trx_id", { length: 120 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

// ------------------------------- SITE SETTINGS -------------------------------
export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: text("value"),
});

// ------------------------------- CERTIFICATES -------------------------------
export const certificates = pgTable(
  "certificates",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 40 }).notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("certificates_user_course_idx").on(t.userId, t.courseId)],
);

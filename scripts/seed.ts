import "dotenv/config";
import { db, pool } from "../src/db";
import {
  users,
  courses,
  modules,
  lessons,
  enrollments,
  progress,
  assignments,
  submissions,
  quizzes,
  questions,
  reviews,
  payments,
  siteSettings,
} from "../src/db/schema";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/utils";
import { DEFAULT_SETTINGS } from "../src/lib/settings";

async function main() {
  console.log("Seeding EasySkillBD database...");

  const pass = await bcrypt.hash("password123", 10);

  const [admin] = await db
    .insert(users)
    .values({
      name: "Rasel Ahmed",
      email: "admin@easyskillbd.com",
      password: pass,
      role: "ADMIN",
      phone: "01715710019",
      bio: "Founder & Platform Administrator at EasySkillBD.",
      lastActiveAt: new Date(),
    })
    .returning();

  const [instructor1] = await db
    .insert(users)
    .values({
      name: "Tanvir Hasan",
      email: "instructor@easyskillbd.com",
      password: pass,
      role: "INSTRUCTOR",
      phone: "01711111111",
      bio: "Senior Full-Stack Developer & Instructor with 8+ years of industry experience.",
      lastActiveAt: new Date(),
    })
    .returning();

  const [instructor2] = await db
    .insert(users)
    .values({
      name: "Nusrat Jahan",
      email: "nusrat@easyskillbd.com",
      password: pass,
      role: "INSTRUCTOR",
      phone: "01722222222",
      bio: "Digital Marketing Strategist. Helped 200+ brands grow online.",
      lastActiveAt: new Date(),
    })
    .returning();

  const students = await db
    .insert(users)
    .values([
      {
        name: "Sadia Islam",
        email: "student@easyskillbd.com",
        password: pass,
        role: "STUDENT",
        phone: "01733333333",
        bio: "Aspiring web developer.",
        lastActiveAt: new Date(),
      },
      {
        name: "Kamal Hossain",
        email: "kamal@example.com",
        password: pass,
        role: "STUDENT",
        phone: "01744444444",
        lastActiveAt: new Date(Date.now() - 1000 * 60 * 2),
      },
      {
        name: "Farhana Akter",
        email: "farhana@example.com",
        password: pass,
        role: "STUDENT",
        phone: "01755555555",
        lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    ])
    .returning();

  const courseData = [
    {
      title: "Complete Web Development Bootcamp (Bangla)",
      description:
        "Master HTML, CSS, JavaScript, React and Node.js from scratch with real-world projects. Designed for absolute beginners who want to become job-ready full-stack developers.",
      excerpt: "Become a job-ready full-stack web developer in 6 months.",
      price: "4500",
      category: "Web Development",
      level: "Beginner",
      techStack: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
      instructorId: instructor1.id,
      thumbnail:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    },
    {
      title: "Advanced React & Next.js Masterclass",
      description:
        "Deep dive into React 19, Next.js App Router, Server Components, and production deployment strategies used by top tech companies.",
      excerpt: "Build production grade apps with React & Next.js.",
      price: "5900",
      category: "Web Development",
      level: "Advanced",
      techStack: ["React", "Next.js", "TypeScript", "Tailwind"],
      instructorId: instructor1.id,
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    },
    {
      title: "Digital Marketing Mastery 2025",
      description:
        "Learn Facebook Ads, Google Ads, SEO, and Content Marketing to grow any business online. Includes live case studies from Bangladeshi brands.",
      excerpt: "Complete digital marketing course for freelancers & agencies.",
      price: "3500",
      category: "Digital Marketing",
      level: "Beginner",
      techStack: ["Facebook Ads", "SEO", "Google Ads", "Analytics"],
      instructorId: instructor2.id,
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    },
    {
      title: "Graphics Design with Adobe Photoshop & Illustrator",
      description:
        "From zero to hero in graphics design. Learn branding, logo design, and social media creatives that clients love.",
      excerpt: "Start your freelancing career in graphics design.",
      price: "2800",
      category: "Graphics Design",
      level: "Beginner",
      techStack: ["Photoshop", "Illustrator", "Canva"],
      instructorId: instructor2.id,
      thumbnail:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    },
    {
      title: "Python Programming for Everyone",
      description:
        "Learn Python from the ground up including data structures, OOP, and automation scripts. Perfect first programming language.",
      excerpt: "Your first step into the world of programming.",
      price: "3000",
      category: "Programming",
      level: "Beginner",
      techStack: ["Python", "Automation", "OOP"],
      instructorId: instructor1.id,
      thumbnail:
        "https://images.unsplash.com/photo-152637995098-d400fd0bf935?w=800&q=80",
    },
  ];

  const createdCourses = [];
  for (const c of courseData) {
    const [course] = await db
      .insert(courses)
      .values({
        title: c.title,
        slug: slugify(c.title),
        description: c.description,
        excerpt: c.excerpt,
        price: c.price,
        thumbnail: c.thumbnail,
        promoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        category: c.category,
        level: c.level,
        techStack: c.techStack,
        isPublished: true,
        instructorId: c.instructorId,
      })
      .returning();
    createdCourses.push(course);
  }

  // Modules & lessons for the first course
  const mainCourse = createdCourses[0];
  const moduleTitles = [
    "Getting Started with Web Development",
    "HTML & CSS Fundamentals",
    "JavaScript Essentials",
    "React Fundamentals",
  ];

  let firstLessonId: number | null = null;
  for (let i = 0; i < moduleTitles.length; i++) {
    const [mod] = await db
      .insert(modules)
      .values({ title: moduleTitles[i], order: i, courseId: mainCourse.id })
      .returning();

    const lessonTitles = [
      `${moduleTitles[i]} - Introduction`,
      `${moduleTitles[i]} - Deep Dive`,
      `${moduleTitles[i]} - Practical Project`,
    ];

    for (let j = 0; j < lessonTitles.length; j++) {
      const [lesson] = await db
        .insert(lessons)
        .values({
          title: lessonTitles[j],
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          content: `<p>Welcome to <strong>${lessonTitles[j]}</strong>. In this lesson we cover the core concepts with hands-on examples relevant for Bangladeshi learners entering the tech industry.</p>`,
          liveClassUrl: j === 1 ? "https://meet.google.com/abc-defg-hij" : null,
          isFreePreview: i === 0 && j === 0,
          order: j,
          moduleId: mod.id,
        })
        .returning();
      if (!firstLessonId) firstLessonId = lesson.id;

      if (i === 1 && j === 0) {
        const [quiz] = await db
          .insert(quizzes)
          .values({ title: "HTML & CSS Quiz", lessonId: lesson.id })
          .returning();
        await db.insert(questions).values([
          {
            quizId: quiz.id,
            question: "Which tag is used to create a hyperlink in HTML?",
            optionsJson: ["<link>", "<a>", "<href>", "<nav>"],
            correctAnswer: "<a>",
            order: 0,
          },
          {
            quizId: quiz.id,
            question: "Which CSS property changes text color?",
            optionsJson: ["font-color", "text-color", "color", "background-color"],
            correctAnswer: "color",
            order: 1,
          },
          {
            quizId: quiz.id,
            question: "What does CSS stand for?",
            optionsJson: [
              "Creative Style Sheets",
              "Cascading Style Sheets",
              "Computer Style Sheets",
              "Colorful Style Sheets",
            ],
            correctAnswer: "Cascading Style Sheets",
            order: 2,
          },
        ]);
      }
    }
  }

  const [assignment] = await db
    .insert(assignments)
    .values({
      courseId: mainCourse.id,
      title: "Build a Personal Portfolio Landing Page",
      description:
        "Create a responsive personal portfolio landing page using HTML & CSS and submit the GitHub/live link.",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    })
    .returning();

  // Enrollments & progress for main student
  const student = students[0];
  await db.insert(enrollments).values([
    { userId: student.id, courseId: createdCourses[0].id },
    { userId: student.id, courseId: createdCourses[2].id },
  ]);
  await db.insert(enrollments).values([
    { userId: students[1].id, courseId: createdCourses[0].id },
  ]);

  if (firstLessonId) {
    await db.insert(progress).values({
      userId: student.id,
      lessonId: firstLessonId,
      isCompleted: true,
      completedAt: new Date(),
    });
  }

  await db.insert(submissions).values({
    assignmentId: assignment.id,
    studentId: students[1].id,
    fileUrl: "https://github.com/example/portfolio",
    note: "Please review my first project!",
  });

  // Reviews
  await db.insert(reviews).values([
    {
      courseId: createdCourses[0].id,
      userId: student.id,
      rating: 5,
      comment:
        "অসাধারণ কোর্স! ইনস্ট্রাক্টর খুব সহজভাবে বুঝিয়েছেন। এখন আমি নিজে থেকে ওয়েবসাইট বানাতে পারি।",
    },
    {
      courseId: createdCourses[0].id,
      userId: students[1].id,
      rating: 5,
      comment: "Best web development course in Bangla. Highly recommended for beginners!",
    },
    {
      courseId: createdCourses[2].id,
      userId: student.id,
      rating: 4,
      comment: "Very practical digital marketing course with real case studies.",
    },
    {
      courseId: createdCourses[1].id,
      userId: students[2].id,
      rating: 5,
      comment: "The Next.js masterclass took my career to the next level. Got a job within 2 months!",
    },
  ]);

  // Payments
  await db.insert(payments).values([
    {
      userId: students[2].id,
      courseId: createdCourses[1].id,
      amount: "5900",
      method: "BKASH",
      senderNumber: "01755555555",
      trxId: "8N7K2M9P1Q",
      status: "PENDING",
    },
    {
      userId: students[1].id,
      courseId: createdCourses[0].id,
      amount: "4500",
      method: "NAGAD",
      senderNumber: "01744444444",
      trxId: "9X8Y7Z6W5V",
      status: "APPROVED",
      reviewedAt: new Date(),
    },
  ]);

  // Site settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db
      .insert(siteSettings)
      .values({ key, value: String(value) })
      .onConflictDoNothing();
  }

  console.log("Seed complete!");
  console.log("Login credentials (password: password123):");
  console.log(" Admin:      admin@easyskillbd.com");
  console.log(" Instructor: instructor@easyskillbd.com");
  console.log(" Student:    student@easyskillbd.com");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

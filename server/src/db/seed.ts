import bcrypt from "bcryptjs";
import { prisma } from "util/db";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@example.com" } });
  if (existingAdmin) {
    console.log("Seeding already completed, skipping...");
    return;
  }

  const hash = async (pwd: string) => bcrypt.hash(pwd, 10);

  // Users
  const _admin = await prisma.user.create({
    data: { name: "Admin", email: "admin@example.com", password: await hash("Admin123!"), role: "ADMIN" },
  });

  const t1 = await prisma.user.create({
    data: {
      name: "Dr. John Smith",
      email: "teacher1@example.com",
      password: await hash("Teacher123!"),
      role: "TEACHER",
    },
  });

  const t2 = await prisma.user.create({
    data: {
      name: "Prof. Sarah Johnson",
      email: "teacher2@example.com",
      password: await hash("Teacher123!"),
      role: "TEACHER",
    },
  });

  // Create 500 student accounts
  const students = [];
  for (let i = 1; i <= 500; i++) {
    const student = await prisma.user.create({
      data: {
        name: `Student ${i}`,
        email: `user${i}@example.com`,
        password: await hash("Student123!"),
        role: "STUDENT",
      },
    });
    students.push(student);
  }

  // Use first 4 for initial enrollments
  const s1 = students[0];
  const s2 = students[1];
  const s3 = students[2];
  const s4 = students[3];

  // Courses
  const [web, db, algo] = await Promise.all([
    prisma.course.create({
      data: {
        title: "English Beginner (A1)",
        description: "Basic grammar, vocabulary and communication for beginners",
      },
    }),
    prisma.course.create({
      data: {
        title: "English Pre-Intermediate (A2–B1)",
        description: "Grammar expansion, daily conversation, essential writing skills",
      },
    }),
    prisma.course.create({
      data: {
        title: "English Speaking & Listening",
        description: "Improve fluency, pronunciation, listening comprehension",
      },
    }),
  ]);

  // Classes
  const [c1, c2, c3, c4] = await Promise.all([
    prisma.class.create({ data: { courseId: web.id, teacherId: t1.id, title: "A1-F24" } }),
    prisma.class.create({ data: { courseId: web.id, teacherId: t2.id, title: "IELTS-F24" } }),
    prisma.class.create({ data: { courseId: db.id, teacherId: t1.id, title: "SPEAK-F24" } }),
    prisma.class.create({ data: { courseId: algo.id, teacherId: t2.id, title: "TOEIC450-S25" } }),
  ]);

  // Enrollments
  await Promise.all([
    prisma.enrollment.create({ data: { userId: s1.id, classId: c1.id, status: "ACTIVE" } }),
    prisma.enrollment.create({ data: { userId: s1.id, classId: c3.id, status: "ACTIVE" } }),
    prisma.enrollment.create({ data: { userId: s2.id, classId: c1.id, status: "ACTIVE" } }),
    prisma.enrollment.create({ data: { userId: s2.id, classId: c4.id, status: "ACTIVE" } }),
    prisma.enrollment.create({ data: { userId: s3.id, classId: c2.id, status: "ACTIVE" } }),
    prisma.enrollment.create({ data: { userId: s4.id, classId: c3.id, status: "ACTIVE" } }),
  ]);

  // Materials
  await Promise.all([
    prisma.material.create({
      data: {
        classId: c1.id,
        createdBy: t1.id,
        title: "Basic Vocabulary PDF",
        description:
          "A beginner-friendly vocabulary list including 150 essential daily-use words with pictures and examples.",
        type: "PDF",
        url: "https://example.com/materials/basic-vocabulary.pdf",
      },
    }),
    prisma.material.create({
      data: {
        classId: c1.id,
        createdBy: t1.id,
        title: "Present Simple Grammar Guide",
        description: "A detailed explanation of Present Simple tense rules, structure, examples, and common mistakes.",
        type: "VIDEO",
        url: "https://example.com/materials/present-simple-guide.pdf",
      },
    }),
    prisma.material.create({
      data: {
        classId: c3.id,
        createdBy: t1.id,
        title: "Daily Activities Listening Audio",
        description: "An audio file containing simple dialogues about daily routines to support listening practice.",
        type: "PDF",
        url: "https://example.com/materials/self-introduction-sample.mp4",
      },
    }),
    prisma.material.create({
      data: {
        classId: c4.id,
        createdBy: t2.id,
        title: "Beginner Workbook – Unit 1",
        description:
          "Workbook exercises for Unit 1, including vocabulary practice, sentence building, and simple dialogues.",
        type: "PDF",
        url: "https://example.com/materials/beginner-workbook-unit1.pdf",
      },
    }),
  ]);

  // Assignments
  const [a1, a2, a3, _a4] = await Promise.all([
    prisma.assignment.create({
      data: {
        classId: c1.id,
        createdBy: t1.id,
        title: "Vocabulary Quiz 1 – Basic Words",
        description:
          "A short quiz focusing on essential beginner-level vocabulary, helping learners review and strengthen basic daily-use words.",
        dueDate: new Date("2024-02-28"),
        maxScore: 100,
      },
    }),
    prisma.assignment.create({
      data: {
        classId: c1.id,
        createdBy: t1.id,
        title: "Grammar Exercise – Present Simple",
        description:
          "Practice activities on the Present Simple tense, including affirmative, negative, and question forms to reinforce basic grammar usage.",
        dueDate: new Date("2024-03-15"),
        maxScore: 100,
      },
    }),
    prisma.assignment.create({
      data: {
        classId: c3.id,
        createdBy: t1.id,
        title: "Listening Practice – Daily Activities",
        description:
          "A listening task featuring simple conversations about everyday routines, designed to improve comprehension of common phrases and actions.",
        dueDate: new Date("2024-03-20"),
        maxScore: 150,
      },
    }),
    prisma.assignment.create({
      data: {
        classId: c4.id,
        createdBy: t2.id,
        title: "Speaking Task – Self Introduction",
        description:
          "Students record or present a short self-introduction to practice speaking fluency, basic sentence structure, and personal information vocabulary.",
        dueDate: new Date("2024-10-15"),
        maxScore: 100,
      },
    }),
  ]);

  // Submissions
  const [sub1, _sub2, sub3, _sub4] = await Promise.all([
    prisma.submission.create({
      data: {
        assignmentId: a1.id,
        userId: s1.id,
        content: "https://github.com/s1/portfolio",
        status: "GRADED",
        submittedAt: new Date("2024-02-25"),
      },
    }),
    prisma.submission.create({
      data: {
        assignmentId: a2.id,
        userId: s1.id,
        content: "https://github.com/s1/calc",
        status: "SUBMITTED",
        submittedAt: new Date("2024-03-14"),
      },
    }),
    prisma.submission.create({
      data: {
        assignmentId: a1.id,
        userId: s2.id,
        content: "https://github.com/s2/portfolio",
        status: "GRADED",
        submittedAt: new Date("2024-02-27"),
      },
    }),
    prisma.submission.create({
      data: {
        assignmentId: a3.id,
        userId: s1.id,
        content: "https://github.com/s1/library-db",
        status: "SUBMITTED",
        submittedAt: new Date("2024-03-19"),
      },
    }),
  ]);

  // Feedback
  await Promise.all([
    prisma.feedback.create({
      data: { submissionId: sub1.id, createdBy: t1.id, comment: "Excellent work! Clean code.", score: 95 },
    }),
    prisma.feedback.create({
      data: { submissionId: sub3.id, createdBy: t1.id, comment: "Good effort. Improve accessibility.", score: 82 },
    }),
  ]);

  console.log("✅ Seeding finished!");
  console.log(
    "📊 Data: 502 users (1 admin, 1 teacher, 500 students), 3 courses, 4 classes, 6 enrollments, 4 materials, 4 assignments, 4 submissions, 2 feedback"
  );
}

// Standalone CLI support
if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error("❌ Seed failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

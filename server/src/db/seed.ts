import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  const existingAdmin = await prisma.user.findUnique({ where: { email: "admin@example.com" } });
  if (existingAdmin) {
    console.log("Seeding already completed, skipping...");
    return;
  }

  const hash = async (pwd: string) => bcrypt.hash(pwd, 10);

  // Users
  const [_admin, t1, t2, s1, s2, s3, s4] = await Promise.all([
    prisma.user.create({
      data: { name: "Admin", email: "admin@example.com", password: await hash("Admin123!"), role: "ADMIN" },
    }),
    prisma.user.create({
      data: {
        name: "Dr. John Smith",
        email: "teacher1@example.com",
        password: await hash("Teacher123!"),
        role: "TEACHER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Prof. Sarah Johnson",
        email: "teacher2@example.com",
        password: await hash("Teacher123!"),
        role: "TEACHER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Alice Nguyen",
        email: "student1@example.com",
        password: await hash("Student123!"),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: { name: "Bob Tran", email: "student2@example.com", password: await hash("Student123!"), role: "STUDENT" },
    }),
    prisma.user.create({
      data: {
        name: "Charlie Lee",
        email: "student3@example.com",
        password: await hash("Student123!"),
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: { name: "Diana Pham", email: "student4@example.com", password: await hash("Student123!"), role: "STUDENT" },
    }),
  ]);

  // Courses
  const [web, db, algo] = await Promise.all([
    prisma.course.create({ data: { title: "Web Development", description: "HTML, CSS, JavaScript" } }),
    prisma.course.create({ data: { title: "Database Systems", description: "SQL and data modeling" } }),
    prisma.course.create({ data: { title: "Algorithms", description: "Complexity analysis" } }),
  ]);

  // Classes
  const [c1, c2, c3, c4] = await Promise.all([
    prisma.class.create({ data: { courseId: web.id, teacherId: t1.id, title: "Web-S24" } }),
    prisma.class.create({ data: { courseId: web.id, teacherId: t2.id, title: "Web-F24" } }),
    prisma.class.create({ data: { courseId: db.id, teacherId: t1.id, title: "DB-S24" } }),
    prisma.class.create({ data: { courseId: algo.id, teacherId: t2.id, title: "Algo-F24" } }),
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
        title: "HTML Basics",
        description: "HTML structure",
        type: "PDF",
        url: "https://example.com/html.pdf",
      },
    }),
    prisma.material.create({
      data: {
        classId: c1.id,
        createdBy: t1.id,
        title: "CSS Tutorial",
        description: "CSS guide",
        type: "VIDEO",
        url: "https://youtube.com/css",
      },
    }),
    prisma.material.create({
      data: {
        classId: c3.id,
        createdBy: t1.id,
        title: "SQL Cheat Sheet",
        description: "SQL commands",
        type: "PDF",
        url: "https://example.com/sql.pdf",
      },
    }),
    prisma.material.create({
      data: {
        classId: c4.id,
        createdBy: t2.id,
        title: "Algorithm Slides",
        description: "Big O notation",
        type: "PDF",
        url: "https://example.com/bigo.pdf",
      },
    }),
  ]);

  // Assignments
  const [a1, a2, a3, _a4] = await Promise.all([
    prisma.assignment.create({
      data: {
        classId: c1.id,
        createdBy: t1.id,
        title: "Portfolio Website",
        description: "HTML/CSS portfolio",
        dueDate: new Date("2024-02-28"),
        maxScore: 100,
      },
    }),
    prisma.assignment.create({
      data: {
        classId: c1.id,
        createdBy: t1.id,
        title: "JS Calculator",
        description: "Calculator in JS",
        dueDate: new Date("2024-03-15"),
        maxScore: 100,
      },
    }),
    prisma.assignment.create({
      data: {
        classId: c3.id,
        createdBy: t1.id,
        title: "DB Design",
        description: "Library DB design",
        dueDate: new Date("2024-03-20"),
        maxScore: 150,
      },
    }),
    prisma.assignment.create({
      data: {
        classId: c4.id,
        createdBy: t2.id,
        title: "Sorting Algos",
        description: "Quicksort, mergesort",
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
    "📊 Data: 7 users, 3 courses, 4 classes, 6 enrollments, 4 materials, 4 assignments, 4 submissions, 2 feedback"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

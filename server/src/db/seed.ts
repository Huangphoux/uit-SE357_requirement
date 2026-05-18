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

  // Admin
  await prisma.user.create({
    data: { name: "Admin", email: "admin@example.com", password: await hash("Admin123!"), role: "ADMIN" },
  });

  // Create 250 teachers
  console.log("Creating 250 teachers...");
  const teachers = [];
  for (let i = 1; i <= 250; i++) {
    const teacher = await prisma.user.create({
      data: {
        name: `Teacher ${i}`,
        email: `teacher${i}@example.com`,
        password: await hash("Teacher123!"),
        role: "TEACHER",
      },
    });
    teachers.push(teacher);
  }

  // Create 250 students
  console.log("Creating 250 students...");
  const students = [];
  for (let i = 1; i <= 250; i++) {
    const student = await prisma.user.create({
      data: {
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        password: await hash("Student123!"),
        role: "STUDENT",
      },
    });
    students.push(student);
  }

  // Courses
  const [course1, course2, course3] = await Promise.all([
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

  // Create 250 classes (one per teacher)
  console.log("Creating 250 classes...");
  const classes = [];
  for (let i = 0; i < 250; i++) {
    const courseIdx = i % 3;
    const courses = [course1, course2, course3];
    const cls = await prisma.class.create({
      data: {
        courseId: courses[courseIdx].id,
        teacherId: teachers[i].id,
        title: `Class-${i + 1}`,
      },
    });
    classes.push(cls);
  }

  // Enroll all 250 students across classes (each student in their corresponding class)
  console.log("Enrolling students...");
  const enrollmentData = [];
  for (let i = 0; i < 250; i++) {
    const classIdx = i % 250;
    enrollmentData.push({
      userId: students[i].id,
      classId: classes[classIdx].id,
      status: "ACTIVE" as const,
    });
  }
  await prisma.enrollment.createMany({ data: enrollmentData });

  // Create assignments for each class
  console.log("Creating assignments...");
  const assignments = [];
  for (let i = 0; i < 250; i++) {
    const assignment = await prisma.assignment.create({
      data: {
        classId: classes[i].id,
        createdBy: teachers[i].id,
        title: `Assignment ${i + 1}`,
        description: `Assignment description for class ${i + 1}`,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        maxScore: 100,
      },
    });
    assignments.push(assignment);
  }

  // Create submissions for all students
  console.log("Creating submissions and feedback...");
  const submissionBatchSize = 50;
  for (let batch = 0; batch < Math.ceil(250 / submissionBatchSize); batch++) {
    const batchStart = batch * submissionBatchSize;
    const batchEnd = Math.min(batchStart + submissionBatchSize, 250);
    const submissionData = [];

    for (let i = batchStart; i < batchEnd; i++) {
      const classIdx = i % 250;
      submissionData.push({
        assignmentId: assignments[classIdx].id,
        userId: students[i].id,
        content: `Submission content from student ${i + 1}`,
        status: "GRADED" as const,
        submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }

    await prisma.submission.createMany({ data: submissionData });
  }

  // Get all submissions and create feedback for each
  console.log("Adding feedback to submissions...");
  const submissions = await prisma.submission.findMany();
  const feedbackBatchSize = 50;

  for (let batch = 0; batch < Math.ceil(submissions.length / feedbackBatchSize); batch++) {
    const batchStart = batch * feedbackBatchSize;
    const batchEnd = Math.min(batchStart + feedbackBatchSize, submissions.length);
    const feedbackData = [];

    for (let i = batchStart; i < batchEnd; i++) {
      const submission = submissions[i];
      const classIdx = i % 250;
      feedbackData.push({
        submissionId: submission.id,
        createdBy: teachers[classIdx].id,
        comment: `Great work! Keep improving.`,
        score: Math.floor(Math.random() * 40) + 60,
      });
    }

    await prisma.feedback.createMany({ data: feedbackData });
  }

  console.log("✅ Seeding finished!");
  console.log(
    "📊 Data: 501 users (1 admin, 250 teachers, 250 students), 3 courses, 250 classes, 250 enrollments, 250 assignments, 250 submissions, 250 feedback"
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

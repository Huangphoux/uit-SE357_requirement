import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Check if seeding has already been done
  const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@example.com" },
  });

  if (existingAdmin) {
      console.log("Seeding already completed, skipping...");
      return;
  } 

  // ============ USERS ============
  const adminPassword = await hashPassword('AdminPass123!');
  const teacherPassword = await hashPassword('TeacherPass123!');
  const teacher2Password = await hashPassword('Teacher2Pass123!');
  const studentPassword = await hashPassword('StudentPass123!');
  const student2Password = await hashPassword('Student2Pass123!');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const teacherUser1 = await prisma.user.upsert({
    where: { email: 'teacher1@example.com' },
    update: {},
    create: {
      name: 'Dr. John Smith',
      email: 'teacher1@example.com',
      password: teacherPassword,
      role: 'TEACHER',
    },
  });

  const teacherUser2 = await prisma.user.upsert({
    where: { email: 'teacher2@example.com' },
    update: {},
    create: {
      name: 'Prof. Sarah Johnson',
      email: 'teacher2@example.com',
      password: teacher2Password,
      role: 'TEACHER',
    },
  });

  const studentUser1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      name: 'Alice Nguyen',
      email: 'student1@example.com',
      password: studentPassword,
      role: 'STUDENT',
    },
  });

  const studentUser2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      name: 'Bob Tran',
      email: 'student2@example.com',
      password: student2Password,
      role: 'STUDENT',
    },
  });

  const studentUser3 = await prisma.user.create({
    data: { name: 'Charlie Lee', email: 'student3@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser4 = await prisma.user.create({
    data: { name: 'Diana Pham', email: 'student4@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser5 = await prisma.user.create({
    data: { name: 'Ethan Vo', email: 'student5@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser6 = await prisma.user.create({
    data: { name: 'Fiona Hoang', email: 'student6@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser7 = await prisma.user.create({
    data: { name: 'George Tran', email: 'student7@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser8 = await prisma.user.create({
    data: { name: 'Hannah Do', email: 'student8@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser9 = await prisma.user.create({
    data: { name: 'Ivan Nguyen', email: 'student9@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser10 = await prisma.user.create({
    data: { name: 'Julia Le', email: 'student10@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser11 = await prisma.user.create({
    data: { name: 'Kevin Ly', email: 'student11@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser12 = await prisma.user.create({
    data: { name: 'Laura Vu', email: 'student12@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser13 = await prisma.user.create({
    data: { name: 'Mike Dang', email: 'student13@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser14 = await prisma.user.create({
    data: { name: 'Nancy Bui', email: 'student14@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser15 = await prisma.user.create({
    data: { name: 'Oscar Truong', email: 'student15@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser16 = await prisma.user.create({
    data: { name: 'Paula Ngo', email: 'student16@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser17 = await prisma.user.create({
    data: { name: 'Quinn Mai', email: 'student17@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser18 = await prisma.user.create({
    data: { name: 'Ryan Ha', email: 'student18@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser19 = await prisma.user.create({
    data: { name: 'Sophia Dinh', email: 'student19@example.com', password: studentPassword, role: 'STUDENT' },
  });
  const studentUser20 = await prisma.user.create({
    data: { name: 'Tom Cao', email: 'student20@example.com', password: studentPassword, role: 'STUDENT' },
  });

  const teacherUser3 = await prisma.user.create({
    data: { name: 'Dr. Emily Chen', email: 'teacher3@example.com', password: teacherPassword, role: 'TEACHER' },
  });
  const teacherUser4 = await prisma.user.create({
    data: { name: 'Prof. Michael Brown', email: 'teacher4@example.com', password: teacherPassword, role: 'TEACHER' },
  });
  const teacherUser5 = await prisma.user.create({
    data: { name: 'Dr. Lisa Wang', email: 'teacher5@example.com', password: teacherPassword, role: 'TEACHER' },
  });

  // ============ COURSES ============
  const webDev = await prisma.course.create({
    data: {
      code: 'CS101',
      name: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, JavaScript and modern web development',
      credits: 3,
    },
  });

  const database = await prisma.course.create({
    data: {
      code: 'CS201',
      name: 'Database Systems',
      description: 'Introduction to relational databases, SQL and data modeling',
      credits: 4,
    },
  });

  const algorithms = await prisma.course.create({
    data: {
      code: 'CS301',
      name: 'Data Structures & Algorithms',
      description: 'Advanced algorithms, complexity analysis, optimization',
      credits: 4,
    },
  });

  const networking = await prisma.course.create({
    data: { code: 'CS402', name: 'Computer Networks', description: 'TCP/IP, routing, network protocols', credits: 3 },
  });
  const ai = await prisma.course.create({
    data: { code: 'CS501', name: 'Artificial Intelligence', description: 'ML, neural networks, AI fundamentals', credits: 4 },
  });
  const os = await prisma.course.create({
    data: { code: 'CS302', name: 'Operating Systems', description: 'Process management, memory, file systems', credits: 4 },
  });
  const security = await prisma.course.create({
    data: { code: 'CS403', name: 'Cybersecurity', description: 'Encryption, threats, security principles', credits: 3 },
  });
  const mobile = await prisma.course.create({
    data: { code: 'CS102', name: 'Mobile App Development', description: 'iOS and Android development', credits: 3 },
  });
  const cloud = await prisma.course.create({
    data: { code: 'CS404', name: 'Cloud Computing', description: 'AWS, Azure, distributed systems', credits: 4 },
  });
  const softwareEng = await prisma.course.create({
    data: { code: 'CS303', name: 'Software Engineering', description: 'SDLC, design patterns, testing', credits: 3 },
  });

  // ============ CLASSES ============
  const webDevClass1 = await prisma.class.create({
    data: {
      courseId: webDev.id,
      teacherId: teacherUser1.id,
      name: 'Web Dev - Spring 2024',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-05-15'),
      capacity: 30,
    },
  });

  const webDevClass2 = await prisma.class.create({
    data: {
      courseId: webDev.id,
      teacherId: teacherUser2.id,
      name: 'Web Dev - Fall 2024',
      startDate: new Date('2024-08-20'),
      endDate: new Date('2024-12-20'),
      capacity: 25,
    },
  });

  const databaseClass = await prisma.class.create({
    data: {
      courseId: database.id,
      teacherId: teacherUser1.id,
      name: 'Database Systems - Spring 2024',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-05-15'),
      capacity: 35,
    },
  });

  const algoClass = await prisma.class.create({
    data: {
      courseId: algorithms.id,
      teacherId: teacherUser2.id,
      name: 'DSA - Fall 2024',
      startDate: new Date('2024-08-20'),
      endDate: new Date('2024-12-20'),
      capacity: 20,
    },
  });

  const networkClass1 = await prisma.class.create({
    data: { courseId: networking.id, teacherId: teacherUser3.id, name: 'Networks - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 30 },
  });
  const networkClass2 = await prisma.class.create({
    data: { courseId: networking.id, teacherId: teacherUser4.id, name: 'Networks - Fall 2025', startDate: new Date('2025-08-20'), endDate: new Date('2025-12-20'), capacity: 28 },
  });
  const aiClass1 = await prisma.class.create({
    data: { courseId: ai.id, teacherId: teacherUser3.id, name: 'AI - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 25 },
  });
  const aiClass2 = await prisma.class.create({
    data: { courseId: ai.id, teacherId: teacherUser5.id, name: 'AI - Fall 2025', startDate: new Date('2025-08-20'), endDate: new Date('2025-12-20'), capacity: 25 },
  });
  const osClass = await prisma.class.create({
    data: { courseId: os.id, teacherId: teacherUser1.id, name: 'OS - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 35 },
  });
  const securityClass1 = await prisma.class.create({
    data: { courseId: security.id, teacherId: teacherUser4.id, name: 'Security - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 30 },
  });
  const securityClass2 = await prisma.class.create({
    data: { courseId: security.id, teacherId: teacherUser5.id, name: 'Security - Fall 2025', startDate: new Date('2025-08-20'), endDate: new Date('2025-12-20'), capacity: 30 },
  });
  const mobileClass1 = await prisma.class.create({
    data: { courseId: mobile.id, teacherId: teacherUser2.id, name: 'Mobile - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 28 },
  });
  const mobileClass2 = await prisma.class.create({
    data: { courseId: mobile.id, teacherId: teacherUser3.id, name: 'Mobile - Fall 2025', startDate: new Date('2025-08-20'), endDate: new Date('2025-12-20'), capacity: 28 },
  });
  const cloudClass1 = await prisma.class.create({
    data: { courseId: cloud.id, teacherId: teacherUser4.id, name: 'Cloud - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 32 },
  });
  const cloudClass2 = await prisma.class.create({
    data: { courseId: cloud.id, teacherId: teacherUser5.id, name: 'Cloud - Fall 2025', startDate: new Date('2025-08-20'), endDate: new Date('2025-12-20'), capacity: 32 },
  });
  const seClass1 = await prisma.class.create({
    data: { courseId: softwareEng.id, teacherId: teacherUser1.id, name: 'SE - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 30 },
  });
  const seClass2 = await prisma.class.create({
    data: { courseId: softwareEng.id, teacherId: teacherUser2.id, name: 'SE - Fall 2025', startDate: new Date('2025-08-20'), endDate: new Date('2025-12-20'), capacity: 30 },
  });
  const webDevClass3 = await prisma.class.create({
    data: { courseId: webDev.id, teacherId: teacherUser3.id, name: 'Web Dev - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 30 },
  });
  const webDevClass4 = await prisma.class.create({
    data: { courseId: webDev.id, teacherId: teacherUser4.id, name: 'Web Dev - Summer 2025', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-01'), capacity: 20 },
  });
  const dbClass2 = await prisma.class.create({
    data: { courseId: database.id, teacherId: teacherUser2.id, name: 'Database - Fall 2025', startDate: new Date('2025-08-20'), endDate: new Date('2025-12-20'), capacity: 35 },
  });
  const dbClass3 = await prisma.class.create({
    data: { courseId: database.id, teacherId: teacherUser3.id, name: 'Database - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 32 },
  });
  const algoClass2 = await prisma.class.create({
    data: { courseId: algorithms.id, teacherId: teacherUser5.id, name: 'DSA - Spring 2025', startDate: new Date('2025-01-15'), endDate: new Date('2025-05-15'), capacity: 22 },
  });
  const algoClass3 = await prisma.class.create({
    data: { courseId: algorithms.id, teacherId: teacherUser1.id, name: 'DSA - Summer 2025', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-01'), capacity: 18 },
  });

  // ============ ENROLLMENTS ============
  await prisma.enrollment.create({
    data: {
      studentId: studentUser1.id,
      classId: webDevClass1.id,
      enrolledAt: new Date('2024-01-10'),
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentUser1.id,
      classId: databaseClass.id,
      enrolledAt: new Date('2024-01-10'),
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentUser2.id,
      classId: webDevClass1.id,
      enrolledAt: new Date('2024-01-12'),
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({
    data: {
      studentId: studentUser2.id,
      classId: algoClass.id,
      enrolledAt: new Date('2024-08-18'),
      status: 'ACTIVE',
    },
  });

  await prisma.enrollment.create({ data: { studentId: studentUser3.id, classId: webDevClass1.id, enrolledAt: new Date('2024-01-11'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser3.id, classId: networkClass1.id, enrolledAt: new Date('2025-01-10'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser4.id, classId: webDevClass2.id, enrolledAt: new Date('2024-08-19'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser4.id, classId: aiClass1.id, enrolledAt: new Date('2025-01-09'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser5.id, classId: databaseClass.id, enrolledAt: new Date('2024-01-11'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser5.id, classId: osClass.id, enrolledAt: new Date('2025-01-10'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser6.id, classId: webDevClass1.id, enrolledAt: new Date('2024-01-13'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser6.id, classId: securityClass1.id, enrolledAt: new Date('2025-01-11'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser7.id, classId: algoClass.id, enrolledAt: new Date('2024-08-19'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser7.id, classId: mobileClass1.id, enrolledAt: new Date('2025-01-10'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser8.id, classId: webDevClass2.id, enrolledAt: new Date('2024-08-21'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser8.id, classId: cloudClass1.id, enrolledAt: new Date('2025-01-09'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser9.id, classId: databaseClass.id, enrolledAt: new Date('2024-01-14'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser9.id, classId: seClass1.id, enrolledAt: new Date('2025-01-10'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser10.id, classId: webDevClass1.id, enrolledAt: new Date('2024-01-15'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser10.id, classId: aiClass1.id, enrolledAt: new Date('2025-01-11'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser11.id, classId: algoClass.id, enrolledAt: new Date('2024-08-22'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser11.id, classId: networkClass1.id, enrolledAt: new Date('2025-01-12'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser12.id, classId: webDevClass2.id, enrolledAt: new Date('2024-08-20'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser12.id, classId: osClass.id, enrolledAt: new Date('2025-01-13'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser13.id, classId: databaseClass.id, enrolledAt: new Date('2024-01-16'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser13.id, classId: securityClass1.id, enrolledAt: new Date('2025-01-14'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser14.id, classId: webDevClass1.id, enrolledAt: new Date('2024-01-17'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser14.id, classId: mobileClass1.id, enrolledAt: new Date('2025-01-11'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser15.id, classId: algoClass.id, enrolledAt: new Date('2024-08-23'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser15.id, classId: cloudClass1.id, enrolledAt: new Date('2025-01-12'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser16.id, classId: webDevClass2.id, enrolledAt: new Date('2024-08-24'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser16.id, classId: seClass1.id, enrolledAt: new Date('2025-01-13'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser17.id, classId: databaseClass.id, enrolledAt: new Date('2024-01-18'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser17.id, classId: webDevClass3.id, enrolledAt: new Date('2025-01-14'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser18.id, classId: webDevClass1.id, enrolledAt: new Date('2024-01-19'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser18.id, classId: dbClass3.id, enrolledAt: new Date('2025-01-15'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser19.id, classId: algoClass.id, enrolledAt: new Date('2024-08-25'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser19.id, classId: algoClass2.id, enrolledAt: new Date('2025-01-16'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser20.id, classId: webDevClass2.id, enrolledAt: new Date('2024-08-26'), status: 'ACTIVE' } });
  await prisma.enrollment.create({ data: { studentId: studentUser20.id, classId: networkClass1.id, enrolledAt: new Date('2025-01-17'), status: 'ACTIVE' } });

  // ============ MATERIALS ============
  await prisma.material.create({
    data: {
      classId: webDevClass1.id,
      title: 'HTML Basics',
      description: 'Introduction to HTML structure and tags',
      type: 'PDF',
      url: 'https://example.com/materials/html-basics.pdf',
    },
  });

  await prisma.material.create({
    data: {
      classId: webDevClass1.id,
      title: 'CSS Tutorial Video',
      description: 'Complete CSS guide for beginners',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=example1',
    },
  });

  await prisma.material.create({
    data: {
      classId: databaseClass.id,
      title: 'SQL Cheat Sheet',
      description: 'Quick reference for SQL commands',
      type: 'PDF',
      url: 'https://example.com/materials/sql-cheatsheet.pdf',
    },
  });

  await prisma.material.create({
    data: {
      classId: databaseClass.id,
      title: 'ER Diagram Examples',
      description: 'Sample entity-relationship diagrams',
      type: 'LINK',
      url: 'https://example.com/er-diagrams',
    },
  });

  await prisma.material.create({
    data: {
      classId: algoClass.id,
      title: 'Algorithm Analysis Slides',
      description: 'Big O notation and complexity analysis',
      type: 'PDF',
      url: 'https://example.com/materials/big-o.pdf',
    },
  });

  await prisma.material.create({ data: { classId: webDevClass2.id, title: 'JavaScript Advanced', description: 'ES6+ features', type: 'PDF', url: 'https://example.com/materials/js-advanced.pdf' } });
  await prisma.material.create({ data: { classId: webDevClass2.id, title: 'React Tutorial', description: 'Building modern web apps', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example2' } });
  await prisma.material.create({ data: { classId: algoClass.id, title: 'Sorting Algorithms', description: 'Quicksort, mergesort', type: 'LINK', url: 'https://example.com/sorting' } });
  await prisma.material.create({ data: { classId: algoClass.id, title: 'Graph Algorithms', description: 'DFS, BFS, Dijkstra', type: 'PDF', url: 'https://example.com/materials/graphs.pdf' } });
  await prisma.material.create({ data: { classId: networkClass1.id, title: 'TCP/IP Protocol', description: 'Network layer protocols', type: 'PDF', url: 'https://example.com/materials/tcpip.pdf' } });
  await prisma.material.create({ data: { classId: networkClass1.id, title: 'Routing Basics', description: 'Router configuration', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example3' } });
  await prisma.material.create({ data: { classId: networkClass1.id, title: 'Network Security', description: 'Firewalls and VPNs', type: 'LINK', url: 'https://example.com/netsec' } });
  await prisma.material.create({ data: { classId: aiClass1.id, title: 'Neural Networks Intro', description: 'Perceptrons and backprop', type: 'PDF', url: 'https://example.com/materials/nn.pdf' } });
  await prisma.material.create({ data: { classId: aiClass1.id, title: 'ML Algorithms', description: 'Supervised learning', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example4' } });
  await prisma.material.create({ data: { classId: aiClass1.id, title: 'Deep Learning', description: 'CNNs and RNNs', type: 'LINK', url: 'https://example.com/deeplearning' } });
  await prisma.material.create({ data: { classId: osClass.id, title: 'Process Scheduling', description: 'CPU scheduling algorithms', type: 'PDF', url: 'https://example.com/materials/scheduling.pdf' } });
  await prisma.material.create({ data: { classId: osClass.id, title: 'Memory Management', description: 'Paging and segmentation', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example5' } });
  await prisma.material.create({ data: { classId: osClass.id, title: 'File Systems', description: 'Disk organization', type: 'LINK', url: 'https://example.com/filesystems' } });
  await prisma.material.create({ data: { classId: securityClass1.id, title: 'Cryptography Basics', description: 'Encryption algorithms', type: 'PDF', url: 'https://example.com/materials/crypto.pdf' } });
  await prisma.material.create({ data: { classId: securityClass1.id, title: 'Web Security', description: 'XSS, CSRF, SQL injection', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example6' } });
  await prisma.material.create({ data: { classId: securityClass1.id, title: 'Security Best Practices', description: 'OWASP top 10', type: 'LINK', url: 'https://example.com/owasp' } });
  await prisma.material.create({ data: { classId: mobileClass1.id, title: 'iOS Development', description: 'Swift programming', type: 'PDF', url: 'https://example.com/materials/ios.pdf' } });
  await prisma.material.create({ data: { classId: mobileClass1.id, title: 'Android Development', description: 'Kotlin basics', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example7' } });
  await prisma.material.create({ data: { classId: mobileClass1.id, title: 'React Native', description: 'Cross-platform development', type: 'LINK', url: 'https://example.com/reactnative' } });
  await prisma.material.create({ data: { classId: cloudClass1.id, title: 'AWS Fundamentals', description: 'EC2, S3, Lambda', type: 'PDF', url: 'https://example.com/materials/aws.pdf' } });
  await prisma.material.create({ data: { classId: cloudClass1.id, title: 'Docker Containers', description: 'Containerization basics', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example8' } });
  await prisma.material.create({ data: { classId: cloudClass1.id, title: 'Kubernetes Guide', description: 'Orchestration', type: 'LINK', url: 'https://example.com/k8s' } });
  await prisma.material.create({ data: { classId: seClass1.id, title: 'Design Patterns', description: 'Gang of Four patterns', type: 'PDF', url: 'https://example.com/materials/patterns.pdf' } });
  await prisma.material.create({ data: { classId: seClass1.id, title: 'Agile Methodology', description: 'Scrum and Kanban', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example9' } });
  await prisma.material.create({ data: { classId: seClass1.id, title: 'Testing Strategies', description: 'Unit, integration, e2e', type: 'LINK', url: 'https://example.com/testing' } });
  await prisma.material.create({ data: { classId: webDevClass3.id, title: 'Node.js Backend', description: 'Server-side JavaScript', type: 'PDF', url: 'https://example.com/materials/nodejs.pdf' } });
  await prisma.material.create({ data: { classId: webDevClass3.id, title: 'Express Framework', description: 'RESTful APIs', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example10' } });
  await prisma.material.create({ data: { classId: dbClass3.id, title: 'NoSQL Databases', description: 'MongoDB basics', type: 'PDF', url: 'https://example.com/materials/nosql.pdf' } });
  await prisma.material.create({ data: { classId: dbClass3.id, title: 'Database Optimization', description: 'Indexing and query tuning', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example11' } });
  await prisma.material.create({ data: { classId: algoClass2.id, title: 'Dynamic Programming', description: 'DP patterns and problems', type: 'PDF', url: 'https://example.com/materials/dp.pdf' } });
  await prisma.material.create({ data: { classId: algoClass2.id, title: 'Greedy Algorithms', description: 'Optimization techniques', type: 'LINK', url: 'https://example.com/greedy' } });
  await prisma.material.create({ data: { classId: networkClass2.id, title: 'Wireless Networks', description: 'WiFi and mobile networks', type: 'PDF', url: 'https://example.com/materials/wireless.pdf' } });
  await prisma.material.create({ data: { classId: aiClass2.id, title: 'Natural Language Processing', description: 'Text analysis', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example12' } });
  await prisma.material.create({ data: { classId: securityClass2.id, title: 'Penetration Testing', description: 'Ethical hacking', type: 'LINK', url: 'https://example.com/pentest' } });
  await prisma.material.create({ data: { classId: mobileClass2.id, title: 'Flutter Development', description: 'Dart and widgets', type: 'PDF', url: 'https://example.com/materials/flutter.pdf' } });
  await prisma.material.create({ data: { classId: cloudClass2.id, title: 'Azure Services', description: 'Microsoft cloud platform', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example13' } });
  await prisma.material.create({ data: { classId: seClass2.id, title: 'CI/CD Pipelines', description: 'DevOps practices', type: 'LINK', url: 'https://example.com/cicd' } });
  await prisma.material.create({ data: { classId: webDevClass4.id, title: 'TypeScript Guide', description: 'Type-safe JavaScript', type: 'PDF', url: 'https://example.com/materials/typescript.pdf' } });
  await prisma.material.create({ data: { classId: dbClass2.id, title: 'Database Transactions', description: 'ACID properties', type: 'VIDEO', url: 'https://www.youtube.com/watch?v=example14' } });
  await prisma.material.create({ data: { classId: algoClass3.id, title: 'Backtracking', description: 'Recursive problem solving', type: 'LINK', url: 'https://example.com/backtrack' } });
  await prisma.material.create({ data: { classId: osClass.id, title: 'Concurrency', description: 'Threads and synchronization', type: 'PDF', url: 'https://example.com/materials/concurrency.pdf' } });
  await prisma.material.create({ data: { classId: databaseClass.id, title: 'Database Normalization', description: '1NF, 2NF, 3NF forms', type: 'LINK', url: 'https://example.com/normalization' } });

  // ============ ASSIGNMENTS ============
  const assignment1 = await prisma.assignment.create({
    data: {
      classId: webDevClass1.id,
      title: 'Build a Portfolio Website',
      description: 'Create a responsive portfolio using HTML and CSS',
      dueDate: new Date('2024-02-28'),
      maxScore: 100,
    },
  });

  const assignment2 = await prisma.assignment.create({
    data: {
      classId: webDevClass1.id,
      title: 'JavaScript Calculator',
      description: 'Build a functional calculator with JS',
      dueDate: new Date('2024-03-15'),
      maxScore: 100,
    },
  });

  const assignment3 = await prisma.assignment.create({
    data: {
      classId: databaseClass.id,
      title: 'Database Design Project',
      description: 'Design and implement a library management database',
      dueDate: new Date('2024-03-20'),
      maxScore: 150,
    },
  });

  const assignment4 = await prisma.assignment.create({
    data: {
      classId: algoClass.id,
      title: 'Sorting Algorithms Implementation',
      description: 'Implement quicksort, mergesort, and heapsort',
      dueDate: new Date('2024-10-15'),
      maxScore: 100,
    },
  });

  const assignment5 = await prisma.assignment.create({ data: { classId: webDevClass2.id, title: 'React Todo App', description: 'Build a todo list with React hooks', dueDate: new Date('2024-10-01'), maxScore: 100 } });
  const assignment6 = await prisma.assignment.create({ data: { classId: webDevClass2.id, title: 'REST API Project', description: 'Create a RESTful API with Express', dueDate: new Date('2024-11-15'), maxScore: 150 } });
  const assignment7 = await prisma.assignment.create({ data: { classId: networkClass1.id, title: 'Network Simulation', description: 'Simulate TCP handshake', dueDate: new Date('2025-03-01'), maxScore: 120 } });
  const assignment8 = await prisma.assignment.create({ data: { classId: networkClass1.id, title: 'Router Configuration', description: 'Configure routing protocols', dueDate: new Date('2025-04-15'), maxScore: 100 } });
  const assignment9 = await prisma.assignment.create({ data: { classId: aiClass1.id, title: 'Neural Network', description: 'Build a simple perceptron', dueDate: new Date('2025-03-20'), maxScore: 150 } });
  const assignment10 = await prisma.assignment.create({ data: { classId: aiClass1.id, title: 'Classification Problem', description: 'Implement k-NN classifier', dueDate: new Date('2025-04-30'), maxScore: 120 } });
  const assignment11 = await prisma.assignment.create({ data: { classId: osClass.id, title: 'Process Scheduler', description: 'Simulate CPU scheduling', dueDate: new Date('2025-03-15'), maxScore: 140 } });
  const assignment12 = await prisma.assignment.create({ data: { classId: osClass.id, title: 'Memory Allocator', description: 'Implement malloc/free', dueDate: new Date('2025-04-25'), maxScore: 150 } });
  const assignment13 = await prisma.assignment.create({ data: { classId: securityClass1.id, title: 'Encryption System', description: 'Implement RSA encryption', dueDate: new Date('2025-03-10'), maxScore: 130 } });
  const assignment14 = await prisma.assignment.create({ data: { classId: securityClass1.id, title: 'Security Audit', description: 'Audit a web application', dueDate: new Date('2025-04-20'), maxScore: 100 } });
  const assignment15 = await prisma.assignment.create({ data: { classId: mobileClass1.id, title: 'iOS Weather App', description: 'Create weather app in Swift', dueDate: new Date('2025-03-25'), maxScore: 120 } });
  const assignment16 = await prisma.assignment.create({ data: { classId: mobileClass1.id, title: 'Android Notes App', description: 'Build notes app in Kotlin', dueDate: new Date('2025-05-01'), maxScore: 120 } });
  const assignment17 = await prisma.assignment.create({ data: { classId: cloudClass1.id, title: 'AWS Deployment', description: 'Deploy app on AWS', dueDate: new Date('2025-03-30'), maxScore: 150 } });
  const assignment18 = await prisma.assignment.create({ data: { classId: cloudClass1.id, title: 'Docker Containerization', description: 'Containerize a web app', dueDate: new Date('2025-05-05'), maxScore: 100 } });
  const assignment19 = await prisma.assignment.create({ data: { classId: seClass1.id, title: 'Design Pattern Implementation', description: 'Apply 5 design patterns', dueDate: new Date('2025-03-18'), maxScore: 140 } });
  const assignment20 = await prisma.assignment.create({ data: { classId: seClass1.id, title: 'Testing Suite', description: 'Write comprehensive tests', dueDate: new Date('2025-04-28'), maxScore: 100 } });
  const assignment21 = await prisma.assignment.create({ data: { classId: webDevClass3.id, title: 'Full Stack App', description: 'Build CRUD application', dueDate: new Date('2025-04-10'), maxScore: 200 } });
  const assignment22 = await prisma.assignment.create({ data: { classId: dbClass3.id, title: 'MongoDB Project', description: 'Design NoSQL schema', dueDate: new Date('2025-04-15'), maxScore: 120 } });
  const assignment23 = await prisma.assignment.create({ data: { classId: algoClass2.id, title: 'DP Problems', description: 'Solve 10 DP problems', dueDate: new Date('2025-03-22'), maxScore: 150 } });
  const assignment24 = await prisma.assignment.create({ data: { classId: networkClass2.id, title: 'WiFi Analysis', description: 'Analyze wireless traffic', dueDate: new Date('2025-10-20'), maxScore: 110 } });
  const assignment25 = await prisma.assignment.create({ data: { classId: aiClass2.id, title: 'NLP Chatbot', description: 'Build basic chatbot', dueDate: new Date('2025-10-25'), maxScore: 160 } });
  const assignment26 = await prisma.assignment.create({ data: { classId: securityClass2.id, title: 'Penetration Test Report', description: 'Conduct security assessment', dueDate: new Date('2025-10-30'), maxScore: 140 } });
  const assignment27 = await prisma.assignment.create({ data: { classId: mobileClass2.id, title: 'Flutter E-commerce', description: 'Shopping app in Flutter', dueDate: new Date('2025-11-05'), maxScore: 180 } });
  const assignment28 = await prisma.assignment.create({ data: { classId: cloudClass2.id, title: 'Azure Functions', description: 'Serverless architecture', dueDate: new Date('2025-11-10'), maxScore: 130 } });
  const assignment29 = await prisma.assignment.create({ data: { classId: seClass2.id, title: 'CI/CD Setup', description: 'GitHub Actions pipeline', dueDate: new Date('2025-11-15'), maxScore: 120 } });
  const assignment30 = await prisma.assignment.create({ data: { classId: webDevClass4.id, title: 'TypeScript API', description: 'Type-safe backend', dueDate: new Date('2025-07-15'), maxScore: 140 } });
  const assignment31 = await prisma.assignment.create({ data: { classId: dbClass2.id, title: 'Transaction Management', description: 'Implement ACID transactions', dueDate: new Date('2025-11-20'), maxScore: 150 } });
  const assignment32 = await prisma.assignment.create({ data: { classId: algoClass3.id, title: 'Graph Algorithms', description: 'Implement graph traversal', dueDate: new Date('2025-07-20'), maxScore: 130 } });
  const assignment33 = await prisma.assignment.create({ data: { classId: webDevClass1.id, title: 'CSS Grid Layout', description: 'Responsive design project', dueDate: new Date('2024-03-30'), maxScore: 80 } });
  const assignment34 = await prisma.assignment.create({ data: { classId: databaseClass.id, title: 'SQL Query Optimization', description: 'Optimize complex queries', dueDate: new Date('2024-04-10'), maxScore: 120 } });
  const assignment35 = await prisma.assignment.create({ data: { classId: algoClass.id, title: 'Binary Search Tree', description: 'Implement BST operations', dueDate: new Date('2024-11-01'), maxScore: 110 } });
  const assignment36 = await prisma.assignment.create({ data: { classId: networkClass1.id, title: 'Packet Analysis', description: 'Wireshark traffic analysis', dueDate: new Date('2025-05-10'), maxScore: 100 } });
  const assignment37 = await prisma.assignment.create({ data: { classId: aiClass1.id, title: 'Regression Model', description: 'Linear regression from scratch', dueDate: new Date('2025-05-15'), maxScore: 140 } });
  const assignment38 = await prisma.assignment.create({ data: { classId: osClass.id, title: 'File System', description: 'Implement simple file system', dueDate: new Date('2025-05-20'), maxScore: 160 } });
  const assignment39 = await prisma.assignment.create({ data: { classId: securityClass1.id, title: 'Password Manager', description: 'Secure credential storage', dueDate: new Date('2025-05-25'), maxScore: 150 } });
  const assignment40 = await prisma.assignment.create({ data: { classId: mobileClass1.id, title: 'Cross-platform App', description: 'React Native project', dueDate: new Date('2025-05-30'), maxScore: 170 } });

  // ============ SUBMISSIONS ============
  const submission1 = await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: studentUser1.id,
      content: 'https://github.com/student1/portfolio',
      status: 'GRADED',
      submittedAt: new Date('2024-02-25'),
    },
  });

  const submission2 = await prisma.submission.create({
    data: {
      assignmentId: assignment2.id,
      studentId: studentUser1.id,
      content: 'https://github.com/student1/calculator',
      status: 'SUBMITTED',
      submittedAt: new Date('2024-03-14'),
    },
  });

  const submission3 = await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: studentUser2.id,
      content: 'https://github.com/student2/portfolio',
      status: 'GRADED',
      submittedAt: new Date('2024-02-27'),
    },
  });

  const submission4 = await prisma.submission.create({
    data: {
      assignmentId: assignment3.id,
      studentId: studentUser1.id,
      content: 'https://github.com/student1/library-db',
      status: 'SUBMITTED',
      submittedAt: new Date('2024-03-19'),
    },
  });

  const submission5 = await prisma.submission.create({ data: { assignmentId: assignment4.id, studentId: studentUser2.id, content: 'https://github.com/student2/sorting-algos', status: 'GRADED', submittedAt: new Date('2024-10-14') } });
  const submission6 = await prisma.submission.create({ data: { assignmentId: assignment5.id, studentId: studentUser4.id, content: 'https://github.com/student4/react-todo', status: 'SUBMITTED', submittedAt: new Date('2024-09-30') } });
  const submission7 = await prisma.submission.create({ data: { assignmentId: assignment5.id, studentId: studentUser8.id, content: 'https://github.com/student8/todo-app', status: 'GRADED', submittedAt: new Date('2024-09-29') } });
  const submission8 = await prisma.submission.create({ data: { assignmentId: assignment6.id, studentId: studentUser4.id, content: 'https://github.com/student4/rest-api', status: 'SUBMITTED', submittedAt: new Date('2024-11-14') } });
  const submission9 = await prisma.submission.create({ data: { assignmentId: assignment7.id, studentId: studentUser3.id, content: 'https://github.com/student3/network-sim', status: 'GRADED', submittedAt: new Date('2025-02-28') } });
  const submission10 = await prisma.submission.create({ data: { assignmentId: assignment8.id, studentId: studentUser3.id, content: 'https://github.com/student3/router-config', status: 'SUBMITTED', submittedAt: new Date('2025-04-14') } });
  const submission11 = await prisma.submission.create({ data: { assignmentId: assignment9.id, studentId: studentUser4.id, content: 'https://github.com/student4/neural-net', status: 'GRADED', submittedAt: new Date('2025-03-19') } });
  const submission12 = await prisma.submission.create({ data: { assignmentId: assignment10.id, studentId: studentUser4.id, content: 'https://github.com/student4/knn-classifier', status: 'SUBMITTED', submittedAt: new Date('2025-04-29') } });
  const submission13 = await prisma.submission.create({ data: { assignmentId: assignment11.id, studentId: studentUser5.id, content: 'https://github.com/student5/scheduler', status: 'GRADED', submittedAt: new Date('2025-03-14') } });
  const submission14 = await prisma.submission.create({ data: { assignmentId: assignment12.id, studentId: studentUser5.id, content: 'https://github.com/student5/memory-alloc', status: 'SUBMITTED', submittedAt: new Date('2025-04-24') } });
  const submission15 = await prisma.submission.create({ data: { assignmentId: assignment13.id, studentId: studentUser6.id, content: 'https://github.com/student6/rsa-encrypt', status: 'GRADED', submittedAt: new Date('2025-03-09') } });
  const submission16 = await prisma.submission.create({ data: { assignmentId: assignment14.id, studentId: studentUser6.id, content: 'https://github.com/student6/security-audit', status: 'SUBMITTED', submittedAt: new Date('2025-04-19') } });
  const submission17 = await prisma.submission.create({ data: { assignmentId: assignment15.id, studentId: studentUser7.id, content: 'https://github.com/student7/weather-ios', status: 'GRADED', submittedAt: new Date('2025-03-24') } });
  const submission18 = await prisma.submission.create({ data: { assignmentId: assignment16.id, studentId: studentUser7.id, content: 'https://github.com/student7/notes-android', status: 'SUBMITTED', submittedAt: new Date('2025-04-30') } });
  const submission19 = await prisma.submission.create({ data: { assignmentId: assignment17.id, studentId: studentUser8.id, content: 'https://github.com/student8/aws-deploy', status: 'GRADED', submittedAt: new Date('2025-03-29') } });
  const submission20 = await prisma.submission.create({ data: { assignmentId: assignment18.id, studentId: studentUser8.id, content: 'https://github.com/student8/docker-app', status: 'SUBMITTED', submittedAt: new Date('2025-05-04') } });
  const submission21 = await prisma.submission.create({ data: { assignmentId: assignment19.id, studentId: studentUser9.id, content: 'https://github.com/student9/design-patterns', status: 'GRADED', submittedAt: new Date('2025-03-17') } });
  const submission22 = await prisma.submission.create({ data: { assignmentId: assignment20.id, studentId: studentUser9.id, content: 'https://github.com/student9/test-suite', status: 'SUBMITTED', submittedAt: new Date('2025-04-27') } });
  const submission23 = await prisma.submission.create({ data: { assignmentId: assignment21.id, studentId: studentUser17.id, content: 'https://github.com/student17/fullstack-app', status: 'GRADED', submittedAt: new Date('2025-04-09') } });
  const submission24 = await prisma.submission.create({ data: { assignmentId: assignment22.id, studentId: studentUser18.id, content: 'https://github.com/student18/mongodb-schema', status: 'SUBMITTED', submittedAt: new Date('2025-04-14') } });
  const submission25 = await prisma.submission.create({ data: { assignmentId: assignment23.id, studentId: studentUser19.id, content: 'https://github.com/student19/dp-problems', status: 'GRADED', submittedAt: new Date('2025-03-21') } });
  const submission26 = await prisma.submission.create({ data: { assignmentId: assignment33.id, studentId: studentUser1.id, content: 'https://github.com/student1/css-grid', status: 'GRADED', submittedAt: new Date('2024-03-29') } });
  const submission27 = await prisma.submission.create({ data: { assignmentId: assignment33.id, studentId: studentUser3.id, content: 'https://github.com/student3/grid-layout', status: 'SUBMITTED', submittedAt: new Date('2024-03-28') } });
  const submission28 = await prisma.submission.create({ data: { assignmentId: assignment34.id, studentId: studentUser1.id, content: 'https://github.com/student1/sql-optimization', status: 'GRADED', submittedAt: new Date('2024-04-09') } });
  const submission29 = await prisma.submission.create({ data: { assignmentId: assignment34.id, studentId: studentUser5.id, content: 'https://github.com/student5/query-tuning', status: 'SUBMITTED', submittedAt: new Date('2024-04-08') } });
  const submission30 = await prisma.submission.create({ data: { assignmentId: assignment35.id, studentId: studentUser2.id, content: 'https://github.com/student2/bst-impl', status: 'GRADED', submittedAt: new Date('2024-10-31') } });
  const submission31 = await prisma.submission.create({ data: { assignmentId: assignment35.id, studentId: studentUser7.id, content: 'https://github.com/student7/binary-tree', status: 'SUBMITTED', submittedAt: new Date('2024-10-30') } });
  const submission32 = await prisma.submission.create({ data: { assignmentId: assignment36.id, studentId: studentUser11.id, content: 'https://github.com/student11/packet-analysis', status: 'GRADED', submittedAt: new Date('2025-05-09') } });
  const submission33 = await prisma.submission.create({ data: { assignmentId: assignment37.id, studentId: studentUser10.id, content: 'https://github.com/student10/regression', status: 'SUBMITTED', submittedAt: new Date('2025-05-14') } });
  const submission34 = await prisma.submission.create({ data: { assignmentId: assignment38.id, studentId: studentUser5.id, content: 'https://github.com/student5/filesystem', status: 'GRADED', submittedAt: new Date('2025-05-19') } });
  const submission35 = await prisma.submission.create({ data: { assignmentId: assignment39.id, studentId: studentUser13.id, content: 'https://github.com/student13/password-mgr', status: 'SUBMITTED', submittedAt: new Date('2025-05-24') } });
  const submission36 = await prisma.submission.create({ data: { assignmentId: assignment40.id, studentId: studentUser14.id, content: 'https://github.com/student14/react-native-app', status: 'GRADED', submittedAt: new Date('2025-05-29') } });
  const submission37 = await prisma.submission.create({ data: { assignmentId: assignment1.id, studentId: studentUser6.id, content: 'https://github.com/student6/portfolio', status: 'SUBMITTED', submittedAt: new Date('2024-02-26') } });
  const submission38 = await prisma.submission.create({ data: { assignmentId: assignment2.id, studentId: studentUser2.id, content: 'https://github.com/student2/calculator', status: 'GRADED', submittedAt: new Date('2024-03-13') } });
  const submission39 = await prisma.submission.create({ data: { assignmentId: assignment4.id, studentId: studentUser11.id, content: 'https://github.com/student11/sorting', status: 'SUBMITTED', submittedAt: new Date('2024-10-13') } });
  const submission40 = await prisma.submission.create({ data: { assignmentId: assignment7.id, studentId: studentUser11.id, content: 'https://github.com/student11/tcp-sim', status: 'GRADED', submittedAt: new Date('2025-02-27') } });

  // ============ FEEDBACK ============
  await prisma.feedback.create({
    data: {
      submissionId: submission1.id,
      teacherId: teacherUser1.id,
      comment: 'Excellent work! Clean code and responsive design.',
      score: 95,
    },
  });

  await prisma.feedback.create({
    data: {
      submissionId: submission3.id,
      teacherId: teacherUser1.id,
      comment: 'Good effort. Improve accessibility features.',
      score: 82,
    },
  });

  await prisma.feedback.create({ data: { submissionId: submission5.id, teacherId: teacherUser2.id, comment: 'Well implemented sorting algorithms.', score: 88 } });
  await prisma.feedback.create({ data: { submissionId: submission7.id, teacherId: teacherUser2.id, comment: 'Great UI design and functionality.', score: 92 } });
  await prisma.feedback.create({ data: { submissionId: submission9.id, teacherId: teacherUser3.id, comment: 'Accurate simulation. Good documentation.', score: 90 } });
  await prisma.feedback.create({ data: { submissionId: submission11.id, teacherId: teacherUser3.id, comment: 'Excellent neural network implementation.', score: 94 } });
  await prisma.feedback.create({ data: { submissionId: submission13.id, teacherId: teacherUser1.id, comment: 'Solid scheduler design.', score: 87 } });
  await prisma.feedback.create({ data: { submissionId: submission15.id, teacherId: teacherUser4.id, comment: 'Correct RSA implementation.', score: 91 } });
  await prisma.feedback.create({ data: { submissionId: submission17.id, teacherId: teacherUser2.id, comment: 'Beautiful iOS app. Well done.', score: 93 } });
  await prisma.feedback.create({ data: { submissionId: submission19.id, teacherId: teacherUser4.id, comment: 'Proper AWS deployment.', score: 89 } });
  await prisma.feedback.create({ data: { submissionId: submission21.id, teacherId: teacherUser1.id, comment: 'Excellent use of design patterns.', score: 96 } });
  await prisma.feedback.create({ data: { submissionId: submission23.id, teacherId: teacherUser3.id, comment: 'Outstanding full stack project.', score: 98 } });
  await prisma.feedback.create({ data: { submissionId: submission25.id, teacherId: teacherUser5.id, comment: 'All DP problems solved correctly.', score: 97 } });
  await prisma.feedback.create({ data: { submissionId: submission26.id, teacherId: teacherUser1.id, comment: 'Good CSS grid usage.', score: 85 } });
  await prisma.feedback.create({ data: { submissionId: submission28.id, teacherId: teacherUser1.id, comment: 'Impressive query optimization.', score: 90 } });
  await prisma.feedback.create({ data: { submissionId: submission30.id, teacherId: teacherUser2.id, comment: 'Clean BST implementation.', score: 86 } });
  await prisma.feedback.create({ data: { submissionId: submission32.id, teacherId: teacherUser3.id, comment: 'Thorough packet analysis.', score: 88 } });
  await prisma.feedback.create({ data: { submissionId: submission34.id, teacherId: teacherUser1.id, comment: 'Robust file system design.', score: 92 } });
  await prisma.feedback.create({ data: { submissionId: submission36.id, teacherId: teacherUser2.id, comment: 'Great React Native app.', score: 94 } });
  await prisma.feedback.create({ data: { submissionId: submission38.id, teacherId: teacherUser1.id, comment: 'Functional calculator with good UI.', score: 84 } });
  await prisma.feedback.create({ data: { submissionId: submission40.id, teacherId: teacherUser3.id, comment: 'Accurate TCP simulation.', score: 89 } });

  console.log('✅ Seeding finished successfully!');
  console.log('📊 Seeded data:');
  console.log(`  - 23 Users: 1 Admin, 5 Teachers, 20 Students`);
  console.log(`  - 10 Courses`);
  console.log(`  - 24 Classes`);
  console.log(`  - 40 Enrollments`);
  console.log(`  - 50 Materials`);
  console.log(`  - 40 Assignments`);
  console.log(`  - 40 Submissions`);
  console.log(`  - 20 Feedback entries`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

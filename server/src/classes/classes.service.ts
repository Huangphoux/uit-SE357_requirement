import { prisma } from "util/db";

export default class ClassesService {
  static async find(id?: string, q?: string) {
    if (id) {
      return await prisma.class.findUnique({
        where: { id },
        include: {
          course: true,
          enrollments: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          assignments: true,
        },
      });
    }

    const classes = await prisma.class.findMany({
      where: q
        ? {
            OR: [{ title: { contains: q } }],
          }
        : undefined,
      include: {
        course: true,
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        assignments: true,
      },
    });

    // Lấy danh sách teacherId khác null
    const teacherIds = classes.map((cls) => cls.teacherId).filter((id) => !!id);

    let teachersMap: Record<string, any> = {};
    if (teacherIds.length > 0) {
      const teachers = await prisma.user.findMany({
        where: { id: { in: teacherIds } },
        select: { id: true, name: true, email: true, role: true },
      });
      teachersMap = Object.fromEntries(teachers.map((t) => [t.id, t]));
    }

    // Gắn thông tin teacher vào từng class
    const result = classes.map((cls) => ({
      ...cls,
      teacher: cls.teacherId ? teachersMap[cls.teacherId] : null,
    }));

    return result;
  }

  static async create(data: { courseId: string; title: string; teacherId?: string }) {
    if (!data.title) {
      throw new Error("Title is required");
    }

    if (!data.courseId) {
      throw new Error("Course ID is required");
    }

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    const classData = await prisma.class.create({
      data: {
        courseId: data.courseId,
        title: data.title,
        teacherId: data.teacherId,
      },
      include: {
        course: true,
      },
    });

    return classData;
  }

  static async update(id: string, data: { courseId?: string; title?: string; teacherId?: string }) {
    const classData = await prisma.class.findUnique({ where: { id } });
    if (!classData) {
      throw new Error("Class not found");
    }

    // If courseId is being updated, verify it exists
    if (data.courseId) {
      const course = await prisma.course.findUnique({
        where: { id: data.courseId },
      });

      if (!course) {
        throw new Error("Course not found");
      }
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data,
      include: {
        course: true,
      },
    });

    return updatedClass;
  }

  static async delete(id: string) {
    const classData = await prisma.class.findUnique({ where: { id } });
    if (!classData) {
      throw new Error("Class not found");
    }

    await prisma.class.delete({
      where: { id },
    });
  }

  static async getStudents(id: string) {
    const classData = await prisma.class.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!classData) {
      throw new Error("Class not found");
    }

    return classData.enrollments;
  }
}

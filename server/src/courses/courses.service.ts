import { prisma } from "util/db";

export default class CoursesService {
  static async find(id?: string, q?: string) {
    if (id) {
      return await prisma.course.findUnique({
        where: { id },
        include: {
          classes: true,
        },
      });
    }

    return await prisma.course.findMany({
      where: q
        ? {
            OR: [{ title: { contains: q } }, { description: { contains: q } }],
          }
        : undefined,
      include: {
        classes: true,
      },
    });
  }

  static async create(data: { title: string; description?: string }) {
    if (!data.title) {
      throw new Error("Title is required");
    }

    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
      },
      include: {
        classes: true,
      },
    });

    return course;
  }

  static async update(id: string, data: { title?: string; description?: string }) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new Error("Course not found");
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data,
      include: {
        classes: true,
      },
    });

    return updatedCourse;
  }

  static async delete(id: string) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new Error("Course not found");
    }

    await prisma.course.delete({
      where: { id },
    });
  }

  static async getEnrolledCourses(userId: string) {
    const courses = await prisma.course.findMany({
      where: {
        classes: {
          some: {
            enrollments: {
              some: {
                userId,
                status: "ACTIVE",
              },
            },
          },
        },
      },
      include: {
        classes: {
          where: {
            enrollments: {
              some: {
                userId,
                status: "ACTIVE",
              },
            },
          },
        },
      },
    });

    return courses;
  }

  static async enrollInClass(userId: string, classId: string) {
    const classExists = await prisma.class.findUnique({
      where: { id: classId },
    });

    if (!classExists) {
      throw new Error("Class not found");
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === "ACTIVE") {
        throw new Error("Already enrolled in this class");
      }

      const enrollment = await prisma.enrollment.update({
        where: { id: existingEnrollment.id },
        data: { status: "ACTIVE" },
        include: {
          class: {
            include: {
              course: true,
            },
          },
        },
      });

      return enrollment;
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        classId,
        status: "ACTIVE",
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
    });

    return enrollment;
  }

  static async unenrollFromClass(userId: string, classId: string) {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });

    if (!enrollment) {
      throw new Error("Not enrolled in this class");
    }

    if (enrollment.status !== "ACTIVE") {
      throw new Error("Enrollment is not active");
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { status: "DROPPED" },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
    });

    return updatedEnrollment;
  }
}

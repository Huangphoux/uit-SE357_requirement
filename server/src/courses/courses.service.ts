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
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
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

  static async update(
    id: string,
    data: { title?: string; description?: string }
  ) {
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
}

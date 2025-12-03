import { prisma } from "util/db";

export default class AssignmentsService {
  static async find(id?: string, classId?: string) {
    if (id) {
      return await prisma.assignment.findUnique({
        where: { id },
        include: {
          class: {
            include: {
              course: true,
            },
          },
          submissions: true,
        },
      });
    }

    if (classId) {
      return await prisma.assignment.findMany({
        where: { classId },
        include: {
          class: {
            include: {
              course: true,
            },
          },
          submissions: true,
        },
        orderBy: {
          dueDate: "asc",
        },
      });
    }

    return await prisma.assignment.findMany({
      include: {
        class: {
          include: {
            course: true,
          },
        },
        submissions: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  }

  static async create(data: {
    title: string;
    description?: string;
    classId: string;
    createdBy: string;
    dueDate: Date;
    maxScore?: number;
  }) {
    if (!data.title || !data.classId || !data.dueDate) {
      throw new Error("Title, classId, and dueDate are required");
    }

    const classExists = await prisma.class.findUnique({
      where: { id: data.classId },
    });

    if (!classExists) {
      throw new Error("Class not found");
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: data.title,
        description: data.description,
        classId: data.classId,
        createdBy: data.createdBy,
        dueDate: data.dueDate,
        maxScore: data.maxScore || 100,
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
    });

    return assignment;
  }

  static async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: Date;
      maxScore?: number;
    }
  ) {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data,
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
    });

    return updatedAssignment;
  }

  static async delete(id: string) {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
      throw new Error("Assignment not found");
    }

    await prisma.assignment.delete({
      where: { id },
    });
  }
}

import { prisma } from "util/db";

export default class MaterialsService {
  static async find(id?: string, classId?: string, userId?: string) {
    if (id) {
      const material = await prisma.material.findUnique({
        where: { id },
        include: {
          class: {
            include: {
              course: true,
            },
          },
        },
      });

      if (material && userId) {
        const isEnrolled = await this.checkEnrollment(userId, material.classId);
        if (!isEnrolled) {
          throw new Error("Access denied: Not enrolled in this class");
        }
      }

      return material;
    }

    if (classId) {
      if (userId) {
        const isEnrolled = await this.checkEnrollment(userId, classId);
        if (!isEnrolled) {
          throw new Error("Access denied: Not enrolled in this class");
        }
      }

      return await prisma.material.findMany({
        where: { classId },
        include: {
          class: {
            include: {
              course: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return await prisma.material.findMany({
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findByAdmin(classId: string) {
    return await prisma.material.findMany({
      where: { classId },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findEnrollments(userId?: string) {
    const enrollment = await prisma.enrollment.findMany({
      where: { userId: userId },
    });
    console.log(enrollment);
    return enrollment;
  }

  static async findEnrollmentsByAdmin() {
    const enrollment = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        class: {
          include: {
            course: true,
          },
        },
      },
    });
    console.log(enrollment);
    return enrollment;
  }

  static async checkEnrollment(userId: string, classId: string): Promise<boolean> {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });

    return enrollment?.status === "ACTIVE";
  }

  static async create(data: {
    title: string;
    description?: string;
    type: string;
    url: string;
    classId: string;
    createdBy: string;
  }) {
    if (!data.title || !data.type || !data.url || !data.classId) {
      throw new Error("Title, type, url, and classId are required");
    }

    const classExists = await prisma.class.findUnique({
      where: { id: data.classId },
    });

    if (!classExists) {
      throw new Error("Class not found");
    }

    const material = await prisma.material.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        classId: data.classId,
        createdBy: data.createdBy,
      },
      include: {
        class: {
          include: {
            course: true,
          },
        },
      },
    });

    return material;
  }

  static async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      type?: string;
      url?: string;
    }
  ) {
    const material = await prisma.material.findUnique({ where: { id } });
    if (!material) {
      throw new Error("Material not found");
    }

    const updatedMaterial = await prisma.material.update({
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

    return updatedMaterial;
  }

  static async delete(id: string) {
    const material = await prisma.material.findUnique({ where: { id } });
    if (!material) {
      throw new Error("Material not found");
    }

    await prisma.material.delete({
      where: { id },
    });
  }
}

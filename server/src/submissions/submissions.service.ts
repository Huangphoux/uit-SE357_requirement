import { prisma } from "util/db";

export default class SubmissionsService {
  static async find(id?: string, assignmentId?: string, userId?: string) {
    if (id) {
      return await prisma.submission.findUnique({
        where: { id },
        include: {
          assignment: {
            include: {
              class: {
                include: {
                  course: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          feedback: true,
        },
      });
    }
    console.log(assignmentId);

    const where: any = {};
    if (assignmentId) where.assignmentId = assignmentId;
    // if (userId) where.userId = userId;

    return await prisma.submission.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        assignment: {
          include: {
            class: {
              include: {
                course: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        feedback: true,
      },
      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  static async findbyStudent(id?: string, userId?: string) {
    if (id) {
      return await prisma.submission.findUnique({
        where: { id },
        include: {
          assignment: {
            include: {
              class: {
                include: {
                  course: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          feedback: true,
        },
      });
    }

    const where: any = {};

    if (userId) where.userId = userId;

    return await prisma.submission.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        assignment: {
          include: {
            class: {
              include: {
                course: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        feedback: true,
      },
      orderBy: {
        submittedAt: "desc",
      },
    });
  }

  static async create(data: { assignmentId: string; userId: string; content?: string; fileUrl?: string }) {
    if (!data.assignmentId) {
      throw new Error("Assignment ID is required");
    }

    if (!data.content && !data.fileUrl) {
      throw new Error("Either content or fileUrl must be provided");
    }

    const assignmentExists = await prisma.assignment.findUnique({
      where: { id: data.assignmentId },
    });

    if (!assignmentExists) {
      throw new Error("Assignment not found");
    }

    const existingSubmission = await prisma.submission.findUnique({
      where: {
        assignmentId_userId: {
          assignmentId: data.assignmentId,
          userId: data.userId,
        },
      },
    });

    if (existingSubmission) {
      const submission = await prisma.submission.update({
        where: { id: existingSubmission.id },
        data: {
          content: data.content,
          fileUrl: data.fileUrl,
          status: "SUBMITTED",
          submittedAt: new Date(),
        },
        include: {
          assignment: {
            include: {
              class: {
                include: {
                  course: true,
                },
              },
            },
          },
          feedback: true,
        },
      });

      return submission;
    }

    const submission = await prisma.submission.create({
      data: {
        assignmentId: data.assignmentId,
        userId: data.userId,
        content: data.content,
        fileUrl: data.fileUrl,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        assignment: {
          include: {
            class: {
              include: {
                course: true,
              },
            },
          },
        },
        feedback: true,
      },
    });

    return submission;
  }

  static async update(
    id: string,
    data: {
      content?: string;
      fileUrl?: string;
    }
  ) {
    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission) {
      throw new Error("Submission not found");
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        content: data.content,
        fileUrl: data.fileUrl,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        assignment: {
          include: {
            class: {
              include: {
                course: true,
              },
            },
          },
        },
        feedback: true,
      },
    });

    return updatedSubmission;
  }

  static async delete(id: string) {
    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission) {
      throw new Error("Submission not found");
    }

    await prisma.submission.delete({
      where: { id },
    });
  }
  static async findById(id: string) {
    return await prisma.submission.findUnique({
      where: { id },
      include: {
        assignment: {
          include: {
            class: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        feedback: true,
      },
    });
  }

  static async grade(
    id: string,
    gradeData: {
      grade: number;
      feedback?: string;
    },
    teacherId: string
  ) {
    try {
      await prisma.feedback.create({
        data: {
          submissionId: id,
          createdBy: teacherId,
          score: gradeData.grade,
          comment: gradeData.feedback || "",
        },
      });

      // 2. Update submission status
      await prisma.submission.update({
        where: { id },
        data: {
          status: "GRADED",
        },
      });

      // 3. Trả về submission đầy đủ
      return await prisma.submission.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          feedback: {
            orderBy: {
              createdAt: "desc",
            },
          },
          assignment: {
            include: {
              class: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Grading error:", error);
      throw new Error("Failed to grade submission: " + error.message);
    }
  }
}

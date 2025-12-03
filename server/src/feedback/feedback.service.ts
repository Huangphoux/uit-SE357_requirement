import { prisma } from "util/db";

export default class FeedbackService {
  static async find(id?: string, submissionId?: string) {
    if (id) {
      return await prisma.feedback.findUnique({
        where: { id },
        include: {
          submission: {
            include: {
              assignment: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }

    if (submissionId) {
      return await prisma.feedback.findMany({
        where: { submissionId },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return await prisma.feedback.findMany({
      include: {
        submission: {
          include: {
            assignment: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async create(data: {
    submissionId: string;
    createdBy: string;
    comment?: string;
    score?: number;
  }) {
    if (!data.submissionId) {
      throw new Error("Submission ID is required");
    }

    const submissionExists = await prisma.submission.findUnique({
      where: { id: data.submissionId },
    });

    if (!submissionExists) {
      throw new Error("Submission not found");
    }

    const feedback = await prisma.feedback.create({
      data: {
        submissionId: data.submissionId,
        createdBy: data.createdBy,
        comment: data.comment,
        score: data.score,
      },
      include: {
        submission: {
          include: {
            assignment: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    await prisma.submission.update({
      where: { id: data.submissionId },
      data: { status: "GRADED" },
    });

    return feedback;
  }

  static async update(
    id: string,
    data: {
      comment?: string;
      score?: number;
    }
  ) {
    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data,
      include: {
        submission: {
          include: {
            assignment: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return updatedFeedback;
  }

  static async delete(id: string) {
    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    await prisma.feedback.delete({
      where: { id },
    });
  }
}

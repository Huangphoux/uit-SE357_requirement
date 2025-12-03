import { z } from "zod";

export const feedbackCreateSchema = z.object({
  submissionId: z.string().min(1, "Submission ID is required"),
  comment: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
});

export const feedbackUpdateSchema = z.object({
  comment: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
});

export type FeedbackCreate = z.infer<typeof feedbackCreateSchema>;
export type FeedbackUpdate = z.infer<typeof feedbackUpdateSchema>;

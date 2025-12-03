import { z } from "zod";

export const submissionCreateSchema = z.object({
  assignmentId: z.string().min(1, "Assignment ID is required"),
  content: z.string().optional(),
  fileUrl: z.string().url("Invalid URL format").optional(),
}).refine((data) => data.content || data.fileUrl, {
  message: "Either content or fileUrl must be provided",
});

export const submissionUpdateSchema = z.object({
  content: z.string().optional(),
  fileUrl: z.string().url("Invalid URL format").optional(),
});

export type SubmissionCreate = z.infer<typeof submissionCreateSchema>;
export type SubmissionUpdate = z.infer<typeof submissionUpdateSchema>;

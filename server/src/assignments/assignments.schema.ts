import { z } from "zod";

export const assignmentCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  classId: z.string().min(1, "Class ID is required"),
  dueDate: z.string().datetime("Invalid date format"),
  maxScore: z.number().positive().optional(),
});

export const assignmentUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime("Invalid date format").optional(),
  maxScore: z.number().positive().optional(),
});

export type AssignmentCreate = z.infer<typeof assignmentCreateSchema>;
export type AssignmentUpdate = z.infer<typeof assignmentUpdateSchema>;

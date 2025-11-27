import { z } from "zod";

export const classCreateSchema = z.object({
  courseId: z.string().min(1, "Course ID is required"),
  title: z.string().min(1, "Title is required"),
  teacherId: z.string().optional(),
});

export const classUpdateSchema = z.object({
  courseId: z.string().min(1, "Course ID is required").optional(),
  title: z.string().min(1, "Title is required").optional(),
  teacherId: z.string().optional(),
});

export type ClassCreate = z.infer<typeof classCreateSchema>;
export type ClassUpdate = z.infer<typeof classUpdateSchema>;

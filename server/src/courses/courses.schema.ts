import { z } from "zod";

export const courseCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const courseUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
});

export const enrollSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
});

export const unenrollSchema = z.object({
  classId: z.string().min(1, "Class ID is required"),
});

export type CourseCreate = z.infer<typeof courseCreateSchema>;
export type CourseUpdate = z.infer<typeof courseUpdateSchema>;
export type Enroll = z.infer<typeof enrollSchema>;
export type Unenroll = z.infer<typeof unenrollSchema>;

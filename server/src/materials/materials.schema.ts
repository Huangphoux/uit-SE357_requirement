import { z } from "zod";

export const materialCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["PDF", "VIDEO", "LINK", "DOC"], {
    error: "Type must be PDF, VIDEO, LINK, or DOC",
  }),
  url: z.string().url("Invalid URL format"),
  classId: z.string().min(1, "Class ID is required"),
});

export const materialUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  type: z.enum(["PDF", "VIDEO", "LINK", "DOC"]).optional(),
  url: z.string().url("Invalid URL format").optional(),
});

export type MaterialCreate = z.infer<typeof materialCreateSchema>;
export type MaterialUpdate = z.infer<typeof materialUpdateSchema>;

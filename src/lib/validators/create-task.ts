import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: "Title is required",
    })
    .max(50, {
      message: "Title must be at most 50 characters",
    }),
  description: z.string().trim().optional(),
});

export type TCreateTaskSchema = z.infer<typeof CreateTaskSchema>;

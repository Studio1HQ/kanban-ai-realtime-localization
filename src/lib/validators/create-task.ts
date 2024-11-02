import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1).max(50),
  description: z.string().trim().optional(),
});

export type TCreateTaskSchema = z.infer<typeof CreateTaskSchema>;

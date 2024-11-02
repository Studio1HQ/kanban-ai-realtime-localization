import { z } from "zod";

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8).max(20),
});

export type TAuthSchema = z.infer<typeof AuthSchema>;

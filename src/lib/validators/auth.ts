import { z } from "zod";

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .trim()
    .min(8, {
      message: "Password must be at least 8 character",
    })
    .max(20, {
      message: "Password must be at most 20 characters",
    }),
});

export type TAuthSchema = z.infer<typeof AuthSchema>;

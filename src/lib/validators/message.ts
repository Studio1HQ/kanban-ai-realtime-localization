import { z } from "zod";

const MessageSchema = z.object({
  role: z.string().min(1),
  content: z.string().min(1),
});

export const ResponseBodySchema = z.object({
  messages: z.array(MessageSchema),
});

export type TResponseBodySchema = z.infer<typeof ResponseBodySchema>;

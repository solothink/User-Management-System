import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Admin", "Editor", "User"])
});

export type User = z.infer<typeof userSchema> & { id: number };
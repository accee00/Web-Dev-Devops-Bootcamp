import { z } from "zod";

const signUpSchema = z.object({
  username: z.string().trim().min(3, "Username must be of three alphabets."),
  password: z.string().trim(),
  age: z.number(),
});

const signInSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
});

const todoSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  isCompleted: z.boolean().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type TodoInput = z.infer<typeof todoSchema>;

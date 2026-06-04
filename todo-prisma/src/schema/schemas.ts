import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().trim().min(3, "Username must be of three alphabets."),
  password: z.string().trim(),
  age: z.number(),
});

export const signInSchema = z.object({
  username: z.string().trim(),
  password: z.string().trim(),
});

export const todoSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  isCompleted: z.boolean().optional(),
});
export const updateTodoSchema = todoSchema.partial();

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type TodoInput = z.infer<typeof todoSchema>;
export type TodoUpdate = z.infer<typeof updateTodoSchema>;

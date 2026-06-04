import { prisma } from "../lib/index.ts";
import type { Request, Response } from "express";
import { todoSchema, updateTodoSchema } from "../schema/schemas.ts";
import type { TodoInput, TodoUpdate } from "../schema/schemas.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const addTodo = asyncHandler(async (req: Request, res: Response) => {
  const result = todoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ msg: result.error.issues[0]?.message });
  }
  const data: TodoInput = result.data;
  const todo = await prisma.todo.create({
    data: {
      title: data.title,
      description: data.description,
      isCompleted: data.isCompleted,
      userId: req.user.id,
    },
  });
  return res.status(201).json(todo);
});

const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid todo id",
    });
  }

  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  await prisma.todo.delete({
    where: {
      id: todo.id,
    },
  });

  res.status(200).json({
    message: "Todo deleted successfully",
  });
});

const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = updateTodoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0]?.message,
    });
  }
  const data: TodoUpdate = result.data;

  const todo = await prisma.todo.findFirst({
    where: {
      id,
      userId: req.user.id,
    },
  });

  if (!todo) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  const updatedTodo = await prisma.todo.update({
    where: {
      id,
    },
    data: result.data,
  });

  return res.status(200).json(updatedTodo);
});
export { addTodo, deleteTodo, updateTodo };

import { prisma } from "../lib/index.ts";
import type { Request, Response } from "express";
import { signUpSchema, signInSchema } from "../schema/schemas.ts";
import type { SignUpInput, SignInInput } from "../schema/schemas.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";

const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const result = signUpSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0]?.message,
    });
  }
  const data: SignUpInput = result.data;

  const doesUserExist = await prisma.user.findFirst({
    where: { username: data.username },
  });

  const passwordHash = await Bun.password.hash(data.password, {
    algorithm: "bcrypt",
    cost: 10,
  });
  if (doesUserExist) {
    return res.status(403).json({ msg: "User alredy exist" });
  }
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: passwordHash,
      age: data.age,
    },
  });
  return res.status(201).json(user);
});

const signInUser = asyncHandler(async (req: Request, res: Response) => {
  const result = signInSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: result.error.issues[0]?.message,
    });
  }
  const data: SignInInput = result.data;

  const user = await prisma.user.findFirst({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    return res.status(404).json({ msg: "Invalid credentials." });
  }

  const isPasswordCorrect = await Bun.password.verify(
    data.password,
    user.password,
  );

  if (!isPasswordCorrect) {
    return res.status(403).json({ msg: "Invalid credentials." });
  }

  return res.status(200).json(user);
});
export { signupUser, signInUser };

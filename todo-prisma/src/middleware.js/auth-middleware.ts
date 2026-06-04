import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/index.ts";
import type { AuthPayload } from "../types/types.ts";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "Token missing.",
      });
    }
    const payload = jwt.verify(token, "239092390902390923") as AuthPayload;

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      return res.status(401).json({
        message: "Half baked token.",
      });
    }
    req.user = {
      id: user.id,
      username: user.username,
      age: user.age,
    };
    next();
  } catch (error) {
    next(error);
  }
}

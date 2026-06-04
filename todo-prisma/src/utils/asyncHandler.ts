import { type Request, type Response, type NextFunction } from "express";

export function asyncHandler(
  fn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<unknown> | unknown,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}

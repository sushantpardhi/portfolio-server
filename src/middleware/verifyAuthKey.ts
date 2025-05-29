import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const verifyAuthKey = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authKey = req.body.authKey;

  if (!authKey) {
    return next(new AppError("Authentication key is required", 401));
  }

  if (authKey !== process.env.AUTHENTICATION_HASH_SECRET) {
    return next(new AppError("Invalid authentication key", 401));
  }

  next();
};

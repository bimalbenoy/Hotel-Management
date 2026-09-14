import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((error: any) => ({
        field: error.type === "field" ? error.path : undefined,
        message: error.msg,
      })),
    });
  }

  next();
};
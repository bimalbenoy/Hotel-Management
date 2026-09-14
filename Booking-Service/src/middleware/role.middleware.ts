import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

export const roleMiddleware =
  (allowedRoles: number[]) => {

    return (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {

      const user =
        (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (
        !allowedRoles.includes(
          user.roleId
        )
      ) {
        return res.status(403).json({
          success: false,
          message: "Access Denied",
        });
      }

      next();
    };
  };
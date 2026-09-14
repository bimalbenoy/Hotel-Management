import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService = new AuthService();

  async register(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { email, password } = req.body;

      const user =
        await this.authService.register(
          email,
          password
        );

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const { email, password } = req.body;

      const result =
        await this.authService.login(
          email,
          password
        );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
  async profile(
  req: Request,
  res: Response
): Promise<Response> {

  return res.status(200).json({
    success: true,
    user: (req as any).user,
  });
}
  
}
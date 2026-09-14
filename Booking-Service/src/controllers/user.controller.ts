import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {

  private userService = new UserService();

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();

      return res.status(200).json({
        message: "Users fetched successfully",
        data: users,
      });

    } catch (error: any) {

      return res.status(500).json({
        message: error.message,
      });

    }
  }

  async getUserById(req: Request, res: Response) {
    try {

      const userId = Number(req.params.id);

      const user = await this.userService.getUserById(userId);

      return res.status(200).json({
        message: "User fetched successfully",
        data: user,
      });

    } catch (error: any) {

      return res.status(404).json({
        message: error.message,
      });

    }
  }

  async disableUser(req: Request, res: Response) {
    try {

      const userId = Number(req.params.id);

      const loggedInUserId = (req as any).user.userID;

      const user = await this.userService.disableUser(
        loggedInUserId,
        userId
      );

      return res.status(200).json({
        message: "User disabled successfully",
        data: user,
      });

    } catch (error: any) {

      return res.status(400).json({
        message: error.message,
      });

    }
  }

}
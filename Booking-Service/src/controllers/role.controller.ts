import { Request, Response } from "express";
import { RoleService } from "../services/role.services";

export class RoleController {

  private roleService = new RoleService();

  // Create Role
  async createRole(
    req: Request,
    res: Response
  ) {

    try {

      const {
        roleName,
        permissionIds
      } = req.body;

      const role = await this.roleService.createRole(
        roleName,
        permissionIds
      );

      return res.status(201).json({
        success: true,
        message: "Role created successfully.",
        data: role
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  }

  // Get All Roles
  async getAllRoles(
    req: Request,
    res: Response
  ) {

    try {

      const roles = await this.roleService.getAllRoles();

      return res.status(200).json({
        success: true,
        data: roles
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }

  // Update Role Permissions
  async updateRolePermissions(
    req: Request,
    res: Response
  ) {

    try {

      const roleId = Number(req.params.roleId);

      const {
        permissionIds
      } = req.body;

      const result =
        await this.roleService.updateRolePermissions(
          roleId,
          permissionIds
        );

      return res.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  }

  // Assign Role To User
  async assignRoleToUser(
    req: Request,
    res: Response
  ) {

    try {

      const userId = Number(req.params.userId);

      const {
        roleId
      } = req.body;

      const result =
        await this.roleService.assignRoleToUser(
          userId,
          roleId
        );

      return res.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message
      });

    }

  }

}
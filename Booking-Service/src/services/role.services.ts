import { RoleRepository } from "../repositories/role.repository";
import { UserRepository } from "../repositories/user.repository";

export class RoleService {

  private roleRepository = new RoleRepository();
  private userRepository = new UserRepository();

  // Create Role
  async createRole(
    roleName: string,
    permissionIds: number[]
  ) {

    const existingRole =
      await this.roleRepository.getRoleByName(roleName);

    if (existingRole) {
      throw new Error("Role already exists.");
    }

    const role =
      await this.roleRepository.createRole(roleName);

    await this.roleRepository.assignPermissions(
      role.role_id,
      permissionIds
    );

    return role;

  }

  // Get All Roles
  async getAllRoles() {

    return await this.roleRepository.getAllRoles();

  }

  // Update Role Permissions
  async updateRolePermissions(
    roleId: number,
    permissionIds: number[]
  ) {

    const role =
      await this.roleRepository.getRoleById(roleId);

    if (!role) {
      throw new Error("Role not found.");
    }

    await this.roleRepository.updatePermissions(
      roleId,
      permissionIds
    );

    return {
      message: "Role permissions updated successfully."
    };

  }

  // Assign Role To User
  async assignRoleToUser(
    userId: number,
    roleId: number
  ) {

    const user =
      await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const role =
      await this.roleRepository.getRoleById(roleId);

    if (!role) {
      throw new Error("Role not found.");
    }

    await this.roleRepository.updateUserRole(
      userId,
      roleId
    );

    return {
      message: "Role assigned successfully."
    };

  }

}
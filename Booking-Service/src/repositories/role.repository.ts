import db from "../config/db";

export class RoleRepository {

  // Create Role
  async createRole(roleName: string) {

    const [role] = await db("roles")
      .insert({
        role_name: roleName
      })
      .returning("*");

    return role;
  }

  // Find Role By Name
  async getRoleByName(roleName: string) {

    return await db("roles")
      .where("role_name", roleName)
      .first();

  }

  // Find Role By Id
  async getRoleById(roleId: number) {

    return await db("roles")
      .where("role_id", roleId)
      .first();

  }

  // Get All Roles
  async getAllRoles() {

    return await db("roles")
      .select(
        "role_id",
        "role_name"
      )
      .orderBy("role_name", "asc");

  }

  // Assign Permissions While Creating Role
  async assignPermissions(
    roleId: number,
    permissionIds: number[]
  ) {

    const rolePermissions = permissionIds.map(permissionId => ({
      role_id: roleId,
      permission_id: permissionId
    }));

    return await db("role_permissions")
      .insert(rolePermissions);

  }

  // Update Role Permissions
  async updatePermissions(
    roleId: number,
    permissionIds: number[]
  ) {

    await db("role_permissions")
      .where("role_id", roleId)
      .delete();

    const rolePermissions = permissionIds.map(permissionId => ({
      role_id: roleId,
      permission_id: permissionId
    }));

    return await db("role_permissions")
      .insert(rolePermissions);

  }

  // Get Permissions Assigned To Role
  async getPermissionsByRole(roleId: number) {

    return await db("role_permissions as rp")
      .join(
        "permissions as p",
        "rp.permission_id",
        "p.permission_id"
      )
      .where(
        "rp.role_id",
        roleId
      )
      .select(
        "p.permission_id",
        "p.permission_name",
        "p.description"
      );

  }

  // Assign Role To User
  async updateUserRole(
    userId: number,
    roleId: number
  ) {

    return await db("users")
      .where(
        "user_id",
        userId
      )
      .update({
        role_id: roleId
      });

  }

}
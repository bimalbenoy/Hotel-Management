import db from "../config/db";

export class PermissionRepository {
    async getPermissionByRoleId(roleId: number){
        return await db("role_permissions as rp")
            .join("permissions as p", "rp.permission_id", "p.permission_id")
            .where({
                "rp.role_id": roleId
            })
            .select("p.permission_id","p.permission_name","p.description");
        
    }
}


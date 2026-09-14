import {PermissionRepository} from "../repositories/permission.repository";
import {logger} from "../logger/logger.service";


export class PermissionService {
    private permissionRepository = new PermissionRepository();

    async getPermissionByRoleId(roleId: number) {
        logger.info(`PermissionService.getPermissionByRoleId called for roleId=${roleId}`);
        return await this.permissionRepository.getPermissionByRoleId(roleId);
    }
}
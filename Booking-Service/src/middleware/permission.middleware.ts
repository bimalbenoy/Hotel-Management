import { NextFunction, Request, Response } from 'express';
import { PermissionService } from '../services/permission.service';

const permissionService = new PermissionService();

export const permissionMiddleware = (requiredPermission: string) => {
    return async (req:Request,res:Response,next:NextFunction) => {
        try{
        const user =(req as any).user;
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'User Not Found'
            });
        }
        const roleId = user.roleId;
        const permissions = await permissionService.getPermissionByRoleId(roleId);
        const hasPermission=permissions.some((permission:any)=>permission.permission_name===requiredPermission);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied',
            });
        }
        next();
    } catch (error:any) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
}
}
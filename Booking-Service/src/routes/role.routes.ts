import express from "express";
import { RoleController } from "../controllers/role.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { permissionMiddleware } from "../middleware/permission.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createRoleValidator,
  updateRolePermissionValidator,
  assignRoleValidator
} from "../validations/role.validation";

const router = express.Router();

const roleController = new RoleController();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role Management APIs
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleName
 *               - permissionIds
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: HOTEL_MANAGER
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2,3]
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  permissionMiddleware("CREATE_ROLES"),
  createRoleValidator,
  validate,
  roleController.createRole.bind(roleController)
);

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/",
  authMiddleware,
  permissionMiddleware("VIEW_ROLES"),
  roleController.getAllRoles.bind(roleController)
);

/**
 * @swagger
 * /roles/{roleId}/permissions:
 *   put:
 *     summary: Update role permissions
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1,2,5]
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:roleId/permissions",
  authMiddleware,
  permissionMiddleware("UPDATE_ROLE_PERMISSIONS"),
  updateRolePermissionValidator,
  validate,
  roleController.updateRolePermissions.bind(roleController)
);

/**
 * @swagger
 * /roles/users/{userId}:
 *   put:
 *     summary: Assign role to a user
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *             properties:
 *               roleId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/users/:userId",
  authMiddleware,
  permissionMiddleware("ASSIGN_ROLE"),
  assignRoleValidator,
  validate,
  roleController.assignRoleToUser.bind(roleController)
);

export default router;
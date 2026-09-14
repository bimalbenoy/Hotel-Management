import { body, param } from "express-validator";

// Create Role Validator
export const createRoleValidator = [

  body("roleName")
    .trim()
    .notEmpty()
    .withMessage("Role name is required.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Role name must be between 3 and 50 characters."),

  body("permissionIds")
    .isArray({ min: 1 })
    .withMessage("At least one permission is required."),

  body("permissionIds.*")
    .isInt({ min: 1 })
    .withMessage("Each permissionId must be a valid integer.")

];

// Update Role Permissions Validator
export const updateRolePermissionValidator = [

  param("roleId")
    .isInt({ min: 1 })
    .withMessage("Valid roleId is required."),

  body("permissionIds")
    .isArray({ min: 1 })
    .withMessage("At least one permission is required."),

  body("permissionIds.*")
    .isInt({ min: 1 })
    .withMessage("Each permissionId must be a valid integer.")

];

// Assign Role To User Validator
export const assignRoleValidator = [

  param("userId")
    .isInt({ min: 1 })
    .withMessage("Valid userId is required."),

  body("roleId")
    .isInt({ min: 1 })
    .withMessage("Valid roleId is required.")

];
import {body} from "express-validator";

export const registerValidation=[
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 4 }).withMessage("Password must be at least 4 characters long")
]

export const loginValidation=[
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required")
]
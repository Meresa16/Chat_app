const { body } = require("express-validator");

const registerValidation = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3, max: 50 }).withMessage("Username must be 3-50 chars"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain a number")
    .matches(/[A-Z]/).withMessage("Password must contain an uppercase letter"),
  body("display_name")
    .optional()
    .isLength({ max: 100 }).withMessage("Display name max 100 chars"),
  body("email")
    .optional()
    .isEmail().withMessage("Invalid email address"),
];

const loginValidation = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { registerValidation, loginValidation };

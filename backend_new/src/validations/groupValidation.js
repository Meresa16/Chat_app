const { body } = require("express-validator");

const createGroupValidation = [
  body("group_name")
    .notEmpty().withMessage("Group name is required")
    .isLength({ min: 3, max: 100 }).withMessage("Group name must be 3-100 chars"),
];

module.exports = { createGroupValidation };

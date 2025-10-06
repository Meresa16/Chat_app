const { body } = require("express-validator");

const messageValidation = [
  body("content")
    .notEmpty().withMessage("Message cannot be empty")
    .isLength({ max: 500 }).withMessage("Message max length is 500 chars"),
  body("group_id")
    .isInt().withMessage("Valid group_id required"),
];

module.exports = { messageValidation };

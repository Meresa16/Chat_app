const express = require("express");
const groupController = require("../controllers/groupController");
const { authenticate,authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validation");
const { createGroupValidation } = require("../validations/groupValidation");

const router = express.Router();

router.post("/", authenticate, validate(createGroupValidation), authorize(["admin"]),groupController.createGroup);
router.get("/", authenticate, groupController.getGroups);


module.exports = router;

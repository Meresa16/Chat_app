// const express = require("express");
// const { messageController } = require("../controllers/messageController");
// const router = express.Router();
// const validate = require("../middleware/validation");
// const { messageValidation } = require("../validations/messageValidation");

// router.get("/:groupId", validate(messageValidation), messageController.getMessages);
// router.post("/", validate(messageValidation), messageController.createMessage);

// module.exports = router;




const express = require("express");
const messageController = require("../controllers/messageController");
const { authenticate } = require("../middleware/authMiddleware");
const {messageValidation} = require("../validations/messageValidation");

const router = express.Router();

// Send a message
router.post("/", authenticate, messageController.sendMessage);

// Get messages for a group
router.get("/:group_id", authenticate, messageValidation, messageController.getMessages);

module.exports = router;

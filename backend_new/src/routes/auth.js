// const express = require("express");
// const  authController  = require("../controllers/authController");
// const { authenticate, authorize } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/register",  authController.register);
// router.post("/login",  authController.login);
// router.get("/users", authenticate, authorize(["admin"]), authController.getAllUsers);

// module.exports = router;


const express = require("express");
const authController = require("../controllers/authController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route: get current logged-in user
router.get("/me", authenticate, authController.me);

// Admin-only route: list all users
router.get("/users", authenticate, authorize(["admin"]), authController.getAllUsers);

module.exports = router;


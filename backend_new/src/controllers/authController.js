


// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { AppDataSource } = require("../config/data-source");
// const User = require("../entities/User");

// // Generate JWT token
// const generateToken = (user) => {
//   return jwt.sign(
//     { user_id: user.user_id, username: user.username, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
//   );
// };

// const authController = {
//   // Register a new user
//   async register(req, res, next) {
//     try {
//       const { username, email, password, display_name } = req.body;
//       if (!username || !email || !password) {
//         return res.status(400).json({ error: "All fields are required" });
//       }

//       const userRepo = AppDataSource.getRepository("User");

//       // Check if username or email exists
//       const exists = await userRepo.findOne({ where: [{ username }, { email }] });
//       if (exists) return res.status(400).json({ error: "Username or email already exists" });

//       // Hash password
//       const hashed = await bcrypt.hash(password, 10);
//       const user = userRepo.create({ username, email, display_name, password_hash: hashed, is_active: 1, role: "user" });
//       await userRepo.save(user);

//       const token = generateToken(user);
//       res.status(201).json({
//         message: "User registered",
//         user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role },
//         token,
//       });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // Login user
//   async login(req, res, next) {
//     try {
//       const { email, password } = req.body;
//       if (!email || !password) return res.status(400).json({ error: "Email and password required" });

//       const userRepo = AppDataSource.getRepository("User");
//       const user = await userRepo.findOne({ where: { email } });
//       if (!user) return res.status(400).json({ error: "Invalid credentials" });
//       if (!user.is_active) return res.status(403).json({ error: "Account not active" });

//       const valid = await bcrypt.compare(password, user.password_hash);
//       if (!valid) return res.status(400).json({ error: "Invalid credentials" });

//       const token = generateToken(user);
//       res.json({
//         message: "Login successful",
//         user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role },
//         token,
//       });
//     } catch (err) {
//       next(err);
//     }
//   },

//   // Get current user info
//   async me(req, res) {
//     res.json({
//       user_id: req.user.user_id,
//       username: req.user.username,
//       email: req.user.email,
//       role: req.user.role,
//     });
//   },

//   // Get all users (admin only)
//   async getAllUsers(req, res, next) {
//     try {
//       if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

//       const userRepo = AppDataSource.getRepository("User");
//       const users = await userRepo.find({
//         select: ["user_id", "username", "email", "role", "is_active"],
//       });

//       res.json(users);
//     } catch (err) {
//       next(err);
//     }
//   },
// };

// module.exports = authController;




const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/data-source");
const User = require("../entities/User");

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
};

const authController = {
  // Register new user
  async register(req, res, next) {
    try {
      const { username, email, password, display_name } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const userRepo = AppDataSource.getRepository("User");

      // Check for existing username/email
      const exists = await userRepo.findOne({ where: [{ username }, { email }] });
      if (exists) return res.status(400).json({ error: "Username or email already exists" });

      // Create user
      const user = userRepo.create({
        username,
        email,
        display_name,
        password_hash: password,
        is_active: 1,   // Activate immediately, or 0 for email verification
        role: "member",
      });

      await userRepo.save(user);

      // Generate JWT
      const token = generateToken(user);

      res.status(201).json({
        message: "User registered",
        user: { user_id: user.user_id, username: user.username, email: user.email, role: user.role },
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  // Login existing user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: "Email and password required" });

      const userRepo = AppDataSource.getRepository("User");
      const user = await userRepo.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      if (!user.is_active) return res.status(403).json({ error: "Account not active" });

      const token = generateToken(user);
      res.json({ message: "Login successful", token });
    } catch (err) {
      next(err);
    }
  },

  // Get current user info
  async me(req, res) {
    res.json(req.user);
  },

  // Get all users (Admin only)
  async getAllUsers(req, res) {
    try {
      if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

      const userRepo = AppDataSource.getRepository("User");
      const users = await userRepo.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = authController;

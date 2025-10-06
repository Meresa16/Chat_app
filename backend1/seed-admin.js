// seed-admin.js
require("dotenv").config();
const bcrypt = require("bcryptjs");
const readline = require("readline");
const { AppDataSource } = require("../backend/src/config/data-source");
const User = require("../backend/src/entities/User");

// Function to ask input from the user
const askQuestion = (query) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

async function seedAdmin() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected");

    const userRepo = AppDataSource.getRepository("User");

    // Prompt for admin details
    const username = await askQuestion("Enter admin username: ");
    const email = await askQuestion("Enter admin email: ");
    const display_name = await askQuestion("Enter display name: ");
    const password = await askQuestion("Enter password: ");

    // Check if admin already exists
    const existingAdmin = await userRepo.findOne({ where: { username } });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = userRepo.create({
      username,
      email,
      display_name,
      password_hash: hashedPassword,
      role: "admin",
      is_active: 1,
    });

    await userRepo.save(admin);
    console.log("✅ Admin user created successfully!");
    console.log("Username:", username);
    console.log("Password:", password);

    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to create admin:", err);
    process.exit(1);
  }
}

seedAdmin();

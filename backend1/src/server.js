require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { AppDataSource } = require("./config/data-source");
const chatSocket = require("./sockets/chat");
const app = require("./app"); // centralized express app (routes, middleware)

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("✅ TypeORM connected to Oracle");

    const server = http.createServer(app);

    // Setup Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "*", // allow frontend
        methods: ["GET", "POST"],
      },
    });

    // Initialize chat socket logic
    chatSocket(io);

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ TypeORM initialization failed:", err);
    process.exit(1);
  }
  process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  console.log("🛑 Graceful shutdown initiated...");
  await AppDataSource.destroy();
  process.exit(0);
});

}

startServer();

const { io } = require("socket.io-client");

// Connect to your backend Socket.IO server
const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server with id:", socket.id);

  // Join a group
  socket.emit("join_group", 1);
  console.log("📥 Joined group 1");

  // Send a test message
  socket.emit("send_message", {
    groupId: 1,
    senderId: 2, // Use a valid user_id from your DB
    content: "Hello from backend test client!",
  });
  console.log("📤 Message sent");
});

// Listen for new messages from the server
socket.on("new_message", (msg) => {
  console.log("💬 New message received:", msg);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

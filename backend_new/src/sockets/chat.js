const { AppDataSource } = require("../config/data-source");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    // Join group room
    socket.on("join_group", (groupId) => {
      if (!groupId) return socket.emit("error", { message: "Group ID required" });

      socket.join(`group_${groupId}`);
      console.log(`📥 Socket ${socket.id} joined group_${groupId}`);
      socket.emit("joined_group", { groupId });
    });

    // Send message event
    socket.on("send_message", async (msg) => {
      try {
        const { groupId, senderId, content } = msg;
        if (!groupId || !senderId || !content) {
          return socket.emit("error", { message: "Missing fields in message payload" });
        }

        // Ensure DB is initialized
        if (!AppDataSource.isInitialized) await AppDataSource.initialize();

        const messageRepo = AppDataSource.getRepository("Message");
        const message = messageRepo.create({
          content,
          group: { group_id: groupId },
          sender: { user_id: senderId },
        });
        await messageRepo.save(message);

        const newMsg = {
          message_id: message.message_id,
          group_id: groupId,
          sender_id: senderId,
          content,
          created_at: message.created_at,
        };

        // Emit to group members
        io.to(`group_${groupId}`).emit("new_message", newMsg);
        console.log(`💬 Message broadcasted to group_${groupId}`);
      } catch (err) {
        console.error("❌ Failed to send message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

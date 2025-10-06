const { AppDataSource } = require("../config/data-source");
const Message = require("../entities/Message");
const User = require("../entities/User");
const Group = require("../entities/Group");

const messageController = {
  // Send a message
 async sendMessage(req, res, next) {
  try {
    const { group_id, content, broadcast } = req.body;
    if (!content) return res.status(400).json({ error: "Content required" });

    const userRepo = AppDataSource.getRepository("User");
    const groupRepo = AppDataSource.getRepository("Group");
    const messageRepo = AppDataSource.getRepository("Message");

    // Validate sender
    const sender = await userRepo.findOne({ where: { user_id: req.user.user_id } });
    if (!sender) return res.status(400).json({ error: "Invalid sender" });

    let groups = [];

    if (broadcast) {
      // Send to all groups the user belongs to
      const memberRepo = AppDataSource.getRepository("GroupMember");
      const memberships = await memberRepo.find({
        where: { user: { user_id: req.user.user_id } },
        relations: ["group"],
      });
      groups = memberships.map(m => m.group);
      if (!groups.length) return res.status(400).json({ error: "User is not a member of any group" });
    } else {
      // Send to specific group
      if (!group_id) return res.status(400).json({ error: "group_id required" });

      const group = await groupRepo.findOne({ where: { group_id } });
      if (!group) return res.status(400).json({ error: "Group not found" });

      groups.push(group);
    }

    // Create messages
    const messages = groups.map(g =>
      messageRepo.create({ content, sender: { user_id: sender.user_id }, group: { group_id: g.group_id } })
    );

    await messageRepo.save(messages);

    res.status(201).json({ message: "Message sent", messages });
  } catch (err) {
    if (err.code === "ORA-02291") {
      return res.status(400).json({ error: "Invalid user or group ID" });
    }
    next(err);
  }
}
,

  // Get messages for a group
  async getMessages(req, res, next) {
    try {
      const { group_id } = req.params;
      if (!group_id) return res.status(400).json({ error: "Group ID required" });

      const messageRepo = AppDataSource.getRepository("Message");

      const messages = await messageRepo.find({
        where: { group: { group_id } },
        relations: ["sender"],
        order: { created_at: "ASC" },
      });

      res.json(messages);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = messageController;

const { AppDataSource } = require("../config/data-source");
const Group = require("../entities/Group");
const GroupMember = require("../entities/GroupMember");

const groupController = {
  // Create a new group
  async createGroup(req, res, next) {
    try {
      const { group_name, description } = req.body;
      if (!group_name) return res.status(400).json({ error: "Group name required" });

      const groupRepo = AppDataSource.getRepository("Group");
      const memberRepo = AppDataSource.getRepository("GroupMember");

      // check if exists
      const exists = await groupRepo.findOne({ where: { group_name } });
      if (exists) return res.status(400).json({ error: "Group name already exists" });

      // create group
      const group = groupRepo.create({ group_name, description });
      await groupRepo.save(group);

      // add creator as admin
      const membership = memberRepo.create({
        user: { user_id: req.user.user_id },
        group: { group_id: group.group_id },
        role: "admin",
      });
      await memberRepo.save(membership);

      res.status(201).json({ message: "Group created", group });
    } catch (err) {
      next(err);
    }
  },

  // List groups user is in
  async getGroups(req, res, next) {
    try {
      const memberRepo = AppDataSource.getRepository("GroupMember");
      const groups = await memberRepo.find({
        where: { user: { user_id: req.user.user_id } },
        relations: ["group"],
      });

      res.json(groups.map(m => m.group));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = groupController;

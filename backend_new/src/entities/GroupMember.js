const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "GroupMember",
  tableName: "group_members",
  columns: {
    id: { primary: true, type: "number", generated: true },
    role: { type: "varchar2", length: 20, default: "member" }, // admin, member, etc.
    joined_at: { type: "timestamp", createDate: true },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      eager: true,
    },
    group: {
      type: "many-to-one",
      target: "Group",
      joinColumn: { name: "group_id" },
      onDelete: "CASCADE",
    },
  },
});

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Group",
  tableName: "groups",
  columns: {
    group_id: { primary: true, type: "number", generated: true },
    group_name: { type: "varchar2", length: 100, unique: true },
    description: { type: "clob", nullable: true },
    created_at: { type: "timestamp", createDate: true },
  },
  relations: {
    members: {
      type: "one-to-many",
      target: "GroupMember",
      inverseSide: "group",
    },
    messages: {
      type: "one-to-many",
      target: "Message",
      inverseSide: "group",
    },
  },
});



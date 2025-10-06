const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Message",
  tableName: "messages",
  columns: {
    message_id: { primary: true, type: "number", generated: true },
    content: { type: "clob" },
    created_at: { type: "timestamp", createDate: true },
  },
  relations: {
    sender: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "sender_id" },
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

const { EntitySchema } = require("typeorm");
const bcrypt = require("bcryptjs");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    user_id: { primary: true, type: "number", generated: true },
    username: { type: "varchar2", length: 50, unique: true },
    email: { type: "varchar2", length: 100, unique: true, nullable: true },
    display_name: { type: "varchar2", length: 100, nullable: true },
    password_hash: { type: "varchar2", length: 255 },
    avatar_url: { type: "varchar2", length: 255, nullable: true },
    role: { type: "varchar2", length: 20, default: "member" }, // member | admin
    is_active: { type: "number", default: 0 }, // 0 = inactive, 1 = active
    created_at: { type: "timestamp", createDate: true },
  },
  // Automatically hash password before insert
  beforeInsert: async (user) => {
    user.password_hash = await bcrypt.hash(user.password_hash, 10);
  },
});

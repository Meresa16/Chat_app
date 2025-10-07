const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");
const messageRoutes = require("./routes/messages");
const errorHandler = require("./middleware/errorHandler");


const app = express();
app.use(cors(
    origin= "http://10.195.33.45:3000", // your frontend URL
  credentials= true, // allow cookies if needed
  methods= ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
));
app.use(bodyParser.json());
app.use(errorHandler);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => res.send("Chat API Running..."));

module.exports = app;

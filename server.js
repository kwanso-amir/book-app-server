const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const users = require("./routes/users.js");
const { sequelize } = require("./models");
const auth = require("./routes/auth.js");
const books = require("./routes/books.js");
const comments = require("./routes/comments.js");
const replies = require("./routes/replies.js");

// APP Config
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
dotenv.config();

// API Routes
app.use("/users", users);
app.use("/books", books);
app.use("/auth", auth);
app.use("/comments", comments);
app.use("/replies", replies);

// Listen

try {
  app.listen(5000, async () => {
    sequelize.authenticate();
    console.log("DB CONNECTED and listening on localhost:5000");
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

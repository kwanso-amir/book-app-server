import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import users from "./routes/users.js";
import books from "./routes/books.js";
import auth from "./routes/auth.js";

// APP Config
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
dotenv.config();

// API Routes
app.use("/users", users);
app.use("/books", books)
app.use("/auth", auth);


// Listen
app.listen(5000, () => console.log("listening at 5000..."));

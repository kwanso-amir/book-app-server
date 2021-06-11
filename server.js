import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

// APP Config
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(dotenv());

// API Routes

// <---- USER ---->
app.get("/users", async (req, res) => {
  try {
    const users = pool.query(`SELECT * FROM "user"`);

    res.json((await users).rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/users", async (req, res) => {
  const { first_name, last_name, email, password, image } = req.body;
  try {
    const newUser = await pool.query(
      `INSERT INTO "user" (first_name, last_name, email, password, image) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, email, password, image]
    );

    res.json(newUser);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [
      req.params.id,
    ]);

    res.json((await user).rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { first_name, last_name, email, image } = req.body;
    const updateUser = await pool.query(
      `UPDATE "user" SET first_name = $1, last_name = $2, email = $3, image = $4 WHERE id = $5`,
      [first_name, last_name, email, image, req.params.id]
    );

    res.json("User updated!");
  } catch (error) {
    console.log(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const user = await pool.query(`DELETE FROM "user" WHERE id = $1`, [
      req.params.id,
    ]);

    res.json("User deleted!");
  } catch (error) {
    console.log(error);
  }
});

// <---- AUTH ---->
app.post("/auth", async (req, res) => {});

// <---- BOOK ---->
app.get("/books", async (req, res) => {});

app.post("/books", async (req, res) => {});

app.get("/books/:id", async (req, res) => {});

app.put("/books/:id", async (req, res) => {});

app.delete("/books/:id", async (req, res) => {});

// Listen
app.listen(5000, () => console.log("listening at 5000..."));

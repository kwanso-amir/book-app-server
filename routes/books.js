import express from "express";
import pool from "../db.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = pool.query(`SELECT * FROM book`);

    res.status(200).json((await books).rows);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/", auth, async (req, res) => {
  const { title, author, image } = req.body;
  try {
    const newBook = await pool.query(
      `INSERT INTO book (title, author, image) VALUES($1, $2, $3) RETURNING *`,
      [title, author, image]
    );

    res.status(200).json((await newBook).rows[0]);
  } catch (err) {
    res.status(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await pool.query(`SELECT * FROM book WHERE book_id = $1`, [
      req.params.id,
    ]);

    res.status(200).json((await book).rows[0]);
  } catch (error) {
    status(500);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, author, image } = req.body;
    const updateBook = await pool.query(
      `UPDATE book SET title = $1, author = $2, image = $3 WHERE book_id = $4`,
      [title, author, image, req.params.id]
    );

    res.status(200).json("Book updated!");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await pool.query(`DELETE FROM book WHERE book_id = $1`, [
      req.params.id,
    ]);

    res.status(200).json("Book deleted!");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

export default router;

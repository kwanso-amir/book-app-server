import express from "express";
import pool from "../db.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = pool.query(`SELECT * FROM book`);

    res.json((await books).rows);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", auth, async (req, res) => {
  const { title, author, image } = req.body;
  try {
    const newBook = await pool.query(
      `INSERT INTO book (title, author, image) VALUES($1, $2, $3) RETURNING *`,
      [title, author, image]
    );

    res.json(newBook);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await pool.query(`SELECT * FROM book WHERE book_id = $1`, [
      req.params.id,
    ]);

    res.json((await book).rows[0]);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, author, image } = req.body;
    const updateBook = await pool.query(
      `UPDATE book SET title = $1, author = $2, image = $3 WHERE book_id = $4`,
      [title, author, image, req.params.id]
    );

    res.json("Book updated!");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await pool.query(`DELETE FROM book WHERE book_id = $1`, [
      req.params.id,
    ]);

    res.json("Book deleted!");
  } catch (error) {
    console.log(error);
  }
});

export default router;

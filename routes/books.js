const express = require("express");
const Joi = require("joi");
const auth = require("../middlewares/auth.js");
const { Book, User, Comment, Reply } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["id", "title", "author", "image", "createdAt"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
    });

    res.status(200).json(books);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/", auth, async (req, res) => {
  const { title, author, image, user_id } = req.body;

  try {
    const newBook = await Book.create({ title, author, image, user_id });

    res.status(200).json(newBook);
  } catch (err) {
    res.status(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "author", "image"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "body", "createdAt"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["first_name", "last_name"],
            },
            {
              model: Reply,
              as: "replies",
              attributes: ["id", "body", "createdAt"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["first_name", "last_name"],
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(book);
  } catch (error) {
    res.status(500);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, author, image } = req.body;

    const updatedBook = await Book.update(
      { title, author, image },
      {
        where: { id: req.params.id },
      }
    );

    res.status(200).json("Book updated!");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const book = await Book.destroy({ where: { id: req.params.id } });

    res.status(200).json("Book deleted!");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;

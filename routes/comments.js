const express = require("express");
const Joi = require("joi");
const auth = require("../middlewares/auth.js");
const { Comment } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.findAll();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", async (req, res) => {
  const { body, user_id, book_id } = req.body;
  console.log(req.body);
  try {
    const comment = await Comment.create({
      body,
      user_id,
      book_id,
    });

    res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;

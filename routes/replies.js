const express = require("express");
const Joi = require("joi");
const auth = require("../middlewares/auth.js");
const { Reply } = require("../models");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const replies = await Reply.findAll();
    res.status(200).json(replies);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/", async (req, res) => {
  const { body, user_id, comment_id } = req.body;

  try {
    const reply = await Reply.create({
      body,
      user_id,
      comment_id,
    });

    res.status(200).json(reply);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;

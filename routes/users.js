const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const auth = require("../middlewares/auth.js");
const { User } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, image } = req.body;
  const { error } = validate(req.body);
  if (!error) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        first_name,
        last_name,
        email,
        password,
        image,
      });

      res.status(200).json(newUser);
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  } else {
    res.status(400).end(error.details[0].message);
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let userData = jwt.verify(token, "jwtPrivateKey");

    const user = await User.findOne({ where: { id: userData._id } });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "first_name", "last_name", "email"],
    });

    res.json(users).status(200);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { first_name, last_name, email, password, image } = req.body;
  const { error } = validate(req.body);
  if (!error) {
    try {
      const { first_name, last_name, email, image } = req.body;

      const updatedUser = User.update(
        { first_name, last_name, email, image },
        {
          where: { id: req.params.id },
        }
      );
      res.status(200);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(400).end(error.details[0].message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const user = User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json("User deleted!");
  } catch (error) {
    console.log(error);
  }
});

function validate(req) {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(255).required(),
    last_name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required(),
    image: Joi.string().allow(null, ""),
  });

  return schema.validate(req);
}

module.exports = router;

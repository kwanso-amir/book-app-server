const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const auth = require("../middlewares/auth.js");
const { User } = require("../models");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user == undefined) {
      return res.status(400).send("Invalid Email");
    } else {
      const { id, email, password } = user;
      // const validPassword = await bcrypt.compare(req.body.password, password);

      if (/* !validPassword */ password !== req.body.password) {
        return res.status(500).send("Invalid password");
      } else {
        const token = jwt.sign({ _id: id, email: email }, "jwtPrivateKey", {
          expiresIn: "1h",
        });

        return res
          .status(200)
          .json({ result: { id: id, email: email }, token });
      }
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post("/signup", async (req, res) => {
  const { error } = signupValidate(req.body);
  const { first_name, last_name, email, password, image } = req.body;

  if (error) return res.status(400).send(error.details[0].message);

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

    const token = jwt.sign(
      { _id: newUser.id, email: newUser.email },
      "jwtPrivateKey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      result: { id: newUser.id, emai: newUser.email },
      token,
    });
  } catch (err) {
    console.log(err.message);
  }
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

function signupValidate(req) {
  const schema = Joi.object({
    first_name: Joi.string().min(3).max(255).required(),
    last_name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    image: Joi.string().allow(null, ""),
  });

  return schema.validate(req);
}

module.exports = router;

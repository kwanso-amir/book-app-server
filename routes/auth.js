import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [
    req.body.email,
  ]);

  if (user.rowCount == 0) {
    return res.status(400).send("Invalid Email");
  } else {
    let { id, email, password } = user.rows[0];
    const validPassword = await bcrypt.compare(req.body.password, password);
    if (!validPassword) {
      return res.status(400).send("Invalid password");
    } else {
      const token = jwt.sign({ _id: id, email: email }, "jwtPrivateKey", {
        expiresIn: "1h",
      });
      return res.status(200).json({ result: { id: id, email: email }, token });
    }
  }
});

router.post("/signup", async (req, res) => {
  const { error } = signupValidate(req.body);
  const { first_name, last_name, email, password, image } = req.body;

  if (error) return res.status(400).send(error.details[0].message);

  try {
    const salt = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO "user" (first_name, last_name, email, password, image) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, email, hash_password, image]
    );

    const token = jwt.sign(
      { _id: newUser.rows[0].id, email: newUser.rows[0].email },
      "jwtPrivateKey",
      { expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({
        result: { id: newUser.rows[0].id, emai: newUser.rows[0].email },
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

export default router;

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import pool from "../db.js";
import auth from '../middlewares/auth.js'
const router = express.Router();

router.get('/me', auth, async (req,res) => {
  try {
    const user = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [
      req.user._id,
    ]);

    res.json((await user).rows[0]);
  } catch (error) {
    console.log(error);
  }
})

router.get("/", async (req, res) => {
  try {
    const users = pool.query(`SELECT * FROM "user"`);

    res.json((await users).rows);
  } catch (error) {
    console.log(error);
  }
});

router.post("/",auth, async (req, res) => {
  const { first_name, last_name, email, password, image } = req.body;
  const { error } = validate(req.body);
  if (!error) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash_password = await bcrypt.hash(password, salt);
      const newUser = await pool.query(
        `INSERT INTO "user" (first_name, last_name, email, password, image) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [first_name, last_name, email, hash_password, image]
      );
      const token = jwt.sign({ _id: newUser.rows[0] }, "jwtPrivateKey");

      res.header("x-auth-token", token).json(newUser);
    } catch (err) {
      console.log(err.message);
    }
  } else {
    res.send(error.details[0].message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [
      req.params.id,
    ]);

    res.json((await user).rows[0]);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", auth, async (req, res) => {
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

router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await pool.query(`DELETE FROM "user" WHERE id = $1`, [
      req.params.id,
    ]);

    res.json("User deleted!");
  } catch (error) {
    console.log(error);
  }
});

function validate(req) {
  const schema = Joi.object({
    first_name: Joi.string().min(5).max(255).required(),
    last_name: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    image: Joi.string().allow(null, ""),
  });

  return schema.validate(req);
}

export default router;

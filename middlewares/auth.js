const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (!token) return res.status(401).send("access denied, No toekn provided");

    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;

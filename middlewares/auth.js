import jwt from "jsonwebtoken";

function auth(req, res, next) {
  console.log(req.headers, "AUTH MIDDLEWARE");
  const token = req.headers.authorization.split(" ")[1];
  try {
    let decodedData = jwt.verify(token, "jwtPrivateKey");

    req.userId = decodedData.id;

    if (!token) return res.status(401).send("access denied, No toekn provided");

    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

export default auth;

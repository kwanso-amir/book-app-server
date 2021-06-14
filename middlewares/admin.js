function admin(req, res, next) {
  if (!req.user.isAdmin) return res.statud(403).send("Access denied.");

  next();
}

export default admin;

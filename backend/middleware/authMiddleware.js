const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json("Token required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, "supersecretkey");
    req.clinic = verified;
    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
}

module.exports = authMiddleware;
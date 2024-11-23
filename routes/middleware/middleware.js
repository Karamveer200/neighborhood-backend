const jwt = require("jsonwebtoken");

const middleware = (req, res, next) => {
  const token = req.header("authorization");

  if (!token)
    return res.status(401).json({ msg: "Access Denied due to invalid token" });

  //Verify Token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.user._id;
    req.user = decoded.user;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid Token" });
  }
};

module.exports = { middleware };

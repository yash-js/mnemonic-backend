const User = require("../models/User");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    const verify = jwt.verify(token, secret);
    const user = await User.findOne({
      _id: verify._id,
    });

    if (!user) return res.send("USER NOT FOUND");

    req.token = token;
    req.user = user;
    req.userId = req.user._id;

    next();
  } catch (err) {
    res.clearCookie("user");
    console.log(err);
    return res.status(401).json({ error: "USER NOT FOUND" });
  }
};

module.exports = authenticate;

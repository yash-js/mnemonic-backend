const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    if (req.session.user && req.cookies.user) {
      const user = await User.findOne({
        _id: req.session.user,
      });
      req.user = user;
      req.userId = req.user._id;
      next();
    } else {
      return res.status(401).json({ error: "USER NOT FOUND" });
    }
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "USER NOT FOUND" });
  }
};

module.exports = authenticate;

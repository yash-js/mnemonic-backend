const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const findUser = await User.findOne({
      _id: req.user._id,
    })
      .populate("requests", ["firstName", "lastName", "username", "profilePic"])
      .populate("friends", ["firstName", "lastName", "username", "profilePic"])
      .populate("sentRequests", [
        "firstName",
        "lastName",
        "username",
        "profilePic",
      ]);

    return res.json({
      user: {
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        profilePic: findUser.profilePic,
        username: findUser.username,
        email: findUser.email,
        friends: findUser.friends,
        requests: findUser.requests,
        token: findUser.token,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Something Went Wrong!",
    });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.params;

    const result = await User.find({
      $or: [
        { firstName: new RegExp("^" + query, "i") },
        { username: new RegExp("^" + query, "i") },
      ],
      _id: {
        $nin: req.user._id,
      },
    });

    if (result) {
      return res.json({
        length: result.length,
        result,
      });
    } else {
      return res.status(400).json({
        error: "User Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something Went Wrong!",
    });
  }
};

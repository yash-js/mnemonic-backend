const User = require("../models/User");
const emailRegex = new RegExp(
  /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/
);

const usernameRegex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,10}$/);

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
        id: findUser._id,
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
      $or: [{ firstName: { $regex: query } }, { username: { $regex: query } }],
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

exports.editUser = async (req, res) => {
  if (req.body)
    try {
      const id = req.user._id;

      // Username Validations

      if (req.body && req.body.username) {
        const existingUsername = await User.findOne({
          username: req.body.username,
        });
        if (!usernameRegex.test(req.body.username))
          return res.status(400).json({
            field: "username",
            error:
              "Invalid Username, Length should Be greater than 4 and lesser than or equal to 10 and it can contain Alphabets(a-z) , Numbers(0-9), Period(.) and Underscore(_) only.",
          });
        if (existingUsername)
          return res.status(400).json({
            field: "username",
            error: "Username already taken, Please choose different username!",
          });
      }

      if (req.body && req.body.email) {
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail)
          return res.status(400).json({
            field: "email",
            error: "Email Id already taken, Please choose different Email Id!",
          });
        if (!emailRegex.test(req.body.email)) {
          return res.status(400).json({
            field: "email",
            error: "Enter Valid Email!",
          });
        }
      }
      await User.findByIdAndUpdate(id, req.body);

      return res.json({
        message: "Profile Updated!",
      });
    } catch (error) {
      res.json({
        error: "Something Went Wrong!",
        errMsg: error.message,
      });
    }
};

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
  try {
    let editData = {};
    const id = req.user._id;

    const { firstName, lastName, email, username } = req.body;
    // if (!data)
    //   return res.status(400).json({
    //     error: "Something Went Wrong! Please Try Again",
    //   });

    if (
      req.user.firstName === firstName &&
      req.user.lastName === lastName &&
      req.user.email === email &&
      req.user.username === username
    ) {
      return res.status(400).json({
        error: "Nothing to Update!",
      });
    } else if (req.user.firstName !== firstName) {
      editData.firstName = firstName;
    } else if (req.user.lastName !== lastName) {
      editData.lastName = lastName;
    } else if (req.user.email !== email) {
      editData.email = email;
    } else if (req.user.username !== username) {
      editData.username = username;
    } else if (req.user.profilePic !== profilePic) {
      editData.profilePic = profilePic;
    }
     if (editData && editData?.username) {
      const existingUsername = await User.findOne({
        username: editData.username,
      });
      if (existingUsername)
        return res.status(400).json({
          error: "Username already taken, Please choose different username!",
        });
    }
    if (editData && editData?.email) {
      const existingEmail = await User.findOne({ email: editData?.email });
      if (existingEmail)
        return res.status(400).json({
          error: "Username already taken, Please choose different username!",
        });
    }
    await User.findByIdAndUpdate(id, editData);

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

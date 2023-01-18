const User = require("../models/User");

exports.addFriend = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const currentUser = await User.findById({ _id: req.user._id })
        .populate("requests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("friends", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("sentRequests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ]);
      const user = await User.findById({ _id: id });
      const save = await user.updateOne({
        $push: {
          requests: req.user._id,
        },
      });
      await currentUser.updateOne({
        $push: {
          sentRequests: id,
        },
      });

      res.json({
        save,
        currentUser,
        message: "Friend Request Sent!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.acceptFriend = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const currentUser = await User.findById({ _id: req.user._id })
        .populate("requests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("friends", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("sentRequests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ]);
      const save = await currentUser.updateOne({
        $push: {
          friends: id,
        },
        $pull: {
          requests: id,
        },
      });

      res.json({
        save,
        currentUser,
        message: "Friend Request Accepted!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const { id } = req.params; //friend's id in request body
    if (id) {
      const currentUser = await User.findById({ _id: req.user._id })
        .populate("requests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("friends", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("sentRequests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ]);
      const save = await currentUser.updateOne({
        $pull: {
          requests: id,
        },
      });

      res.json({
        save,
        currentUser,
        message: "Friend Request Accepted!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const currentUser = await User.findById({ _id: req.user._id })
        .populate("requests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("friends", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ])
        .populate("sentRequests", [
          "firstName",
          "lastName",
          "username",
          "profilePic",
        ]);
      const save = await currentUser.updateOne({
        $pull: {
          friends: id,
        },
      });
      
      res.json({
        save,
        currentUser,
        message: "Friend Removed!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id }).populate(
      "friends",
      ["firstName", "lastName", "username", "profilePic"]
    );
    res.json(user.friends);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id }).populate(
      "requests",
      ["firstName", "lastName", "username", "profilePic"]
    );
    res.json(user.requests);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const users = await User.find();
    users.pop(req.user._id);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

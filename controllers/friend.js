const User = require("../models/User");
const { transporter } = require("./auth");

exports.addFriend = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const currentUser = await User.findById({ _id: req.user._id });
      const user = await User.findById({ _id: id });
      const save = await user.updateOne({
        $push: {
          requests: req.user._id,
          latestNotification: {
            from: req.user._id,
            message: "sent you friend request!",
            event: "added",
          },
          notification: {
            from: req.user._id,
            message: "sent you friend request!",
            event: "added",
          },
        },
      });
      await currentUser.updateOne({
        $push: {
          sentRequests: id,
        },
      });
      const mail = {
        to: user.email,
        from: "yash@no-reply.com",
        subject: "Account Successfully Registered",
        html: `<h1>Hi, ${user.firstName}. </h1>
  
              <h2> ${req.user.firstName} has sent you a friend request!</h2>
  
              <h4>
              Regards, 
              Mnemonic Notes.
              </h4>
               
              `,
      };
      transporter.sendMail(mail, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
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
      const user = await User.findById({ _id: id });
      const currentUser = await User.findById({ _id: req.user._id });
      const save = await currentUser.updateOne({
        $push: {
          friends: id,
        },
        $pull: {
          requests: id,
        },
      });

      await user.updateOne({
        $push: {
          friends: req.user._id,
          latestNotification: {
            from: req.user._id,
            message: "Accepted your friend request!",
          },
          notification: {
            from: req.user._id,
            message: "Accepted your friend request!",
          },
        },
        $pull: {
          sentRequests: id,
        },
      });
      const mail = {
        to: req.user.email,
        from: "yash@no-reply.com",
        subject: "Account Successfully Registered",
        html: `<h1>Hey, ${req.user.firstName}. </h1>
  
              <h2> ${user.firstName} has accepted your friend request!</h2>
  
              <h4>
              Regards, 
              Mnemonic Notes.
              </h4>
               
              `,
      };
      transporter.sendMail(mail, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.json({
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
    const { id } = req.params;
    if (id) {
      const user = await User.findById({ _id: id });
      const currentUser = await User.findById({
        _id: req.user._id,
      });
      const save = await currentUser.updateOne({
        $pull: {
          sentRequests: id,
        },
      });

      await user.updateOne({
        $pull: {
          requests: req.user._id,
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

exports.removeFriend = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await User.findById({ _id: id });
      const currentUser = await User.findById({ _id: req.user._id });
      const save = await currentUser.updateOne({
        $pull: {
          friends: id,
        },
      });

      await user.updateOne({
        $pull: {
          friends: req.user._id,
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

exports.getSentRequests = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id }).populate(
      "sentRequests",
      ["firstName", "lastName", "username", "profilePic"]
    );
    res.json(user.sentRequests);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getAllFriendsData = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id })
      .populate("friends", ["firstName", "lastName", "username", "profilePic"])
      .populate("requests", ["firstName", "lastName", "username", "profilePic"])
      .populate("sentRequests", [
        "firstName",
        "lastName",
        "username",
        "profilePic",
      ]);
    res.json({
      friends: user?.friends,
      request: user?.requests,
      sentRequests: user?.sentRequests,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

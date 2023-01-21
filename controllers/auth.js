const User = require("../models/User");
const nodemailer = require("nodemailer");
// const { cloudinary } = require("../utils/cloudinary")
const bcrypt = require("bcryptjs");
const Post = require("../models/Post");
const emailRegex = new RegExp(
  /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/
);

const usernameRegex = new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,10}$/);

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
// const mail = {
//     to: admin.email,
//     from: "yash@no-reply.com",
//     subject: "Account Successfully Registered",
//     html: `<h2>Welcome, ${name}. </h2>
//     <h4>You're Now an Admin of Student Management System</h4>
//       <p>Your Login Credentials Are : </p>
//       <em>Email Id: ${email}</em>
//       <em>Password: ${password}</em>

//     <h4>
//     <a href="https://project-sms.netlify.app/admin">Click Here To Login!</a>
//     </h4>

//       <footer>
//       <p>-Admin Dept.</p>
//       </footer>

//     `,
//   };
//   transporter.sendMail(mail, (error, info) => {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      cpassword,
      username,
      profilePic,
    } = req.body;

    if (firstName.length < 2) {
      return res.status(400).json({
        field: "firstName",
        error: "Enter Valid Firstname!",
      });
    }
    if (lastName.length < 2) {
      return res.status(400).json({
        field: "lastName",
        error: "Enter Valid Lastname!",
      });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        field: "email",
        error: "Enter Valid Email!",
      });
    }
    const exists = await User.findOne({ email });

    if (exists)
      return res.status(400).json({
        field: "email",
        error: "User Already Exists!",
      });
    // if (
    //   !firstName ||
    //   !lastName ||
    //   !email ||
    //   !password ||
    //   !cpassword ||
    //   !username ||
    //   !profilePic
    // )
    //   return res.status(400).json({
    //     error: "All Fields are required!",
    //   });
    if (!usernameRegex.test(username))
      return res.status(400).json({
        field: "username",
        error:
          "Invalid Username, Length should Be greater than 4 and lesser than or equal to 10 and it can contain Alphabets(a-z) , Numbers(0-9), Period(.) and Underscore(_) only.",
      });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({
        field: "username",
        error: "Username already taken, Please choose different username!",
      });

    if (password.length < 8) {
      return res.status(400).json({
        field: "password",
        error: "Password length should be greater than 8!",
      });
    }

    if (!cpassword) {
      return res.status(400).json({
        field: "cpassword",
        error: "Please Confirm Your Password!",
      });
    }

    if (password !== cpassword)
      return res.status(400).json({
        field: "cpassword",
        error: "Enter Same Password Twice!",
      });

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      profilePic,
      username,
    });

    await user.save();
    const mail = {
      to: email,
      from: "yash@no-reply.com",
      subject: "Account Successfully Registered",
      html: `<h1>Welcome, ${firstName}. </h1>

            <h2> Mnemonic!</h2>

            <h4>
            <a href="http://localhost:3000">Click Here To Login!</a>
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

    return res.json({
      message: "User Registered",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { password, username } = req.body;

    if (!username)
      return res.status(400).json({
        field: "username",
        error: "Please Enter Username or Email!",
      });
    if (!password)
      return res.status(400).json({
        field: "password",
        error: "Please Enter Password!",
      });

    let existingUser = await User.findOne({
      $or: [
        { email: new RegExp("^" + username, "i") },
        { username: new RegExp("^" + username, "i") },
      ],
    })
      .populate("requests", ["firstName", "lastName", "username", "profilePic"])
      .populate("friends", ["firstName", "lastName", "username", "profilePic"])
      .populate("sentRequests", [
        "firstName",
        "lastName",
        "username",
        "profilePic",
      ]);

    if (!existingUser)
      return res.status(400).json({ error: "Inavlid Credentials!" });

    const checkPassword = await bcrypt.compare(password, existingUser.password);

    if (!checkPassword)
      return res.status(400).json({ error: "Inavlid Credentials!" });

    token = await existingUser.generateToken();

    return res.json({
      message: "Success!",
      user: {
        id: existingUser.firstName,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        profilePic: existingUser.profilePic,
        username: existingUser.username,
        email: existingUser.email,
        friends: existingUser.friends,
        requests: existingUser.requests,
        token: existingUser.token,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.signout = async (req, res) => {
  try {
    const getUser = await User.findOne({
      _id: req.user._id,
      token: req.token,
    });
    req.token = undefined;
    req.user = undefined;
    req.userId = undefined;
    return res.send("Success");
  } catch (error) {
    console.log(error);
  }
};

exports.post = async (req, res) => {
  try {
    const { postTitle, postContent, postedOn, photo, tags } = req.body;

    if (!postTitle || !postContent || !postedOn || !photo || !tags)
      return res.status(400).json({
        error: "All Fields Are Required!",
      });

    const findPost = await Post.findOne({
      postTitle,
    });

    if (findPost)
      return res.status(400).json({
        error: "Post With The Same Title Already Exists!",
      });

    if (!photo)
      return res.status(400).json({
        error: "Something Went Wrong with Photo!",
      });
    const uploadedRes = await cloudinary.uploader.upload(photo, {
      upload_preset: "mymernblogapp",
    });

    let photoUrl = uploadedRes.url;
    console.log(photoUrl);

    const savePost = new Post({
      postedBy: req.user.name,
      postTitle,
      postContent,
      postedOn,
      photo: photoUrl,
      tags,
    });

    await savePost.save();

    return res.json({
      message: "Posted!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: error.message,
    });
  }
};

exports.posts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.json(posts);
  } catch (error) {
    console.log(error);
  }
};

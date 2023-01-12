const User = require('../models/User')
const nodemailer = require("nodemailer")
// const { cloudinary } = require("../utils/cloudinary")
const bcrypt = require('bcryptjs');
const Post = require('../models/Post');

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
        const { firstName, lastName, email, password, cpassword, gender, username } = req.body
        if (!firstName || !lastName || !email || !password || !cpassword || !gender || !username) return res.status(400).json({
            error: "All Fields are required!"
        })
        let profilePic = `https://ui-avatars.com/api/?name=${firstName+lastName}`


        const exists = await User.findOne({ email })
        const existingUsername = await User.findOne({username})
        if(existingUsername) return res.status(400).json({
            error: "Username already taken, Please choose different username!"
        })

        if (exists) return res.status(400).json({
            error: "User Already Exists!"
        })

        if (password !== cpassword) return res.status(400).json({ error: "Enter Same Password Twice!" })

    const user = new User({
            firstName, lastName, email, password, gender ,profilePic, username
        })

        await user.save()
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
      user: user,
            message: "User Registered"
        })

  } catch (error) {
    res.status(400).json({
            error: error.message
        })
  }
}

exports.signin = async (req, res) => {
  try {
        let token
        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({ error: "All Fields are Required!" })

        const existingUser = await User.findOne({ email })

        if (!existingUser) return res.status(400).json({ error: "Inavlid Credentials!" })

    const checkPassword = await bcrypt.compare(password, existingUser.password);

        if (!checkPassword) return res.status(400).json({ error: "Inavlid Credentials!" })

        token = await existingUser.generateToken()

    await res.cookie("authToken", token, {
            httpOnly: true
        })

    return res.json({
      message: "Success!",
            token
        })

  } catch (error) {
    res.status(400).json({
            error: error.message
        })
  }
}

exports.signout = async (req, res) => {
  try {
    const getUser = await User.findOne({
      _id: req.user._id,
            token: req.cookies.authToken
        })

        getUser.token = undefined
        await getUser.save()
        res.clearCookie('authToken', {
            path: "/"
        })
        return res.send("Success")
  } catch (error) {
        console.log(error)
  }
}

exports.getUser = async (req, res) => {

  try {
    const findUser = await User.findOne({
            _id: req.user._id

        })

        return res.json({ user: findUser })

  } catch (error) {
    res.status(400).json({
            error: "Something Went Wrong!"
        })
  }
}


// exports.editUser = async (req, res) => {

//     if (req.body.data) {
//         try {

//             // console.log(req.body)
//             const id = req.user._id
//             const { data } = req.body
//             if (!data) return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })
//             const uploadedRes = await cloudinary.uploader.upload(data, {
//                 upload_preset: 'mymernblogapp',
//             })

//             let photo = uploadedRes.url
//             console.log(photo);

//             // // const finder = await User.findById({ _id: id._id })

//             await User.findByIdAndUpdate(id, {
//                 photo
//             })

//             return res.json({
//                 message: "Photo Updated!"
//             })
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     if (req.body.name) {
//         try {

//             // console.log(req.body)
//             const id = req.user._id
//             const { name } = req.body
//             if (!name) return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })

//             await User.findByIdAndUpdate(id, {
//                 name: name
//             })

//             return res.json({
//                 message: "Name Updated!"
//             })
//         } catch (error) {
//             return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })
//         }
//     }
//     if (req.body.email) {
//         try {

//             // console.log(req.body)
//             const id = req.user._id
//             const { email } = req.body
//             if (!email) return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })

//             await User.findByIdAndUpdate(id, {
//                 email: email
//             })

//             return res.json({
//                 message: "Email Updated!"
//             })
//         } catch (error) {
//             return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })
//         }
//     }
//     if (req.body.contact) {
//         try {

//             // console.log(req.body)
//             const id = req.user._id
//             const { contact } = req.body
//             if (!contact) return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })

//             await User.findByIdAndUpdate(id, {
//                 contact: contact
//             })

//             return res.json({
//                 message: "Contact Updated!"
//             })
//         } catch (error) {
//             return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })
//         }
//     }
//     if (req.body.currentPassword) {
//         try {

//             // console.log(req.body)
//             const id = req.user._id
//             const { currentPassword, newPassword, confirmNewPassword } = req.body


//             if (!currentPassword || !newPassword || !confirmNewPassword) return res.status(400).json({
//                 error: "All Fields are required!"
//             })


//             const checkCurrentPassword = await bcrypt.compare(currentPassword, req.user.password)

//             if (!checkCurrentPassword) return res.status(400).json({
//                 error: "Password is Wrong"
//             })


//             if (newPassword !== confirmNewPassword) return res.status(400).json({
//                 error: "Enter Same Password Twice!"
//             })



//             const hashPassword = await bcrypt.hash(newPassword, 12)

//             await User.findByIdAndUpdate(id, {
//                 password: hashPassword
//             })

//             return res.json({
//                 message: "Password Updated!"
//             })
//         } catch (error) {
//             console.log(error)
//             return res.status(400).json({
//                 error: "Something Went Wrong! Please Try Again"
//             })
//         }
//     }
// }



exports.post = async (req, res) => {
  try {
        const { postTitle, postContent, postedOn, photo, tags } = req.body

        if (!postTitle || !postContent || !postedOn || !photo || !tags) return res.status(400).json({
            error: "All Fields Are Required!"
        })

    const findPost = await Post.findOne({
            postTitle
        })

        if (findPost) return res.status(400).json({
            error: "Post With The Same Title Already Exists!"
        })

        if (!photo) return res.status(400).json({
            error: "Something Went Wrong with Photo!"
        })
    const uploadedRes = await cloudinary.uploader.upload(photo, {
            upload_preset: 'mymernblogapp',
        })

        let photoUrl = uploadedRes.url
    console.log(photoUrl);

    const savePost = new Post({
            postedBy: req.user.name, postTitle, postContent, postedOn, photo: photoUrl, tags
        })


        await savePost.save()

    return res.json({
            message: "Posted!"
        })


  } catch (error) {
        console.log(error)
    return res.status(400).json({
            error: error.message
        })

  }
}


exports.posts = async (req, res) => {
  try {
        const posts = await Post.find()

        return res.json(posts)
  } catch (error) {
        console.log(error)

  }
}

const express = require("express");
const { signup, signin, signout, editUser, post,posts } = require("../controllers/auth");
const authenticate = require("../middlewares/auth");
const router = express.Router();


router.post('/signup', signup)
router.post('/signin', signin)
router.get('/signout', authenticate, signout)

module.exports = router
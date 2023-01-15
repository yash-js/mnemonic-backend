const express = require("express");
const { getUser, searchUser } = require("../controllers/user");
const router = express.Router();
const authenticate = require("../middlewares/auth");

router.get("/getuser", authenticate, getUser);
router.get("/search/:query", authenticate,searchUser);

module.exports = router;

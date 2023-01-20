const express = require("express");
const { getUser, searchUser, editUser } = require("../controllers/user");
const router = express.Router();
const authenticate = require("../middlewares/auth");

router.get("/getuser", authenticate, getUser);
router.get("/search/:query", authenticate, searchUser);
router.put("/edit", authenticate, editUser);

module.exports = router;

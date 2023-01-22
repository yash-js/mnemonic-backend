const express = require("express");
const {
  getUser,
  searchUser,
  editUser,
  getNotifications,
  readNotifications,
  removeNotification,
} = require("../controllers/user");
const router = express.Router();
const authenticate = require("../middlewares/auth");

router.get("/getuser", authenticate, getUser);
router.get("/search/:query", authenticate, searchUser);
router.put("/edit", authenticate, editUser);
router.get("/notifications", authenticate, getNotifications);
router.put("/notifications", authenticate, readNotifications);
router.put("/notification/remove/:id", authenticate, removeNotification);

module.exports = router;

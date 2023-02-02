const express = require("express");
const {
  getUser,
  editUser,
  getNotifications,
  readNotifications,
  removeNotification,
  allUser,
} = require("../controllers/user");
const router = express.Router();
const authenticate = require("../middlewares/auth");
const { getUserCache, allUserCache, getNotificationsCache } = require("../middlewares/user");

router.get("/getuser", authenticate, getUser);
router.get("/all", authenticate, allUser);
router.put("/edit", authenticate, editUser);
router.get(
  "/notifications",
  authenticate,
  getNotifications
);
router.put("/notifications", authenticate, readNotifications);
router.put("/notification/remove/:id", authenticate, removeNotification);

module.exports = router;

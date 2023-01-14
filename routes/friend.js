const express = require("express");
const {
  addFriend,
  cancelRequest,
  acceptFriend,
  removeFriend,
  getFriends,
  getRequests,
  getSuggestions,
} = require("../controllers/friend");
const authenticate = require("../middlewares/auth");
const router = express.Router();

router.get("/", authenticate, getFriends);

router.get("/requests", authenticate, getRequests);

router.post("/add", authenticate, addFriend);

router.delete("/cancel", authenticate, cancelRequest);

router.post("/accept", authenticate, acceptFriend);

router.delete("/remove", authenticate, removeFriend);

router.get("/suggestions", authenticate, getSuggestions);

module.exports = router;

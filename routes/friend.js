const express = require("express");
const {
  addFriend,
  cancelRequest,
  acceptFriend,
  removeFriend,
  getFriends,
  getRequests,
  getSuggestions,
  getSentRequests,
} = require("../controllers/friend");
const authenticate = require("../middlewares/auth");
const router = express.Router();

router.get("/", authenticate, getFriends);

router.get("/requests", authenticate, getRequests);

router.post("/add/:id", authenticate, addFriend);

router.delete("/cancel/:id", authenticate, cancelRequest);

router.post("/accept/:id", authenticate, acceptFriend);

router.delete("/remove/:id", authenticate, removeFriend);

router.get("/suggestions", authenticate, getSuggestions);

router.get('/sent',getSentRequests)

module.exports = router;

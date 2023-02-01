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
  getAllFriendsData,
} = require("../controllers/friend");
const authenticate = require("../middlewares/auth");
const {
  getFriendsCache,
  getRequestsCache,
  getAllDataCache,
  getSentRequestsCache,
} = require("../middlewares/friends");
const router = express.Router();

router.get("/", authenticate, getFriends);

router.get("/requests", authenticate, getRequests);

router.post("/add/:id", authenticate, addFriend);

router.delete("/cancel/:id", authenticate, cancelRequest);

router.post("/accept/:id", authenticate, acceptFriend);

router.delete("/remove/:id", authenticate, removeFriend);

router.get("/suggestions", authenticate, getSuggestions);

router.get("/sent", authenticate, getSentRequests);

router.get("/all", authenticate, getAllFriendsData);

module.exports = router;

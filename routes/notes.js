const express = require("express");
const { createNote } = require("../controllers/notes");
const authenticate = require("../middlewares/auth");
const router = express.Router();

router.post("/create", authenticate, createNote);

module.exports = router;

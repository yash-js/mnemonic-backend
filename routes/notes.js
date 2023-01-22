const express = require("express");
const {
  createNote,
  editNote,
  deleteNote,
  getNotes,
} = require("../controllers/notes");
const authenticate = require("../middlewares/auth");
const router = express.Router();

router.post("/create", authenticate, createNote);
router.put("/edit/:id", authenticate, editNote);
router.delete("/delete/:id", authenticate, deleteNote);
router.get("/", authenticate, getNotes);

module.exports = router;

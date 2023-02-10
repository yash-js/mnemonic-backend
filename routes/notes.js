const express = require("express");
const {
  createNote,
  editNote,
  deleteNote,
  getNotes,
  genImage,
  summarize,
} = require("../controllers/notes");
const authenticate = require("../middlewares/auth");
const { getNotesCache } = require("../middlewares/notes");
const router = express.Router();

router.post("/create", authenticate, createNote);
router.put("/edit/:id", authenticate, editNote);
router.delete("/delete/:id", authenticate, deleteNote);
router.get("/", authenticate, getNotes);
router.get("/gen/:prompt", authenticate, genImage);
router.get("/summarize/:prompt", summarize);

module.exports = router;

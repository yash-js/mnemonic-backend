const Notes = require("../models/Notes");

exports.createNote = async (req, res) => {
  try {
    const { noteTitle, noteContent, notedOn } = req.body;
    const noteData = {
      author: req.user._id,
      noteTitle, //title
      noteContent, //content
      notedOn, //date
    };

    const saveNote = new Notes(noteData);

    await saveNote.save();
    await saveNote.populate("author");
    res.json({
      saveNote,
      message: "Note Stored",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

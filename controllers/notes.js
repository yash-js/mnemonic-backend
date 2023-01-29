const Notes = require("../models/Notes");
const User = require("../models/User");

exports.createNote = async (req, res) => {
  try {
    const { noteTitle, noteContent, notedOn, mentions } = req.body;
    const noteData = {
      author: req.user._id,
      noteTitle, //title
      noteContent, //content
      notedOn, //date
      mentions,
      noteType,
    };

    if (!noteTitle || !noteContent || !notedOn) {
      return res.status(400).json({
        error: "All Fields are required!",
      });
    }

    const saveNote = new Notes(noteData);
    const currentUser = await User.findById(req.user._id);
    await saveNote.save();
    const savedNote = await Notes.findById(saveNote._id)
      .populate("author", ["username", "profilePic"])
      .populate("mentions", ["username", "profilePic"]);

    await currentUser.updateOne({
      $push: {
        notes: savedNote._id,
      },
    });
    if (mentions && mentions.length > 0) {
      mentions.map(async (mention) => {
        const user = await User.findById(mention._id);
        await user.updateOne({
          $push: {
            notes: {
              author: req.user._id,
              noteTitle,
              noteContent,
              notedOn,
              noteType,
            },
            latestNotification: {
              from: req.user._id,
              message: `${req.user.username} mentioned you in a note!`,
              event: "mentioned",
            },
            notification: {
              from: req.user._id,
              message: `${req.user.username} mentioned you in a note!`,
              event: "mentioned",
            },
          },
        });
      });
    }

    res.json({
      savedNote,
      message: "Note Stored",
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.editNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    // Username Validations

    if (req.body && req.body.noteTitle) {
      const existingNoteTitle = await Notes.findOne({
        noteTitle: req.body.noteTitle,
      });
      if (existingNoteTitle)
        return res.status(400).json({
          field: "Note title",
          error:
            "Note title already taken, Please choose different Note title!",
        });
    }

    await Notes.findByIdAndUpdate(noteId, req.body);

    return res.json({
      message: "Note Updated!",
    });
  } catch (error) {
    res.json({
      error: "Something Went Wrong!",
      errMsg: error.message,
    });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    await Notes.findByIdAndUpdate(req.params.id, req.body);

    return res.json({
      message: "Note Deleted!",
    });
  } catch (error) {
    res.json({
      error: "Something Went Wrong!",
      errMsg: error.message,
    });
  }
};

exports.getNotes = async (req, res) => {
  try {
    var notes = await Notes.find({ author: req.user._id })
      .populate("mentions", ["username", "profilePic"])
      .populate("author", ["username", "profilePic"]);

    return res.json({
      notes: notes,
    });
  } catch (error) {
    res.json({
      error: "Something Went Wrong!",
      errMsg: error.message,
    });
  }
};
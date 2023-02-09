const Notes = require("../models/Notes");
const User = require("../models/User");

exports.createNote = async (req, res) => {
  try {
    const { noteTitle, noteContent, notedOn, mentions, noteType } = req.body;
    const noteData = {
      author: req.user._id,
      noteTitle, //title
      noteContent, //content
      notedOn, //date
      noteType,
    };

    if (mentions && mentions.length > 0) noteData.mentions = mentions;

    if (!noteTitle || !noteContent || !notedOn) {
      return res.status(400).json({
        error: "All Fields are required!",
      });
    }

    const saveNote = new Notes(noteData);
    await saveNote.save();
    const currentUser = await User.findById(req.user._id);
    const savedNote = await Notes.findById(saveNote._id)
      .populate("author", ["username", "profilePic"])
      .populate("mentions", ["username", "profilePic"]);

    await currentUser.updateOne({
      $push: {
        notes: savedNote._id,
      },
    });

    await User.updateMany(
      { _id: { $in: mentions } },
      {
        $push: {
          notes: saveNote._id,
          latestNotification: {
            from: req.user._id,
            message: `${req.user.username} has mentioned you in a note`,
          },
        },
      },
      { multi: true }
    );

    // const mentioned = await User.findById({ _id: mentions });
    // console.log(mentioned);
    // mentioned.notes.push({
    //   author: req.user._id,
    //   noteTitle, //title
    //   noteContent, //content
    //   notedOn, //date
    //   noteType,
    // });
    // mentioned.latestNotification.push({
    //   from: req.user._id,
    //   message: `@${req.user.username} mentioned you in a note!`,
    //   event: "mentioned",
    // });
    // mentioned.notification.push({
    //   from: req.user._id,
    //   message: `@${req.user.username} mentioned you in a note!`,
    //   event: "mentioned",
    // });
    // await mentioned.updateOne({
    //   $push: {
    //     notes: {
    //       author: req.user._id,
    //       noteTitle, //title
    //       noteContent, //content
    //       notedOn, //date
    //       noteType,
    //     },
    //     latestNotification: {
    //       from: req.user._id,
    //       message: `@${req.user.username} mentioned you in a note!`,
    //       event: "mentioned",
    //     },
    //     notification: {
    //       from: req.user._id,
    //       message: `@${req.user.username} mentioned you in a note!`,
    //       event: "mentioned",
    //     },
    //   },
    // });

    // if (mentions && mentions.length > 0) {
    // const user = await User.updateMany(
    //   { _id: { $in: mentions } },
    //   {
    //     $push: {
    //       notes: {
    //         author: req.user._id,
    //         noteTitle,
    //         noteContent,
    //         notedOn,
    //         noteType,
    //       },
    //       latestNotification: {
    //         from: req.user._id,
    //         message: `${req.user.username} mentioned you in a note!`,
    //         event: "mentioned",
    //       },
    //       notification: {
    //         from: req.user._id,
    //         message: `${req.user.username} mentioned you in a note!`,
    //         event: "mentioned",
    //       },
    //     },
    //   },
    // );
    // await mentioned.updateOne({
    //   $push: {
    //     notes: {
    //       author: req.user._id,
    //       noteTitle,
    //       noteContent,
    //       notedOn,
    //       noteType,
    //     },
    //     latestNotification: {
    //       from: req.user._id,
    //       message: `${req.user.username} mentioned you in a note!`,
    //       event: "mentioned",
    //     },
    //     notification: {
    //       from: req.user._id,
    //       message: `${req.user.username} mentioned you in a note!`,
    //       event: "mentioned",
    //     },
    //   },
    // });

    res.json({
      // user,
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

    const note = await Notes.findById(noteId);

    if (!req.body.noteContent && !req.body.noteTitle) {
      return res.status(400).json({
        error: "Nothing to change",
      });
    }

    if (
      (req.body.noteContent === note.noteContent &&
        req.body.noteTitle === note.noteTitle) ||
      (req.body.noteContent === note.noteContent && !req.body.noteTitle)
    ) {
      return res.status(400).json({
        error: "Nothing to change",
      });
    }
    if (req.body && !req.body.noteContent && req.body.noteTitle) {
      const existingNoteTitle = await Notes.findOne({
        noteTitle: req.body.noteTitle,
      });
      if (existingNoteTitle)
        return res.status(400).json({
          field: "Note title",
          error:
            "Note title already taken, Please choose different Note title!",
        });
      else {
        await Notes.findByIdAndUpdate(noteId, {
          noteTitle: req.body.noteTitle,
        });
      }
    }

    if (req.body && req.body.noteContent && !req.body.noteTitle) {
      await Notes.findByIdAndUpdate(noteId, {
        noteContent: req.body.noteContent,
      });
    }

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
    const user = await User.findById(req.user._id);

    await Notes.findByIdAndDelete(req.params.id, req.body);
    await user.updateOne({
      $pull: {
        notes: req.params.id,
      },
    });
    return res.json({
      message: "Note Deleted!",
    });
  } catch (error) {
    res.status(400).json({
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

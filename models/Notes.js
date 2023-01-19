const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    noteTitle: {
      type: String,
    },
    noteContent: {
      type: String,
    },
    notedOn: {
      type: String,
    },
    //   photo: {
    //     type: String,
    //   },
    tags: {
      type: Array,
      default: [""],
    },
  },
  { timestamps: true }
);

module.exports = Notes = mongoose.model("Notes", notesSchema);

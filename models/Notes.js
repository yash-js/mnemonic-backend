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
      type: Date,
      default: new Date(),
    },
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    noteType: {
      type: String,
      default: "normal",
    },
    summary: {
      type: String,
    },
    image:{
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = Notes = mongoose.model("Notes", notesSchema);

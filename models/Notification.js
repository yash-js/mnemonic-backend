const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const notificationSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    from: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    to: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.post("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

module.exports = Notification = mongoose.model(
  "Notification",
  notificationSchema
);

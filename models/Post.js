const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    postedBy: {
        type: String,
    },
    postTitle: {
        type: String,
    },
    postContent: {
        type: String,
    },
    postedOn: {
        type: String
    },
    photo: {
        type: String,
    },
    tags: {
        type: Array,
        default: [""]
    }
});

module.exports = Post = mongoose.model("Post", postSchema);
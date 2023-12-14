const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  like: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [
      {
        user: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("POSTS", PostSchema);

module.exports = Post;

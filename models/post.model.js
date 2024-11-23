const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: { type: String },
  description: { type: String },
  lat: { type: Number },
  long: { type: Number },
  publisherId: { type: String },
  neighbourhoodId: { type: String },
  date: { type: String },
  time: { type: String },
  severity: { type: String },
  status: { type: String },
  category: { type: String },
  comments: [
    {
      username: { type: String },
      comment: { type: String },
    },
  ],
});

module.exports = PostModel = mongoose.model("post", PostSchema);

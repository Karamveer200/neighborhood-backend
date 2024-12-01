const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
  neighbourCode: { type: String, required: true },
  readUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  title: { type: String, required: true },
  message: { type: String, required: true },
  imageId: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = NotificationModel = mongoose.model(
  "notification",
  NotificationSchema
);

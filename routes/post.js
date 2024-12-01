var express = require("express");
var router = express.Router();

const PostModel = require("../models/post.model");
const NotificationModel = require("../models/notifications.model");

// Get all posts
router.get("/list", async (_, res) => {
  try {
    // Sort by recent -> old
    const posts = await PostModel.find().sort({ date: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// Get all posts by neighbourCode
router.get("/getPosts/:neighbourCode", async (req, res) => {
  try {
    const neighbourCode = req.params.neighbourCode;

    const posts = await PostModel.find({ neighbourCode });

    res.status(200).json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// Get post by id
router.get("/getPost/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).send("Post Not Found");
    }

    return res.json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

// Create a new post
router.post("/create", async (req, res) => {
  const {
    title,
    description,
    lat,
    long,
    publisherId,
    neighbourCode,
    date,
    time,
    severity,
    status,
    category,
    imageId,
  } = req.body;

  const comments = [];

  try {
    const postData = {
      title,
      description,
      lat,
      long,
      publisherId,
      neighbourCode,
      date,
      time,
      severity,
      status,
      category,
      comments,
      imageId,
    };

    const createdPost = await new PostModel(postData);

    await createdPost.save();

    const notification = await new NotificationModel({
      postId: createdPost._id,
      neighbourCode,
      title,
      imageId: createdPost.imageId ?? null,
      message: "A new post has been added",
    });

    await notification.save();

    res.status(200).json(createdPost);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// change post status
router.put("/updateStatus/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const { status } = req.body;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).send("Post Not Found");
    }

    post.status = status;

    await post.save();

    const notification = await new NotificationModel({
      postId: post._id,
      title: post.title,
      neighbourCode: post.neighbourCode,
      imageId: post.imageId ?? null,
      message: `Issue has been marked as ${status}`,
    });

    await notification.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

//add comment to post
router.put("/addComment/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    let { comment } = req.body;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).send("Post Not Found");
    }

    const newComment = {
      username: req.user.name,
      userId: req.userId,
      comment,
    };

    post.comments.unshift(newComment);
    await post.save();

    const trimmedNewComment = comment.slice(0, 70);

    const notification = await new NotificationModel({
      postId: post._id,
      title: post.title,
      neighbourCode: post.neighbourCode,
      imageId: post.imageId ?? null,
      message: `A new comment has been added '${trimmedNewComment}...'`,
    });

    await notification.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;

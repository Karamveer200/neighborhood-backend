var express = require("express");
var router = express.Router();
var asyncHandler = require("express-async-handler");

const PostModel = require("../models/post.model");

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
    neighbourhoodId,
    date,
    time,
    severity,
    status,
    category,
  } = req.body;

  const comments = [];

  try {
    const postData = {
      title,
      description,
      lat,
      long,
      publisherId,
      neighbourhoodId,
      date,
      time,
      severity,
      status,
      category,
      comments,
    };

    const createdPost = await new PostModel(postData);
    await createdPost.save();

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
    const { comment } = req.body;

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

    res.status(200).json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;

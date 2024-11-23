const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { middleware } = require("./middleware/middleware");
const User = require("../models/user.model");

const getSha256Hash = (key) =>
  crypto.createHash("sha256").update(key).digest("hex");

// @route GET api/auth
// Get current user
router.get("/", middleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/users
// Login User
router.post(
  "/login",
  [
    check("email", "Enter email address").isEmail(),
    check("password", "Enter password at least 4 characters").isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isValidPassword = getSha256Hash(password) === user.password;

      if (!isValidPassword)
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });

      {
        const { password, ...restUser } = user._doc;

        const payload = {
          user: restUser,
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 36000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token, ...payload.user });
          }
        );
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route POST api/users
// Register User
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email address").isEmail(),
    check("password", "Enter a password with 4 characters or more").isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      password,
      phoneNumber,
      residentialAddress,
      profileImageId,
    } = req.body;

    try {
      //Check if user already exist
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        phoneNumber,
        residentialAddress,
        profileImageId,
      });

      // Hash pswrd
      user.password = getSha256Hash(password);

      await user.save();

      {
        const { password, ...restUser } = user._doc;

        const payload = {
          user: restUser,
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 36000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token, ...payload.user });
          }
        );
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

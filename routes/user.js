const express = require("express");
const router = express.Router();
const { middleware } = require("./middleware/middleware");
const User = require("../models/user.model");
const ImageSchema = require("../models/images.model");
const multer = require("multer");
const { check, validationResult } = require("express-validator");

const upload = multer({ storage: multer.memoryStorage() });

// @route api/user/upload-image
// Post upload-image
router.post("/upload-image", upload.single("profile-pic"), async (req, res) => {
  try {
    const newImage = new ImageSchema({
      name: req.file.originalname,
      img: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const saveImg = await newImage.save();

    res.status(200).json({ id: saveImg._id });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route GET api/user/image/:id
// GET image
router.get("/image/:id", middleware, async (req, res) => {
  try {
    const image = await ImageSchema.findById(req.params.id);

    res.contentType(image.img.contentType);
    res.send(image.img.data);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route PUT api/user/update-user
// Update User
router.put(
  "/update-user",
  middleware,
  [check("name", "Name is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phoneNumber, residentialAddress, profileImageId } = req.body;
    const updatedFields = {};

    if (name) updatedFields.name = name;

    if (phoneNumber) updatedFields.phoneNumber = phoneNumber;

    if (residentialAddress)
      updatedFields.residentialAddress = residentialAddress;

    if (profileImageId) updatedFields.profileImageId = profileImageId;

    try {
      //Check if user already exist
      let user = await User.findOne({ email: req.user.email });

      if (user) {
        user = await User.findOneAndUpdate(
          { _id: user._id },
          {
            $set: updatedFields,
          },
          { new: true }
        );

        await user.save();

        const { password, ...restUser } = user._doc;

        return res.json(restUser);
      }

      return res.status(400).json({ errors: [{ msg: "User doesn't exist" }] });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

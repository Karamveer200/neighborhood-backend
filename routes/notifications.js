var express = require("express");
var router = express.Router();

const NotificationModel = require("../models/notifications.model");

// Get all notifcations
router.get("/list/:neighbourCode", async (req, res) => {
  try {
    const neighbourCode = req.params.neighbourCode;

    // Sort by recent -> old
    const notifications = await NotificationModel.find({ neighbourCode })
      .sort({
        createdAt: -1,
      })
      .lean();

    const updatedNotifications = notifications.map((notifyItem) => {
      let isReadByUser = "false";

      const readUserIds = notifyItem.readUserIds.map((userId) =>
        userId.toString()
      );

      if (readUserIds.includes(req.userId)) isReadByUser = "true";

      return { isReadByUser, ...notifyItem };
    });

    res.status(200).json(updatedNotifications);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// Read notifcation
router.post("/read/:notificationId", async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    const updatedNotification =
      await NotificationModel.findById(notificationId);

    if (!updatedNotification) {
      return res.status(404).send("Notification not Found");
    }

    if (!updatedNotification.readUserIds.includes(req.userId))
      updatedNotification.readUserIds.unshift(req.userId);

    await updatedNotification.save();
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

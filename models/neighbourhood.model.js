const mongoose = require("mongoose");

const NeighborHoodSchema = mongoose.Schema({
  name: { type: String },
  kind: { type: String },
  admin_id: { type: String },
  description: { type: String },

  geoFence: [
    {
      lat: { type: Number },
      long: { type: Number },
    },
  ],

  members: [
    {
      memberId: { type: String },
    },
  ],
});

module.exports = NeighborHoodModel = mongoose.model(
  "neighborhood",
  NeighborHoodSchema
);

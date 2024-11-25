const mongoose = require("mongoose");

const NeighbourhoodSchema = mongoose.Schema({
  name: { type: String },
  kind: { type: String },
  adminId: { type: String },
  description: { type: String },
  neighbourCode:{ type: String },

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

module.exports = NeighbourhoodModel = mongoose.model(
  "neighbourhood",
  NeighbourhoodSchema
);

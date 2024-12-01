var express = require("express");
var router = express.Router();

var NeighbourhoodModel = require("../models/neighbourhood.model");
const neighbourhoodModel = require("../models/neighbourhood.model");

// Get neighbourhood by code
router.get("/getNeighbourhood/:neighbourCode", async (req, res) => {
  try {
    const neighbourCode = req.params.neighbourCode;

    const neighbourhood = await PostModel.find(neighbourCode);

    if (!neighbourhood) {
      return res.status(404).send("Neighbourhood Not Found");
    }

    return res.json(neighbourhood);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Server Error");
  }
});

// Create neighbourhood
router.post("/create", async (req, res) => {
  const { name, kind, adminId, description, geoFence } = req.body;

  const neighbourCode = generateUniqueId(5);
  const members = [{ memberId: adminId }];

  try {
    const neighbourhoodData = {
      name,
      kind,
      adminId,
      description,
      neighbourCode,
      geoFence,
      members,
    };

    const createNeighbourhood = await new neighbourhoodModel(neighbourhoodData);
    await createNeighbourhood.save();
    res.status(200).json({ neighbourhoodCode: neighbourCode });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

//Add member to neighbourhood
router.put("/addMember/:neighbourCode", async (req, res) => {
  try {
    const neighbourCode = req.params.neighbourCode;
    const { memberId } = req.body;

    const neighbourhood = await NeighbourhoodModel.find(neighbourCode);

    if (!neighbourhood) {
      return res.status(404).send("Neighbourhood Not Found");
    }

    neighbourhood.members.unshift(memberId);
    await neighbourhood.save();

    res.status(200).json(neighbourhood);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

//Edit neighbourhood by code
router.put("/edit", async (req, res) => {
  const { name, kind, adminId, description, neighbourCode, geoFence, members } =
    req.body;

  try {
    const neighbourhood = await neighbourhoodModel.find({ neighbourCode });

    if (!neighbourhood) {
      return res.status(404).send("Neighbourhood Not Found");
    }

    if (neighbourhood.adminId != adminId) {
      return res.status(401).send("Not Autherised");
    }

    const result = await neighbourhoodModel.findOneAndUpdate(
      { neighbourCode },
      { name, kind, adminId, description, neighbourCode, geoFence, members }
    );
    res.status(200).send("Neighbourhood Updated");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// delete neighbourhood
router.post("/delete/:neighbourCode", async (req, res) => {
  const neighbourCode = req.params.neighbourCode;

  try {
    const result = await neighbourhoodModel.deleteOne({ neighbourCode });
    res.status(200).send("Neighbourhood deleted successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Bad Request");
  }
});

function generateUniqueId(length) {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Including digits and uppercase letters
  const charLength = characters.length;
  let id = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charLength);
    id += characters.charAt(randomIndex);
  }

  return id;
}

module.exports = router;

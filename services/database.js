const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error connecting DB: " + error.message);
    process.exit(1); //exit process with failure
  }
};

module.exports = connectDB;

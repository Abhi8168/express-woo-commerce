const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI; // Replace with your MongoDB URI
  if (!uri) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

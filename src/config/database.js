const mongoose = require("mongoose");

const connectDB = async () => {
  // await mongoose.connect(
  //   "mongodb://localhost:27017/devTinder"
  // );
  await mongoose.connect("mongodb+srv://harshmeghani47:1G15QTaqyXlEzslw@namasteharsh.popfo95.mongodb.net/?retryWrites=true&w=majority&appName=NamasteHarsh");
};

module.exports = connectDB;
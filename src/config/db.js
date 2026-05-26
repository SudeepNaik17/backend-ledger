const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB connected!");
    })
    .catch((e) => {
      console.log("Error", e);
      process.exit(1);
    });
};

module.exports = connectDB;

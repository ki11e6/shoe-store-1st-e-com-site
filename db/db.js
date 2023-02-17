const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);
const mongoDB = process.env.DBURL;

mongoose.connect(mongoDB, (err) => {
  if (err) {
    console.log(`Unable to connect to the server :${err}`);
  } else {
    console.log("MongoDB is connected");
  }
});
module.exports = mongoose.connection;

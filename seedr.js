const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const BootCamp = require("./models/Bootcamp");
const dotenv = require("dotenv");
const colors = require("colors");

dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// bring in the file
const bootcampsFileUrl = path.join(__dirname, "_data", "bootcamps.json");
const data = JSON.parse(fs.readFileSync(bootcampsFileUrl, "utf-8"));
const importData = async () => {
  try {
    await BootCamp.create(data);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red.bold);
  }
};

const deleteData = async () => {
  try {
    await BootCamp.deleteMany();
    console.log("Data deleted...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red.bold);
  }
};

// check for flags
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

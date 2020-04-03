const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const BootCamp = require("./models/Bootcamp");
const Course = require("./models/Courses");
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
const coursesFileUrl = path.join(__dirname, "_data", "courses.json");
const data = JSON.parse(fs.readFileSync(bootcampsFileUrl, "utf-8"));
const Coursesdata = JSON.parse(fs.readFileSync(coursesFileUrl, "utf-8"));
const importData = async () => {
  try {
    await BootCamp.create(data);
    // await Course.create(Coursesdata);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red);
  }
};

const deleteData = async () => {
  try {
    await BootCamp.deleteMany();
    await Course.deleteMany();
    console.log("Data deleted...".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error.red);
  }
};

// check for flags
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

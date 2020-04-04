const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const Bootcamproutes = require("./routes/Bootcamp");
const Courseroutes = require("./routes/Courseroutes");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const authRoutes = require("./routes/Auth");

// load env variables
dotenv.config({ path: path.join(__dirname, "config", "config.env") });
// connect to database
connectDB();

const PORT = process.env.PORT || 3000;
const app = express();
// Body parser
app.use(express.json());
// set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(fileupload());

app.use("/api/v1/bootcamps", Bootcamproutes);
app.use("/api/v1/courses", Courseroutes);
app.use("/api/v1/auth", authRoutes);
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server running on in ${process.env.NODE_ENV} at port ${process.env.PORT}`
      .yellow.bold
  );
});

// handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`.red.underline);
  // close server and exit
  server.close(() => process.exit(1));
});

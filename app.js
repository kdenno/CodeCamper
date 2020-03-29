const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const APIroutes = require("./routes/APIroutes");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

// load env variables
dotenv.config({ path: path.join(__dirname, "config", "config.env") });
// connect to database
connectDB();


const PORT = process.env.PORT || 3000;
const app = express();
// Body parser
app.use(express.json());
app.use("/api/v1/bootcamps", APIroutes);
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}

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

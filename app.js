const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const Bootcamproutes = require("./routes/Bootcamp");
const Courseroutes = require("./routes/Courseroutes");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const authRoutes = require("./routes/Auth");
const adminRoutes = require("./routes/Users");
const reveiwsRoutes = require("./routes/Review");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

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
app.use(cookieParser());
// sanitize data
app.use(mongoSanitize());
// set security headers
app.use(helmet());
// prevent cross site scripting attacks
app.use(xss());
// prevent request parameter polution
app.use(hpp());
// rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100, // only allow 100 requests per 10min from the same IP
});
app.use(limiter);

// implement cors
app.use(cors());

app.use("/api/v1/bootcamps", Bootcamproutes);
app.use("/api/v1/courses", Courseroutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", adminRoutes);
app.use("/api/v1/reviews", reveiwsRoutes);
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

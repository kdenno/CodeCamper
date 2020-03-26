const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

// load env variables
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

const PORT = process.env.PORT || 3000;
const app = express();
app.listen(PORT, () => {
  console.log(
    `Server running on in ${process.env.NODE_ENV} at port ${process.env.PORT}`
  );
});

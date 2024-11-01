require("dotenv").config();
const mongoose = require("mongoose");
const clc = require("cli-color");

const { MONGODB_URL } = process.env;
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log(clc.blueBright("✓ Mongoose connection established..!"));
  })
  .catch((error) => {
    console.log(clc.bgCyanBright(error));
  });
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_DB_URI).then(
  () => {
    logger.info("Mongo DB connection established");
    app.listen(PORT, () => {
      logger.info(`Server is running on PORT ${PORT}...`);
    });
  },
  (err) => {
    logger.error("Mongo DB connection failed", err.message);
  }
);

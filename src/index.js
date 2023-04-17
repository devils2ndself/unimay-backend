require("dotenv").config({
    path: process.env.ENV_FILE ? process.env.ENV_FILE : ".env",
});

const logger = require("./logger");
const db = require("./models");

process.on("uncaughtException", (err, origin) => {
    logger.fatal({ err, origin }, "uncaughtException");
    throw err;
});

process.on("unhandledRejection", (reason, promise) => {
    logger.fatal({ reason, promise }, "unhandledRejection");
    throw reason;
});

db.init()
    .then(() => {
        require("./server");
    })
    .catch((err) => {
        logger.fatal(err, "Unable to connect to DB");
    });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createErrorResponse } = require("./response");

const logger = require("./logger");
const pino = require("pino-http")({
    logger,
});

const app = express();

// Middleware: logger, headers, cors
app.use(pino);
app.use(helmet());
app.use(cors());

app.use("/", require("./routes"));

// 404-handling middleware
app.use((req, res) => {
    res.status(404).json(createErrorResponse(404, "not found"));
});

// Error-handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "unable to process request";

    if (status > 499) {
        logger.error({ err }, `Error processing request`);
    }

    res.status(status).json(createErrorResponse(status, message));
});

module.exports = app;

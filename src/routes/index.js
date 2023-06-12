/* eslint-disable no-unused-vars */
const express = require("express");
const { hostname } = require("os");
const {
    version,
    author,
    license,
    name,
    description,
} = require("../../package.json");
const { createSuccessResponse } = require("../response");
const config = require("../config");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: name,
            version: version,
            description: description,
            license: {
                name: license,
            },
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
            },
        ],
    },
    apis: [
        "./src/models/index.js",
        "./src/routes/api/*/*.js",
        "./src/routes/api/*/*/*.js",
    ],
};

const specs = swaggerJsdoc(options);

const router = express.Router();

router.use(`/api`, require("./api"));
router.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

router.get("/", (req, res) => {
    // Health-check = no-caches
    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json(
        createSuccessResponse({
            // author,
            version,
            // hostname: hostname(),
        })
    );
});

module.exports = router;

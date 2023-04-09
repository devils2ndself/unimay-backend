/* eslint-disable no-unused-vars */
const express = require("express");
const { hostname } = require("os");
const { version, author } = require("../../package.json");
const { createSuccessResponse } = require("../response");

const router = express.Router();

// router.use(`/v1`, authenticate(), require("./api"));

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

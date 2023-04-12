const express = require("express");
const router = express.Router();

router.get("/test", require("./get"));

module.exports = router;

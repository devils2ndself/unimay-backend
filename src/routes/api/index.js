const express = require("express");
const router = express.Router();
const upload = require("../../upload");

router.get("/titles", require("./titles/get"));
router.get("/titles/:id", require("./titles/getId"));
router.post("/titles", upload.single("image"), require("./titles/post"));

module.exports = router;

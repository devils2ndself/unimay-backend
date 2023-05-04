const express = require("express");
const router = express.Router();
const upload = require("../../upload");

router.get("/titles", require("./titles/get"));
router.get("/titles/:id", require("./titles/getId"));
router.get("/titles/:id/image", require("./titles/getIdImage"));
router.post("/titles", upload.single("image"), require("./titles/post"));

router.get("/genres", require("./genres/get"));
router.post("/genres", upload.none(), require("./genres/post"));

module.exports = router;

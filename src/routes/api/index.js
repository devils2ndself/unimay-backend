const express = require("express");
const router = express.Router();
const upload = require("../../upload");

router.get("/titles", require("./titles/get"));
router.get("/titles/:id", require("./titles/getId"));
router.get("/titles/:id/image", require("./titles/getIdImage"));
router.post("/titles", upload.single("image"), require("./titles/post"));
// TODO: titles: delete, put, putPlayer

router.post(
    "/titles/:titleId/players",
    upload.none(),
    require("./titles/players/post")
);
router.delete("/players/:id", require("./titles/players/delete"));

router.get("/genres", require("./genres/get"));
router.post("/genres", upload.none(), require("./genres/post"));
router.delete("/genres/:id", require("./genres/delete"));
router.put("/genres/:id", upload.none(), require("./genres/put"));

// TODO: members + links: delete, put

// TODO: services: delete, put

// TODO: partners: delete, put

module.exports = router;

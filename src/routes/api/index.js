const express = require("express");
const router = express.Router();
const upload = require("../../upload");

// TODO: authorization middleware

router.get("/titles", require("./titles/get"));
router.get("/titles/:id", require("./titles/getId"));
router.get("/titles/:id/image", require("./titles/getIdImage"));
router.post("/titles", upload.single("image"), require("./titles/post"));
router.put("/titles/:id", upload.single("image"), require("./titles/put"));
router.delete("/titles/:id", require("./titles/delete"));
router.patch(
    "/titles/:titleId/sequence/:id",
    require("./titles/patchSequence")
);
router.delete("/titles/:titleId/sequence", require("./titles/deleteSequence"));

router.post(
    "/titles/:titleId/players",
    upload.none(),
    require("./titles/players/post")
);
router.put(
    "/titles/:titleId/players/:id",
    upload.none(),
    require("./titles/players/put")
);
router.delete("/players/:id", require("./titles/players/delete"));
router.get("/players", require("./titles/players/get")); // For checking if any hanging players are present

router.post(
    "/titles/:titleId/keywords",
    upload.none(),
    require("./titles/keywords/post")
);
router.delete("/keywords/:id", require("./titles/keywords/delete"));
router.get("/keywords", require("./titles/keywords/get")); // For checking if any hanging keywords are present

router.get("/sequences", require("./sequences/get"));
router.get("/sequences/:id", require("./sequences/getId"));
router.post("/sequences", upload.none(), require("./sequences/post"));
router.put("/sequences/:id", upload.none(), require("./sequences/put"));
router.delete("/sequences/:id", upload.none(), require("./sequences/delete"));

router.get("/genres", require("./genres/get"));
router.post("/genres", upload.none(), require("./genres/post"));
router.delete("/genres/:id", require("./genres/delete"));
router.put("/genres/:id", upload.none(), require("./genres/put"));

// TODO: members + links: delete, put

// TODO: services: delete, put

// TODO: partners: delete, put

module.exports = router;

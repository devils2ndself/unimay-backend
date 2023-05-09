const multer = require("multer");
const { maxImageSize } = require("./config");
const storage = multer.memoryStorage();

module.exports = multer({
    storage: storage,
    limits: { fileSize: maxImageSize },
});

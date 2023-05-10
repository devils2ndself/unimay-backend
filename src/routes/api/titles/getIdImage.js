const logger = require("../../../logger");
const { createErrorResponse } = require("../../../response");
const db = require("../../../models");

module.exports = async (req, res) => {
    try {
        const titleImage = await db.Title.findByPk(req.params.id, {
            attributes: ["image", "imageType"],
            include: db.Genre,
        });

        if (!titleImage) {
            res.status(404).json(createErrorResponse(404, "title not found"));
            return;
        }

        const imageObj = titleImage.dataValues;
        if (!imageObj.imageType || !imageObj.image) {
            res.end();
            return;
        }

        res.status(200)
            .set({ "Content-Type": imageObj.imageType })
            .send(imageObj.image);
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

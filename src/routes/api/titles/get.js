const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");

module.exports = async (req, res) => {
    try {
        const titles = await db.Title.findAll({
            attributes: { exclude: ["image", "imageType"] },
            include: [{ model: db.Genre, through: { attributes: [] } }],
        });

        res.status(200).json(createSuccessResponse({ data: titles }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

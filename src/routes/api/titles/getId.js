const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");

module.exports = async (req, res) => {
    try {
        const title = await db.Title.findByPk(req.params.id, {
            attributes: { exclude: ["image", "imageType"] },
            include: [
                {
                    model: db.Genre,
                    through: { attributes: [] },
                },
                db.Player,
            ],
        });

        if (!title) {
            res.status(404).json(createErrorResponse(404, "title not found"));
            return;
        }

        res.status(200).json(createSuccessResponse({ data: title }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

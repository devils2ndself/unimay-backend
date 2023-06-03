const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");

module.exports = async (req, res) => {
    try {
        // TODO: search (keywords), genres filter, pagination?, sorting

        const titles = await db.Title.findAll({
            attributes: { exclude: ["image", "imageType"] },
            include: [{ model: db.Genre, through: { attributes: [] } }],
        });

        const response = [];

        for (let titleObj of titles) {
            let title = titleObj.get({ plain: true });

            if (!title.imageLink) {
                title.imageLink =
                    req.protocol +
                    "://" +
                    req.get("host") +
                    req.originalUrl +
                    "/" +
                    title.id +
                    "/image";
            }

            response.push(title);
        }

        res.status(200).json(createSuccessResponse({ data: response }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

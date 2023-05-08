const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");

module.exports = async (req, res) => {
    try {
        const genre = await db.Genre.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!genre) {
            res.status(200).json(
                createSuccessResponse({
                    message: "genre not found",
                    data: null,
                })
            );
            return;
        }

        await genre.destroy();

        res.status(200).json(
            createSuccessResponse({
                message: "genre deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

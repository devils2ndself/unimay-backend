const logger = require("../../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../../response");
const db = require("../../../../models");

module.exports = async (req, res) => {
    try {
        const player = await db.Player.findByPk(req.params.id);

        if (!player) {
            res.status(201).json(
                createSuccessResponse({
                    message: "player not found",
                    data: null,
                })
            );
            return;
        }

        await player.destroy();

        res.status(201).json(
            createSuccessResponse({
                message: "player deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

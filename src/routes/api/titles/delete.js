const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");

module.exports = async (req, res) => {
    try {
        const title = await db.Title.findByPk(req.params.id);

        if (!title) {
            res.status(201).json(
                createSuccessResponse({
                    message: "title not found",
                    data: null,
                })
            );
            return;
        }

        const players = await db.Player.findAll({
            where: {
                titleId: req.params.id,
            },
        });

        for (let player of players) {
            await player.destroy();
        }

        await title.destroy();

        res.status(201).json(
            createSuccessResponse({
                message: "title deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

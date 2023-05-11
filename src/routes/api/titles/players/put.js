const logger = require("../../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../../response");
const db = require("../../../../models");
const { ValidationError } = require("yup");
const createPlayer = require("./post");

module.exports = async (req, res) => {
    try {
        const player = await db.Player.findByPk(req.params.id);

        if (!player) {
            await createPlayer(req, res);
            return;
        }

        if (!req.params?.titleId) {
            throw new ValidationError("'titleId' is not specified");
        }

        if (
            player.dataValues.titleId &&
            req.params.titleId != player.dataValues.titleId
        ) {
            throw new ValidationError(
                "Associated titleId does not match to request titleId"
            );
        }

        const data = await db.playerSchema.validate(req.body);
        data.titleId = req.params.titleId;

        const title = await db.Title.findByPk(data.titleId, {
            attributes: ["id"],
        });
        if (!title) {
            throw new ValidationError("Associated title is not found");
        }

        await player.update({ ...data });

        res.status(200).json(
            createSuccessResponse({
                message: "player updated",
                data: player,
            })
        );
    } catch (error) {
        logger.warn(error);
        if (error instanceof ValidationError) {
            res.status(400).json(createErrorResponse(400, error.message));
        } else {
            res.status(500).json(createErrorResponse(500, "internal error"));
        }
    }
};

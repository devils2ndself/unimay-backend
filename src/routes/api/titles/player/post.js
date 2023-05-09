const logger = require("../../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../../response");
const db = require("../../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        if (!req.params?.titleId) {
            throw new ValidationError("'titleId' is not specified");
        }
        const data = await db.playerSchema.validate(req.body);
        data.titleId = req.params.titleId;
        if (req.params?.id) {
            data.id = req.params.id;
        }

        const title = await db.Title.findOne({
            attributes: { exclude: ["image", "imageType"] },
            where: {
                id: data.titleId,
            },
        });
        if (!title) {
            throw new ValidationError("Associated title is not found");
        }

        const player = await db.Player.create({ ...data });

        res.status(201).json(
            createSuccessResponse({
                message: "player created",
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

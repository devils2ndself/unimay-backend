const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        let data = await db.genreSchema.validate(req.body);
        const genre = await db.Genre.create({ name: data.name });

        const location =
            req.protocol +
            "://" +
            req.get("host") +
            req.originalUrl +
            "/" +
            genre.dataValues.id.toString();

        res.status(200)
            .set({ Location: location })
            .json(createSuccessResponse({ data: genre }));
    } catch (error) {
        logger.warn(error);
        if (error instanceof ValidationError) {
            res.status(400).json(createErrorResponse(400, error.message));
        } else {
            res.status(500).json(createErrorResponse(500, "internal error"));
        }
    }
};

const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        const data = await db.genreSchema.validate(req.body);
        if (req.params?.id) {
            data.id = req.params.id;
        }
        const genre = await db.Genre.create({ ...data });

        const location =
            req.protocol +
            "://" +
            req.get("host") +
            req.originalUrl +
            "/" +
            genre.dataValues.id.toString();

        res.status(201)
            .set({ Location: location })
            .json(
                createSuccessResponse({ message: "genre created", data: genre })
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

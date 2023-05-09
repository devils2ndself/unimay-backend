const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        const data = await db.titleSchema.validate(req.body);
        if (req.params?.id) {
            data.id = req.params.id;
        }
        const image = req.file ? req.file.buffer : null;
        const imageType = req.file ? req.file.mimetype : null;

        if (imageType && !imageType.startsWith("image/")) {
            throw new ValidationError("File is not an image");
        }

        const title = await db.Title.create({
            ...data,
            image: image,
            imageType: imageType,

            // TODO: include genres
        });

        const location =
            req.protocol +
            "://" +
            req.get("host") +
            req.originalUrl +
            "/" +
            title.dataValues.id.toString();

        const response = { ...title.dataValues };
        delete response.image;
        delete response.imageType;
        response.imageURL = location + "/image";

        res.status(201)
            .set({
                Location: location,
            })
            .json(
                createSuccessResponse({
                    message: "title created",
                    data: response,
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

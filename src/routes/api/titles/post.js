const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        if (req.body.genres) {
            req.body.genres = Array.isArray(req.body.genres)
                ? req.body.genres
                : [req.body.genres];
        }
        const data = await db.titleSchema.validate(req.body);
        if (req.params?.id) {
            data.id = req.params.id;
        }
        const image = req.file ? req.file.buffer : null;
        const imageType = req.file ? req.file.mimetype : null;

        if (imageType && !imageType.startsWith("image/")) {
            throw new ValidationError("File is not an image");
        }

        if (data.genres) {
            for (let genreId of data.genres) {
                const genre = await db.Genre.findOne({
                    where: {
                        id: genreId,
                    },
                });
                if (!genre) {
                    throw new ValidationError(
                        `Genre with id ${genreId} does not exist`
                    );
                }
            }
        }

        const title = await db.Title.create({
            ...data,
            image: image,
            imageType: imageType,
        });

        if (data.genres) {
            await title.setGenres(data.genres);
        }
        await title.reload({ include: [db.Genre, db.Player] });

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

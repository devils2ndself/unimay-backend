const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        // TODO: keywords, sequence

        if (req.body.genres) {
            req.body.genres = Array.isArray(req.body.genres)
                ? req.body.genres
                : [req.body.genres];
        }
        const data = await db.titleSchema.validate(req.body);
        if (req.params?.id) {
            data.id = req.params.id;
        }
        if (!data.imageLink && req.file) {
            data.image = req.file.buffer;
            data.imageType = req.file.mimetype;
        }

        if (
            !data.imageLink &&
            data.imageType &&
            !data.imageType.startsWith("image/")
        ) {
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

        const title = await db.sequelize.transaction(async (t) => {
            const title = await db.Title.create(
                { ...data },
                { transaction: t }
            );

            if (data.genres) {
                await title.setGenres(data.genres, { transaction: t });
            }

            return title;
        });

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
        if (!response.imageLink) {
            response.imageLink = location + "/image";
        }

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

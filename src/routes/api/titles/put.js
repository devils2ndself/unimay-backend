const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { ValidationError } = require("yup");
const createTitle = require("./post");

module.exports = async (req, res) => {
    try {
        // TODO: keywords, sequence

        const title = await db.Title.findByPk(req.params.id, {
            include: {
                model: db.Genre,
                through: {
                    attributes: [],
                },
            },
        });

        if (!title) {
            await createTitle(req, res);
            return;
        }

        req.body.genres = Array.isArray(req.body.genres)
            ? req.body.genres.filter((el) => el)
            : req.body.genres
            ? [req.body.genres]
            : [];
        const data = await db.titleSchema.validate(req.body);
        if (req.params?.id) {
            data.id = req.params.id;
        }
        if (!data.imageLink && req.file) {
            data.image = req.file.buffer;
            data.imageType = req.file.mimetype;
            data.imageLink = null;
        } else {
            data.image = null;
            data.imageType = null;
        }

        if (
            !data.imageLink &&
            data.imageType &&
            !data.imageType.startsWith("image/")
        ) {
            throw new ValidationError("File is not an image");
        }

        let genresToAdd = [];
        let genresToRemove = [];

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

        const existingGenres = title
            .get({ plain: true })
            .genres.map((el) => el.id.toString());

        genresToRemove = existingGenres.filter(
            (el) => !data.genres.includes(el)
        );
        genresToAdd = data.genres.filter((el) => !existingGenres.includes(el));

        await db.sequelize.transaction(async (t) => {
            await title.update({ ...data }, { transaction: t });

            if (genresToAdd.length != 0) {
                await title.addGenres(genresToAdd, { transaction: t });
            }
            if (genresToRemove.length != 0) {
                await title.removeGenres(genresToRemove, { transaction: t });
            }
        });

        await title.reload({ include: [db.Genre, db.Player] });

        const response = title.get({ plain: true });
        delete response.image;
        delete response.imageType;
        if (!response.imageLink) {
            response.imageLink =
                req.protocol +
                "://" +
                req.get("host") +
                req.originalUrl +
                "/image";
        }

        res.status(201).json(
            createSuccessResponse({
                message: "title updated",
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

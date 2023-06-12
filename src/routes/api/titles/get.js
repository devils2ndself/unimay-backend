/**
 * @swagger
 * /api/titles:
 *  get:
 *      summary: Get all Titles
 *      tags: [Titles]
 *      parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Search by keywords
 *          - in: query
 *            name: genres
 *            schema:
 *              type: string
 *            description: Comma-separated genreId list
 *      responses:
 *          200:
 *              description: List of all existing titles
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/GetTitle'
 *          500:
 *              description: Some server error
 */

const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
    try {
        const search = req.query.search;
        const genres = req.query.genres
            ? req.query.genres?.split(",").filter((el) => el)
            : [];

        let titleIds = null;

        if (Array.isArray(genres) && genres.length > 0) {
            const genreIds = await db.Genre.findAll({
                attributes: [],
                include: [
                    {
                        attributes: ["id"],
                        model: db.Title,
                        through: { attributes: [] },
                    },
                ],
                where: {
                    id: genres,
                },
                raw: true,
                nest: true,
            });

            titleIds = genreIds.map((el) => el?.titles?.id).filter((el) => el);
        }

        if (search) {
            let searchIds = await db.Keyword.findAll({
                attributes: [],
                include: [
                    {
                        attributes: ["id"],
                        model: db.Title,
                    },
                ],
                where: {
                    name: {
                        [Op.substring]: search,
                    },
                },
                raw: true,
                nest: true,
            });

            searchIds = searchIds.map((el) => el?.title?.id).filter((el) => el);

            titleIds =
                titleIds == null
                    ? searchIds
                    : titleIds.filter((el) => searchIds.includes(el));
        }

        const titles = await db.Title.findAll({
            attributes: { exclude: ["image", "imageType"] },
            include: [
                {
                    model: db.Genre,
                    through: { attributes: [] },
                },
                db.Keyword,
            ],
            order: [["year", "DESC"], "name"],
            where: titleIds != null ? { id: titleIds } : null,
        });

        const response = [];

        for (let titleObj of titles) {
            let title = titleObj.get({ plain: true });

            if (!title.imageLink) {
                title.imageLink =
                    req.protocol +
                    "://" +
                    req.get("host") +
                    req.originalUrl +
                    "/" +
                    title.id +
                    "/image";
            }

            response.push(title);
        }

        res.status(200).json(createSuccessResponse({ data: response }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

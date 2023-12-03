/**
 * @swagger
 * /api/titles/{id}:
 *  get:
 *      summary: Get Title by id
 *      tags: [Titles]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Title id
 *      responses:
 *          200:
 *              description: Title with players
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                              data:
 *                                  $ref: '#/components/schemas/GetTitleWithPlayer'
 *          404:
 *              description: Not found
 *          500:
 *              description: Some server error
 */

const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");

module.exports = async (req, res) => {
    try {
        const title = await db.Title.findByPk(req.params.id, {
            attributes: { exclude: ["image", "imageType"] },
            include: [
                {
                    model: db.Genre,
                    through: { attributes: [] },
                },
                db.Player,
                db.Keyword,
                {
                    model: db.Sequence,
                    include: [
                        {
                            model: db.Title,
                            attributes: { exclude: ["image", "imageType"] },
                            order: [["year", "DESC"], "name"],
                            plain: true,
                        },
                    ],
                    plain: true,
                },
            ],
            plain: true,
        });

        console.log(title.sequence);

        if (!title) {
            res.status(404).json(createErrorResponse(404, "title not found"));
            return;
        }

        for (let seqTitle of (title?.sequence?.titles || [])) {
            if (!seqTitle.imageLink) {
                seqTitle.imageLink =
                    req.protocol +
                    "://" +
                    req.get("host") +
                    `/api/titles/${seqTitle.id}/image`;
            }
        }

        if (!title?.imageLink) {
            title.imageLink =
                req.protocol +
                "://" +
                req.get("host") +
                req.originalUrl +
                "/image";
        }

        res.status(200).json(createSuccessResponse({ data: title }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

/**
 * @swagger
 * /api/genres/{id}:
 *  delete:
 *      summary: Delete Genre by id
 *      tags: [Genres]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Genre id
 *      responses:
 *          200:
 *              description: Deletion confirmation
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              status:
 *                                  type: string
 *                              message:
 *                                  type: string
 *                              data:
 *                                  type: object
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
        const genre = await db.Genre.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!genre) {
            res.status(200).json(
                createSuccessResponse({
                    message: "genre not found",
                    data: null,
                })
            );
            return;
        }

        await genre.destroy();

        res.status(200).json(
            createSuccessResponse({
                message: "genre deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

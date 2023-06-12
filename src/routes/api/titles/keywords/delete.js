/**
 * @swagger
 * /api/keywords/{id}:
 *  delete:
 *      summary: Delete Keyword by id
 *      tags: [Keywords]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Keyword id
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

const logger = require("../../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../../response");
const db = require("../../../../models");

module.exports = async (req, res) => {
    try {
        const keyword = await db.Keyword.findByPk(req.params.id);

        if (!keyword) {
            res.status(200).json(
                createSuccessResponse({
                    message: "keyword not found",
                    data: null,
                })
            );
            return;
        }

        await keyword.destroy();

        res.status(200).json(
            createSuccessResponse({
                message: "keyword deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

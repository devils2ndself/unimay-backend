/**
 * @swagger
 * /api/players/{id}:
 *  delete:
 *      summary: Delete Player by id
 *      tags: [Players]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Player id
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
        const player = await db.Player.findByPk(req.params.id);

        if (!player) {
            res.status(200).json(
                createSuccessResponse({
                    message: "player not found",
                    data: null,
                })
            );
            return;
        }

        await player.destroy();

        res.status(200).json(
            createSuccessResponse({
                message: "player deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

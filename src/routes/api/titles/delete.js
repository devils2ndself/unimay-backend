/**
 * @swagger
 * /api/titles/{id}:
 *  delete:
 *      summary: Delete Title by id
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
        // TODO: keywords

        const title = await db.Title.findByPk(req.params.id);

        if (!title) {
            res.status(200).json(
                createSuccessResponse({
                    message: "title not found",
                    data: null,
                })
            );
            return;
        }

        const players = await db.Player.findAll({
            where: {
                titleId: req.params.id,
            },
        });

        await db.sequelize.transaction(async (t) => {
            for (let player of players) {
                await player.destroy({ transaction: t });
            }

            await title.destroy({ transaction: t });
        });

        res.status(200).json(
            createSuccessResponse({
                message: "title deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

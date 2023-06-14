/**
 * @swagger
 * /api/sequences/{id}:
 *  delete:
 *      summary: Delete Sequence by id
 *      tags: [Sequences]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Sequence id
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
        const sequence = await db.Sequence.findOne({
            where: {
                id: req.params.id,
            },
        });

        if (!sequence) {
            res.status(200).json(
                createSuccessResponse({
                    message: "sequence not found",
                    data: null,
                })
            );
            return;
        }

        const titles = await db.Title.findAll({
            attributes: ["id", "sequenceId"],
            where: {
                sequenceId: req.params.id,
            },
        });

        await db.sequelize.transaction(async (t) => {
            await sequence.destroy({ transaction: t });

            for (let title of titles) {
                await title.update({ sequenceId: null }, { transaction: t });
            }
        });

        res.status(200).json(
            createSuccessResponse({
                message: "sequence deleted",
                data: null,
            })
        );
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

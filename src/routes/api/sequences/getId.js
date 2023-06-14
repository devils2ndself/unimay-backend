/**
 * @swagger
 * /api/sequences/{id}:
 *  get:
 *      summary: Get all Sequences with associated Titles
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
 *              description: List of all existing sequences
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
 *                                      $ref: '#/components/schemas/GetSequence'
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
        const sequence = await db.Sequence.findByPk(req.params.id, {
            include: [
                {
                    model: db.Title,
                    attributes: {
                        exclude: ["image", "imageType"],
                    },
                    plain: true,
                },
            ],
            plain: true,
        });

        if (!sequence) {
            res.status(404).json(
                createErrorResponse(404, "sequence not found")
            );
            return;
        }

        for (let seqTitle of sequence.titles) {
            if (!seqTitle.imageLink) {
                seqTitle.imageLink =
                    req.protocol +
                    "://" +
                    req.get("host") +
                    `/api/titles/${seqTitle.id}/image`;
            }
        }

        res.status(200).json(createSuccessResponse({ data: sequence }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

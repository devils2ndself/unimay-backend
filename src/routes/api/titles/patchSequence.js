/**
 * @swagger
 * /api/titles/{id}/sequence/{sequenceId}:
 *  patch:
 *      summary: Associate Title with Sequence
 *      tags: [Titles]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Title to have sequence associated with
 *          - in: path
 *            name: sequenceId
 *            schema:
 *              type: integer
 *            required: true
 *            description: Sequence id
 *      responses:
 *          200:
 *              description: Sequence associated
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
 *                                  $ref: '#/components/schemas/GetSequence'
 *          400:
 *              description: Validation error
 *          500:
 *              description: Some server error
 */

const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");
const db = require("../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        if (!req.params?.titleId) {
            throw new ValidationError("'titleId' is not specified");
        }
        const titleId = req.params.titleId;
        const id = req.params.id;

        const title = await db.Title.findByPk(titleId, {
            attributes: ["id", "sequenceId"],
        });
        if (!title) {
            throw new ValidationError("Title is not found");
        }

        const sequence = await db.Sequence.findByPk(id, {
            attributes: ["id"],
            plain: true,
        });
        if (!sequence) {
            throw new ValidationError("Sequence is not found");
        }

        title.update({ sequenceId: id });

        res.status(200).json(
            createSuccessResponse({
                message: "sequence associated",
                data: {
                    id: title.dataValues.id,
                    sequenceId: title.dataValues.sequenceId,
                },
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

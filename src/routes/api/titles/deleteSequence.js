/**
 * @swagger
 * /api/titles/{id}/sequence:
 *  delete:
 *      summary: Remove Title's Sequence association
 *      tags: [Titles]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Title to have Sequence removed on
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

        const title = await db.Title.findByPk(titleId, {
            attributes: ["id", "sequenceId"],
        });
        if (!title) {
            throw new ValidationError("Title is not found");
        }

        title.update({ sequenceId: null });

        res.status(200).json(
            createSuccessResponse({
                message: "sequence deassociated",
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

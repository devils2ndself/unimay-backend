/**
 * @swagger
 * /api/sequences/{id}:
 *  put:
 *      summary: Update Sequence
 *      tags: [Sequences]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Sequence id
 *      requestBody:
 *          description: Sequence information
 *          required: true
 *          content:
 *               multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateCreateSequence'
 *      responses:
 *          200:
 *              description: Updated Sequence
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
 *          201:
 *              description: Created Sequence
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
const createSequence = require("./post");

module.exports = async (req, res) => {
    try {
        const sequence = await db.Sequence.findByPk(req.params.id);

        if (!sequence) {
            await createSequence(req, res);
            return;
        }

        const data = await db.sequenceSchema.validate(req.body);
        await sequence.update({ ...data });

        res.status(200).json(
            createSuccessResponse({
                message: "sequence updated",
                data: sequence,
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

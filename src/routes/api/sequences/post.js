/**
 * @swagger
 * /api/sequences:
 *  post:
 *      summary: Create Sequence
 *      tags: [Sequences]
 *      requestBody:
 *          description: Sequence information
 *          required: true
 *          content:
 *               multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateCreateSequence'
 *      responses:
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

module.exports = async (req, res) => {
    try {
        const data = await db.sequenceSchema.validate(req.body);
        if (req.params?.id) {
            data.id = req.params.id;
        }
        const sequence = await db.Sequence.create({ ...data });

        const location =
            req.protocol +
            "://" +
            req.get("host") +
            req.originalUrl +
            "/" +
            sequence.dataValues.id.toString();

        res.status(201)
            .set({ Location: location })
            .json(
                createSuccessResponse({
                    message: "sequence created",
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

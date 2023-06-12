/**
 * @swagger
 * /api/titles/{titleId}/players:
 *  post:
 *      summary: Create Player
 *      tags: [Players]
 *      parameters:
 *          - in: path
 *            name: titleId
 *            schema:
 *              type: integer
 *            required: true
 *            description: Title to have new player
 *      requestBody:
 *          description: Player information
 *          required: true
 *          content:
 *               multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateCreatePlayer'
 *      responses:
 *          201:
 *              description: Created Player
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
 *                                  $ref: '#/components/schemas/GetPlayer'
 *          400:
 *              description: Validation error
 *          500:
 *              description: Some server error
 */

const logger = require("../../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../../response");
const db = require("../../../../models");
const { ValidationError } = require("yup");

module.exports = async (req, res) => {
    try {
        if (!req.params?.titleId) {
            throw new ValidationError("'titleId' is not specified");
        }
        const data = await db.playerSchema.validate(req.body);
        data.titleId = req.params.titleId;
        if (req.params?.id) {
            data.id = req.params.id;
        }

        const title = await db.Title.findByPk(data.titleId, {
            attributes: ["id"],
        });
        if (!title) {
            throw new ValidationError("Associated title is not found");
        }

        const player = await db.Player.create({ ...data });

        res.status(201).json(
            createSuccessResponse({
                message: "player created",
                data: player,
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

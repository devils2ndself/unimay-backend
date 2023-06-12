/**
 * @swagger
 * /api/titles/{titleId}/keywords:
 *  post:
 *      summary: Create Keyword
 *      tags: [Keywords]
 *      parameters:
 *          - in: path
 *            name: titleId
 *            schema:
 *              type: integer
 *            required: true
 *            description: Title to have new keyword
 *      requestBody:
 *          description: Keyword information
 *          required: true
 *          content:
 *               multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateCreateKeyword'
 *      responses:
 *          201:
 *              description: Created Keyword
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
 *                                  $ref: '#/components/schemas/GetKeyword'
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
        const data = await db.keywordSchema.validate(req.body);
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

        const keyword = await db.Keyword.create({ ...data });

        res.status(201).json(
            createSuccessResponse({
                message: "keyword created",
                data: keyword,
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

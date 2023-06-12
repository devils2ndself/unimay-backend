/**
 * @swagger
 * /api/genres:
 *  post:
 *      summary: Create Genre
 *      tags: [Genres]
 *      requestBody:
 *          description: Genre information
 *          required: true
 *          content:
 *               multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateCreateGenre'
 *      responses:
 *          201:
 *              description: Created Genre
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
 *                                  $ref: '#/components/schemas/GetGenre'
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
        const data = await db.genreSchema.validate(req.body);
        if (req.params?.id) {
            data.id = req.params.id;
        }
        const genre = await db.Genre.create({ ...data });

        const location =
            req.protocol +
            "://" +
            req.get("host") +
            req.originalUrl +
            "/" +
            genre.dataValues.id.toString();

        res.status(201)
            .set({ Location: location })
            .json(
                createSuccessResponse({ message: "genre created", data: genre })
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

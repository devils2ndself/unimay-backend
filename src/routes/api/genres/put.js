/**
 * @swagger
 * /api/genres/{id}:
 *  put:
 *      summary: Update Genre by id
 *      tags: [Genres]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: Genre id
 *      requestBody:
 *          description: Genre information
 *          required: true
 *          content:
 *               multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateCreateGenre'
 *      responses:
 *          200:
 *              description: Updated Genre
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
const createGenre = require("./post");

module.exports = async (req, res) => {
    try {
        const genre = await db.Genre.findByPk(req.params.id);

        if (!genre) {
            await createGenre(req, res);
            return;
        }

        const data = await db.genreSchema.validate(req.body);
        await genre.update({ ...data });

        res.status(200).json(
            createSuccessResponse({
                message: "genre updated",
                data: genre,
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

/**
 * @swagger
 * /api/genres:
 *  get:
 *      summary: Get all Genres
 *      tags: [Genres]
 *      responses:
 *          200:
 *              description: List of all existing genres
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
 *                                      $ref: '#/components/schemas/GetGenre'
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
        const genres = await db.Genre.findAll();
        res.status(200).json(createSuccessResponse({ data: genres }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

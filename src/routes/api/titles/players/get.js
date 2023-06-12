/**
 * @swagger
 * /api/players:
 *  get:
 *      summary: Get all Players
 *      tags: [Players]
 *      responses:
 *          200:
 *              description: List of all existing players
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
 *                                      $ref: '#/components/schemas/GetPlayer'
 *          500:
 *              description: Some server error
 */

const logger = require("../../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../../response");
const db = require("../../../../models");

module.exports = async (req, res) => {
    try {
        const players = await db.Player.findAll();
        res.status(200).json(createSuccessResponse({ data: players }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

/**
 * @swagger
 * /api/keywords:
 *  get:
 *      summary: Get all Keywords
 *      tags: [Keywords]
 *      responses:
 *          200:
 *              description: List of all existing keywords
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
 *                                      $ref: '#/components/schemas/GetKeyword'
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
        const keywords = await db.Keyword.findAll();
        res.status(200).json(createSuccessResponse({ data: keywords }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

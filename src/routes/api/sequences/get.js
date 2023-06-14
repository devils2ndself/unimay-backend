/**
 * @swagger
 * /api/sequences:
 *  get:
 *      summary: Get all Sequences
 *      tags: [Sequences]
 *      responses:
 *          200:
 *              description: List of all existing sequences
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
 *                                      $ref: '#/components/schemas/GetSequence'
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
        const sequences = await db.Sequence.findAll();
        res.status(200).json(createSuccessResponse({ data: sequences }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

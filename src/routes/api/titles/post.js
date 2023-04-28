const logger = require("../../../logger");
const {
    createSuccessResponse,
    createErrorResponse,
} = require("../../../response");

module.exports = async (req, res) => {
    try {
        console.log(req.file);
        res.status(200).json(createSuccessResponse({ test: "post" }));
    } catch (error) {
        logger.warn(error);
        res.status(500).json(createErrorResponse(500, "internal error"));
    }
};

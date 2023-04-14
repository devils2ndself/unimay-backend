const stoppable = require("stoppable");
const logger = require("./logger");
const app = require("./app");

const { port } = require("./config");

const server = stoppable(
    app.listen(port, () => {
        logger.info({ port }, `Server started`);
    })
);

module.exports = server;

const { Sequelize, DataTypes } = require("sequelize");
const { dbConfig } = require("../config");

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
    }
);

async function init() {
    await sequelize.sync();
}

const Title = require("./title")(sequelize, DataTypes);
const Genre = require("./genre")(sequelize, DataTypes);
const Player = require("./player")(sequelize, DataTypes);
// TODO: other models

// TODO: associations

module.exports = {
    sequelize,
    init,
    Title,
    Genre,
    Player,
};

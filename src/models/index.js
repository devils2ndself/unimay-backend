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

const Title = require("./title");
const Genre = require("./genre");
const Player = require("./player");
// TODO: other models

// TODO: associations

module.exports = {
    sequelize,
    DataTypes,
    init,
    Title,
    Genre,
    Player,
};

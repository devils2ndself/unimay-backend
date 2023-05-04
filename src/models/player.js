const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const Player = sequelize.define("player", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        source: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        embedLink: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });

    const playerSchema = object({
        name: string().required("Name is required").max(254),
        embedLink: string().required("Embed link is required").max(254),
        source: string().notRequired().max(254),
    });

    return { Player, playerSchema };
};

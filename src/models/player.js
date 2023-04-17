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

    return Player;
};

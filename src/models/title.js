module.exports = (sequelize, DataTypes) => {
    const Title = sequelize.define("title", {
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
        image: {
            type: DataTypes.BLOB("long"),
            allowNull: true,
            defaultValue: null,
        },
        imageType: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        contry: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
        description: {
            type: DataTypes.STRING(2047),
            allowNull: true,
            defaultValue: null,
        },
        directors: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
        actors: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
    });

    return Title;
};

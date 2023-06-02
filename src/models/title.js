const { object, string, number, array } = require("yup");

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
        imageLink: {
            type: DataTypes.STRING(2083),
            allowNull: true,
            defaultValue: null,
        },
        country: {
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

    const titleSchema = object({
        name: string().required("'name' is required").max(254),
        country: string().notRequired().max(254),
        year: number().notRequired().min(0).max(3000),
        description: string().notRequired().max(2046),
        directors: string().notRequired().max(254),
        actors: string().notRequired().max(254),
        genres: array().optional().of(string()),
        imageLink: string().notRequired().max(2082),
    });

    return { Title, titleSchema };
};

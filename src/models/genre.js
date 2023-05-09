const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define("genre", {
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
    });

    const genreSchema = object({
        name: string().required("'name' is required").max(254),
    });

    return { Genre, genreSchema };
};

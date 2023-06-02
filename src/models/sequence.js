const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const Sequence = sequelize.define("sequence", {
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
        description: {
            type: DataTypes.STRING(2047),
            allowNull: true,
            defaultValue: null,
        },
    });

    const sequenceSchema = object({
        name: string().required("'name' is required").max(254),
        description: string().notRequired().max(2046),
    });

    return { Sequence, sequenceSchema };
};

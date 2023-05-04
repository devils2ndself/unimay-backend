const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define("service", {
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

    const serviceSchema = object({
        name: string().required("Name is required").max(254),
        description: string().notRequired().max(2046),
    });

    return { Service, serviceSchema };
};

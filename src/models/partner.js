const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const Partner = sequelize.define("partner", {
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
        link: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
        },
    });

    const partnerSchema = object({
        name: string().required("'name' is required").max(254),
        description: string().notRequired().max(2046),
        link: string().notRequired().max(254),
        imageLink: string().notRequired().max(2082),
    });

    return { Partner, partnerSchema };
};

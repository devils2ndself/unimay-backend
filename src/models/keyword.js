const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const Keyword = sequelize.define("keyword", {
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

    const keywordSchema = object({
        name: string().required("'name' is required").max(254),
    });

    return { Keyword, keywordSchema };
};

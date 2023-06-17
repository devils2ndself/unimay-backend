const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const MemberLink = sequelize.define("memberLink", {
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
        icon: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        link: {
            type: DataTypes.STRING(2083),
            allowNull: false,
        },
    });

    const memberLinkSchema = object({
        name: string().required("'name' is required").max(254),
        link: string().required("'link' is required").max(2082),
        icon: string().notRequired().max(254),
    });

    return { MemberLink, memberLinkSchema };
};

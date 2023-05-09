const { object, string } = require("yup");

module.exports = (sequelize, DataTypes) => {
    const MemberLink = sequelize.define("memberLink", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        icon: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        link: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });

    const memberLinkSchema = object({
        link: string().required("'link' is required").max(254),
        icon: string().notRequired().max(254),
    });

    return { MemberLink, memberLinkSchema };
};

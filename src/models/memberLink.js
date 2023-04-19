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

    return MemberLink;
};

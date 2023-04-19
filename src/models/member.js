module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define("member", {
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
    });

    return Member;
};

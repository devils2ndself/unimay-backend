const { Sequelize, DataTypes } = require("sequelize");
const { dbConfig } = require("../config");

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
    }
);

async function init() {
    await sequelize.sync();
}

const Title = require("./title")(sequelize, DataTypes);
const Genre = require("./genre")(sequelize, DataTypes);
const Player = require("./player")(sequelize, DataTypes);
const Member = require("./member")(sequelize, DataTypes);
const MemberLink = require("./memberLink")(sequelize, DataTypes);
const Service = require("./service")(sequelize, DataTypes);
const Partner = require("./partner")(sequelize, DataTypes);

Title.hasMany(Player, { foreignKey: "titleId" });
Player.belongsTo(Title);

Title.belongsToMany(Genre, { through: "GenreTitles" });
Genre.belongsToMany(Title, { through: "GenreTitles" });

Member.hasMany(MemberLink, { foreignKey: "memberId" });
MemberLink.belongsTo(Member);

module.exports = {
    sequelize,
    init,
    Title,
    Genre,
    Player,
    Member,
    MemberLink,
    Service,
    Partner,
};

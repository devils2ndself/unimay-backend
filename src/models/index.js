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

const { Title, titleSchema } = require("./title")(sequelize, DataTypes);
const { Sequence, sequenceSchema } = require("./sequence")(
    sequelize,
    DataTypes
);
const { Keyword, keywordSchema } = require("./keyword")(sequelize, DataTypes);
const { Genre, genreSchema } = require("./genre")(sequelize, DataTypes);
const { Player, playerSchema } = require("./player")(sequelize, DataTypes);
const { Member, memberSchema } = require("./member")(sequelize, DataTypes);
const { MemberLink, memberLinkSchema } = require("./memberLink")(
    sequelize,
    DataTypes
);
const { Service, serviceSchema } = require("./service")(sequelize, DataTypes);
const { Partner, partnerSchema } = require("./partner")(sequelize, DataTypes);

Title.hasMany(Player, { foreignKey: "titleId" });
Player.belongsTo(Title);

Title.hasMany(Keyword, { foreignKey: "titleId" });
Keyword.belongsTo(Title);

Sequence.hasMany(Title, { foreignKey: "sequenceId" });
Title.belongsTo(Sequence);

Title.belongsToMany(Genre, { through: "GenreTitles" });
Genre.belongsToMany(Title, { through: "GenreTitles" });

Member.hasMany(MemberLink, { foreignKey: "memberId" });
MemberLink.belongsTo(Member);

module.exports = {
    sequelize,
    init,

    Title,
    Sequence,
    Keyword,
    Genre,
    Player,
    Member,
    MemberLink,
    Service,
    Partner,

    titleSchema,
    sequenceSchema,
    keywordSchema,
    genreSchema,
    playerSchema,
    memberSchema,
    memberLinkSchema,
    serviceSchema,
    partnerSchema,
};

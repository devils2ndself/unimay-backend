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

/**
 * @swagger
 * components:
 *  schemas:
 *
 *  ### Titles ###
 *
 *      GetTitle:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: number
 *                  description: Auto-incremented SQL id
 *              name:
 *                  type: string
 *                  description: Title's name
 *              imageLink:
 *                  type: string
 *                  description: Image link whether from internet or
 *              genres:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/GetGenre'
 *                  description: Array of Genre ids
 *              description:
 *                  type: string
 *                  description: Title's description
 *              country:
 *                  type: string
 *                  description: Country where the title was created in
 *              year:
 *                  type: int
 *                  description: Year it came out
 *              directors:
 *                  type: string
 *                  description: Who made the title
 *              actors:
 *                  type: string
 *                  description: Who dubbed the title
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      GetTitleWithPlayer:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: number
 *                  description: Auto-incremented SQL id
 *              name:
 *                  type: string
 *                  description: Title's name
 *              imageLink:
 *                  type: string
 *                  description: Image link whether from internet or
 *              genres:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/GetGenre'
 *                  description: Array of Genre ids
 *              players:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/GetPlayer'
 *                  description: Array of Genre ids
 *              description:
 *                  type: string
 *                  description: Title's description
 *              country:
 *                  type: string
 *                  description: Country where the title was created in
 *              year:
 *                  type: int
 *                  description: Year it came out
 *              directors:
 *                  type: string
 *                  description: Who made the title
 *              actors:
 *                  type: string
 *                  description: Who dubbed the title
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      UpdateCreateTitle:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  description: Title's name
 *              imageLink:
 *                  type: string
 *                  description: Image cover from the internet (preferred)
 *              image:
 *                  type: file
 *                  description: Image cover stored in DB (not preferred)
 *              genres:
 *                  type: string[]
 *                  description: Array of Genre ids
 *              description:
 *                  type: string
 *                  description: Title's description
 *              country:
 *                  type: string
 *                  description: Country where the title was created in
 *              year:
 *                  type: int
 *                  description: Year it came out
 *              directors:
 *                  type: string
 *                  description: Who made the title
 *              actors:
 *                  type: string
 *                  description: Who dubbed the title
 *
 * ### Players ###
 *
 *      GetPlayer:
 *          type: object
 *          required:
 *              - name
 *              - embedLink
 *          properties:
 *              id:
 *                  type: number
 *                  description: Auto-incremented SQL id
 *              name:
 *                  type: string
 *                  description: Player's name
 *              embedLink:
 *                  type: string
 *                  description: URL to be inserted into an iframe tag
 *              source:
 *                  type: string
 *                  description: What website this is from (Youtube | Voidboost)
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      UpdateCreatePlayer:
 *          type: object
 *          required:
 *              - name
 *              - embedLink
 *          properties:
 *              name:
 *                  type: string
 *                  description: Player's name
 *              embedLink:
 *                  type: string
 *                  description: URL to be inserted into an iframe tag
 *              source:
 *                  type: string
 *                  description: What website this is from (Youtube | Voidboost)
 *
 *  ### Genres ###
 *
 *      GetGenre:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: number
 *                  description: Auto-incremented SQL id
 *              name:
 *                  type: string
 *                  description: Genre name
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      UpdateCreateGenre:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  description: Genre name
 */

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
    let configuration = dbConfig.alterTables
        ? { force: false, alter: true }
        : {};
    await sequelize.sync(configuration);
}

const { Title, titleSchema, titleUpdateSchema } = require("./title")(
    sequelize,
    DataTypes
);
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
    titleUpdateSchema,
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
 *                  type: integer
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
 *                  description: Array of Genres
 *              description:
 *                  type: string
 *                  description: Title's description
 *              country:
 *                  type: string
 *                  description: Country where the title was created in
 *              year:
 *                  type: integer
 *                  description: Year it came out
 *              directors:
 *                  type: string
 *                  description: Who made the title
 *              actors:
 *                  type: string
 *                  description: Who dubbed the title
 *              sequenceId:
 *                  type: integer
 *                  description: Next seasons Sequence id
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
 *                  type: integer
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
 *                  description: Array of Genres
 *              players:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/GetPlayer'
 *                  description: Array of Players
 *              description:
 *                  type: string
 *                  description: Title's description
 *              country:
 *                  type: string
 *                  description: Country where the title was created in
 *              year:
 *                  type: integer
 *                  description: Year it came out
 *              directors:
 *                  type: string
 *                  description: Who made the title
 *              actors:
 *                  type: string
 *                  description: Who dubbed the title
 *              sequenceId:
 *                  type: integer
 *                  description: Next seasons Sequence id
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      CreateTitle:
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
 *                  type: array
 *                  items:
 *                      type: integer
 *                  description: Array of Genre ids
 *              description:
 *                  type: string
 *                  description: Title's description
 *              country:
 *                  type: string
 *                  description: Country where the title was created in
 *              year:
 *                  type: integer
 *                  description: Year it came out
 *              directors:
 *                  type: string
 *                  description: Who made the title
 *              actors:
 *                  type: string
 *                  description: Who dubbed the title
 *
 *      UpdateTitle:
 *          type: object
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
 *                  type: array
 *                  items:
 *                      type: integer
 *                  description: Array of Genre ids
 *              description:
 *                  type: string
 *                  description: Title's description
 *              country:
 *                  type: string
 *                  description: Country where the title was created in
 *              year:
 *                  type: integer
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
 *                  type: integer
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
 *                  type: integer
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
 *
 *  ### Keywords ###
 *
 *      GetKeyword:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Auto-incremented SQL id
 *              name:
 *                  type: string
 *                  description: Keyword name
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      UpdateCreateKeyword:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  description: Keyword name
 *
 *  ### Sequences ###
 *
 *      GetSequence:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Auto-incremented SQL id
 *              name:
 *                  type: string
 *                  description: Sequence name
 *              description:
 *                  type: string
 *                  description: Sequence description
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      GetSequenceWithTitles:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: integer
 *                  description: Auto-incremented SQL id
 *              name:
 *                  type: string
 *                  description: Sequence name
 *              description:
 *                  type: string
 *                  description: Sequence description
 *              titles:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/GetTitle'
 *                  description: Array of Titles
 *              createdAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *              updatedAt:
 *                  type: string
 *                  format: date
 *                  description: Automatic timestamp
 *
 *      UpdateCreateSequence:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  description: Sequence name
 *              description:
 *                  type: string
 *                  description: Sequence description
 */

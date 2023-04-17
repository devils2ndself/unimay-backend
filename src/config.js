module.exports = {
    dbConfig: {
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || "mysql",
    },
    port: parseInt(process.env.PORT || 8080, 10),
};

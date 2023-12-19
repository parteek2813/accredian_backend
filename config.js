const dotenv = require("dotenv");
dotenv.config();

const config = {
    db: {
        host: "localhost",
        user: "root",
        password: process.env.SQL_PASSWORD,
        database: "accredian_assignment",
        connectTimeout: 60000
    },
};

module.exports = config;
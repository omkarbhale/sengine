const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db',
    // storage: ':memory:',
    pool: {
        maxUses: 1,
        max: 4,
        min: 0,
        acquire: 30_000,
        idle: 10_000,
    },
    transactionType: 'IMMEDIATE',
});

module.exports = {
    sequelize
};
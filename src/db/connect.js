const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.db',
    // storage: ':memory:',
});

module.exports = {
    sequelize
};
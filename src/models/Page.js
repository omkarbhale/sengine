const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const Url = require('./Url');

const Page = sequelize.define('Page', {
    url: {
        type: DataTypes.INTEGER,
        references: { model: 'Urls', 'key': 'id' },
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Page;
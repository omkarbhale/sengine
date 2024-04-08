const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const Page = require('./Page');

const Url = sequelize.define('Url', {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isScraped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    page: {
        type: DataTypes.INTEGER,
        references: { model: 'pages', key: 'id' },
    },
    errorMessage: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Url;
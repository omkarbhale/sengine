const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Url = sequelize.define('Url', {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    isScraped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    page: {
        type: DataTypes.INTEGER,
        references: { model: 'Pages', key: 'id' },
    },
    parentUrl: {
        type: DataTypes.INTEGER,
        references: { model: 'Urls', key: 'id' },
    },
    errorMessage: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

module.exports = Url;
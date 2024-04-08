const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');
const Url = require('./Url');

const Page = sequelize.define('Page', {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

Page.hasOne(Url);

module.exports = Page;
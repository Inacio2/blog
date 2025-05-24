const Sequelize = require("sequelize");

const connection = new Sequelize('blog_bd','root','',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: "+01:00"
});

module.exports = connection;
const mysql = require('mysql')
require('dotenv').config();

const connect = mysql.createPool({
  host: process.env.HOST,
  port: 3306,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: 'heroku_66b06e517efac40'
})

module.exports = connect;
const mysql = require('mysql')

const connect = mysql.createPool({
  // host: "127.0.0.1",
  port: 3306,
  user: "sqluser",
  password: "password",
  database: 'url_shortener'
})

module.exports = connect;
var mysql      = require('mysql');
var dbConfig = require('./../../config/db');
var pool = mysql.createPool({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = pool;
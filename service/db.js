var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {
	authenticate : function(username, password, res) {
			connection.query('SELECT U.ID, U.FULL_NAME, U.USERNAME, U.PASSWORD, R.DESCRIPTION FROM COMM_USERS U, COMM_ROLES R, COMM_USER_ROLES UR WHERE U.ID = UR.USER_ID AND R.ID=UR.ROLE_ID  AND U.USERNAME = ? AND U.PASSWORD = ?',[username,password], function(err, rows, fields) {
			
			if (err) throw err;
			console.log("length"+rows.length);
			if(rows.length == 0)
				res.redirect('/login/failed');
			else if (rows.length == 1) {
				user = rows[0];
				res.render('home',user);
			}
		});
		
	}
};
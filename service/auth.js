var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {
	isAuthenticated : function(req) {
		return (req.session && req.session.user);
	},
	logout : function(req) {
		req.session.destroy();
	},
	authenticate : function(username, password, req, res) {
			var statement = 'SELECT U.ID, U.FULL_NAME, U.USERNAME, U.PASSWORD, R.DESCRIPTION FROM COMM_USERS U, COMM_ROLES R, COMM_USER_ROLES UR WHERE U.ID = UR.USER_ID AND R.ID=UR.ROLE_ID  AND U.USERNAME = ? AND U.PASSWORD = ?';
			connection.query(statement,[username,password], function(err, rows, fields) {
			
			if (err) throw err;
			if(rows.length == 0)
				res.redirect('/login/failed');
			else if (rows.length == 1) {
				user = rows[0];
				req.session.user = user;
				res.redirect('/home/');
			}
		});
	}
};
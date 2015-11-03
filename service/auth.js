var serverConfig = require('./../config/server');
var pool = require("./../db/conn/conn.js")

module.exports = {
	//Test if the request's user is authenticated
	isAuthenticated : function(req, callback) {
		var isAuthenticated = req.session && req.session.user;
		if(isAuthenticated) {
			return callback(true);
		}
		else
			return callback(false);
	},
	//Logout the user by destroying the session
	logout : function(req) {
		//req.session.destroy()
		req.session.regenerate(function(err) {});
	},
	//Authenticate the given request using the username and password and redirect to home page
	authenticateAndRespond : function(username, password, req, res) {
		var statement = 'SELECT U.*, R.DESCRIPTION FROM COMM_USERS U, COMM_ROLES R, COMM_USER_ROLES UR WHERE U.ID = UR.USER_ID AND R.ID=UR.ROLE_ID  AND U.USERNAME = ? AND U.PASSWORD = ?';
		pool.getConnection(function(err, connection) {
				if(err)
					throw err;
				connection.query(statement,[username,password], function(err, rows, fields) {
				var jsonResponse;
				if (err) throw err;
				if (rows.length == 0) {
					jsonResponse = {
						"err_message" : "That username and password combination was not correct"
					};
				}
				else if (rows.length == 1) {
					user = rows[0];
					req.session.user = user;
					if(user.DESCRIPTION==='Administrator'){
						jsonResponse = {
							"message" : "You are now logged in",
							"menu":['/login','/logout','/updateInfo','/modifyProduct','/viewUsers','/getProducts']
						};
					}
					else {
						jsonResponse = {
							"message" : "You are now logged in",
							"menu":['/login','/logout','/updateInfo','/getProducts']
						};	
					}
					req.session.cookie.maxAge = new Date(Date.now() + serverConfig.sessionExpiry);
				}
				connection.release();
				res.json(jsonResponse);
			});
		});
	},
	//Authenticate the given request using the username and password and redirect to home page
	authenticate : function(username, password, req, res) {
		var statement = 'SELECT U.ID, U.FULL_NAME, U.USERNAME, U.PASSWORD, R.DESCRIPTION FROM COMM_USERS U, COMM_ROLES R, COMM_USER_ROLES UR WHERE U.ID = UR.USER_ID AND R.ID=UR.ROLE_ID  AND U.USERNAME = ? AND U.PASSWORD = ?';
		pool.getConnection(function(err, connection) {	
			connection.query(statement,[username,password], function(err, rows, fields) {
				if (err) throw err;
				if (rows.length == 0){
					connection.release();
					res.redirect('/login/failed');
				}
				else if (rows.length == 1) {
					user = rows[0];
					req.session.user = user;
					connection.release();
					res.redirect('/home/');
				}
			});
		});
	}
};
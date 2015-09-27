var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var serverConfig = require('./../config/server');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {
	//Test if the request's user is authenticated
	isAuthenticated : function(req) {
		return (req.session && req.session.user);
	},
	//Logout the user by destroying the session
	logout : function(req) {
		req.session.regenerate(function(err) {});
	},
	//Authenticate the given request using the username and password and redirect to home page
	authenticateAndRespond : function(username, password, req, res) {
			var statement = 'SELECT U.*, R.DESCRIPTION FROM COMM_USERS U, COMM_ROLES R, COMM_USER_ROLES UR WHERE U.ID = UR.USER_ID AND R.ID=UR.ROLE_ID  AND U.USERNAME = ? AND U.PASSWORD = ?';
			connection.query(statement,[username,password], function(err, rows, fields) {			
			var jsonResponse;
			if (err) throw err;
			if(rows.length == 0) {
				jsonResponse = {
					"err_message" : "That username and password combination was not correct"
				};
			}
			else if (rows.length == 1) {
				user = rows[0];
				console.log('The user is already logged in 3');
				req.session.user = user;
				console.log('The user is already logged in 4');
				if(user.DESCRIPTION==='Administrator'){
					jsonResponse = {
						"err_message" : "",
						"menu":['Login','Logout','Update Contact','Modify Product','View Users','View Products'],
						"sessionID":req.sessionID
					};
				}
				else {
					jsonResponse = {
						"err_message" : "",
						"menu":['Login','Logout','Update Contact','View Products'],
						"sessionID":req.sessionID
					};	
				}
				req.session.cookie.maxAge = new Date(Date.now() + serverConfig.sessionExpiry);
			}
			res.json(jsonResponse);
		});
	},
	//Authenticate the given request using the username and password and redirect to home page
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
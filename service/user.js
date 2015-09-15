var mysql      = require('mysql');
var dbConfig = require('./../config/db');
var connection = mysql.createConnection({
  host     : dbConfig.host,
  database : dbConfig.database,
  user     : dbConfig.username,
  password : dbConfig.password
});

module.exports = {
	// Fetch a list of users using partial first name and last name
	viewUsersAndRespond : function(user, req, res) {
		var statement = 'SELECT U.USERNAME, U.FIRST_NAME, U.LAST_NAME, U.ADDRESS, U.CITY, U.STATE, U.ZIP, U.EMAIL, R.DESCRIPTION FROM COMM_USERS U, COMM_ROLES R, COMM_USER_ROLES UR WHERE U.ID = UR.USER_ID AND R.ID=UR.ROLE_ID  AND (U.FIRST_NAME LIKE "%'+user.firstName+'%" OR U.LAST_NAME LIKE "%'+user.lastName+'%")';
			connection.query(statement, function(err, rows, fields) {
			var jsonResponse;
			if (err) {
				jsonResponse = {
					"message" : "There was a problem fetching the users"
				};
				console.log(err);
				res.json(jsonResponse);
				return;
			}
			else {
				jsonResponse = {
					"user_list" : rows
				};
				res.json(jsonResponse);
			}
			
		});
	},

	//Register a user as customer with his details and also register the role
	registerUserAndRespond : function(user, req, res) {
		var statement = 'INSERT INTO COMM_USERS (FIRST_NAME,LAST_NAME,ADDRESS, CITY, STATE, ZIP, EMAIL, USERNAME, PASSWORD) VALUES(?,?,?,?,?,?,?,?,?);';
		var userId;
		connection.query(statement,[user.firstName,user.lastName, user.address, user.city, user.state, user.zip, user.email, user.username, user.password], function(err, rows, fields) {
			var jsonResponse;
			if (err) {
				jsonResponse = {
					"message" : "There was a problem with your registration"
				};
				console.log(err);
				res.json(jsonResponse);
				return;
			}
			else {
				userId = rows.insertId;		
				console.log(userId);
				var customerRoleId = 2;
				console.log(rows);
				var secondStatement = 'INSERT INTO COMM_USER_ROLES (USER_ID, ROLE_ID) VALUES (?,?);';
				connection.query(secondStatement,[userId,customerRoleId], function(err, rows, fields) {				
					if (err) {
						jsonResponse = {
							"message" : "There was a problem with your registration"
						};
						console.log(err);
						res.json(jsonResponse);
					}
					else{
						jsonResponse = {
							"message" : "Your account has been registered"
						};
						
						res.json(jsonResponse);
					}
				});
			}
		});

		
	}
};
